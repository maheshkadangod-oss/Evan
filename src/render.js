// Builds the page HTML as plain strings. Runs at build time (see vite.config.js), so search
// engines and AI crawlers get the full content without running any JavaScript.
import { renderChart, funnelSvg } from './charts.js'
import { mapSize, nationPath, statesPath, places } from './us-map.js'
import { site, hero, industries, cases, moreWork, services, method, about, cta, faq } from './content.js'

const ext = 'target="_blank" rel="noopener"'
const year = new Date().getFullYear()

export function navHtml(prefix = '') {
  return `<header class="nav">
      <a href="${prefix || '#top'}" class="logo"><span>${site.name}</span><small>Growth partner</small></a>
      <nav aria-label="Main">
        <a href="${prefix}#work">Work</a>
        <a href="${prefix}#method">Method</a>
        <a href="${prefix}#services">Services</a>
        <a href="${prefix}#faq">FAQ</a>
        <a href="${site.bookLink}" ${ext} class="nav-cta">Book a call</a>
      </nav>
    </header>`
}

export function footerHtml() {
  return `<footer class="foot">
  <div><strong>${site.fullName}</strong><span>${site.role}</span></div>
  <address><span>${site.company}</span><span>${site.address}</span></address>
  <div><a href="tel:${site.tel}">${site.phone}</a><span>© ${year} ${site.fullName}</span></div>
</footer>`
}

function caseBlock(c, i) {
  return `
  <article class="case ${i % 2 ? 'flip' : ''}" id="case-${c.slug}">
    <div class="case-copy from-${i % 2 ? 'right' : 'left'}">
      <p class="case-meta"><span>${String(i + 1).padStart(2, '0')}</span>${c.client} · ${c.industry}</p>
      <h3>${c.headline}</h3>
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
<section class="hero" id="top">
  <div class="hero-grid">
    <div class="hero-copy">
      <p class="eyebrow rv">${hero.eyebrow}</p>
      <h1>${hero.lines.map((l) => `<span class="line"><span>${l}</span></span>`).join(' ')}</h1>
      <p class="lead rv">${hero.sub}</p>
      <div class="btns rv">
        <a class="btn primary" href="${site.bookLink}" ${ext}>${hero.primary}<i aria-hidden="true">→</i></a>
        <a class="btn ghost" href="#work">${hero.secondary}</a>
      </div>
    </div>
    <figure class="portrait rv">
      <div class="portrait-frame"><img src="/img/evan-portrait.webp" alt="Portrait of Evan Lee, marketing growth partner in Naples, Florida" width="880" height="1100" fetchpriority="high" /></div>
      <figcaption><span>${site.name}</span><span>${site.city}</span></figcaption>
      <div class="float-card" aria-hidden="true">
        <span class="fc-k">Peddinghaus · Google Ads</span>
        <div class="fc-row"><span>Before</span><b class="fc-bar base" style="--v:.39"></b><em>2 to 3x</em></div>
        <div class="fc-row"><span>Now</span><b class="fc-bar hi" style="--v:1"></b><em>6.34x</em></div>
      </div>
    </figure>
  </div>
  <ul class="proof">
    ${hero.proof.map((p) => `<li class="rv"><strong>${p.value}</strong><span>${p.label}</span></li>`).join('')}
  </ul>
</section>

<section class="industries" aria-label="Industries served">
  <p class="kicker">Industries I’ve grown</p>
  <div class="ind-track">${[...industries, ...industries].map((x, i) => `<span${i >= industries.length ? ' aria-hidden="true"' : ''}>${x}</span>`).join('')}</div>
</section>

<section class="work" id="work">
  <header class="sec-head">
    <p class="kicker rv">Selected work</p>
    <h2 class="rv">Results, in the client’s own numbers.</h2>
    <p class="sec-sub rv">Every figure below comes from the ad, analytics and search accounts we ran.</p>
  </header>
  ${cases.map(caseBlock).join('')}
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
      <h2>${method.title}</h2>
      <ol class="steps">${method.steps.map((s) => `<li class="rv"><span class="n">${s.n}</span><div><h3>${s.name}</h3><p>${s.body}</p></div></li>`).join('')}</ol>
    </div>
    <div class="from-right">${funnelSvg()}</div>
  </div>
</section>

<section class="services" id="services">
  <div class="split top">
    <div class="sticky">
      <p class="kicker rv">Services</p>
      <h2 class="rv">One team for the whole path to revenue.</h2>
      <p class="sec-sub rv">Delivered through <a class="inline" href="${site.agency}" ${ext}>JetSpeedSocial</a>, my agency in Naples.</p>
    </div>
    <ol class="svc">${services.map((s, i) => `<li class="rv"><span class="n">${String(i + 1).padStart(2, '0')}</span><div><h3>${s.name}</h3><p>${s.body}</p></div></li>`).join('')}</ol>
  </div>
</section>

<section class="map-sec" id="reach">
  <div class="split">
    <div class="from-left">
      <p class="kicker">Based in Southwest Florida</p>
      <h2>Naples to New York, and coast to coast.</h2>
      <p class="sec-sub">A sample of where clients in the case study deck are based.</p>
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

<section class="about" id="about">
  <div class="split">
    <figure class="about-photo from-left"><img src="/img/evan-life.webp" alt="Evan Lee at home in Naples, Florida" loading="lazy" width="1156" height="1022" /></figure>
    <div class="from-right">
      <p class="kicker">About</p>
      <h2>${about.title}</h2>
      ${about.body.map((p) => `<p class="body">${p}</p>`).join('')}
      <ul class="creds">${about.creds.map((c) => `<li>${c}</li>`).join('')}</ul>
      <p class="links"><a href="${site.linkedin}" ${ext}>LinkedIn</a><a href="${site.instagram}" ${ext}>Instagram</a><a href="${site.agency}" ${ext}>JetSpeedSocial</a></p>
    </div>
  </div>
</section>

<section class="faq" id="faq">
  <div class="split top">
    <div class="sticky">
      <p class="kicker rv">Questions</p>
      <h2 class="rv">Straight answers.</h2>
    </div>
    <div class="faq-list">${faq.map((f, i) => `
      <details class="rv"${i === 0 ? ' open' : ''}><summary><h3>${f.q}</h3><i aria-hidden="true"></i></summary><p>${f.a}</p></details>`).join('')}
    </div>
  </div>
</section>

<section class="cta" id="contact">
  <p class="kicker rv">Next step</p>
  <h2>${cta.title.map((t) => `<span class="line"><span>${t}</span></span>`).join(' ')}</h2>
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
  <div class="cp-chart">${renderChart(c.chart)}</div>
  <div class="cp-next">
    <a class="btn primary" href="${site.bookLink}" ${ext}>Get a plan like this for your business<i aria-hidden="true">→</i></a>
    <a class="next-case" href="/work/${next.slug}/"><small>Next case study</small>${next.client}: ${next.headline}</a>
  </div>
</section>`
}
