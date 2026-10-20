import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createAurora } from './aurora.js'
import { prepare, decode } from './scramble.js'

// Page HTML is pre-rendered at build time (src/render.js). This file only adds motion and the header.
gsap.registerPlugin(ScrollTrigger)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const mm = gsap.matchMedia()
const DESK = '(min-width: 961px)'
const MOB = '(max-width: 960px)'

// ---------- smooth scroll + aurora ----------
const aurora = createAurora()
const lenis = new Lenis({ lerp: 0.1, smoothWheel: !reduced })
lenis.on('scroll', (e) => {
  ScrollTrigger.update()
  aurora.onScroll(e.velocity, e.progress || 0)
})
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)

// ---------- header ----------
const nav = document.querySelector('.nav')
const navH = () => nav.offsetHeight
const menu = document.getElementById('menu')
const menuBtn = document.querySelector('.menu-btn')
const progress = document.querySelector('.nav-progress')
const ink = document.querySelector('.nav-ink')
const mbar = document.querySelector('.mbar')

function setMenu(open) {
  document.body.classList.toggle('menu-open', open)
  menuBtn.setAttribute('aria-expanded', String(open))
  menuBtn.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu'
  menu.setAttribute('aria-hidden', String(!open))
  open ? lenis.stop() : lenis.start()
}
menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')))
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false) })

document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')
    if (id.length < 2) return
    e.preventDefault()
    const wasOpen = document.body.classList.contains('menu-open')
    setMenu(false)
    lenis.scrollTo(id === '#top' ? 0 : id, { offset: -navH() + 1, duration: wasOpen ? 1.1 : 1.4, immediate: reduced })
    history.replaceState(null, '', id)
  })
)

ScrollTrigger.create({ start: 60, end: 'max', onToggle: (st) => nav.classList.toggle('solid', st.isActive) })
ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (st) => progress.style.setProperty('--p', st.progress.toFixed(4)) })

// active section: highlight its link and slide the underline under it
function moveInk(link) {
  if (!link || !ink) return gsap.to(ink, { autoAlpha: 0, duration: 0.3 })
  const r = link.getBoundingClientRect()
  const p = link.parentElement.getBoundingClientRect()
  gsap.to(ink, { x: r.left - p.left, width: r.width, autoAlpha: 1, duration: 0.5, ease: 'power3.out' })
}
function setActive(id) {
  document.querySelectorAll('[data-spy]').forEach((a) => a.classList.toggle('active', a.dataset.spy === id))
  moveInk(document.querySelector(`.nav-links [data-spy="${id}"]`))
}
document.querySelectorAll('[data-spy]').forEach((a) => {
  const sec = document.getElementById(a.dataset.spy)
  if (!sec || a.closest('.menu')) return
  ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: (st) => st.isActive && setActive(a.dataset.spy) })
})
ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom 45%', onToggle: (st) => st.isActive && setActive(null) })
ScrollTrigger.create({ trigger: '.cta', start: 'top 45%', end: 'bottom top', onToggle: (st) => st.isActive && setActive(null) })

// phone: quick-contact bar shows after the hero, hides at the closing call to action
if (mbar) {
  const show = () => document.body.classList.add('mbar-on')
  const hide = () => document.body.classList.remove('mbar-on')
  ScrollTrigger.create({ trigger: '.hero', start: 'bottom 60%', endTrigger: '.cta', end: 'top 85%', onEnter: show, onEnterBack: show, onLeave: hide, onLeaveBack: hide })
}

// ---------- swipe carousels on phones (proof stats, case studies) ----------
document.querySelectorAll('[data-carousel]').forEach((el) => {
  const dots = el.nextElementSibling?.classList.contains('dots') ? el.nextElementSibling.querySelectorAll('[data-dot]') : []
  const update = () => {
    const kids = [...el.children]
    const center = el.scrollLeft + el.clientWidth / 2
    let best = 0
    kids.forEach((k, i) => { if (Math.abs(k.offsetLeft + k.offsetWidth / 2 - center) < Math.abs(kids[best].offsetLeft + kids[best].offsetWidth / 2 - center)) best = i })
    dots.forEach((d, i) => d.classList.toggle('on', i === best))
  }
  el.addEventListener('scroll', update, { passive: true })
  dots.forEach((d, i) => d.addEventListener('click', () => el.scrollTo({ left: el.children[i].offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: 'smooth' })))
  update()
})

// ---------- count-up numbers ----------
function countUp(el, tl, at = 0) {
  const raw = el.textContent.trim()
  const m = raw.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/)
  if (!m || (m[1] === '#' && +m[2] < 13)) return
  const [, pre, num, post] = m
  const end = parseFloat(num.replace(/,/g, ''))
  const dec = (num.split('.')[1] || '').length
  const o = { v: 0 }
  const fmt = (v) => pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + post
  el.textContent = fmt(0)
  tl.to(o, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v)) }, at)
}

// ---------- motion ----------
if (!reduced) {
  // hero entrance
  const intro = gsap.timeline({ delay: 0.15 })
  intro.from('.hero h1 .line > span', { yPercent: 105, duration: 1.2, stagger: 0.12, ease: 'power4.out' })
    .from('.hero .rv', { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.8')
    .from('.portrait-frame', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'power4.inOut' }, 0.1)
    .from('.portrait img', { scale: 1.2, duration: 1.8, ease: 'power3.out' }, 0.1)
    .from('.float-card', { y: 30, autoAlpha: 0, duration: 1, ease: 'power3.out' }, 0.9)
    .from('.fc-bar', { scaleX: 0, duration: 1.1, stagger: 0.15, ease: 'power3.out' }, 1.1)
    .from('.nav > *', { y: -16, autoAlpha: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out' }, 0.2)
  document.querySelectorAll('.proof strong').forEach((el) => countUp(el, intro, 0.8))
  const heroWords = prepare(document.querySelectorAll('.hero h1 .line > span'))
  intro.call(() => decode(heroWords, { duration: 1.4 }), null, 0.25)
  const ctaWords = prepare(document.querySelectorAll('.cta h2 .line > span'))
  ScrollTrigger.create({ trigger: '.cta', start: 'top 70%', once: true, onEnter: () => decode(ctaWords, { duration: 1.3 }) })

  // headings: words rise out of a mask while the letters decode, matrix style
  gsap.utils.toArray('.sw').forEach((h) => {
    const items = prepare(h.querySelectorAll('.w > span'))
    gsap.from(h.querySelectorAll('.w > span'), {
      yPercent: 110, duration: 0.9, stagger: 0.03, ease: 'power4.out',
      scrollTrigger: { trigger: h, start: 'top 88%', once: true, onEnter: () => decode(items, { duration: h.tagName === 'H3' ? 0.9 : 1.2 }) },
    })
  })
  // small labels decode too
  gsap.utils.toArray('section:not(.hero) .kicker').forEach((k) => {
    const items = prepare([k])
    ScrollTrigger.create({ trigger: k, start: 'top 92%', once: true, onEnter: () => decode(items, { duration: 0.7 }) })
  })
  // generic reveals
  gsap.utils.toArray('section:not(.hero) .rv').forEach((el) =>
    gsap.from(el, { y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
  )

  // headline stats count up
  gsap.utils.toArray('.stat-row').forEach((row) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 85%' } })
    row.querySelectorAll('strong').forEach((el, i) => countUp(el, tl, i * 0.1))
  })
  // case study metrics count up
  gsap.utils.toArray('.metrics').forEach((m) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: m, start: 'top 88%' } })
    m.querySelectorAll('dd').forEach((dd, i) => countUp(dd, tl, i * 0.12))
  })

  // charts draw when they come into view
  gsap.utils.toArray('.chart-card').forEach((card) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 80%' } })
    tl.from(card, { clipPath: 'inset(0 0 100% 0 round 16px)', duration: 1, ease: 'power3.inOut' })
    card.querySelectorAll('.f-bar').forEach((b) => { b.style.transformBox = 'fill-box'; b.style.transformOrigin = 'center' })
    tl.from(card.querySelectorAll('.bar, .f-bar'), { scaleX: 0, transformOrigin: 'left center', duration: 1.1, stagger: 0.12, ease: 'power3.out' }, 0.4)
    card.querySelectorAll('.col').forEach((c) => { c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'bottom' })
    tl.from(card.querySelectorAll('.col'), { scaleY: 0, duration: 1.1, stagger: 0.1, ease: 'power3.out' }, 0.4)
    const ringFg = card.querySelector('.ring-fg')
    if (ringFg) tl.fromTo(ringFg, { strokeDashoffset: getComputedStyle(ringFg).getPropertyValue('--c') }, { strokeDashoffset: getComputedStyle(ringFg).getPropertyValue('--o'), duration: 1.6, ease: 'power2.inOut' }, 0.4)
    card.querySelectorAll('.ring-key dd').forEach((dd) => countUp(dd, tl, 0.4))
    tl.from(card.querySelectorAll('.val, .ref, .ref-lbl, .leak-lbl'), { autoAlpha: 0, duration: 0.5, stagger: 0.06 }, '-=0.5')
    const slope = card.querySelector('.slope')
    if (slope) {
      const len = slope.getTotalLength()
      gsap.set(slope, { strokeDasharray: len, strokeDashoffset: len })
      tl.to(slope, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.4)
        .from(card.querySelectorAll('.dot'), { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', duration: 0.5, stagger: 1 }, 0.4)
    }
    card.querySelectorAll('[data-count]').forEach((el) => {
      const o = { v: 0 }
      tl.to(o, { v: +el.dataset.count, duration: 1.6, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString('en-US') + el.dataset.suffix) }, 0.4)
    })
  })

  // method: a progress line fills down the steps, each step lights up as it is reached
  const steps = document.querySelector('.steps')
  if (steps) {
    gsap.to(steps, { '--p': 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 70%', end: 'bottom 55%', scrub: 0.6 } })
    steps.querySelectorAll('li').forEach((li) => ScrollTrigger.create({ trigger: li, start: 'top 68%', onEnter: () => li.classList.add('lit'), onLeaveBack: () => li.classList.remove('lit') }))
  }
  // services light up one at a time as they pass the middle of the screen
  document.querySelectorAll('.svc li').forEach((li) =>
    ScrollTrigger.create({ trigger: li, start: 'top 72%', onEnter: () => li.classList.add('lit'), onLeaveBack: () => li.classList.remove('lit') })
  )

  // map: routes draw out from Naples, pins pop in
  const routes = gsap.utils.toArray('.route')
  routes.forEach((r) => { const l = r.getTotalLength(); gsap.set(r, { strokeDasharray: l, strokeDashoffset: l }) })
  gsap.timeline({ scrollTrigger: { trigger: '.map', start: 'top 75%' } })
    .from('.map .nation, .map .states', { autoAlpha: 0, duration: 0.8 })
    .to(routes, { strokeDashoffset: 0, duration: 1.2, stagger: 0.12, ease: 'power2.inOut' }, 0.3)
    .from('.pin', { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', duration: 0.5, stagger: 0.1, ease: 'back.out(2)' }, 0.5)

  // CTA headline
  gsap.from('.cta h2 .line > span', { yPercent: 105, duration: 1.1, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: '.cta', start: 'top 70%' } })
  gsap.fromTo('.cta h2', { scale: 0.92 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'center center', scrub: true } })

  mm.add(DESK, () => {
    // words and visuals slide in from opposite sides
    gsap.utils.toArray('.from-left, .from-right').forEach((el) =>
      gsap.from(el, { x: el.classList.contains('from-left') ? -80 : 80, autoAlpha: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%' } })
    )
    // hero gently splits apart as you leave it
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true } })
      .to('.hero h1 .line:first-child', { xPercent: -6, ease: 'none' }, 0)
      .to('.hero h1 .line:last-child', { xPercent: 6, ease: 'none' }, 0)
      .to('.hero-copy', { autoAlpha: 0.15, ease: 'none' }, 0)
      .to('.portrait-frame img', { yPercent: 8, scale: 1.06, ease: 'none' }, 0)
      .to('.float-card', { y: -60, ease: 'none' }, 0)
    // charts float a little slower than their story
    gsap.utils.toArray('.case-viz').forEach((v) =>
      gsap.fromTo(v, { y: 50 }, { y: -50, ease: 'none', scrollTrigger: { trigger: v.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
    )
    gsap.to('.about-photo img', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.about', scrub: true } })
  })

  mm.add(MOB, () => {
    // on phones everything rises in; no sideways travel that can jitter the page
    gsap.utils.toArray('.from-left, .from-right').forEach((el) =>
      gsap.from(el, { y: 40, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
    )
    gsap.to('.portrait-frame img', { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.portrait', start: 'top 20%', end: 'bottom top', scrub: true } })
  })
}

// industries ticker, nudged by scroll speed and direction
const ticker = gsap.to('.ind-track', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
lenis.on('scroll', ({ velocity, direction }) => {
  gsap.to(ticker, { timeScale: (direction < 0 ? -1 : 1) * (1 + Math.min(Math.abs(velocity) * 0.12, 5)), duration: 0.4, overwrite: true })
})

// map list and pins highlight each other
document.querySelectorAll('[data-place]').forEach((el) => {
  const i = el.dataset.place
  const on = (v) => document.querySelectorAll(`[data-place="${i}"]`).forEach((n) => n.classList.toggle('on', v))
  el.addEventListener('mouseenter', () => on(true))
  el.addEventListener('mouseleave', () => on(false))
  el.addEventListener('click', () => { document.querySelectorAll('[data-place].on').forEach((n) => n.classList.remove('on')); on(true) })
})

// ---------- tooltip for anything with data-tip (mouse only) ----------
if (window.matchMedia('(hover: hover)').matches) {
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
}

window.addEventListener('load', () => ScrollTrigger.refresh())
