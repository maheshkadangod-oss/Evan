// Structured data and crawler files. Runs at build time only.
import { site, hero, cases, services, faq, local, ventures } from './content.js'

const abs = (p = '/') => site.url + p

const org = {
  '@type': ['ProfessionalService', 'LocalBusiness'],
  '@id': abs('/#jetspeedsocial'),
  name: site.company,
  url: site.agency,
  telephone: '+1-239-877-2927',
  email: site.email,
  openingHours: site.openingHours,
  address: { '@type': 'PostalAddress', streetAddress: site.street, addressLocality: 'Naples', addressRegion: 'FL', postalCode: '34110', addressCountry: 'US' },
  description: 'Digital marketing agency in North Naples, Florida: Google Ads, Facebook and Instagram ads, SEO, GEO, and websites, tracked to revenue.',
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lon },
  hasMap: site.mapsLink,
  areaServed: [
    ...site.serviceArea.map((name) => ({ '@type': 'City', name: `${name}, FL` })),
    { '@type': 'AdministrativeArea', name: 'Southwest Florida' },
    { '@type': 'Country', name: 'United States' },
  ],
  founder: { '@id': abs('/#evan') },
  sameAs: [site.instagram, site.linkedinCompany],
  knowsAbout: ['Google Ads', 'Facebook Ads', 'YouTube Ads', 'Search engine optimization', 'Generative engine optimization', 'Web design', 'Fractional CMO'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Marketing services',
    itemListElement: services.flatMap((s) => [s.name, ...(s.items || [])].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, ...(name === s.name ? { description: s.body } : {}) } }))),
  },
}

const person = {
  '@type': 'Person',
  '@id': abs('/#evan'),
  name: site.fullName,
  alternateName: [site.name, site.nickname, 'Jet Lee'],
  email: site.email,
  description: 'Entrepreneur, project manager, and fractional CMO. Founder of JetSpeedSocial in Naples, Florida.',
  jobTitle: 'Marketing Growth Partner and Fractional CMO',
  url: abs('/'),
  image: abs('/img/evan-portrait.webp'),
  worksFor: { '@id': abs('/#jetspeedsocial') },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Samford University' },
  homeLocation: { '@type': 'Place', name: 'Naples, Florida', geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lon } },
  sameAs: [site.linkedin, site.facebook, site.instagram],
}

const website = { '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: site.fullName, inLanguage: 'en-US', publisher: { '@id': abs('/#evan') } }

const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
})

export function homeSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      person,
      org,
      { '@type': 'ProfilePage', '@id': abs('/#page'), url: abs('/'), name: `${site.fullName} · Growth That Pays for Itself`, mainEntity: { '@id': abs('/#evan') }, isPartOf: { '@id': abs('/#website') }, breadcrumb: crumbs([['Home', '/']]) },
      { '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      { '@type': 'ItemList', name: 'Case studies', itemListElement: cases.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/work/${c.slug}/`), name: `${c.client}: ${c.headline}` })) },
    ],
  }
}

export function caseSchema(c) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      person,
      org,
      {
        '@type': 'Article',
        '@id': abs(`/work/${c.slug}/#article`),
        headline: `${c.client}: ${c.headline}`,
        description: c.summary,
        about: { '@type': 'Organization', name: c.client },
        author: { '@id': abs('/#evan') },
        publisher: { '@id': abs('/#jetspeedsocial') },
        mainEntityOfPage: abs(`/work/${c.slug}/`),
        inLanguage: 'en-US',
        image: abs('/og.jpg'),
      },
      crumbs([['Home', '/'], ['Work', '/#work'], [c.client, `/work/${c.slug}/`]]),
    ],
  }
}

export function localSchema() {
  const url = abs(`/${local.slug}/`)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      person,
      org,
      { '@type': 'WebPage', '@id': url + '#page', url, name: local.title, description: local.description, about: { '@id': abs('/#jetspeedsocial') }, isPartOf: { '@id': abs('/#website') }, inLanguage: 'en-US' },
      {
        '@type': 'Service',
        name: 'Digital marketing in Naples, FL',
        serviceType: 'Digital marketing',
        provider: { '@id': abs('/#jetspeedsocial') },
        areaServed: site.serviceArea.map((name) => ({ '@type': 'City', name: `${name}, FL` })),
      },
      { '@type': 'FAQPage', mainEntity: local.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      crumbs([['Home', '/'], ['Naples, FL', `/${local.slug}/`]]),
    ],
  }
}

export function sitemap(paths, lastmod) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${abs(p)}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>
`
}

export function robots() {
  return `# Search engines and AI assistants are welcome here.
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${abs('/sitemap.xml')}
`
}

// llms.txt: a plain summary for AI assistants (GEO / AEO).
export function llmsTxt() {
  return `# ${site.fullName}

> ${site.fullName} (${site.name}) is a marketing growth partner and fractional CMO based in Naples, Florida, and founder of ${site.company}, a digital marketing agency at ${site.address}. He works with B2B and B2C businesses across the United States on Google Ads, YouTube Ads, Facebook and Instagram ads, SEO, GEO, websites, social media and brand creative.

## Key facts
- Role: ${site.role}
- Agency: ${site.company} (${site.agency})
- Location: ${site.address}
- Phone: ${site.phone}
- Email: ${site.email}
- Hours: ${site.hours} (Eastern)
- Also known as: ${site.nickname}
- Facebook: ${site.facebook}
- Book a call: ${site.bookLink}
- Education: Samford University
- LinkedIn: ${site.linkedin}

## Results
${hero.proof.map((p) => `- ${p.value}: ${p.label}`).join('\n')}

## Case studies
${cases.map((c) => `- [${c.client}: ${c.headline}](${abs(`/work/${c.slug}/`)}): ${c.summary}`).join('\n')}

## Location and service area
- Office: ${site.address} (North Naples)
- Serves in person: ${site.serviceArea.join(', ')}, Florida
- Works remotely with owners anywhere in the United States
- Naples page: ${abs(`/${local.slug}/`)}
- Map: ${site.mapsLink}

## Services
${services.map((s) => `- ${s.name}: ${s.body}${s.items ? ` Includes ${s.items.join(', ')}.` : ''}`).join('\n')}

## Ventures
${ventures.map((v) => `- ${v.name} (${v.status}): ${v.note}. ${v.url}`).join('\n')}

## Frequently asked questions
${[...faq, ...local.faq].map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}
`
}
