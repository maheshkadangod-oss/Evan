// Orange aurora that pours down the screen like a waterfall.
// Two canvases: a low-res one blurred heavily for the glow, and a sharper one for bright
// cores and falling droplets. Bands of light travel downward along each ribbon, and the
// fall sways gently across the page as you scroll. Scroll speed makes the water run faster.

const COLORS = ['#ff9a3c', '#ff7a1f', '#e85d1a', '#ffb35c', '#c94a16', '#ff8c42', '#ffc078', '#f26a21']

export function createAurora() {
  const glow = document.createElement('canvas')
  const core = document.createElement('canvas')
  glow.className = 'aurora aurora-glow'
  core.className = 'aurora aurora-core'
  glow.setAttribute('aria-hidden', 'true')
  core.setAttribute('aria-hidden', 'true')
  document.body.prepend(core)
  document.body.prepend(glow)
  const g = glow.getContext('2d')
  const c = core.getContext('2d')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // three curtains of fine strands; strands in a curtain share one wave so they move together
  const ribbons = []
  for (let cI = 0; cI < 3; cI++) {
    const phase = Math.random() * Math.PI * 2
    const amp = 26 + Math.random() * 30
    const count = 9 + cI * 2
    for (let k = 0; k < count; k++) {
      ribbons.push({
        color: COLORS[(cI * 3 + k) % COLORS.length],
        phase,
        wobble: Math.random() * Math.PI * 2,
        amp,
        flow: 0.16 + cI * 0.05 + Math.random() * 0.04,
        curtain: cI - 1,
        offset: k - (count - 1) / 2,
        width: 10 + Math.random() * 16,
        alpha: 0.18 + Math.random() * 0.22,
      })
    }
  }
  const drops = Array.from({ length: 70 }, () => newDrop(true))

  let W = 0, H = 0, mobile = false
  let flowBoost = 0, sway = 0, swayTarget = 0, t = 0, last = performance.now()

  function newDrop(anywhere) {
    return { r: Math.floor(Math.random() * ribbons.length), y: anywhere ? Math.random() : -0.05, v: 0.12 + Math.random() * 0.25, j: (Math.random() - 0.5) * 30, s: 0.6 + Math.random() * 1.6 }
  }

  function resize() {
    W = window.innerWidth
    H = window.innerHeight
    mobile = W < 860
    glow.width = Math.ceil(W / 4)
    glow.height = Math.ceil(H / 4)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    core.width = Math.ceil(W * dpr)
    core.height = Math.ceil(H * dpr)
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  // x position of strand r at screen height y (0..H)
  function xAt(r, y) {
    const yn = y / H
    const center = W * (mobile ? 0.5 : 0.64 + sway)
    const gap = (mobile ? 40 : 90) * (0.5 + yn) // curtains drift apart as they fall
    const spacing = (mobile ? 4 : 6) * (1 + yn * 2.4) // strands fan out lower down
    return center + r.curtain * gap + r.offset * spacing
      + Math.sin(y * 0.0032 + t * 0.4 + r.phase) * r.amp * (0.35 + yn)
      + Math.sin(y * 0.009 - t * 0.8 + r.phase * 2) * r.amp * 0.22
      + Math.sin(y * 0.02 + t * 1.3 + r.wobble) * 2.5
  }

  function ribbonGradient(ctx, r, scale, alphaMul) {
    const grad = ctx.createLinearGradient(0, 0, 0, H * scale)
    const STOPS = 18
    for (let k = 0; k <= STOPS; k++) {
      const p = k / STOPS
      // bright bands sliding downward = falling water
      const band = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (p * 2.4 - t * r.flow * (1 + flowBoost)) + r.phase)
      const edge = Math.min(1, p / 0.08) * Math.min(1, (1 - p) / 0.25 + 0.35)
      const a = r.alpha * alphaMul * (0.25 + 0.75 * band * band) * edge
      grad.addColorStop(p, hexA(r.color, a))
    }
    return grad
  }

  function path(ctx, r, scale) {
    ctx.beginPath()
    for (let y = -20; y <= H + 20; y += 14) {
      const x = xAt(r, y) * scale
      y === -20 ? ctx.moveTo(x, y * scale) : ctx.lineTo(x, y * scale)
    }
  }

  function draw() {
    const s = 1 / 4
    g.clearRect(0, 0, glow.width, glow.height)
    g.globalCompositeOperation = 'lighter'
    g.lineCap = 'round'
    for (const r of ribbons) {
      path(g, r, s)
      g.strokeStyle = ribbonGradient(g, r, s, mobile ? 0.6 : 1)
      g.lineWidth = r.width * s * (mobile ? 0.7 : 1)
      g.stroke()
    }

    c.clearRect(0, 0, W, H)
    c.globalCompositeOperation = 'lighter'
    c.lineCap = 'round'
    ribbons.forEach((r, i) => {
      path(c, r, 1)
      c.strokeStyle = ribbonGradient(c, { ...r, color: i % 3 ? r.color : '#ffd2a0', alpha: r.alpha * 2.2 }, 1, mobile ? 0.45 : 0.7)
      c.lineWidth = i % 4 ? 0.9 : 1.6
      c.stroke()
    })
    // droplets riding the ribbons
    for (const d of drops) {
      const y = d.y * H
      const x = xAt(ribbons[d.r], y) + d.j
      const a = 0.65 * Math.min(1, d.y * 8) * (1 - d.y)
      c.fillStyle = hexA('#ffc890', a)
      c.beginPath()
      c.ellipse(x, y, d.s * 0.7, d.s * 2.6, 0, 0, Math.PI * 2)
      c.fill()
    }
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    t += dt
    flowBoost *= 0.94
    sway += (swayTarget - sway) * 0.03
    for (const d of drops) {
      d.y += d.v * dt * (1 + flowBoost * 1.5)
      if (d.y > 1.05) Object.assign(d, newDrop(false))
    }
    draw()
    requestAnimationFrame(frame)
  }

  resize()
  window.addEventListener('resize', resize)
  if (reduced) { t = 3; draw() } else requestAnimationFrame(frame)

  return {
    // velocity from the smooth scroller, progress 0..1 down the page
    onScroll(velocity, progress) {
      flowBoost = Math.min(flowBoost + Math.abs(velocity) * 0.03, 4)
      swayTarget = Math.sin(progress * Math.PI * 3) * 0.2
      // full strength in the hero and the closing section, dimmer behind reading text
      const edge = Math.max(1 - progress / 0.08, (progress - 0.9) / 0.1, 0)
      const level = 0.5 + 0.5 * Math.min(1, edge)
      glow.style.opacity = (0.55 * level).toFixed(3)
      core.style.opacity = (0.85 * level).toFixed(3)
    },
  }
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${Math.max(0, Math.min(1, a)).toFixed(3)})`
}
