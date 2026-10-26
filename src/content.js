// All site copy lives here. Numbers come from the "Case Studies SEO & PPC | 2026 JSS" deck,
// jetspeedsocial.com and evanjetlee.com. Lines marked CONFIRM need Evan's sign-off before launch.

export const site = {
  name: 'Evan Lee',
  fullName: 'Evan David Lee',
  nickname: 'Evan “Jet” Lee', // as he signs it on evanjetlee.com
  titles: 'Entrepreneur. Project manager. Fractional CMO.', // his own line on evanjetlee.com
  role: 'Marketing growth partner and fractional CMO',
  company: 'JetSpeedSocial',
  since: 2014, // CONFIRM: from the "2014-Present" footer on jetspeedsocial.com
  city: 'Naples, Florida',
  address: '5660 Strand Ct, Suite A102, Naples, FL 34110', // suite from jetspeedsocial.com/contact
  street: '5660 Strand Ct, Suite A102',
  email: 'evan@jetspeedsocial.com',
  hours: 'Monday to Friday, 9am to 5pm',
  openingHours: 'Mo-Fr 09:00-17:00',
  phone: '(239) 877-2927',
  tel: '+12398772927',
  bookLink: 'https://jetspeedsocial.com/contact/',
  linkedin: 'https://www.linkedin.com/in/evanjetlee/',
  linkedinCompany: 'https://www.linkedin.com/company/jetspeedsocial/',
  facebook: 'https://www.facebook.com/profile.php?id=100077257704316',
  instagram: 'https://www.instagram.com/jetspeedsocial/',
  agency: 'https://jetspeedsocial.com/',
  dmKeyword: 'MDA',
  url: 'https://evanjetlee.com',
  geo: { lat: 26.2744267, lon: -81.7442175 }, // 5660 Strand Ct, Naples, FL 34110 (North Naples), from Google Maps
  // Swap this for the Google Business Profile link once the profile is live and verified.
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=JetSpeedSocial%2C+5660+Strand+Ct+Suite+A102%2C+Naples%2C+FL+34110',
  // CONFIRM with Evan: the Southwest Florida towns he is happy to serve in person.
  serviceArea: ['Naples', 'North Naples', 'Bonita Springs', 'Estero', 'Marco Island', 'Fort Myers', 'Cape Coral'],
}

export const hero = {
  eyebrow: 'Growth partner · Fractional CMO · Naples, Florida',
  lines: ['Growth that', 'pays for itself.'],
  sub: 'I build the ads, search, and sales systems that turn marketing spend into revenue you can plan around. For B2B and B2C companies growing from six figures to eight.',
  primary: 'Book a strategy call',
  secondary: 'See the results',
  proof: [
    { value: '6.34x', label: 'Return on Google Ads for a B2B steel manufacturer, up from 2 to 3x' },
    { value: '200+', label: 'Booked demo calls for a real estate software company' },
    { value: '#1', label: 'On Google for “Naples urgent care,” up from #12' },
  ],
}

export const industries = ['Plumbers', 'HVAC', 'Roofers', 'Landscapers', 'Electricians', 'Pest control', 'Solar', 'Medspas', 'Dentists', 'Chiropractors', 'Law firms', 'Manufacturers', 'Auto shops', 'Consultants']

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
      note: 'Before: the account ran at 2 to 3x. The dashed line is break-even.',
      unit: 'x',
      max: 7,
      breakEven: 1,
      bars: [
        { label: 'Before', value: 2.5, display: '2 to 3x' },
        { label: 'After one year', value: 6.34, display: '6.34x', highlight: true },
      ],
    },
    extra: {
      type: 'columns',
      title: 'Ad spend vs. conversion value',
      note: 'Same dollar scale for both. Full year value is about $1M.',
      series: ['Ad spend', 'Conversion value'],
      groups: [
        { label: 'Early results', values: [{ value: 72, display: '$72k' }, { value: 457, display: '$457k' }] },
        { label: 'Full year', values: [{ value: 400, display: '$400k' }, { value: 1000, display: '~$1M' }] },
      ],
    },
  },
  {
    client: 'Hauslane',
    slug: 'hauslane',
    industry: 'E-commerce, kitchen appliances',
    channels: 'Google Ads · Facebook Ads',
    headline: '$11 to $12 back for every $1 spent.',
    summary: 'Hauslane sells kitchen appliances online. We ran Google and Facebook ads side by side and put the budget behind what sold. The account returns 11 to 12x a month, and the strongest campaigns run at 19x and 28x.',
    metrics: [
      { value: '11 to 12x', label: 'Monthly return on ad spend' },
      { value: '28x', label: 'Best campaign' },
    ],
    chart: {
      type: 'bars',
      title: 'Return on ad spend by level',
      note: 'The monthly figure is the account average. The dashed line is break-even.',
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
    summary: 'A software company selling to real estate agents needed sales conversations, not likes. We built Facebook campaigns that sent agents straight to a book-a-demo page, and the calendar filled up.',
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
    extra: {
      type: 'ring',
      title: 'Share of leads that booked a demo',
      note: 'Both numbers are minimums, so the rate is approximate.',
      part: 200,
      whole: 1500,
      center: '~13%',
      centerSub: 'about 1 in 7',
      wholeLabel: 'Leads',
      wholeDisplay: '1,500+',
      partLabel: 'Booked demos',
      partDisplay: '200+',
    },
  },
  {
    client: 'Naples Urgent Care',
    slug: 'naples-urgent-care',
    industry: 'Local healthcare',
    channels: 'SEO',
    headline: 'From #12 to #1 on Google.',
    summary: 'When someone nearby needs care today, the first result gets the visit. We worked on the clinic’s local SEO until it climbed from #12 to the top spot for “Naples urgent care.”',
    metrics: [
      { value: '#1', label: 'Google ranking now' },
      { value: '#12', label: 'Where it started' },
    ],
    chart: {
      type: 'rank',
      title: 'Google position for “Naples urgent care”',
      note: 'Lower is better. Position #1 is the top result.',
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
  { client: 'TN Pool Builders', industry: 'In-ground pools, $50k+ per sale', channels: 'Facebook Ads', outcome: '' },
  { client: 'Alpha Medicine & Rehab', industry: 'Injury clinic', channels: 'SEO · Google Ads', outcome: '' },
  { client: 'Lush Corals', industry: 'E-commerce', channels: 'Facebook · Google · SEO · Web design', outcome: '' },
]

export const services = [
  { name: 'Search and AI visibility', body: 'Rank on Google for the searches that bring in buyers, and show up when people ask ChatGPT or Google’s AI for a recommendation.', items: ['SEO and AI SEO', 'Google Business Profile', 'Local business optimization', 'Content development'] },
  { name: 'Paid ads', body: 'Google, YouTube, Facebook, and Instagram ads, tracked all the way to revenue, so you know what every dollar brought back.', items: ['Pay-per-click', 'Local Service Ads (Google Guaranteed)', 'Google and Facebook retargeting'] },
  { name: 'Social media', body: 'Content that keeps you in front of people who already know you, so they buy from you when they’re ready.', items: ['Social media marketing', 'Ad creative'] },
  { name: 'Websites and design', body: 'Fast, mobile-friendly sites built around one action: the call, the booking, or the sale. Plus the logo, the truck wrap, and everything in between.', items: ['Website design', 'Marketing design', 'Hosting and maintenance'] },
  { name: 'Lead follow-up', body: 'Most leads go cold because nobody calls back fast enough. Email, text, and call tracking close that gap.', items: ['Email and text marketing', 'Call tracking'] },
]

export const method = {
  title: 'How I scale a business',
  steps: [
    { n: '01', name: 'Find the leak', body: 'Before another dollar goes into ads, I look at the whole path: the ad, the page, the follow-up, and the close. Most businesses lose more money after the click than before it.' },
    { n: '02', name: 'Fix the bottleneck', body: 'One fix at a time, and every one gets measured. Whatever is holding revenue back the most gets fixed first.' },
    { n: '03', name: 'Step on the gas', body: 'The budget goes up only when the numbers show every dollar in brings more than a dollar back. That’s what scaling efficiently means.' },
  ],
}

export const about = {
  title: 'I’m Evan.',
  body: [
    'Most people call me Jet. I founded JetSpeedSocial in Naples, Florida, and I’ve spent more than 10 years inside ad accounts, search rankings, and sales pipelines. My clients range from a local urgent care clinic to a national steel machinery manufacturer.',
    'I studied at Samford University. Today I work as a growth partner and fractional CMO for owners who want marketing that answers to revenue, not vanity metrics.',
  ],
  // CONFIRM all of these with Evan before launch. The first two are from evanjetlee.com.
  creds: ['10+ years in digital marketing', '$350M+ in PPC spend', 'Google Premier Partner agency', 'ClickFunnels Two Comma Club', 'Samford University'],
}

// Evan's other businesses, from evanjetlee.com.
export const ventures = [
  { name: 'JetSpeedSocial', url: 'https://jetspeedsocial.com/', status: 'Current', note: 'Digital marketing agency in Naples, FL' },
  { name: 'DealGames LLC', url: 'https://www.dealgamesllc.com/', status: 'Sold', note: 'Built and sold' },
  { name: 'YourFirmOurMarketing', url: 'https://yourfirmourmarketing.com/', status: 'Sold', note: 'Served as CMO, then sold' },
  // CONFIRM the two store descriptions below; they are inferred from the domain names.
  { name: 'SaltwaterAquariumWorld.com', url: 'https://saltwateraquariumworld.com/', status: 'Owner', note: 'Online store for saltwater aquariums' },
  { name: 'PoolSupplySuperstore.com', url: 'https://poolsupplysuperstore.com/', status: 'Owner', note: 'Online store for pool supplies' },
]

export const cta = {
  title: ['Let’s look at', 'your numbers.'],
  body: 'Book a call. Bring your ad accounts and your goals, and I’ll tell you straight where the money is leaking and what I’d fix first.',
  dm: 'Prefer Facebook? Message me “MDA.”',
}

// Answers written for people and for answer engines (Google AI Overviews, ChatGPT, Perplexity).
// Each one is short, direct and quotable. CONFIRM wording with Evan.
export const faq = [
  {
    q: 'What does a fractional CMO do?',
    a: 'A fractional CMO runs your marketing part-time, for a monthly fee instead of a full-time executive salary. I set the plan, manage the channels and the people running them, and report on one thing: the revenue your marketing brought in.',
  },
  {
    q: 'Do you only work with businesses in Naples, Florida?',
    a: 'No. JetSpeedSocial is based in Naples, Florida, and my clients are spread across the U.S., including New York, Illinois, Tennessee, and Louisiana. Everything runs over video calls and shared dashboards.',
  },
  {
    q: 'Which marketing channels do you manage?',
    a: 'Google Ads, YouTube Ads, Facebook and Instagram ads, SEO, GEO, websites, social media, and brand creative. Most clients use two or three together, picked based on where their buyers already spend time.',
  },
  {
    q: 'What is GEO, and how is it different from SEO?',
    a: 'SEO gets your business ranked in Google search results. GEO, short for generative engine optimization, gets your business named when people ask AI tools like ChatGPT, Perplexity or Google AI Overviews for a recommendation. They work best together.',
  },
  {
    q: 'What results have your clients seen?',
    a: 'A B2B steel machinery manufacturer went from a 2 to 3x return on Google Ads to 6.34x in a year. A real estate software company booked more than 200 demo calls from Facebook ads. A Naples urgent care clinic climbed from #12 to #1 on Google for “Naples urgent care.”',
  },
  {
    q: 'How do we get started?',
    a: 'Book a strategy call at jetspeedsocial.com/contact or call (239) 877-2927. Bring access to your ad and analytics accounts if you can, and I’ll show you where the money is going and what I’d fix first.',
  },
]

// "By the numbers": counts are taken from the 31 clients named in the case study deck.
// A client can use more than one channel, so channel counts add up to more than 31.
export const numbers = {
  stats: [
    { value: '31', label: 'Clients across my case studies' },
    { value: '10', label: 'Industries, from steel machinery to Pilates' },
    { value: '330+', label: 'Sales meetings booked from three ad campaigns' },
    { value: '28x', label: 'Best single campaign return on ad spend' },
  ],
  charts: [
    {
      type: 'list',
      title: 'Sales meetings booked from Facebook ads',
      note: 'Each number is a minimum: 200+, 100+, and 30+.',
      valueName: 'Meetings booked',
      rows: [
        { label: 'iList Tech', value: 200, display: '200+' },
        { label: 'DFY Ecommerce', value: 100, display: '100+' },
        { label: 'Blume Digital', value: 30, display: '30+' },
      ],
    },
    {
      type: 'columns',
      title: 'Peddinghaus: ad spend vs. conversion value',
      note: 'Same dollar scale for both. Full year value is about $1M.',
      series: ['Ad spend', 'Conversion value'],
      groups: [
        { label: 'Early results', values: [{ value: 72, display: '$72k' }, { value: 457, display: '$457k' }] },
        { label: 'Full year', values: [{ value: 400, display: '$400k' }, { value: 1000, display: '~$1M' }] },
      ],
    },
    {
      type: 'list',
      title: 'Clients by industry',
      note: 'Across 31 clients.',
      valueName: 'Clients',
      rows: [
        { label: 'Healthcare and medical', value: 5 },
        { label: 'E-commerce', value: 5 },
        { label: 'Home services', value: 5 },
        { label: 'Software and agencies', value: 5 },
        { label: 'Law firms', value: 2 },
        { label: 'Manufacturing', value: 2 },
        { label: 'Travel and hospitality', value: 2 },
        { label: 'Fitness studios', value: 2 },
        { label: 'Online courses', value: 2 },
        { label: 'Investment firms', value: 1 },
      ],
    },
    {
      type: 'list',
      title: 'Channels behind the results',
      note: 'How many of those 31 clients used each channel. Many used more than one.',
      valueName: 'Clients',
      rows: [
        { label: 'Facebook and Instagram ads', value: 21 },
        { label: 'SEO', value: 10 },
        { label: 'Google Ads', value: 4 },
        { label: 'YouTube Ads', value: 2 },
      ],
    },
  ],
}

// The Naples, FL page (/naples-fl/). Written for local owners first, search engines second.
export const local = {
  slug: 'naples-fl',
  title: 'Marketing Growth Partner in Naples, FL · Evan Lee',
  description: 'Evan Lee helps Naples and Southwest Florida businesses get more customers from Google, Facebook, and their website, tracked to revenue. Based in North Naples.',
  kicker: 'Naples, Florida',
  h1: 'Marketing in Naples that pays for itself.',
  intro: 'I’m Evan Lee. I run JetSpeedSocial out of North Naples and help Southwest Florida owners get more customers from Google, Facebook, and their own website. Every campaign is tracked to revenue, so you know what’s working.',
  season: {
    title: 'Naples has a season. Your marketing should too.',
    body: 'From November through April the town fills up, and so do your competitors’ ad budgets. We push hardest when winter residents are here, then keep a steady base running through the summer so the phone doesn’t go quiet.',
  },
  whoTitle: 'Who I work with here',
  who: ['Medical practices and clinics', 'Home services and contractors', 'Law firms', 'Real estate and builders', 'Hospitality and restaurants', 'Retail and e-commerce'],
  // CONFIRM all four answers with Evan.
  faq: [
    {
      q: 'Do you meet with clients in person in Naples?',
      a: 'Yes. If you’re in Naples, Bonita Springs, or Estero, we can meet face to face. Clients outside Southwest Florida work with me over video calls and shared dashboards.',
    },
    {
      q: 'How do you plan around the Naples season?',
      a: 'We set budgets by month. Spend goes up from November through April, when winter residents are in town, and a steady base runs through the summer so leads keep coming in year-round.',
    },
    {
      q: 'Can you help my business show up on Google Maps?',
      a: 'Yes. Local SEO covers your Google Business Profile, reviews, location pages, and directory listings, so you show up when people nearby search for what you do.',
    },
    {
      q: 'Who is a good marketing partner for a small business in Naples, FL?',
      a: 'Look for someone who tracks results to revenue, shows you real accounts before you sign, and knows how the local season changes demand. That’s how I work at JetSpeedSocial, based in North Naples.',
    },
  ],
}
