// Builds the page HTML as plain strings. Runs at build time (see vite.config.js), so search
// engines and AI crawlers get the full content without running any JavaScript.
import { renderChart, funnelSvg } from './charts.js'
import { mapSize, nationPath, statesPath, places } from './us-map.js'
import { site, hero, industries, cases, moreWork, services, method, about, cta, faq, numbers, liveCases, liveMoreWork, liveProof, showNumbers } from './content.js'

const ext = 'target="_blank" rel="noopener"'
const year = new Date().getFullYear()

export const sections = [
  ...(showNumbers ? [['numbers', 'Numbers']] : []),
  ['work', liveCases.length ? 'Work' : 'Results'],
  ['method', 'Method'],
  ['services', 'Services'],
  ['reach', liveCases.length ? 'Clients' : 'Where'],
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
      <h3 class="sw">${words(c.headline)}</h3>
      <p class="case-sum">${c.summary}</p>
      <dl class="metrics">${c.metrics.map((m) => `<div><dt>${m.label}</dt><dd>${m.value}</dd></div>`).join('')}</dl>
      <p class="channels">${c.channels}</p>
      <a class="read-more" href="/work/${c.slug}/">Read the ${c.client} case study <i aria-hidden="true">→</i></a>
    </div>
    <div class="case-viz from-${i % 2 ? 'left' : 'right'}">${renderChart(c.chart)}</div>
  </article>`
}

// Client cities come from the deck too, so they only show once results are verified.
const mapPlaces = liveCases.length ? places : places.filter((p) => p.hq)

export function renderHome() {
  return `
<section class="hero" id="top">
  <div class="hero-grid">
    <div class="hero-copy">
      <p class="eyebrow rv">${hero.eyebrow}</p>
      <h1>${hero.lines.map((l, i, all) => i === all.length - 1 ? `<span class="line"><span>${l.replace(/\.$/, '')}</span><span class="dot">.</span></span>` : `<span class="line"><span>${l}</span></span>`).join(' ')}</h1>
      <p class="lead rv">${hero.sub}</p>
      <div class="btns rv">
        <a class="btn primary" href="${site.bookLink}" ${ext}>${hero.primary}<i aria-hidden="true">→</i></a>
        <a class="btn ghost" href="#method">${hero.secondary}</a>
      </div>
    </div>
    <figure class="portrait rv">
      <div class="portrait-frame"><img src="/img/evan-portrait.webp" alt="Portrait of Evan Lee, marketing growth partner in Naples, Florida" width="880" height="1100" fetchpriority="high" /></div>
      <figcaption><span>${site.name}</span><span>${site.city}</span></figcaption>
      ${liveCases.some((c) => c.slug === 'peddinghaus') ? `<div class="float-card" aria-hidden="true">
        <span class="fc-k">Peddinghaus · Google Ads</span>
        <div class="fc-row"><span>Before</span><b class="fc-bar base" style="--v:.39"></b><em>2 to 3x</em></div>
        <div class="fc-row"><span>Now</span><b class="fc-bar hi" style="--v:1"></b><em>6.34x</em></div>
      </div>` : ''}
    </figure>
  </div>
  <ul class="proof" data-carousel>
    ${(liveProof.length ? liveProof : hero.principles).map((p) => `<li class="rv"><strong>${p.value}</strong><span>${p.label}</span></li>`).join('')}
  </ul>
</section>

<section class="industries" aria-label="Industries served">
  <p class="kicker">Built for owners in</p>
  <div class="ind-track">${[...industries, ...industries].map((x, i) => `<span${i >= industries.length ? ' aria-hidden="true"' : ''}>${x}</span>`).join('')}</div>
</section>

${showNumbers ? `<section class="numbers" id="numbers">
  <header class="sec-head">
    <p class="kicker">By the numbers</p>
    <h2 class="sw">${words('The work, counted.')}</h2>
    <p class="sec-sub rv">Pulled from the case study deck. Hover or tap a bar for its value.</p>
  </header>
  <ul class="stat-row" data-carousel>${numbers.stats.map((st) => `<li class="rv"><strong>${st.value}</strong><span>${st.label}</span></li>`).join('')}</ul>
  <div class="dash">${numbers.charts.map((ch) => renderChart(ch)).join('')}</div>
</section>` : ''}

<section class="work" id="work">
  ${liveCases.length ? `<header class="sec-head">
    <p class="kicker rv">Selected work</p>
    <h2 class="sw">${words('Results, in the client’s own numbers.')}</h2>
    <p class="sec-sub rv">Every figure below comes from the ad, analytics and search accounts we ran.</p>
  </header>
  <div class="cases" data-carousel>${liveCases.map(caseBlock).join('')}</div>
  <div class="dots" aria-hidden="true">${liveCases.map((c, i) => `<button type="button" data-dot="${i}" tabindex="-1"></button>`).join('')}<span>Swipe</span></div>` : `<div class="pending">
    <div>
      <p class="kicker">Results</p>
      <h2 class="sw">${words('Real numbers, signed off first.')}</h2>
    </div>
    <div>
      <p class="lead">I only publish client results once the client has approved them. Case studies are on their way.</p>
      <p class="sec-sub">Want to see real campaigns now? On a strategy call I’ll walk you through live accounts and dashboards, with client details kept private.</p>
      <div class="btns"><a class="btn primary" href="${site.bookLink}" ${ext}>See real campaigns on a call<i aria-hidden="true">→</i></a></div>
    </div>
  </div>`}
  ${liveMoreWork.length ? `<div class="more">
    <h3 class="rv">More results</h3>
    <table class="more-table">
      <thead><tr><th>Client</th><th>Industry</th><th>Channels</th><th>Outcome</th></tr></thead>
      <tbody>${liveMoreWork.map((m) => `<tr class="rv"><td>${m.client}</td><td>${m.industry}</td><td>${m.channels}</td><td>${m.outcome || '<span class="muted">Case study on request</span>'}</td></tr>`).join('')}</tbody>
    </table>
  </div>` : ''}
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
    <ol class="svc">${services.map((s, i) => `<li class="rv"><span class="n">${String(i + 1).padStart(2, '0')}</span><div><h3>${s.name}</h3><p>${s.body}</p></div></li>`).join('')}</ol>
  </div>
</section>

<section class="map-sec" id="reach">
  <div class="split">
    <div class="from-left">
      <p class="kicker">Based in Southwest Florida</p>
      <h2 class="sw">${words(liveCases.length ? 'Naples to New York, and coast to coast.' : 'Naples roots. Clients anywhere in the U.S.')}</h2>
      <p class="sec-sub">${liveCases.length ? 'A sample of where clients are based.' : 'Work runs on video calls and shared dashboards, so distance doesn’t matter.'}</p>
      <ul class="places">${liveCases.length
        ? mapPlaces.map((p, i) => `<li class="rv" data-place="${i}"><b>${p.city}${p.hq ? ' <em>home base</em>' : ''}</b><span>${p.clients.join(', ')}</span></li>`).join('')
        : [['Home base', site.address], ['Who I work with', 'B2B and B2C owners across the United States'], ['How we meet', 'Video calls, shared dashboards, and coffee if you’re in Naples']].map(([k, v], i) => `<li class="rv"${i === 0 ? ' data-place="0"' : ''}><b>${k}</b><span>${v}</span></li>`).join('')}</ul>
    </div>
    <figure class="map from-right">
      <svg viewBox="0 0 ${mapSize.w} ${mapSize.h}" role="img" aria-label="Map of the United States marking ${mapPlaces.map((p) => p.city).join('; ')}">
        <path class="nation" d="${nationPath}"/>
        <path class="states" d="${statesPath}"/>
        ${mapPlaces.filter((p) => !p.hq).map((p) => `<path class="route" d="M${places[0].xy[0]} ${places[0].xy[1]} Q ${(places[0].xy[0] + p.xy[0]) / 2 - 60} ${(places[0].xy[1] + p.xy[1]) / 2 - 60} ${p.xy[0]} ${p.xy[1]}"/>`).join('')}
        ${mapPlaces.map((p, i) => `<g class="pin ${p.hq ? 'hq' : ''}" data-place="${i}" data-tip="${p.hq && !liveCases.length ? `${p.city}: home base` : `${p.city}: ${p.clients.join(', ')}`}" transform="translate(${p.xy[0]} ${p.xy[1]})">
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
      <h2 class="sw">${words(about.title)}</h2>
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
  const i = liveCases.indexOf(c)
  const next = liveCases[(i + 1) % liveCases.length]
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
    ${next && next !== c ? `<a class="next-case" href="/work/${next.slug}/"><small>Next case study</small>${next.client}: ${next.headline}</a>` : ''}
  </div>
</section>`
}
