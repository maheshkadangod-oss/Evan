// Builds the page HTML as plain strings. Runs at build time (see vite.config.js), so search
// engines and AI crawlers get the full content without running any JavaScript.
import { renderChart, funnelSvg } from './charts.js'
import { mapSize, nationPath, statesPath, places } from './us-map.js'
import { site, hero, industries, cases, moreWork, services, method, about, cta, faq, numbers, local, ventures } from './content.js'

const ext = 'target="_blank" rel="noopener"'
const year = new Date().getFullYear()

export const sections = [
  ['numbers', 'Numbers'],
  ['work', 'Work'],
  ['method', 'Method'],
  ['services', 'Services'],
  ['reach', 'Clients'],
  ['about', 'About'],
  ['faq', 'FAQ'],
]

// Splits a heading into masked words for the word-by-word reveal. Text stays plain for crawlers.
export const words = (t) => t.split(' ').map((w) => `<span class="w"><span>${w}</span></span>`).join(' ')

export function navHtml(prefix = '') {
  return `<header class="nav">
      <a href="${prefix || '#top'}" class="logo" aria-label="${site.name}, back to top"><span>${site.name}</span><small>Growth partner</small></a>
      <nav aria-label="Main" class="nav-links">
        ${sections.map(([id, label]) => `<a href="${prefix}#${id}" data-spy="${id}">${label}</a>`).join('')}
        <i class="nav-ink" aria-hidden="true"></i>
      </nav>
      <div class="nav-right">
        <a href="${site.bookLink}" ${ext} class="nav-cta">Book a call</a>
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="sr-only">Open menu</span><i></i><i></i></button>
      </div>
      <b class="nav-progress" aria-hidden="true"></b>
    </header>
    <div class="menu" id="menu" aria-hidden="true">
      <nav aria-label="Mobile">
        ${sections.map(([id, label], i) => `<a href="${prefix}#${id}" data-spy="${id}" style="--i:${i}"><small>${String(i + 1).padStart(2, '0')}</small>${label}</a>`).join('')}
      </nav>
      <div class="menu-foot" style="--i:${sections.length}">
        <a class="btn primary" href="${site.bookLink}" ${ext}>Book a strategy call<i aria-hidden="true">→</i></a>
        <a class="menu-tel" href="tel:${site.tel}">${site.phone}</a>
        <span>${site.address}</span>
      </div>
    </div>
    <div class="mbar" aria-label="Quick contact">
      <a href="${site.bookLink}" ${ext} class="mbar-book">Book a call</a>
      <a href="tel:${site.tel}" class="mbar-call" aria-label="Call ${site.phone}">Call</a>
    </div>`
}

const icons = {
  linkedin: '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.25H3V9.75Zm6.5 0h3.8v1.6h.06c.53-.95 1.84-1.95 3.79-1.95 4.05 0 4.8 2.5 4.8 5.76V21h-4v-5.1c0-1.22-.02-2.79-1.75-2.79-1.75 0-2.02 1.32-2.02 2.7V21h-4V9.75Z"/>',
  instagram: '<path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.75a3.05 3.05 0 1 1 0-6.1 3.05 3.05 0 0 1 0 6.1ZM17.9 7.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z"/><path d="M12 2.5c-2.6 0-2.9 0-3.92.06-1 .04-1.7.2-2.3.44a4.7 4.7 0 0 0-1.7 1.1A4.7 4.7 0 0 0 3 5.8c-.24.6-.4 1.3-.44 2.3C2.5 9.1 2.5 9.4 2.5 12s0 2.9.06 3.92c.04 1 .2 1.7.44 2.3.24.64.57 1.18 1.1 1.7.52.53 1.06.86 1.7 1.1.6.24 1.3.4 2.3.44 1.02.05 1.33.06 3.92.06s2.9 0 3.92-.06c1-.04 1.7-.2 2.3-.44a4.7 4.7 0 0 0 1.7-1.1 4.7 4.7 0 0 0 1.1-1.7c.24-.6.4-1.3.44-2.3.05-1.02.06-1.33.06-3.92s0-2.9-.06-3.92c-.04-1-.2-1.7-.44-2.3a4.7 4.7 0 0 0-1.1-1.7 4.7 4.7 0 0 0-1.7-1.1c-.6-.24-1.3-.4-2.3-.44C14.9 2.5 14.6 2.5 12 2.5Zm0 1.7c2.55 0 2.85 0 3.86.06.93.04 1.44.2 1.78.33.45.17.77.38 1.1.72.34.33.55.65.72 1.1.13.34.29.85.33 1.78.05 1 .06 1.3.06 3.86s0 2.85-.06 3.86c-.04.93-.2 1.44-.33 1.78-.17.45-.38.77-.72 1.1-.33.34-.65.55-1.1.72-.34.13-.85.29-1.78.33-1 .05-1.3.06-3.86.06s-2.85 0-3.86-.06c-.93-.04-1.44-.2-1.78-.33a2.96 2.96 0 0 1-1.1-.72 2.96 2.96 0 0 1-.72-1.1c-.13-.34-.29-.85-.33-1.78C4.2 14.85 4.2 14.55 4.2 12s0-2.85.06-3.86c.04-.93.2-1.44.33-1.78.17-.45.38-.77.72-1.1.33-.34.65-.55 1.1-.72.34-.13.85-.29 1.78-.33C9.15 4.2 9.45 4.2 12 4.2Z"/>',
  facebook: '<path d="M13.5 21v-7.6h2.56l.38-2.97H13.5V8.54c0-.86.24-1.45 1.47-1.45h1.57V4.44A21 21 0 0 0 14.25 4.3c-2.26 0-3.8 1.38-3.8 3.9v2.23H7.9v2.97h2.55V21h3.05Z"/>',
  mail: '<path d="M3 5.5h18v13H3v-13Zm2 2v.3l7 4.7 7-4.7v-.3H5Zm14 2.7-7 4.7-7-4.7v6.3h14v-6.3Z"/>',
}
const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">${icons[name]}</svg>`

export function footerHtml() {
  const socials = [
    ['linkedin', 'Evan on LinkedIn', site.linkedin],
    ['linkedin', 'JetSpeedSocial on LinkedIn', site.linkedinCompany],
    ['instagram', 'JetSpeedSocial on Instagram', site.instagram],
    ['facebook', 'Evan on Facebook', site.facebook],
    ['mail', `Email ${site.email}`, `mailto:${site.email}`],
  ]
  return `<footer class="foot">
  <div class="foot-grid">
    <div class="foot-col">
      <strong class="foot-name">${site.nickname}</strong>
      <span>${site.titles}</span>
      <a href="/${local.slug}/">Marketing in Naples, FL</a>
      <ul class="socials" aria-label="Social media">${socials.map(([k, label, href]) => `<li><a href="${href}" ${href.startsWith('mailto') ? '' : ext} aria-label="${label}" title="${label}">${icon(k)}</a></li>`).join('')}</ul>
    </div>
    <address class="foot-col">
      <b>${site.company}</b>
      <span>${site.address}</span>
      <a href="${site.mapsLink}" ${ext}>Get directions</a>
      <a href="tel:${site.tel}">${site.phone}</a>
      <a href="mailto:${site.email}">${site.email}</a>
      <span>${site.hours}</span>
    </address>
    <div class="foot-col">
      <b>Ventures</b>
      ${ventures.map((v) => `<a href="${v.url}" ${ext}>${v.name}<small>${v.status}</small></a>`).join('')}
    </div>
  </div>
  <div class="foot-base"><span>© ${year} ${site.fullName}</span><span>${site.city}</span></div>
</footer>`
}

function caseBlock(c, i) {
  return `
  <article class="case ${i % 2 ? 'flip' : ''}" id="case-${c.slug}">
    <div class="case-copy from-${i % 2 ? 'right' : 'left'}">
      <p class="case-meta"><span>${String(i + 1).padStart(2, '0')}</span>${c.client} · ${c.industry}</p>
      <h3 class="sw">${words(c.headline)}</h3>
      <p class="case-sum">${c.summary}</p>
      <dl class="metrics">${c.metrics.map((m) => `<div><dt>${m.label}</dt><dd>${m.value}</dd></div>`).join('')}</dl>
      <p class="channels">${c.channels}</p>
      <a class="read-more" href="/work/${c.slug}/">Read the ${c.client} case study <i aria-hidden="true">→</i></a>
    </div>
    <div class="case-viz from-${i % 2 ? 'left' : 'right'}">${renderChart(c.chart)}</div>
  </article>`
}

export function renderHome() {
  return `
<section class="nameplate" id="top">
  <div class="np-photo"><img src="/img/evan-hero.webp" alt="Evan “Jet” Lee, marketing growth partner and founder of JetSpeedSocial, in Naples, Florida" width="880" height="700" fetchpriority="high" /></div>
  <ul class="np-meta">
    <li>Marketing growth partner<br />and fractional CMO</li>
    <li>Based in<br />${site.city}</li>
    <li>Founder of<br /><a href="${site.agency}" ${ext}>${site.company}</a></li>
    <li>© ${year}</li>
  </ul>
  <div class="np-row">
    <h1 class="np-name"><span class="nm"><span>Evan</span></span> <span class="nm"><span>Lee</span></span><span class="sr-only">, marketing growth partner and fractional CMO in Naples, Florida</span></h1>
    <a class="np-cta" href="${site.bookLink}" ${ext}>Book a call <i aria-hidden="true">↗</i></a>
  </div>
  <p class="np-touch">Get in touch at<br /><a href="mailto:${site.email}">${site.email}</a></p>
  <a class="np-down" href="#intro" aria-label="Scroll to the introduction">↓</a>
</section>

<section class="intro" id="intro">
  <p class="eyebrow rv"><span class="eb-long">${hero.eyebrow}</span><span class="eb-short">Growth partner · Naples, FL</span></p>
  <h2 class="intro-title sw">${words(hero.lines.join(' ').replace(/\.$/, ''))}<span class="dot">.</span></h2>
  <div class="intro-row">
    <p class="lead rv">${hero.sub}</p>
    <div class="btns rv">
      <a class="btn primary" href="${site.bookLink}" ${ext}>${hero.primary}<i aria-hidden="true">→</i></a>
      <a class="btn ghost" href="#work">${hero.secondary}</a>
    </div>
  </div>
  <ul class="proof" data-carousel>
    ${hero.proof.map((p) => `<li class="rv"><strong>${p.value}</strong><span>${p.label}</span></li>`).join('')}
  </ul>
</section>

<section class="industries" aria-label="Industries served">
  <p class="kicker">Industries I’ve helped grow</p>
  <div class="ind-track">${[...industries, ...industries].map((x, i) => `<span${i >= industries.length ? ' aria-hidden="true"' : ''}>${x}</span>`).join('')}</div>
</section>

<section class="numbers" id="numbers">
  <header class="sec-head">
    <p class="kicker">By the numbers</p>
    <h2 class="sw">${words('The work, counted.')}</h2>
    <p class="sec-sub rv">Counted across the clients in my case studies. Tap any bar to see its value.</p>
  </header>
  <ul class="stat-row">${numbers.stats.map((st) => `<li class="rv"><strong>${st.value}</strong><span>${st.label}</span></li>`).join('')}</ul>
  <div class="dash-pin"><div class="dash">${numbers.charts.map((ch) => renderChart(ch)).join('')}</div></div>
</section>

<section class="work" id="work">
  <header class="sec-head">
    <h2 class="sw">${words('Results, in the client’s own numbers.')}</h2>
    <p class="sec-sub rv">Every figure below comes from the ad, analytics and search accounts we ran.</p>
  </header>
  <div class="cases">${cases.map(caseBlock).join('')}</div>
  <div class="more">
    <h3 class="rv">More results</h3>
    <table class="more-table">
      <thead><tr><th>Client</th><th>Industry</th><th>Channels</th><th>Outcome</th></tr></thead>
      <tbody>${moreWork.map((m) => `<tr class="rv"><td>${m.client}</td><td>${m.industry}</td><td>${m.channels}</td><td>${m.outcome || '<span class="muted">Case study on request</span>'}</td></tr>`).join('')}</tbody>
    </table>
  </div>
</section>

<section class="method" id="method">
  <div class="split">
    <div class="from-left">
      <p class="kicker">The method</p>
      <h2 class="sw">${words(method.title)}</h2>
      <ol class="steps">${method.steps.map((s) => `<li class="rv"><span class="n">${s.n}</span><div><h3>${s.name}</h3><p>${s.body}</p></div></li>`).join('')}</ol>
    </div>
    <div class="from-right">${funnelSvg()}</div>
  </div>
</section>

<section class="services" id="services">
  <div class="split top">
    <div class="sticky">
      <p class="kicker rv">Services</p>
      <h2 class="sw">${words('One team for the whole path to revenue.')}</h2>
      <p class="sec-sub rv">Delivered through <a class="inline" href="${site.agency}" ${ext}>JetSpeedSocial</a>, my agency in Naples.</p>
    </div>
    <ol class="svc">${services.map((s, i) => `<li class="rv"><span class="n">${String(i + 1).padStart(2, '0')}</span><div><h3>${s.name}</h3><p>${s.body}</p>${s.items ? `<ul class="svc-items">${s.items.map((it) => `<li>${it}</li>`).join('')}</ul>` : ''}</div></li>`).join('')}</ol>
  </div>
</section>

<section class="map-sec" id="reach">
  <div class="split">
    <div class="from-left">
      <p class="kicker">Based in Southwest Florida</p>
      <h2 class="sw">${words('Naples to New York, and coast to coast.')}</h2>
      <p class="sec-sub">A few of the places my clients call home.</p>
      <a class="read-more" href="/${local.slug}/">Marketing for Naples businesses <i aria-hidden="true">→</i></a>
      <ul class="places">${places.map((p, i) => `<li class="rv" data-place="${i}"><b>${p.city}${p.hq ? ' <em>home base</em>' : ''}</b><span>${p.clients.join(', ')}</span></li>`).join('')}</ul>
    </div>
    <figure class="map from-right">
      <svg viewBox="0 0 ${mapSize.w} ${mapSize.h}" role="img" aria-label="Map of the United States with client locations in ${places.map((p) => p.city).join('; ')}">
        <path class="nation" d="${nationPath}"/>
        <path class="states" d="${statesPath}"/>
        ${places.filter((p) => !p.hq).map((p) => `<path class="route" d="M${places[0].xy[0]} ${places[0].xy[1]} Q ${(places[0].xy[0] + p.xy[0]) / 2 - 60} ${(places[0].xy[1] + p.xy[1]) / 2 - 60} ${p.xy[0]} ${p.xy[1]}"/>`).join('')}
        ${places.map((p, i) => `<g class="pin ${p.hq ? 'hq' : ''}" data-place="${i}" data-tip="${p.city}: ${p.clients.join(', ')}" transform="translate(${p.xy[0]} ${p.xy[1]})">
          <circle class="hit" r="22" fill="transparent"/>${p.hq ? '<circle class="pulse" r="10"/>' : ''}<circle class="dot" r="${p.hq ? 7 : 5.5}"/>
          <text x="12" y="-10">${p.city}</text></g>`).join('')}
      </svg>
    </figure>
  </div>
</section>

<section class="meet" aria-label="Meet Evan">
  <ul class="meet-notes">
    <li>Growing businesses<br />for 10+ years</li>
    <li>Currently running<br />${site.company}</li>
    <li>Open to growth<br />partnerships</li>
  </ul>
  <div class="meet-photo"><img src="/img/evan-hero.webp" alt="" loading="lazy" width="880" height="700" /></div>
  <h2 class="meet-title"><span class="ml"><span>Nice to</span></span><span class="ml"><span>meet you<i class="dot">.</i></span></span></h2>
</section>

<section class="about" id="about">
  <div class="split">
    <figure class="about-photo from-left"><img src="/img/evan-life.webp" alt="Evan Lee at home in Naples, Florida" loading="lazy" width="1156" height="1022" /></figure>
    <div class="from-right">
      <p class="kicker">About</p>
      <h2 class="sw">${words(about.title)}</h2>
      ${about.body.map((p) => `<p class="body">${p}</p>`).join('')}
      <ul class="creds">${about.creds.map((c) => `<li>${c}</li>`).join('')}</ul>
      <h3 class="ventures-h">Businesses I’ve built</h3>
      <ul class="ventures">${ventures.map((v) => `<li><a href="${v.url}" ${ext}><span class="v-name">${v.name}</span><span class="v-note">${v.note}</span><em class="v-tag ${v.status.toLowerCase()}">${v.status}</em></a></li>`).join('')}</ul>
      <p class="links"><a href="${site.linkedin}" ${ext}>LinkedIn</a><a href="${site.instagram}" ${ext}>Instagram</a><a href="${site.facebook}" ${ext}>Facebook</a><a href="mailto:${site.email}">${site.email}</a></p>
    </div>
  </div>
</section>

<section class="faq" id="faq">
  <div class="split top">
    <div class="sticky">
      <p class="kicker rv">Questions</p>
      <h2 class="sw">${words('Straight answers.')}</h2>
    </div>
    <div class="faq-list">${faq.map((f, i) => `
      <details class="rv"${i === 0 ? ' open' : ''}><summary><h3>${f.q}</h3><i aria-hidden="true"></i></summary><p>${f.a}</p></details>`).join('')}
    </div>
  </div>
</section>

<section class="cta" id="contact">
  <p class="kicker rv">Next step</p>
  <h2>${cta.title.map((t, i, all) => i === all.length - 1 ? `<span class="line"><span>${t.replace(/\.$/, '')}</span><span class="dot">.</span></span>` : `<span class="line"><span>${t}</span></span>`).join(' ')}</h2>
  <p class="lead rv">${cta.body}</p>
  <div class="btns rv">
    <a class="btn primary" href="${site.bookLink}" ${ext}>Book a strategy call<i aria-hidden="true">→</i></a>
    <a class="btn ghost" href="tel:${site.tel}">Call ${site.phone}</a>
  </div>
  <p class="dm rv">${cta.dm}</p>
</section>`
}

// One standalone page per featured case study, with visible breadcrumbs.
export function renderCase(c) {
  const i = cases.indexOf(c)
  const next = cases[(i + 1) % cases.length]
  return `
<section class="case-page">
  <nav class="crumbs" aria-label="Breadcrumb"><ol>
    <li><a href="/">Home</a></li>
    <li><a href="/#work">Work</a></li>
    <li aria-current="page">${c.client}</li>
  </ol></nav>
  <header class="cp-head">
    <p class="kicker">${c.industry} · ${c.channels}</p>
    <h1>${c.headline}</h1>
    <p class="lead">${c.summary}</p>
  </header>
  <dl class="metrics big">${c.metrics.map((m) => `<div><dt>${m.label}</dt><dd>${m.value}</dd></div>`).join('')}</dl>
  <div class="cp-charts${c.extra ? ' two' : ''}">${renderChart(c.chart)}${c.extra ? renderChart(c.extra) : ''}</div>
  <div class="cp-next">
    <a class="btn primary" href="${site.bookLink}" ${ext}>Get a plan like this for your business<i aria-hidden="true">→</i></a>
    <a class="next-case" href="/work/${next.slug}/"><small>Next case study</small>${next.client}: ${next.headline}</a>
  </div>
</section>`
}

// The Naples, FL page: local intro, the season, who it's for, local proof, map, local FAQ.
export function renderLocal() {
  const nuc = cases.find((c) => c.slug === 'naples-urgent-care')
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&z=13&output=embed`
  return `
<section class="case-page local-page">
  <nav class="crumbs" aria-label="Breadcrumb"><ol>
    <li><a href="/">Home</a></li>
    <li aria-current="page">Naples, FL</li>
  </ol></nav>
  <header class="cp-head">
    <p class="kicker">${local.kicker}</p>
    <h1>${local.h1}</h1>
    <p class="lead">${local.intro}</p>
    <div class="btns">
      <a class="btn primary" href="${site.bookLink}" ${ext}>Book a strategy call<i aria-hidden="true">→</i></a>
      <a class="btn ghost" href="tel:${site.tel}">Call ${site.phone}</a>
    </div>
  </header>

  <div class="local-grid">
    <div>
      <h2>${local.season.title}</h2>
      <p class="body">${local.season.body}</p>
      <h3 class="local-h3">${local.whoTitle}</h3>
      <ul class="local-list">${local.who.map((w) => `<li>${w}</li>`).join('')}</ul>
      <h3 class="local-h3">Areas I serve in person</h3>
      <ul class="creds">${site.serviceArea.map((a) => `<li>${a}</li>`).join('')}</ul>
    </div>
    ${nuc ? `<a class="local-proof" href="/work/${nuc.slug}/">
      <span class="kicker">Local result</span>
      <strong>#12 → #1</strong>
      <span>${nuc.client} on Google for “Naples urgent care.”</span>
      <em>Read the case study →</em>
    </a>` : ''}
  </div>

  <figure class="local-map">
    <iframe title="Map of ${site.company} in North Naples, Florida" src="${mapSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    <figcaption><span>${site.company} · ${site.address}</span><a href="${site.mapsLink}" ${ext}>Get directions →</a></figcaption>
  </figure>

  <div class="local-services">
    <h2>What I do for Naples businesses</h2>
    <ol class="svc">${services.map((sv, i) => `<li class="lit"><span class="n">${String(i + 1).padStart(2, '0')}</span><div><h3>${sv.name}</h3><p>${sv.body}</p></div></li>`).join('')}</ol>
  </div>

  <div class="local-faq faq">
    <h2>Questions from Naples owners</h2>
    <div class="faq-list">${local.faq.map((f, i) => `
      <details${i === 0 ? ' open' : ''}><summary><h3>${f.q}</h3><i aria-hidden="true"></i></summary><p>${f.a}</p></details>`).join('')}
    </div>
  </div>

  <div class="cp-next">
    <a class="btn primary" href="${site.bookLink}" ${ext}>Let’s look at your numbers<i aria-hidden="true">→</i></a>
    <a class="next-case" href="/#work"><small>See more results</small>Case studies from clients across the U.S.</a>
  </div>
</section>`
}
