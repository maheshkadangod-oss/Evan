import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createScene } from './scene.js'
import { createTrail } from './trail.js'
import { site, hero, marquee, fit, approach, cases, about, cta } from './content.js'

gsap.registerPlugin(ScrollTrigger)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---------- render content ----------
// The page is one fixed stage. Each scene is a layer: words on one side, image on the other.
// Scrolling never moves the page up; it slides words and image sideways and swaps their sides.
const app = document.getElementById('app')
const dm = site.dmLink || '#contact'
const metaRow = (c) => `<div class="case-meta"><span>${c.industry}</span><span>·</span><span>${c.client}</span>${c.placeholder ? '<span class="tag-todo">PLACEHOLDER</span>' : ''}</div>`

app.innerHTML = `
<div class="stage${reduced ? ' static' : ''}" id="stage">
  <section class="layer side-left hero" data-scene="top">
    <div class="panel">
      <p class="eyebrow item">${hero.eyebrow}</p>
      <h1 class="item">${hero.lines.map((l) => `<span class="line"><span>${l}</span></span>`).join('')}</h1>
      <p class="hero-sub item" data-speed="1.25">${hero.sub}</p>
      <div class="btns item" data-speed="1.5">
        <a class="btn primary magnetic" href="${dm}" target="_blank" rel="noopener">${hero.ctaPrimary}</a>
        <a class="btn ghost magnetic" href="#work">${hero.ctaSecondary}</a>
      </div>
    </div>
    <div class="marquee item" data-speed="0.6"><div class="marquee-track">${[...marquee, ...marquee].map((m) => `<span>${m}</span>`).join('')}</div></div>
  </section>

  <section class="layer side-right fit" data-scene="fit">
    <div class="panel">
      <p class="kicker item">Who I work with</p>
      <h2 class="item">${fit.title}</h2>
      <ul>${fit.points.map((p, i) => `<li class="item" data-speed="${1.1 + i * 0.15}"><b>0${i + 1}</b><span>${p}</span></li>`).join('')}</ul>
    </div>
  </section>

  <section class="layer side-left approach" data-scene="approach">
    <div class="panel">
      <p class="kicker item">The method</p>
      <h2 class="item">${approach.title}</h2>
      <div class="cycle steps item" data-speed="1.3">
        ${approach.steps.map((s) => `<div class="slide step"><div class="n">${s.n}</div><h3>${s.name}</h3><p>${s.body}</p></div>`).join('')}
      </div>
      <div class="progress item" data-speed="1.5">${approach.steps.map(() => '<i><b></b></i>').join('')}</div>
    </div>
  </section>

  <section class="layer side-right work" data-scene="work">
    <div class="panel">
      <p class="kicker item">Results</p>
      <h2 class="item">Case studies</h2>
      <div class="cycle cases item" data-speed="1.3">
        ${cases.map((c) => `
          <article class="slide case">
            ${metaRow(c)}
            <h3>${c.headline}</h3>
            <p>${c.summary}</p>
            <div class="metrics">${c.metrics.map((m) => `<div class="metric"><strong>${m.value}</strong><span>${m.label}</span></div>`).join('')}</div>
          </article>`).join('')}
      </div>
      <div class="progress item" data-speed="1.5">${cases.map(() => '<i><b></b></i>').join('')}</div>
    </div>
  </section>

  <section class="layer side-left about" data-scene="about">
    <div class="panel">
      <p class="kicker item">About</p>
      <h2 class="item">${about.title}</h2>
      ${about.body.map((p, i) => `<p class="item" data-speed="${1.15 + i * 0.15}">${p}</p>`).join('')}
      <div class="facts item" data-speed="1.5"><span>${site.company}</span><span>${site.location}</span><span>${site.school}</span></div>
    </div>
    <figure class="photo item" data-speed="0.8" data-side="right"><img src="/img/evan-couple.webp" alt="Evan David Lee" /></figure>
  </section>

  <section class="layer side-right cta" data-scene="contact">
    <div class="panel">
      <p class="kicker item">Cleared for takeoff</p>
      <h2 class="item">${cta.title.map((t) => `<span>${t}</span>`).join(' ')}</h2>
      <p class="item" data-speed="1.2">${cta.body}</p>
      <div class="item" data-speed="1.4"><a class="btn primary magnetic" href="${dm}" target="_blank" rel="noopener">${cta.button}</a></div>
    </div>
    <footer class="item" data-speed="0.6">
      <span>© ${new Date().getFullYear()} ${site.name} · ${site.company}</span>
      <span>${site.location}</span>
    </footer>
  </section>
</div>
`
document.querySelectorAll('[data-dm]').forEach((a) => { a.href = dm; a.target = '_blank'; a.rel = 'noopener' })

// ---------- smooth scroll ----------
const lenis = new Lenis({ lerp: 0.09, smoothWheel: !reduced })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)

// ---------- 3D ----------
const loaderEl = document.getElementById('loader')
const three = createScene(document.getElementById('scene'), {
  onProgress: (p) => loaderEl.style.setProperty('--p', p),
})
const s = three.state
lenis.on('scroll', ({ velocity }) => three.setScrollVelocity(velocity))

// Where the figure stands in each scene. x is in half-screens: +1 right edge, -1 left edge.
// It always takes the side the words are not on. mdim dims it on phones, where it sits behind text.
const poses = {
  top: { x: 0.5, rotY: -0.35, scale: 1, opacity: 1, mdim: 1, speed: 1 },
  fit: { x: -0.5, rotY: 0.6, scale: 0.95, opacity: 1, mdim: 0.3, speed: 1.4 },
  approach: { x: 0.5, rotY: Math.PI * 2 - 0.5, scale: 1, opacity: 1, mdim: 0.3, speed: 1.8 },
  work: { x: -0.5, rotY: Math.PI * 2 + 0.55, scale: 0.95, opacity: 1, mdim: 0.25, speed: 2.4 },
  about: { x: 0.9, rotY: Math.PI * 4 - 0.6, scale: 0.8, opacity: 0, mdim: 0, speed: 1.6 },
  contact: { x: -0.5, rotY: Math.PI * 4 + 0.45, scale: 1, opacity: 1, mdim: 0.3, speed: 3.5 },
}
Object.assign(s, poses.top)

// ---------- intro ----------
function intro() {
  const tl = gsap.timeline()
  tl.to(loaderEl, { autoAlpha: 0, duration: 0.6, delay: 0.3 })
    .to(s, { reveal: 1.02, duration: reduced ? 0 : 2.2, ease: 'power3.inOut' }, '-=0.2')
  if (!reduced) {
    tl.from('.hero h1 .line > span', { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, '-=1.8')
      .from('.hero .eyebrow, .hero .hero-sub, .hero .btn', { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.9')
  }
}
window.addEventListener('load', intro)

// ---------- the stage timeline ----------
const layers = gsap.utils.toArray('.layer')
let master = null

function cycle(tl, root, at, perSlide) {
  // slides inside one panel replace each other sideways while the scene holds
  const slides = root.querySelectorAll('.slide')
  const bars = root.parentElement.querySelectorAll('.progress i b')
  gsap.set(slides, { autoAlpha: 0, xPercent: 18 })
  gsap.set(slides[0], { autoAlpha: 1, xPercent: 0 })
  slides.forEach((slide, i) => {
    const t = at + i * perSlide
    tl.fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: perSlide, ease: 'none' }, t)
    if (i < slides.length - 1) {
      tl.to(slide, { autoAlpha: 0, xPercent: -18, duration: 0.35, ease: 'power2.in' }, t + perSlide - 0.35)
        .fromTo(slides[i + 1], { autoAlpha: 0, xPercent: 18 }, { autoAlpha: 1, xPercent: 0, duration: 0.35, ease: 'power2.out' }, t + perSlide)
    }
  })
  return slides.length * perSlide
}

// items fly off and on along their own side; speed varies per item so they move as layers
const edge = (layer, item) => {
  const side = item.dataset.side || (layer.classList.contains('side-left') ? 'left' : 'right')
  return side === 'left' ? -1 : 1
}
const dist = (layer, item) => edge(layer, item) * window.innerWidth * 0.75 * parseFloat(item.dataset.speed || 1)

function build() {
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
  const T = 1 // length of one swap between scenes, in timeline units (about one screen of scroll)
  let t = 0
  gsap.set(layers, { autoAlpha: 0 })
  gsap.set(layers[0], { autoAlpha: 1 })

  layers.forEach((layer, i) => {
    const name = layer.dataset.scene
    const items = layer.querySelectorAll('.item')

    // hold this scene
    tl.addLabel(name, t + 0.05)
    let hold = 0.7
    const c = layer.querySelector('.cycle')
    if (c) hold = cycle(tl, c, t + 0.2, 0.9) + 0.3
    t += hold

    const next = layers[i + 1]
    if (!next) return
    const nextItems = next.querySelectorAll('.item')
    // swap: current words leave by their own edge, the next words arrive from theirs,
    // and the figure crosses the screen to the free side
    tl.to(items, { x: (k, el) => dist(layer, el), autoAlpha: 0, duration: T * 0.6, stagger: 0.04 }, t)
      .set(next, { autoAlpha: 1 }, t + T * 0.3)
      .fromTo(nextItems, { x: (k, el) => dist(next, el), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: T * 0.6, stagger: 0.05, immediateRender: false }, t + T * 0.35)
      .set(layer, { autoAlpha: 0 }, t + T)
      .to(s, { ...poses[next.dataset.scene], duration: T * 0.7, ease: 'power2.inOut' }, t)
    t += T
  })
  return tl
}

if (!reduced) {
  master = build()
  ScrollTrigger.create({
    trigger: '#stage',
    start: 'top top',
    end: () => '+=' + master.duration() * window.innerHeight * 0.9,
    pin: true,
    scrub: 0.8,
    animation: master,
    invalidateOnRefresh: true,
  })
}

// nav links jump to a scene's label on the timeline
function scrollToScene(name) {
  if (!master) return document.querySelector(`[data-scene="${name}"]`)?.scrollIntoView({ behavior: 'smooth' })
  const st = master.scrollTrigger
  const at = master.labels[name] ?? 0
  lenis.scrollTo(st.start + (at / master.duration()) * (st.end - st.start), { duration: 1.6 })
}
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1)
    if (!id) return
    e.preventDefault()
    scrollToScene(id === 'results' ? 'work' : id)
  })
)

// S-shaped flight path, drawn by overall scroll progress
createTrail()

// marquee follows scroll direction
const track = document.querySelector('.marquee-track')
const mq = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
lenis.on('scroll', ({ direction, velocity }) => {
  gsap.to(mq, { timeScale: (direction || 1) * (1 + Math.min(Math.abs(velocity) * 0.15, 4)), duration: 0.4, overwrite: true })
})

// ---------- altimeter HUD: the whole page is a climb to FL080 ----------
const altEl = document.getElementById('alt')
const altLabel = document.getElementById('alt-label')
const tape = document.querySelector('.hud-tape b')
const marks = document.querySelectorAll('.hud-marks span')
const labels = ['ON THE GROUND', 'SIX FIGURES', 'SEVEN FIGURES', 'EIGHT FIGURES']
ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (st) => {
    const p = st.progress
    altEl.textContent = 'ALT ' + String(Math.round(p * 8000) * 10).padStart(5, '0')
    tape.style.height = p * 100 + '%'
    const level = p < 0.2 ? 0 : p < 0.55 ? 1 : p < 0.85 ? 2 : 3
    marks.forEach((m, i) => m.classList.toggle('on', i <= level))
    altLabel.textContent = labels[level]
  },
})

// ---------- micro interactions ----------
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect()
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4 })
    })
    btn.addEventListener('pointerleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, .4)' }))
  })
  document.querySelectorAll('.case').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%')
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%')
    })
  })
}
