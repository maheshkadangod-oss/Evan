import { ScrollTrigger } from 'gsap/ScrollTrigger'

// A long S-shaped flight path that draws itself down the page as you scroll.
// The glowing tip always sits at the same height in the viewport, so the line
// feels like it is being pulled along by the reader.

const NS = 'http://www.w3.org/2000/svg'
const el = (tag, attrs = {}) => {
  const n = document.createElementNS(NS, tag)
  for (const k in attrs) n.setAttribute(k, attrs[k])
  return n
}

export function createTrail(host) {
  const svg = el('svg', { class: 'trail', 'aria-hidden': 'true' })
  const defs = el('defs')
  const grad = el('linearGradient', { id: 'trailGrad', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: 1000 })
  ;[['0', '#ffd27a'], ['0.3', '#ffb21a'], ['0.65', '#ff7a1a'], ['1', '#ff4d1f']].forEach(([o, c]) =>
    grad.appendChild(el('stop', { offset: o, 'stop-color': c }))
  )
  const blur = el('filter', { id: 'trailGlow', x: '-50%', y: '-50%', width: '200%', height: '200%' })
  blur.appendChild(el('feGaussianBlur', { stdDeviation: 8 }))
  defs.append(grad, blur)

  const ghost = el('path', { class: 'trail-ghost' }) // faint full route, shows where it is heading
  const glow = el('path', { class: 'trail-glow', filter: 'url(#trailGlow)' })
  const line = el('path', { class: 'trail-line' })
  const halo = el('circle', { class: 'trail-halo', r: 16 })
  const tip = el('circle', { class: 'trail-tip', r: 5 })
  svg.append(defs, ghost, glow, line, halo, tip)
  host.prepend(svg)

  let length = 0
  let table = [] // [{ y, len }] sorted by y, for mapping scroll position to path length

  function build() {
    const W = host.clientWidth
    const H = host.scrollHeight
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    svg.style.height = H + 'px'
    grad.setAttribute('y2', H)

    const mobile = W < 860
    const left = W * (mobile ? 0.06 : 0.1)
    const right = W * (mobile ? 0.94 : 0.9)
    const startY = window.innerHeight * 0.55
    const bends = Math.max(4, Math.round(H / (window.innerHeight * 1.35)))
    const step = (H - startY - window.innerHeight * 0.4) / bends

    let x = W * 0.62
    let y = startY
    let d = `M ${x} ${y - window.innerHeight * 0.45} L ${x} ${y}`
    for (let i = 0; i < bends; i++) {
      const nx = i % 2 === 0 ? left : right
      const ny = y + step
      d += ` C ${x} ${y + step * 0.55}, ${nx} ${ny - step * 0.55}, ${nx} ${ny}`
      x = nx
      y = ny
    }
    d += ` C ${x} ${y + step * 0.3}, ${W / 2} ${y + step * 0.1}, ${W / 2} ${H - 40}`

    ;[ghost, glow, line].forEach((p) => p.setAttribute('d', d))
    length = line.getTotalLength()
    ;[glow, line].forEach((p) => {
      p.style.strokeDasharray = `${length} ${length}`
      p.style.strokeDashoffset = length
    })

    table = []
    const samples = 600
    let maxY = -Infinity
    for (let i = 0; i <= samples; i++) {
      const len = (length * i) / samples
      const pt = line.getPointAtLength(len)
      if (pt.y > maxY) { maxY = pt.y; table.push({ y: pt.y, len }) }
    }
    update()
  }

  function lengthAtY(y) {
    if (y <= table[0].y) return 0
    for (let i = 1; i < table.length; i++) {
      if (table[i].y >= y) {
        const a = table[i - 1], b = table[i]
        return a.len + ((y - a.y) / (b.y - a.y)) * (b.len - a.len)
      }
    }
    return length
  }

  function update() {
    if (!table.length) return
    const hostTop = host.getBoundingClientRect().top + window.scrollY
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0
    // the tip rides at 55% of the viewport, then eases down to land at the very end
    const y = window.scrollY + window.innerHeight * (0.55 + 0.4 * p ** 6) - hostTop
    const len = lengthAtY(y)
    const off = length - len
    line.style.strokeDashoffset = off
    glow.style.strokeDashoffset = off
    const pt = line.getPointAtLength(len)
    tip.setAttribute('cx', pt.x); tip.setAttribute('cy', pt.y)
    halo.setAttribute('cx', pt.x); halo.setAttribute('cy', pt.y)
  }

  ScrollTrigger.addEventListener('refresh', build)
  window.addEventListener('scroll', update, { passive: true })
  build()
  return { update, build }
}
