// All site copy lives here. Numbers come from the "Case Studies SEO & PPC | 2026 JSS" deck
// and jetspeedsocial.com. Lines marked CONFIRM need Evan's sign-off before launch.

export const site = {
  name: 'Evan Lee',
  fullName: 'Evan David Lee',
  role: 'Marketing growth partner and fractional CMO',
  company: 'JetSpeedSocial',
  since: 2014, // CONFIRM: from the "2014-Present" footer on jetspeedsocial.com
  city: 'Naples, Florida',
  address: '5660 Strand Ct, Naples, FL 34110',
  phone: '(239) 877-2927',
  tel: '+12398772927',
  bookLink: 'https://jetspeedsocial.com/contact/',
  linkedin: 'https://www.linkedin.com/in/evanjetlee',
  instagram: 'https://www.instagram.com/jetspeedsocial/',
  agency: 'https://jetspeedsocial.com/',
  dmKeyword: 'MDA',
  url: 'https://evanjetlee.com',
  geo: { lat: 26.2716, lon: -81.7787 }, // approx. for 5660 Strand Ct, Naples, FL 34110
}

export const hero = {
  eyebrow: 'Growth partner · Fractional CMO · Naples, Florida',
  lines: ['Growth that', 'pays for itself.'],
  sub: 'I build the ads, search and sales systems that turn marketing spend into revenue you can plan around. B2B and B2C, from six figures to eight.',
  primary: 'Book a strategy call',
  secondary: 'See the results',
  proof: [
    { value: '6.34x', label: 'Return on Google Ads for a B2B steel manufacturer, up from 2 to 3x' },
    { value: '200+', label: 'Booked demo calls for a real estate software company' },
    { value: '#1', label: 'On Google for “Naples urgent care”, up from #12' },
  ],
}

export const industries = ['Manufacturing', 'Healthcare', 'Law firms', 'E-commerce', 'Software', 'Home services', 'Fitness studios', 'Travel and hospitality', 'LASIK and medical', 'Investment firms', 'Contractors']

// Featured case studies. `chart` decides which graphic is drawn next to the story.
export const cases = [
  {
    client: 'Peddinghaus',
    slug: 'peddinghaus',
    industry: 'B2B steel fabrication machinery',
    channels: 'Google Ads · YouTube Ads',
    headline: 'From 2 to 3x return to 6.34x in a year.',
    summary: 'Peddinghaus sells high-ticket machinery to other businesses, so every lead matters. I rebuilt the account around one main conversion goal so we could see what was really paying back. A year later, the account had driven about $1M in conversion value on $400k of spend.',
    metrics: [
      { value: '6.34x', label: 'Return on ad spend' },
      { value: '$1M', label: 'Conversion value' },
      { value: '$400k', label: 'Ad spend' },
    ],
    chart: {
      type: 'bars',
      title: 'Return on ad spend, Google Ads',
      note: 'Before is the 2 to 3x range the account ran at. Dashed line is break-even.',
      unit: 'x',
      max: 7,
      breakEven: 1,
      bars: [
        { label: 'Before', value: 2.5, display: '2 to 3x' },
        { label: 'After one year', value: 6.34, display: '6.34x', highlight: true },
      ],
    },
  },
  {
    client: 'Hauslane',
    slug: 'hauslane',
    industry: 'E-commerce, kitchen appliances',
    channels: 'Google Ads · Facebook Ads',
    headline: '11 to 12 dollars back for every dollar spent.',
    summary: 'Hauslane sells kitchen appliances online. We ran Google and Facebook ads side by side and kept the budget on what sold. The account returns 11 to 12x a month, and the strongest campaigns run at 19x and 28x.',
    metrics: [
      { value: '11 to 12x', label: 'Monthly return on ad spend' },
      { value: '28x', label: 'Best campaign' },
    ],
    chart: {
      type: 'bars',
      title: 'Return on ad spend by level',
      note: 'Monthly figure is the account average. Dashed line is break-even.',
      unit: 'x',
      max: 30,
      breakEven: 1,
      bars: [
        { label: 'Whole account, monthly', value: 11.5, display: '11 to 12x', highlight: true },
        { label: 'Strong campaign', value: 19, display: '19x', highlight: true },
        { label: 'Best campaign', value: 28, display: '28x', highlight: true },
      ],
    },
  },
  {
    client: 'iList Tech',
    slug: 'ilist-tech',
    industry: 'Software for real estate agents',
    channels: 'Facebook Ads',
    headline: '1,500+ leads and 200+ booked demos.',
    summary: 'A software company selling to real estate agents needed sales conversations, not likes. We built Facebook campaigns that sent agents straight to a book-a-demo page, and the calendar filled.',
    metrics: [
      { value: '1,500+', label: 'Leads' },
      { value: '200+', label: 'Booked meetings' },
    ],
    chart: {
      type: 'tiles',
      title: 'Campaign output',
      tiles: [
        { value: 1500, suffix: '+', label: 'Leads to the demo page' },
        { value: 200, suffix: '+', label: 'Meetings booked on the calendar' },
      ],
    },
  },
  {
    client: 'Naples Urgent Care',
    slug: 'naples-urgent-care',
    industry: 'Local healthcare',
    channels: 'SEO',
    headline: 'From #12 to #1 on Google.',
    summary: 'When someone nearby needs care today, the first result gets the visit. We worked the clinic’s search presence until it moved from twelfth place to the top spot for “Naples urgent care”.',
    metrics: [
      { value: '#1', label: 'Google ranking now' },
      { value: '#12', label: 'Where it started' },
    ],
    chart: {
      type: 'rank',
      title: 'Google position for “Naples urgent care”',
      note: 'Lower is better. Position 1 is the top result.',
      from: { label: 'Start', value: 12 },
      to: { label: 'Now', value: 1 },
      worst: 12,
    },
  },
]

// Shorter wins from the same deck. Outcome left blank where the deck shows a screenshot, not a number.
export const moreWork = [
  { client: 'DFY Ecommerce', industry: 'E-commerce services', channels: 'Facebook Ads', outcome: '100+ booked appointments' },
  { client: 'Blume Digital', industry: 'Law firm marketing agency', channels: 'Facebook Ads', outcome: '30+ meetings with law firms' },
  { client: 'Dello Russo Laser Vision', industry: 'LASIK, 7 locations in NY and NJ', channels: 'SEO · Facebook Ads', outcome: 'Location pages ranking on page one' },
  { client: 'TN Pool Builders', industry: 'Inground pools, $50k+ per sale', channels: 'Facebook Ads', outcome: '' },
  { client: 'Alpha Medicine & Rehab', industry: 'Injury clinic', channels: 'SEO · Google Ads', outcome: '' },
  { client: 'Lush Corals', industry: 'E-commerce', channels: 'Facebook · Google · SEO · Web design', outcome: '' },
]

export const services = [
  { name: 'Paid search and social', body: 'Google, YouTube, Facebook and Instagram ads, tracked all the way to revenue so you know what each dollar returned.' },
  { name: 'SEO and GEO', body: 'Rank on Google for the searches that bring buyers, and show up when people ask AI tools for a recommendation.' },
  { name: 'Websites that convert', body: 'Design and development built around one action: the call, the booking, the sale.' },
  { name: 'Social media', body: 'Content that keeps you in front of the people who already know you, so they buy when they are ready.' },
  { name: 'Brand and creative', body: 'Identity, ad creative and landing pages that look like the business you are becoming.' },
]

export const method = {
  title: 'How I scale a business',
  steps: [
    { n: '01', name: 'Find the leak', body: 'Before more money goes into ads, I look at the whole path: the ad, the page, the follow-up, the close. Most businesses lose more after the click than before it.' },
    { n: '02', name: 'Fix the constraint', body: 'One fix at a time, measured. The thing that holds revenue back the most goes first.' },
    { n: '03', name: 'Add fuel', body: 'Budget goes up only when the numbers show a dollar in brings more than a dollar back. That is what scaling efficiently means.' },
  ],
}

export const about = {
  title: 'I’m Evan.',
  body: [
    'I founded JetSpeedSocial in Naples, Florida, and have spent the years since inside ad accounts, search rankings and sales pipelines. My clients range from a local urgent care clinic to a national steel machinery manufacturer.',
    'I studied at Samford University. Today I work as a growth partner and fractional CMO for owners who want marketing that answers to revenue, not vanity numbers.',
  ],
  // CONFIRM all three with Evan before launch
  creds: ['Google Premier Partner agency', 'ClickFunnels Two Comma Club', 'Samford University'],
}

export const cta = {
  title: ['Let’s look at', 'your numbers.'],
  body: 'Book a call. Bring your ad accounts and your goals, and I’ll tell you plainly where the money is leaking and what I would fix first.',
  dm: 'Prefer Facebook? Message me “MDA”.',
}

// Answers written for people and for answer engines (Google AI Overviews, ChatGPT, Perplexity).
// Each one is short, direct and quotable. CONFIRM wording with Evan.
export const faq = [
  {
    q: 'What does a fractional CMO do?',
    a: 'A fractional CMO runs your marketing strategy part time, for a monthly fee instead of a full executive salary. I set the plan, manage the channels and the people running them, and report on one thing: revenue the marketing brought in.',
  },
  {
    q: 'Do you only work with businesses in Naples, Florida?',
    a: 'No. JetSpeedSocial is based in Naples, Florida, and clients are spread across the United States, including New York, Illinois, Tennessee and Louisiana. Everything runs over calls and shared dashboards.',
  },
  {
    q: 'Which marketing channels do you manage?',
    a: 'Google Ads, YouTube Ads, Facebook and Instagram ads, SEO, GEO, websites, social media and brand creative. Most clients use two or three of these together, picked by where their buyers already are.',
  },
  {
    q: 'What is GEO, and how is it different from SEO?',
    a: 'SEO gets your business ranked in Google search results. GEO, short for generative engine optimization, gets your business named when people ask AI tools like ChatGPT, Perplexity or Google AI Overviews for a recommendation. They work best together.',
  },
  {
    q: 'What results have your clients seen?',
    a: 'A B2B steel machinery manufacturer went from a 2 to 3x return on Google Ads to 6.34x in a year. A real estate software company booked more than 200 demo calls from Facebook ads. A Naples urgent care clinic moved from #12 to #1 on Google for “Naples urgent care”.',
  },
  {
    q: 'How do we get started?',
    a: 'Book a strategy call at jetspeedsocial.com/contact or call (239) 877-2927. Bring access to your ad and analytics accounts if you can, and I will show you where the money is going and what I would fix first.',
  },
]
