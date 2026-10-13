import * as THREE from 'three'

// The 3D portrait: Evan's cutout photo pushed into relief by a depth map, lit with a
// warm key and cool rim so it reads as an object in space when it turns.
// If a real scanned model is dropped at /models/evan.glb it replaces the relief automatically.

const vert = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uDepthAmt;
  uniform vec2 uTexel;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  float h(vec2 uv) { return texture2D(uDepth, uv).r * uDepthAmt; }
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += h(uv);
    float dx = h(uv + vec2(uTexel.x, 0.)) - h(uv - vec2(uTexel.x, 0.));
    float dy = h(uv + vec2(0., uTexel.y)) - h(uv - vec2(0., uTexel.y));
    vec3 n = normalize(vec3(-dx * 22., -dy * 22., 1.));
    vNormal = normalize(normalMatrix * n);
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

const frag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uReveal;
  uniform float uOpacity;
  uniform vec3 uKey;
  uniform vec3 uRim;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    if (tex.a < 0.45) discard;
    float edge = vUv.y - uReveal;
    if (edge > 0.0) discard;
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    vec3 keyDir = normalize(vec3(-0.5, 0.6, 0.8));
    float key = max(dot(n, keyDir), 0.0);
    float rim = pow(1.0 - max(dot(n, v), 0.0), 2.2);
    vec3 col = tex.rgb * (0.9 + 0.32 * key) * mix(vec3(1.), uKey, 0.05);
    col += uRim * rim * 0.55;
    // scan line at the reveal edge during the intro
    col += uKey * smoothstep(-0.012, 0.0, edge) * 2.0;
    gl_FragColor = vec4(col, uOpacity);
  }
`

export function createScene(canvas, { onProgress } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200)
  camera.position.set(0, 0, 9)

  const rig = new THREE.Group() // moved by scroll
  const turn = new THREE.Group() // turned by pointer
  rig.add(turn)
  scene.add(rig)

  const state = { x: 0, y: 0, rotY: 0, scale: 1, opacity: 1, mdim: 1, reveal: 0, speed: 1 }
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

  // ---------- relief portrait ----------
  const manager = new THREE.LoadingManager()
  manager.onProgress = (_, loaded, total) => onProgress?.(loaded / total)
  const loader = new THREE.TextureLoader(manager)
  const map = loader.load('/img/evan-cutout.webp')
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 8
  const depth = loader.load('/img/evan-depth.png')

  const H = 5.2
  const W = H * (472 / 1366)
  const geo = new THREE.PlaneGeometry(W, H, 160, 460)
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uMap: { value: map },
      uDepth: { value: depth },
      uDepthAmt: { value: 0.55 },
      uTexel: { value: new THREE.Vector2(1 / 472, 1 / 1366) },
      uReveal: { value: 0 },
      uOpacity: { value: 1 },
      uKey: { value: new THREE.Color('#ffb21a') },
      uRim: { value: new THREE.Color('#9fd3ff') },
    },
  })
  const portrait = new THREE.Mesh(geo, mat)
  portrait.position.z = -0.25
  turn.add(portrait)

  // ground halo under the feet
  const halo = new THREE.Mesh(
    new THREE.RingGeometry(0.55, 0.58, 96),
    new THREE.MeshBasicMaterial({ color: '#ffb21a', transparent: true, opacity: 0.55, side: THREE.DoubleSide })
  )
  halo.rotation.x = -Math.PI / 2
  halo.position.y = -H / 2 + 0.05
  turn.add(halo)
  const halo2 = halo.clone()
  halo2.material = halo.material.clone()
  halo2.material.opacity = 0.18
  halo2.scale.setScalar(1.9)
  turn.add(halo2)

  // optional real 3D model
  fetch('/models/evan.glb', { method: 'HEAD' })
    .then((r) => {
      const type = r.headers.get('content-type') || ''
      if (!r.ok || type.includes('text/html')) return
      return import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
        new GLTFLoader().load('/models/evan.glb', (gltf) => {
          const model = gltf.scene
          const box = new THREE.Box3().setFromObject(model)
          const size = box.getSize(new THREE.Vector3())
          const center = box.getCenter(new THREE.Vector3())
          const s = H / size.y
          model.scale.setScalar(s)
          model.position.sub(center.multiplyScalar(s))
          scene.add(new THREE.HemisphereLight('#fff4e0', '#1a1d24', 1.4))
          const rimL = new THREE.DirectionalLight('#9fd3ff', 2.2)
          rimL.position.set(-3, 2, -3)
          const keyL = new THREE.DirectionalLight('#ffe2b0', 2.4)
          keyL.position.set(2, 3, 4)
          scene.add(rimL, keyL)
          turn.remove(portrait)
          turn.add(model)
        })
      })
    })
    .catch(() => {})

  // ---------- speed streaks (the "jet speed" field) ----------
  const COUNT = 520
  const pos = new Float32Array(COUNT * 6)
  const col = new Float32Array(COUNT * 6)
  const meta = []
  const amber = new THREE.Color('#ffb21a')
  const cool = new THREE.Color('#9fd3ff')
  for (let i = 0; i < COUNT; i++) {
    const r = 2.2 + Math.random() * 9
    const a = Math.random() * Math.PI * 2
    const m = { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.7, z: -80 + Math.random() * 90, len: 0.4 + Math.random() * 1.6, v: 0.6 + Math.random() }
    meta.push(m)
    const c = Math.random() < 0.18 ? amber : cool
    const dim = 0.25 + Math.random() * 0.5
    col.set([c.r * dim, c.g * dim, c.b * dim, 0, 0, 0], i * 6)
  }
  const sGeo = new THREE.BufferGeometry()
  sGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  sGeo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const streaks = new THREE.LineSegments(sGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
  scene.add(streaks)

  // ---------- sizing ----------
  let mobile = false
  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    mobile = w < 860
  }
  resize()
  window.addEventListener('resize', resize)

  window.addEventListener('pointermove', (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
  })

  // ---------- loop ----------
  const clock = new THREE.Clock()
  let scrollVel = 0
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05)
    const t = clock.elapsedTime
    pointer.x += (pointer.tx - pointer.x) * 0.06
    pointer.y += (pointer.ty - pointer.y) * 0.06

    // state.x is in half-screens, so the figure lands on the free side at any aspect ratio
    const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect
    const xMul = mobile ? 0 : halfW
    rig.position.set(state.x * xMul, state.y + Math.sin(t * 0.8) * 0.04 + (mobile ? 1.1 : 0), 0)
    rig.scale.setScalar(state.scale * (mobile ? 0.55 : 1))
    turn.rotation.y = state.rotY + pointer.x * 0.35
    turn.rotation.x = pointer.y * 0.06
    mat.uniforms.uReveal.value = state.reveal
    const op = state.opacity * (mobile ? state.mdim : 1)
    mat.uniforms.uOpacity.value = op
    portrait.visible = op > 0.01
    halo.material.opacity = 0.55 * op
    halo2.material.opacity = 0.18 * op
    halo2.scale.setScalar(1.9 + Math.sin(t * 1.4) * 0.12)

    const speed = (state.speed + Math.min(Math.abs(scrollVel) * 0.02, 6)) * dt * 14
    for (let i = 0; i < COUNT; i++) {
      const m = meta[i]
      m.z += speed * m.v
      if (m.z > 9) m.z = -80
      const stretch = m.len * (1 + Math.abs(scrollVel) * 0.01)
      pos.set([m.x, m.y, m.z, m.x, m.y, m.z - stretch], i * 6)
    }
    sGeo.attributes.position.needsUpdate = true
    scrollVel *= 0.92

    renderer.render(scene, camera)
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

  return {
    state,
    setScrollVelocity(v) { scrollVel = v },
  }
}
