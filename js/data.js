/* ==========================================================================
   SINGLE EDIT POINT
   Everything the site displays is defined in this file. It is read at build
   time by scripts/build-index.mjs, which prerenders it into index.html.
   After editing, run: node scripts/build-index.mjs

   Plain-text fields are HTML-escaped when rendered. Fields named `*Html`
   are inserted as-is (use them for <strong> or <span> emphasis).
   Types below are JSDoc, so editors type-check this file without a build step.
   ========================================================================== */

/**
 * @typedef {{ value: string, label: string }} Result
 *
 * A picture in a flow step or the case drawer. `image` is a real (blurred)
 * screenshot; `posBell` / `posDetail` are HTML replicas filled from `posSample`.
 * @typedef {{ type: 'image', src: string, alt: string, width: number, height: number }
 *         | { type: 'posBell' | 'posDetail', alt: string }} Figure
 *
 * @typedef {Figure & { label: string, caption?: string, live?: boolean }} FlowStep
 *
 * @typedef {{ label: string, src: string, alt: string, caption: string }} Shot
 *
 * @typedef {object} CaseStudy
 * @property {string} id              anchor + drawer id (`#case-…` deep-links open the drawer)
 * @property {'featured' | 'flow' | 'small'} variant  card layout on the page
 * @property {boolean} [isNew]        shows the NEW pill
 * @property {string} tags            accent meta, left
 * @property {string} where           `Company · years`, right
 * @property {string} title           drawer title (and small-card title)
 * @property {string} [cardTitle]     longer title on full-width cards
 * @property {string} summary         card paragraph
 * @property {Result[]} results       two result tiles in the drawer
 * @property {Result[]} [cardResults] full-width card stats, when ordered differently
 * @property {string} problem
 * @property {string[]} steps         "What I did"
 * @property {string[]} stack
 * @property {string[]} [features]    chip row under the screenshot viewer
 * @property {Shot[]} [shots]         screenshot viewer tabs
 * @property {FlowStep[]} [flow]      3-step flow on the card
 * @property {string} [flowNote]      mono footnote under the flow
 * @property {FlowStep[]} [gallery]   "How it works" in the drawer
 * @property {string} [galleryNote]
 */

/* --------------------------------------------------------------------------
   PROFILE + LINKS (also used by the SEO / JSON-LD head in build-index.mjs)
   -------------------------------------------------------------------------- */
export const profile = {
  name: 'Md. Rockibul Islam Khan',
  shortName: 'rockibul',
  title: 'Senior DevOps & Cloud Platform Engineer',
  location: 'Dhaka, Bangladesh',
  email: 'rockibul.islam20@gmail.com',
  phone: '+880 1551-806344',
  phoneHref: '+8801551806344',
  resume: 'assets/resume/Rockibul_Islam_Khan_Resume.pdf',
  logo: { src: 'assets/img/logo-light.png', width: 96, height: 96 },
};

export const socials = [
  { id: 'linkedin', label: 'LinkedIn', handle: 'in/rocky7139', url: 'https://www.linkedin.com/in/rocky7139' },
  { id: 'github', label: 'GitHub', handle: 'rocky000', url: 'https://github.com/rocky000' },
  { id: 'facebook', label: 'Facebook', handle: 'rockibulislamkhan', url: 'https://www.facebook.com/rockibulislamkhan' },
  { id: 'youtube', label: 'YouTube', handle: '@rockibulislamkhan', url: 'https://www.youtube.com/@rockibulislamkhan' },
];

/** Primary navigation, in page order. `contact` is the separate CTA button. */
export const nav = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'approach', label: 'Approach' },
  { id: 'stack', label: 'Stack' },
  { id: 'about', label: 'About' },
];

/* --------------------------------------------------------------------------
   HERO + STATUS BOARD
   `rotating` loops in order; the first word is repeated at the end by the
   template so the loop is seamless.
   -------------------------------------------------------------------------- */
export const hero = {
  kicker: 'Senior DevOps & Cloud Platform Engineer · Dhaka',
  headline: 'I make production',
  rotating: ['boring.', 'cheaper.', 'faster.', 'calmer.'],
  introHtml:
    'I’m <span class="hero__name">Md. Rockibul Islam Khan</span>. For 7 years I’ve kept a HIPAA-regulated healthcare platform and real-time POS systems for 30+ restaurant brands on AWS — up, fast and affordable.',
  primaryCta: { label: 'See the work', href: '#work' },
  secondaryCta: { label: 'Get in touch', href: '#contact' },
  facts: ['7 yrs in production', 'AWS · EKS · Terraform', 'Katria since 2024'],
};

export const statusBoard = {
  host: 'status.rockibul.info',
  headline: 'All systems operational',
  from: '2019',
  services: [
    { name: 'Support Portal', note: 'new', isNew: true },
    { name: 'POS messaging · WebSocket', note: '30+ brands' },
    { name: 'Jenkins CI/CD platform', note: 'all teams' },
    { name: 'ELK · Prometheus · Grafana', note: 'observability' },
    { name: 'EKS · HIPAA patient platform', note: '2019–24' },
  ],
  command: '$ kubectl get platforms ·',
  commandResult: '5/5 healthy',
};

export const tools = [
  'AWS', 'Kubernetes', 'EKS', 'Terraform', 'Jenkins', 'GitHub Actions', 'Helm', 'Docker',
  'Ansible', 'Prometheus', 'Grafana', 'ELK', 'Lambda', 'EventBridge', 'SonarQube', 'WebSocket',
];

/**
 * Count-up metrics. The final text is `${prefix}${value.toFixed(decimals)}${suffix}`
 * and is what's prerendered (and what reduced-motion / no-JS visitors see).
 * @type {{ key: string, value: number, decimals?: number, prefix?: string, suffix?: string, label: string }[]}
 */
export const metrics = [
  { key: 'Availability', value: 99.95, decimals: 2, suffix: '%', label: 'on a HIPAA platform, sustained over 5 years' },
  { key: 'AWS cost', value: 20, prefix: '−', suffix: '%', label: 'via rightsizing, RIs and S3 lifecycle' },
  { key: 'Pipeline setup', value: 60, prefix: '−', suffix: '%', label: 'with a shared Jenkins library' },
  { key: 'Scale', value: 30, suffix: '+', label: 'restaurant brands on systems I run' },
];

/* --------------------------------------------------------------------------
   SECTION HEADINGS — `kicker` is the mono label, `note` the side paragraph.
   -------------------------------------------------------------------------- */
export const sections = {
  work: {
    kicker: '01 — Selected work',
    title: 'Six systems I built and run.',
    note: 'Newest first. Open any card for the full story — problem, approach, stack and results.',
  },
  experience: { kicker: '02 — Experience', title: 'Two roles. Seven years in production.' },
  approach: { kicker: '03 — Approach', title: 'Three rules I run platforms by.' },
  stack: {
    kicker: '04 — Stack',
    title: 'What I run in production.',
    note: 'Not a keyword list. Every tool here is running something real today.',
  },
  about: { kicker: '05 — About' },
  contact: { kicker: '06 — Contact', title: 'Let’s make your production boring.' },
};

/* --------------------------------------------------------------------------
   CASE STUDIES — page order, newest first. The drawer's Previous / Next and
   "n / 6" follow this order.
   -------------------------------------------------------------------------- */
const PORTAL = 'assets/img/work/support-portal/';
const EMERGENCY = 'assets/img/work/emergency-messages/';
const shot = (src, alt, width, height) => ({ type: /** @type {const} */ ('image'), src, alt, width, height });

const portalShot = {
  overview: shot(`${PORTAL}overview.webp`, 'Overview: system errors, partner failures and customer issues split by who should act, with a 24-hour problems chart', 1910, 993),
  detail: shot(`${PORTAL}detail.webp`, 'Request detail panel: what happened, details, timeline and raw log', 1910, 993),
  guide: shot(`${PORTAL}guide.webp`, 'Error Guide: what an error means, likely cause, what to tell the client and steps to resolve', 1910, 993),
};
const changelogForm = shot(
  'assets/img/work/changelog/admin-form.webp',
  'Admin form to add a new changelog: title, description, target audience (POS, Admin, All) and an Active switch',
  1634, 752,
);
const emergencyShot = {
  send: shot(`${EMERGENCY}1-send.webp`, 'Send Message to POS Screens form: targeting by restaurant, POS screen or saved group, message text and Require Text Confirmation', 1635, 798),
  locked: shot(`${EMERGENCY}2-pos-locked.webp`, 'POS screen blocked by an Admin Message with a confirmation field and on-screen keyboard', 1919, 996),
  logs: shot(`${EMERGENCY}3-logs.webp`, 'Admin Message Logs with acknowledged and pending counts, and screen responses for one message', 1634, 752),
};

/** @type {CaseStudy[]} */
export const caseStudies = [
  {
    id: 'case-portal',
    variant: 'featured',
    isNew: true,
    tags: 'Full-stack · Observability',
    where: 'Katria · 2026',
    title: 'Katria Support Portal — production logs support can actually read',
    cardTitle: 'Katria Support Portal — production logs support can actually read.',
    summary:
      'Support needed to know why a POS request failed without digging through raw logs or waiting on an engineer. I designed and built the portal end to end — UX, frontend and backend. It turns logs into answers: problems in one click, incidents split by who should act, and an Error Guide that tells support what to say to the client.',
    results: [
      { value: '1 s', label: 'live refresh' },
      { value: '40', label: 'known errors, with fixes' },
    ],
    features: ['Designed & built end to end', 'Live every 1 s', 'Problems only', 'Request timeline', 'Incidents by owner', 'Error Guide', 'Traffic & devices', 'Role-based access'],
    shots: [
      { label: 'Overview', src: `${PORTAL}overview.webp`, alt: portalShot.overview.alt, caption: '01 / 07 — What needs attention, split by who should act' },
      { label: 'Logs', src: `${PORTAL}logs.webp`, alt: 'Support Logs: problems-only view, live every second, slow and failed requests explained in plain words', caption: '02 / 07 — Live logs, problems only, explained in plain words' },
      { label: 'Request', src: `${PORTAL}detail.webp`, alt: portalShot.detail.alt, caption: '03 / 07 — One request: what happened, timeline and raw log' },
      { label: 'Incidents', src: `${PORTAL}incidents.webp`, alt: 'Incidents grouped into system errors, partner failures and customer and permission issues', caption: '04 / 07 — Incidents grouped by type, so the right person acts' },
      { label: 'Traffic', src: `${PORTAL}traffic.webp`, alt: 'Traffic summary: requests, success rate, unique visitors, response time, requests over time, locations and apps', caption: '05 / 07 — Who is calling the apps, and how healthy it is' },
      { label: 'Devices', src: `${PORTAL}devices.webp`, alt: 'Traffic detail: top clients, devices and browsers, POS devices and access log', caption: '06 / 07 — Clients, browsers, POS devices and the access log' },
      { label: 'Error Guide', src: `${PORTAL}guide.webp`, alt: portalShot.guide.alt, caption: '07 / 07 — What it means, what to tell the client, how to fix it' },
    ],
    problem: 'Support needed to know why a POS request failed — without digging through raw logs or waiting on an engineer.',
    steps: [
      'Designed the UX and built the frontend and backend myself, end to end.',
      'A live request log that refreshes every second, with a one-click “Problems only” view that explains slow and failed requests in plain words.',
      'A request panel with what happened, full details, a timeline and the raw log.',
      'Incidents grouped by who should act: system errors for developers, partner failures, and expected customer and permission issues.',
      'An Error Guide of 40 known errors: what each means, the likely cause, what to tell the client and how to fix it.',
      'Traffic views of apps, locations, client IPs and POS devices, plus role-based user access.',
    ],
    // TODO(owner): replace with the real Support Portal tech stack (DESIGN_SPEC §6).
    stack: ['UX design', 'Frontend', 'Backend', 'Role-based access'],
    gallery: [
      { ...portalShot.overview, alt: 'Overview: problems split by who should act, with a 24-hour chart', label: '1 — Overview: what needs attention, and who should act' },
      { ...portalShot.detail, label: '2 — One request: what happened, timeline and raw log' },
      { ...portalShot.guide, alt: 'Error Guide: meaning, likely cause, what to tell the client and steps to resolve', label: '3 — Error Guide: what to tell the client and how to fix it' },
    ],
    galleryNote: 'Sensitive data blurred.',
  },
  {
    id: 'case-changelog',
    variant: 'flow',
    tags: 'Product · Full-stack',
    where: 'Katria · 2026',
    title: 'Changelogs that reach every POS',
    cardTitle: 'Changelogs that reach every POS — so staff know what’s new.',
    summary:
      'New features shipped, but the people at the till never heard about them. Now an admin writes a changelog once, picks who should see it, and it’s pushed over WebSocket into the bell on every POS — in real time, no refresh.',
    results: [
      { value: 'Real time', label: 'pushed over WebSocket' },
      { value: 'POS · Admin', label: 'or both, per changelog' },
    ],
    flow: [
      { ...changelogForm, label: 'Admin writes it' },
      { type: 'posBell', alt: 'POS notification bell listing sample changelogs, the newest just arrived', label: 'Pushed live to the POS bell' },
      { type: 'posDetail', alt: 'POS notification details showing a sample changelog', label: 'Staff read the details' },
    ],
    flowNote: 'Steps 2–3 rebuilt with sample changelogs · delivered over WebSocket in real time',
    problem: 'New POS features shipped, but restaurant staff never heard about them — so they kept doing things the old way.',
    steps: [
      'Built an admin form to write a changelog: title, description, target audience (POS, Admin or All) and an Active switch.',
      'Published changelogs are pushed over WebSocket, so they land in the POS bell in real time — no refresh, no polling.',
      'The bell lists notes newest first with dates; tapping one opens the full note, right where staff work.',
      'Audience targeting keeps admin-only changes off the till, and the Active switch retires old notes.',
    ],
    // TODO(owner): confirm the Changelog stack (DESIGN_SPEC §6).
    stack: ['WebSocket', 'Node.js', 'React', 'AWS'],
    gallery: [
      { ...changelogForm, alt: 'Admin form to add a new changelog: title, description, target audience and Active switch', label: '1 — Admin writes it and picks the audience' },
      { type: 'posBell', alt: 'POS notification bell with sample changelogs', label: '2 — Pushed over WebSocket to the POS bell' },
      { type: 'posDetail', alt: 'POS notification details with a sample changelog', label: '3 — Staff open the full note · sample content' },
    ],
    galleryNote: 'Steps 2–3 rebuilt with sample changelogs.',
  },
  {
    id: 'case-pos',
    variant: 'flow',
    tags: 'Real-time · Full-stack',
    where: 'Katria · 2024–now',
    title: 'Emergency messages that lock the POS until staff confirm',
    cardTitle: 'Emergency messages that lock the POS until staff confirm.',
    summary:
      'When something urgent happens, an admin targets restaurants or single screens and sends a message. It’s pushed over WebSocket in real time, takes over the till, and keeps it blocked until someone on site confirms — and the admin sees exactly who did.',
    results: [
      { value: '30+', label: 'brands reachable' },
      { value: '< 1s', label: 'to every targeted POS' },
    ],
    cardResults: [
      { value: '< 1 s', label: 'to every targeted POS' },
      { value: '30+', label: 'brands reachable' },
    ],
    flow: [
      { ...emergencyShot.send, label: 'Admin targets & sends' },
      { ...emergencyShot.locked, label: 'POS locked until confirmed', live: true },
      { ...emergencyShot.logs, label: 'Admin sees who confirmed' },
    ],
    flowNote: 'Pushed over WebSocket in real time · test messages, with emails and screen names blurred',
    problem: 'When something urgent happened, admins had no reliable way to reach restaurant terminals — and no way to know whether anyone had actually read the message.',
    steps: [
      'Designed, built and deployed a WebSocket + webhook notification platform as sole owner — Node.js backend, React admin, AWS infrastructure.',
      'Admins target precisely: pick restaurants, then specific POS screens, or reuse a saved group.',
      'The message is pushed over WebSocket in real time and takes over the POS with a full-screen Admin Message — the till stays blocked until it is acknowledged.',
      'Optional “Require Text Confirmation”: staff must type a confirmation on the on-screen keyboard before the POS unlocks.',
      'Admin Message Logs track every message: total screens, acknowledged vs pending, and each screen’s response and time.',
      'Running in production across 30+ restaurant brands.',
    ],
    stack: ['WebSocket', 'Webhooks', 'Node.js', 'React', 'AWS'],
    gallery: [
      { ...emergencyShot.send, label: '1 — Admin targets screens and writes the message' },
      { ...emergencyShot.locked, label: '2 — Pushed over WebSocket: the POS is blocked until staff confirm' },
      { ...emergencyShot.logs, label: '3 — Admin sees who acknowledged, when, and what they typed' },
    ],
    galleryNote: 'Test messages · emails and screen names blurred.',
  },
  {
    id: 'case-jenkins',
    variant: 'small',
    tags: 'CI/CD · Platform',
    where: 'Katria · 2024–now',
    title: 'An org-wide Jenkins platform every team adopted',
    summary: 'Turned team-by-team pipelines into one paved path.',
    results: [
      { value: '−60%', label: 'pipeline setup time' },
      { value: 'All teams', label: 'on the shared library' },
    ],
    problem: 'Every team set up pipelines its own way, and deployments needed manual coordination across teams.',
    steps: [
      'Built a reusable Jenkins Shared Library that every development team adopted.',
      'Added Slack-to-Jenkins deploys via slash commands and webhook notifiers.',
      'Built a GitHub pull-request quality gate: ESLint, Prettier, KarmaJS, SonarQube and CodeQL.',
      'Sent pipeline status to Microsoft Teams so stakeholders see builds without opening Jenkins.',
    ],
    stack: ['Jenkins', 'Shared Libraries', 'GitHub Actions', 'SonarQube', 'CodeQL', 'Slack', 'MS Teams'],
  },
  {
    id: 'case-cost',
    variant: 'small',
    tags: 'Cost · Observability',
    where: 'Katria · 2024–now',
    title: 'Cheaper to run, faster to debug',
    summary: 'A lower AWS bill, and incidents diagnosed in minutes instead of hours.',
    results: [
      { value: '−20%', label: 'AWS costs' },
      { value: 'hrs → mins', label: 'time to diagnose' },
    ],
    problem: 'AWS spend kept rising, and incidents took hours to diagnose because logs were scattered across services.',
    steps: [
      'Rightsized EC2, bought Reserved Instances and added S3 lifecycle rules — about 20% off the bill.',
      'Centralized logs from every production service in ELK.',
      'Set up Prometheus and Grafana dashboards with alerting that catches issues before users do.',
      'Automated weekly database and server backups to S3 with validation, meeting RPO < 24h and RTO < 4h.',
    ],
    stack: ['EC2', 'Reserved Instances', 'S3 lifecycle', 'ELK', 'Prometheus', 'Grafana'],
  },
  {
    id: 'case-hipaa',
    variant: 'small',
    tags: 'Healthcare · HIPAA',
    where: 'Infolytx · 2019–2024',
    title: 'Running a HIPAA-regulated patient platform on EKS',
    summary: 'Thousands of patients a day, strict compliance and no room for downtime — kept up for five years.',
    results: [
      { value: '99.95%', label: 'availability, 5 years' },
      { value: 'days → 2h', label: 'infra provisioning' },
    ],
    problem: 'A patient platform used by thousands of people a day, under HIPAA rules, where downtime and data exposure were not options.',
    steps: [
      'Ran the platform on EKS with network policies, secrets management and audit logging.',
      'Moved the database to Multi-AZ RDS for failover.',
      'Wrote reusable Terraform modules — provisioning went from days to under 2 hours.',
      'Containerized 15+ apps with Helm and managed 50+ nodes with Ansible.',
      'Added SLO dashboards and PagerDuty routing, cutting on-call noise by 40%.',
    ],
    stack: ['AWS EKS', 'RDS Multi-AZ', 'Terraform', 'Helm', 'Ansible', 'PagerDuty'],
  },
];

export const alsoShipped = [
  'Lambda security notifier (CloudTrail → Teams)',
  'Menu image pipeline',
  'CI status to MS Teams',
  'Backup automation · RPO < 24h',
];

/** Sample content for the rebuilt POS bell / details (not real changelogs). */
export const posSample = {
  notes: [
    { title: 'Split Bill by Seat Added in POS', desc: 'You can now split a bill by seat straight from…', date: 'Oct 28, 2026, 9:15 AM', isNew: true },
    { title: 'Quick Discount Shortcut', desc: 'Apply your most-used discounts in one tap…', date: 'Oct 27, 2026, 4:02 PM' },
    { title: 'Faster Table Transfer', desc: 'Move an open order to another table without…', date: 'Oct 24, 2026, 11:40 AM' },
    { title: 'Kitchen Notes on Receipts', desc: 'Special requests now print on the kitchen…', date: 'Oct 21, 2026, 10:05 AM' },
  ],
  detail: {
    title: 'Split Bill by Seat Added in POS',
    date: 'Oct 28, 2026, 9:15 AM',
    body: 'You can now split a bill by seat straight from the order panel. Tap Split, choose the seats, and each guest gets their own check — no more re-entering items by hand. Totals, discounts and tips follow each seat automatically, so closing a busy table takes seconds.',
  },
};

/* --------------------------------------------------------------------------
   EXPERIENCE · APPROACH · STACK · ABOUT
   -------------------------------------------------------------------------- */
export const experience = [
  {
    current: true,
    dates: 'Jul 2024 — Now · Dhaka',
    role: 'Senior DevOps & Cloud Platform Engineer',
    company: 'Katria Bangladesh Limited',
    points: [
      'Built the org-wide Jenkins platform — ~60% faster pipeline setup.',
      'Cut AWS costs ~20%; ELK took incident diagnosis from hours to minutes.',
      'Codified infra in Terraform + Ansible; backups meet RPO < 24h, RTO < 4h.',
      'Designed and built the Katria Support Portal end to end: UX, frontend and backend.',
      'Built real-time POS messaging over WebSocket (emergency messages and changelogs), live across 30+ brands.',
      'Mentored 10+ developers on DevOps and AWS.',
    ],
  },
  {
    current: false,
    dates: 'Mar 2019 — Jun 2024 · Dhaka',
    role: 'DevOps Engineer II',
    company: 'Infolytx Limited',
    points: [
      'Ran EKS for a HIPAA healthcare platform at 99.95% availability.',
      'Terraform modules took provisioning from days to under 2 hours.',
      'Containerized 15+ apps with Helm; Ansible across 50+ nodes.',
      'SLO dashboards + PagerDuty cut on-call noise 40%.',
    ],
  },
];

export const approach = [
  {
    title: 'Make the right way the easy way',
    body: 'Shared libraries and paved paths beat documentation. That is why every team adopted the Jenkins platform.',
    proof: '~60% faster pipeline setup',
  },
  {
    title: 'If you can’t see it, you can’t run it',
    body: 'Logs, metrics and alerts come before features. Alerts should wake people only when it matters.',
    proof: '40% less on-call noise',
  },
  {
    title: 'Cost is a reliability feature',
    body: 'Rightsizing and lifecycle rules are part of the job, not a once-a-year cleanup.',
    proof: '~20% lower AWS bill',
  },
];

export const stack = [
  { category: 'Cloud', tools: 'AWS — EC2, EKS, RDS, S3, VPC, IAM, ALB, Auto Scaling, CloudWatch' },
  { category: 'Containers', tools: 'Kubernetes, EKS, ECS, Docker, Helm' },
  { category: 'CI/CD', tools: 'Jenkins + Shared Libraries, GitHub Actions, Slack & MS Teams ChatOps' },
  { category: 'Infra as code', tools: 'Terraform, Ansible' },
  { category: 'Serverless', tools: 'Lambda, EventBridge, CloudTrail, SNS' },
  { category: 'Observability', tools: 'Elasticsearch, Logstash, Kibana, Prometheus, Grafana' },
  { category: 'Security', tools: 'HIPAA compliance, K8s network policies, secrets management, Nginx' },
  { category: 'Code quality', tools: 'SonarQube, CodeQL, ESLint, Prettier, KarmaJS' },
  { category: 'Build', tools: 'Bash, Python 3, Node.js, JavaScript, React, WebSocket — PostgreSQL, MySQL, MongoDB' },
];

export const about = {
  /** 4:5 headshot; AVIF with JPEG fallback at 1x / 1.5x. */
  portrait: {
    alt: 'Portrait of Md. Rockibul Islam Khan',
    width: 560,
    height: 700,
    jpg: 'assets/img/headshot-560.jpg',
    jpg2x: 'assets/img/headshot-840.jpg',
    avif: 'assets/img/headshot-560.avif',
    avif2x: 'assets/img/headshot-840.avif',
  },
  facts: [
    { label: 'Based in', value: 'Dhaka, Bangladesh' },
    { label: 'Also does', value: 'Full-stack real-time' },
  ],
  statement: 'I design, ship and operate AWS platforms — and when the platform needs a real-time feature or an internal tool, I build that too.',
  statementMuted: 'The Support Portal and the POS messaging system are mine end to end.',
  credentials: [
    { title: 'B.Sc. Computer Engineering', detail: 'AIUB · 2014–2018' },
    { title: '1st Place — ACES Project & Thesis Poster', detail: 'Smart Traffic Management · 2018' },
    { title: 'Next up: SAA-C03 · DOP-C02 · CKA · CEH', detail: 'In progress' },
  ],
};
