import { ScrollTrigger } from 'gsap/ScrollTrigger'

// A long S-shaped flight path fixed to the screen. The page itself stays still,
// so this line is the sense of travel: it draws from the top of the screen to the
// bottom over the whole scroll, with a glowing tip leading it.

const NS = 'http://www.w3.org/2000/svg'
const el = (tag, attrs = {}) => {
  const n = document.createElementNS(NS, tag)
  for (const k in attrs) n.setAttribute(k, attrs[k])
  return n
}

export function createTrail() {
  const svg = el('svg', { class: 'trail', 'aria-hidden': 'true' })
  const defs = el('defs')
  const grad = el('linearGradient', { id: 'trailGrad', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: 1000 })
  ;[['0', '#ffd27a'], ['0.3', '#ffb21a'], ['0.65', '#ff7a1a'], ['1', '#ff4d1f']].forEach(([o, c]) =>
    grad.appendChild(el('stop', { offset: o, 'stop-color': c }))
  )
  const blur = el('filter', { id: 'trailGlow', x: '-50%', y: '-50%', width: '200%', height: '200%' })
  blur.appendChild(el('feGaussianBlur', { stdDeviation: 8 }))
  defs.append(grad, blur)

  const ghost = el('path', { class: 'trail-ghost' })
  const glow = el('path', { class: 'trail-glow', filter: 'url(#trailGlow)' })
  const line = el('path', { class: 'trail-line' })
  const halo = el('circle', { class: 'trail-halo', r: 16 })
  const tip = el('circle', { class: 'trail-tip', r: 5 })
  svg.append(defs, ghost, glow, line, halo, tip)
  document.body.appendChild(svg)

  let length = 0
  let progress = 0

  function build() {
    const W = window.innerWidth
    const H = window.innerHeight
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    grad.setAttribute('y2', H)
    const L = W * 0.06
    const R = W * 0.94
    // top centre, swing right, swing left, land bottom centre: one long S
    const d = [
      `M ${W * 0.5} ${-10}`,
      `C ${W * 0.5} ${H * 0.12}, ${R} ${H * 0.08}, ${R} ${H * 0.3}`,
      `C ${R} ${H * 0.5}, ${L} ${H * 0.42}, ${L} ${H * 0.66}`,
      `C ${L} ${H * 0.86}, ${W * 0.5} ${H * 0.8}, ${W * 0.5} ${H + 10}`,
    ].join(' ')
    ;[ghost, glow, line].forEach((p) => p.setAttribute('d', d))
    length = line.getTotalLength()
    ;[glow, line].forEach((p) => (p.style.strokeDasharray = `${length} ${length}`))
    draw()
  }

  function draw() {
    const len = length * progress
    line.style.strokeDashoffset = length - len
    glow.style.strokeDashoffset = length - len
    const pt = line.getPointAtLength(Math.max(len, 0.01))
    tip.setAttribute('cx', pt.x); tip.setAttribute('cy', pt.y)
    halo.setAttribute('cx', pt.x); halo.setAttribute('cy', pt.y)
    svg.style.setProperty('--tip', progress > 0.002 && progress < 0.998 ? 1 : 0)
  }

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (st) => { progress = st.progress; draw() },
    onRefresh: (st) => { progress = st.progress; build() },
  })
  window.addEventListener('resize', build)
  build()
}
