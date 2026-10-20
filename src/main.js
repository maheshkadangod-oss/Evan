import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createAurora } from './aurora.js'

// Page HTML is pre-rendered at build time (src/render.js). This file only adds motion.
gsap.registerPlugin(ScrollTrigger)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---------- smooth scroll + aurora ----------
const aurora = createAurora()
const lenis = new Lenis({ lerp: 0.1, smoothWheel: !reduced })
lenis.on('scroll', (e) => {
  ScrollTrigger.update()
  aurora.onScroll(e.velocity, e.progress || 0)
})
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')
    if (id.length < 2) return
    e.preventDefault()
    lenis.scrollTo(id === '#top' ? 0 : id, { offset: -70, duration: 1.4 })
  })
)
const nav = document.querySelector('.nav')
ScrollTrigger.create({ start: 80, end: 'max', onToggle: (st) => nav.classList.toggle('solid', st.isActive) })

// ---------- motion ----------
if (!reduced) {
  // hero entrance
  gsap.timeline({ delay: 0.15 })
    .from('.hero h1 .line > span', { yPercent: 105, duration: 1.2, stagger: 0.12, ease: 'power4.out' })
    .from('.hero .rv', { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.8')
    .from('.portrait img', { scale: 1.12, duration: 1.8, ease: 'power3.out' }, 0)
    .from('.float-card', { x: 40, autoAlpha: 0, duration: 1, ease: 'power3.out' }, 0.7)
    .from('.fc-bar', { scaleX: 0, duration: 1.1, stagger: 0.15, ease: 'power3.out' }, 0.9)

  // generic reveals
  gsap.utils.toArray('section:not(.hero) .rv').forEach((el) =>
    gsap.from(el, { y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
  )
  // words and visuals slide in from opposite sides
  gsap.utils.toArray('.from-left, .from-right').forEach((el) =>
    gsap.from(el, { x: el.classList.contains('from-left') ? -80 : 80, autoAlpha: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%' } })
  )
  // CTA headline
  gsap.from('.cta h2 .line > span', { yPercent: 105, duration: 1.1, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: '.cta', start: 'top 70%' } })

  // charts draw when they come into view
  gsap.utils.toArray('.chart-card').forEach((card) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 78%' } })
    tl.from(card.querySelectorAll('.bar, .f-bar'), { scaleX: 0, transformOrigin: 'left center', duration: 1.1, stagger: 0.12, ease: 'power3.out' })
    card.querySelectorAll('.f-bar').forEach((b) => (b.style.transformBox = 'fill-box'))
    card.querySelectorAll('.f-bar').forEach((b) => (b.style.transformOrigin = 'center'))
    tl.from(card.querySelectorAll('.val, .ref, .ref-lbl, .leak-lbl'), { autoAlpha: 0, duration: 0.5, stagger: 0.06 }, '-=0.5')
    const slope = card.querySelector('.slope')
    if (slope) {
      const len = slope.getTotalLength()
      gsap.set(slope, { strokeDasharray: len, strokeDashoffset: len })
      tl.to(slope, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0)
        .from(card.querySelectorAll('.dot'), { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', duration: 0.5, stagger: 1 }, 0)
    }
    card.querySelectorAll('[data-count]').forEach((el) => {
      const end = +el.dataset.count
      const o = { v: 0 }
      tl.to(o, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString('en-US') + el.dataset.suffix) }, 0)
    })
  })

  // map: routes draw out from Naples, pins pop in
  const routes = gsap.utils.toArray('.route')
  routes.forEach((r) => { const l = r.getTotalLength(); gsap.set(r, { strokeDasharray: l, strokeDashoffset: l }) })
  gsap.timeline({ scrollTrigger: { trigger: '.map', start: 'top 75%' } })
    .from('.map .nation, .map .states', { autoAlpha: 0, duration: 0.8 })
    .to(routes, { strokeDashoffset: 0, duration: 1.2, stagger: 0.12, ease: 'power2.inOut' }, 0.3)
    .from('.pin', { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', duration: 0.5, stagger: 0.1, ease: 'back.out(2)' }, 0.5)

  // portrait drifts slightly slower than the page
  gsap.to('.portrait-frame img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
  gsap.to('.about-photo img', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.about', scrub: true } })
}

// industries ticker
gsap.to('.ind-track', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })

// map list and pins highlight each other
document.querySelectorAll('[data-place]').forEach((el) => {
  const i = el.dataset.place
  el.addEventListener('mouseenter', () => document.querySelectorAll(`[data-place="${i}"]`).forEach((n) => n.classList.add('on')))
  el.addEventListener('mouseleave', () => document.querySelectorAll(`[data-place="${i}"]`).forEach((n) => n.classList.remove('on')))
})

// ---------- tooltip for anything with data-tip ----------
const tip = document.createElement('div')
tip.className = 'tip'
tip.setAttribute('role', 'status')
document.body.appendChild(tip)
document.addEventListener('pointerover', (e) => {
  const t = e.target.closest('[data-tip]')
  if (!t) return tip.classList.remove('show')
  tip.textContent = t.dataset.tip
  tip.classList.add('show')
})
document.addEventListener('pointermove', (e) => {
  if (!tip.classList.contains('show')) return
  const x = Math.min(e.clientX + 16, window.innerWidth - tip.offsetWidth - 12)
  tip.style.transform = `translate(${x}px, ${e.clientY + 18}px)`
})
document.addEventListener('pointerout', (e) => { if (!e.relatedTarget?.closest?.('[data-tip]')) tip.classList.remove('show') })
