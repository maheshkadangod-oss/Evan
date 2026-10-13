import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createScene } from './scene.js'
import { createTrail } from './trail.js'
import { site, hero, marquee, fit, approach, cases, about, cta } from './content.js'

gsap.registerPlugin(ScrollTrigger)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---------- render content ----------
const app = document.getElementById('app')
const dm = site.dmLink || '#contact'
app.innerHTML = `
  <section class="hero" id="top">
    <p class="eyebrow">${hero.eyebrow}</p>
    <h1>${hero.lines.map((l) => `<span class="line"><span>${l}</span></span>`).join('')}</h1>
    <div class="hero-row">
      <p class="hero-sub">${hero.sub}</p>
      <div class="btns">
        <a class="btn primary magnetic" href="${dm}" target="_blank" rel="noopener">${hero.ctaPrimary}</a>
        <a class="btn ghost magnetic" href="#work">${hero.ctaSecondary}</a>
      </div>
    </div>
  </section>

  <div class="marquee"><div class="marquee-track">${[...marquee, ...marquee].map((m) => `<span>${m}</span>`).join('')}</div></div>

  <section class="fit">
    <div class="fit-grid">
      <div><p class="kicker">Who I work with</p><h2 class="reveal">${fit.title}</h2></div>
      <ul>${fit.points.map((p, i) => `<li class="reveal"><b>0${i + 1}</b><span>${p}</span></li>`).join('')}</ul>
    </div>
  </section>

  <section class="approach" id="approach">
    <div class="approach-inner">
      <div class="approach-left">
        <p class="kicker">The method</p>
        <h2>${approach.title}</h2>
        <div class="steps">
          ${approach.steps.map((s) => `<div class="step"><div class="n">${s.n}</div><h3>${s.name}</h3><p>${s.body}</p></div>`).join('')}
        </div>
        <div class="progress">${approach.steps.map(() => '<i><b></b></i>').join('')}</div>
      </div>
    </div>
  </section>

  <section class="work" id="work">
    <div class="work-head">
      <div><p class="kicker">Results</p><h2 class="reveal">Case studies</h2></div>
      <p class="reveal">Real businesses, real numbers. Every figure below comes from the client’s own accounts.</p>
    </div>
    <div class="cases">
      ${cases.map((c) => `
        <article class="case reveal">
          <div>
            <div class="case-meta"><span>${c.industry}</span><span>·</span><span>${c.client}</span>${c.placeholder ? '<span class="tag-todo">PLACEHOLDER</span>' : ''}</div>
            <h3>${c.headline}</h3>
            <p>${c.summary}</p>
          </div>
          <div class="metrics">${c.metrics.map((m) => `<div class="metric"><strong>${m.value}</strong><span>${m.label}</span></div>`).join('')}</div>
        </article>`).join('')}
    </div>
  </section>

  <section class="about" id="about">
    <div class="about-grid">
      <div class="about-photo reveal"><img src="/img/evan-couple.webp" alt="Evan David Lee" loading="lazy" /></div>
      <div>
        <p class="kicker">About</p>
        <h2 class="reveal">${about.title}</h2>
        ${about.body.map((p) => `<p class="reveal">${p}</p>`).join('')}
        <div class="facts reveal"><span>${site.company}</span><span>${site.location}</span><span>${site.school}</span></div>
      </div>
    </div>
  </section>

  <section class="cta" id="contact">
    <p class="kicker">Cleared for takeoff</p>
    <h2>${cta.title.map((t) => `<span>${t}</span>`).join(' ')}</h2>
    <p>${cta.body}</p>
    <a class="btn primary magnetic" href="${dm}" target="_blank" rel="noopener">${cta.button}</a>
  </section>

  <footer>
    <span>© ${new Date().getFullYear()} ${site.name} · ${site.company}</span>
    <span>${site.location}</span>
  </footer>
`
document.querySelectorAll('[data-dm]').forEach((a) => { a.href = dm; a.target = '_blank'; a.rel = 'noopener' })

createTrail(app)

// ---------- smooth scroll ----------
const lenis = new Lenis({ lerp: 0.09, smoothWheel: !reduced })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')
    if (id.length < 2) return
    e.preventDefault()
    lenis.scrollTo(id === '#top' ? 0 : id, { offset: 0 })
  })
)

// ---------- 3D ----------
const loaderEl = document.getElementById('loader')
const three = createScene(document.getElementById('scene'), {
  onProgress: (p) => loaderEl.style.setProperty('--p', p),
})
const s = three.state
lenis.on('scroll', ({ velocity }) => three.setScrollVelocity(velocity))

// ---------- intro ----------
function intro() {
  const tl = gsap.timeline()
  tl.to(loaderEl, { autoAlpha: 0, duration: 0.6, delay: 0.3 })
    .to(s, { reveal: 1.02, duration: reduced ? 0 : 2.2, ease: 'power3.inOut' }, '-=0.2')
    .from('.hero h1 .line > span', { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, '-=1.8')
    .from('.eyebrow, .hero-sub, .hero .btn', { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.9')
}
s.x = 2.2
s.rotY = -0.35
window.addEventListener('load', intro)

// pinned method steps
const steps = gsap.utils.toArray('.step')
const bars = gsap.utils.toArray('.progress i b')
gsap.set(steps, { autoAlpha: 0, y: 40 })
gsap.set(steps[0], { autoAlpha: 1, y: 0 })
const stepTl = gsap.timeline({
  scrollTrigger: { trigger: '.approach', start: 'top top', end: () => '+=' + window.innerHeight * 2.2, pin: true, scrub: 0.6 },
})
steps.forEach((step, i) => {
  stepTl.to(bars[i], { scaleX: 1, duration: 1, ease: 'none' })
  if (i < steps.length - 1) {
    stepTl.to(step, { autoAlpha: 0, y: -40, duration: 0.3 }).to(steps[i + 1], { autoAlpha: 1, y: 0, duration: 0.3 }, '<0.1')
  }
})

// ---------- scroll choreography for the 3D figure ----------
const fly = (trigger, to, opts = {}) =>
  gsap.to(s, { ...to, ease: 'none', scrollTrigger: { trigger, start: 'top bottom', end: 'top top', scrub: 1, ...opts } })

fly('.fit', { x: 2.9, rotY: -0.9, scale: 0.9, opacity: 0.35, y: -0.2 })
fly('.approach', { x: -2.4, rotY: 0.55, scale: 1.05, opacity: 1, y: 0 })
fly('.work', { x: 0, rotY: Math.PI * 2 - 0.2, scale: 0.75, opacity: 0.12, speed: 2 })
fly('.about', { x: 2.8, rotY: Math.PI * 2 - 0.7, opacity: 0, scale: 0.7 })
fly('.cta', { x: 0, rotY: Math.PI * 2, scale: 0.85, opacity: 0.22, speed: 4, y: 0.2 })

// reveals
gsap.utils.toArray('.reveal').forEach((el) =>
  gsap.to(el, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
)

// marquee follows scroll direction
const track = document.querySelector('.marquee-track')
const mq = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
lenis.on('scroll', ({ direction, velocity }) => {
  gsap.to(mq, { timeScale: direction * (1 + Math.min(Math.abs(velocity) * 0.15, 4)), duration: 0.4, overwrite: true })
})

// about photo parallax
gsap.to('.about-photo img', { yPercent: -16, ease: 'none', scrollTrigger: { trigger: '.about-photo', scrub: true } })

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
    const alt = Math.round(p * 8000) * 10
    altEl.textContent = 'ALT ' + String(alt).padStart(5, '0')
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
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      card.style.setProperty('--mx', px * 100 + '%')
      card.style.setProperty('--my', py * 100 + '%')
      gsap.to(card, { rotateY: (px - 0.5) * 5, rotateX: (0.5 - py) * 5, transformPerspective: 1200, duration: 0.5 })
    })
    card.addEventListener('pointerleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8 }))
  })
}
