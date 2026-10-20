import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Pre-renders every page to static HTML at build time so crawlers and AI assistants
// see full content, then adds case study pages, schema, sitemap, robots.txt and llms.txt.
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;600;700;800&family=Public+Sans:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`

function headTags({ title, description, path, image = '/og.jpg', type = 'website', schema, site }) {
  const url = site.url + path
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta name="author" content="${esc(site.fullName)}" />`,
    `<meta name="geo.region" content="US-FL" />`,
    `<meta name="geo.placename" content="Naples" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:site_name" content="${esc(site.fullName)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${site.url}${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${site.url}${image}" />`,
    `<link rel="alternate" type="text/plain" href="/llms.txt" title="Summary for AI assistants" />`,
    ld(schema),
  ].join('\n    ')
}

const fileUrl = (id) => pathToFileURL(resolve(process.cwd(), '.' + id)).href + '?t=' + Date.now()
const load = async (server, id) => (server ? server.ssrLoadModule(id) : import(fileUrl(id)))

function prerender() {
  let server
  return {
    name: 'prerender',
    configureServer(s) { server = s },
    async transformIndexHtml(html) {
      const { renderHome, navHtml, footerHtml } = await load(server, '/src/render.js')
      const { homeSchema } = await load(server, '/src/seo.js')
      const { site } = await load(server, '/src/content.js')
      return html
        .replace('<!--seo-head-->', headTags({
          title: 'Evan Lee · Marketing Growth Partner & Fractional CMO in Naples, FL',
          description: 'Evan Lee is a marketing growth partner and fractional CMO in Naples, Florida. Google Ads, Facebook Ads, SEO, GEO and websites, tracked to revenue for B2B and B2C owners across the U.S.',
          path: '/', type: 'profile', schema: homeSchema(), site,
        }))
        .replace('<!--nav-->', navHtml())
        .replace('<!--app-->', renderHome())
        .replace('<!--foot-->', footerHtml())
    },
    async generateBundle(_, bundle) {
      const { renderCase, navHtml, footerHtml } = await import(fileUrl('/src/render.js'))
      const seo = await import(fileUrl('/src/seo.js'))
      const { site, liveCases: cases } = await import(fileUrl('/src/content.js'))
      const css = Object.values(bundle).filter((f) => f.fileName.endsWith('.css')).map((f) => `<link rel="stylesheet" href="/${f.fileName}" />`).join('')
      for (const c of cases) {
        const html = `<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${headTags({ title: `${c.client} case study: ${c.headline} · Evan Lee`, description: c.summary, path: `/work/${c.slug}/`, type: 'article', schema: seo.caseSchema(c), site })}
    <meta name="theme-color" content="#0f0d0b" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    ${FONTS}
    ${css}
  </head>
  <body class="sub mbar-on">
    ${navHtml('/').replace('class="nav"', 'class="nav solid"')}
    <main id="app">${renderCase(c)}</main>
    ${footerHtml()}
    <script>
      // phone menu on case study pages (the home page gets this from main.js)
      const b = document.body, btn = document.querySelector('.menu-btn'), m = document.getElementById('menu')
      const set = (o) => { b.classList.toggle('menu-open', o); btn.setAttribute('aria-expanded', o); m.setAttribute('aria-hidden', !o) }
      btn.addEventListener('click', () => set(!b.classList.contains('menu-open')))
      m.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)))
    </script>
  </body>
</html>
`
        this.emitFile({ type: 'asset', fileName: `work/${c.slug}/index.html`, source: html })
      }
      const today = new Date().toISOString().slice(0, 10)
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: seo.sitemap(['/', ...cases.map((c) => `/work/${c.slug}/`)], today) })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: seo.robots() })
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: seo.llmsTxt() })
    },
  }
}

export default defineConfig({ plugins: [prerender()] })
