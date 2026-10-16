/* ==========================================================================
   SINGLE EDIT POINT
   Everything the site displays is defined in this file. It is read at build
   time by scripts/build-index.mjs, which prerenders it into index.html.
   After editing, run: node scripts/build-index.mjs

   Plain-text fields are HTML-escaped when rendered. Fields named `*Html`
   are inserted as-is (use them for <strong> or <em> emphasis).
   ========================================================================== */

/* --------------------------------------------------------------------------
   SECTION HEADINGS
   `kicker` is the small mono label above the heading.
   `note`   is the optional line under the heading.
   -------------------------------------------------------------------------- */
export const sections = {
  projects: {
    kicker: 'Case studies',
    title: 'Four systems, four measurable outcomes.',
    moreTeaser: 'More: Lambda security notifier, menu image pipeline, backup automation',
  },
  experience: {
    kicker: 'Experience',
    title: 'Two roles, seven years.',
  },
  approach: {
    kicker: 'Approach',
    title: 'Three rules I run platforms by.',
  },
  skills: {
    kicker: 'Skills',
    title: 'The stack I run in production.',
    note: 'Cloud, containers, CI/CD, and the tools I keep production running with.',
  },
  about: {
    kicker: 'About',
    title: 'Infrastructure people actually depend on.',
  },
  contact: {
    title: 'Let’s talk infrastructure.',
    note: 'Always happy to swap notes on platform engineering, SRE and AWS.',
  },
};

export const profile = {
  name: 'Md. Rockibul Islam Khan',
  shortName: 'Rockibul Islam Khan',
  title: 'Senior DevOps & Cloud Platform Engineer',
  location: 'Dhaka, Bangladesh',
  email: 'rockibul.islam20@gmail.com',
  phone: '+880 1551-806344',
  phoneHref: '+8801551806344',
  resume: 'assets/resume/Rockibul_Islam_Khan_Resume.pdf',
  // Bump this whenever you replace the PDF so browsers/CDN skip the old file.
  resumeVersion: '20260807b',
  tagline: 'I build and operate the cloud infrastructure that keeps healthcare and restaurant SaaS platforms running.',
  lead: 'I design, ship, and operate AWS platforms for healthcare and restaurant SaaS — Kubernetes, CI/CD, Terraform, and real-time systems I owned end to end.',
  summary:
    'Senior DevOps & Cloud Platform Engineer with 7+ years of experience building and operating business-critical infrastructure on AWS for healthcare and restaurant SaaS platforms. Beyond infrastructure, brings rare full-stack capability — having sole-owned the design, development, and production deployment of real-time systems (WebSocket/Webhook) and admin tooling for restaurant POS platforms. Deep expertise in Kubernetes (EKS), CI/CD automation (Jenkins, GitHub Actions), Infrastructure as Code (Terraform, Ansible), serverless architecture (AWS Lambda, EventBridge), and automated code quality pipelines (ESLint, SonarQube, CodeQL). Proven track record of driving cloud cost optimization, enforcing HIPAA compliance, and delivering systems that are live in production across 30+ restaurant brands.',
};

/* --------------------------------------------------------------------------
   HERO
   `leadMore` is hidden on small screens to keep the CTA above the fold.
   `photo` sources are generated into assets/img/ (see README).
   -------------------------------------------------------------------------- */
export const hero = {
  eyebrow: 'Building platforms at Katria · Dhaka, Bangladesh',
  eyebrowShort: 'Building at Katria · Dhaka',
  headline: 'I keep healthcare & restaurant SaaS on AWS',
  headlineAccent: 'up, fast and affordable.',
  lead: '7 years running EKS, Terraform and CI/CD in production',
  leadMore:
    ' — from a HIPAA-regulated healthcare platform to real-time POS systems across 30+ restaurant brands.',
  primaryCta: { label: 'See case studies', href: '#projects' },
  secondaryCta: { label: 'Get in touch', href: '#contact' },
  current: { label: 'Currently', role: 'Senior DevOps @ Katria', since: 'Jul 2024 → now' },
  photo: {
    alt: 'Md. Rockibul Islam Khan',
    width: 560,
    height: 700,
    jpg: 'assets/img/headshot-560.jpg',
    jpg2x: 'assets/img/headshot-840.jpg',
    avif: 'assets/img/headshot-560.avif',
    avif2x: 'assets/img/headshot-840.avif',
  },
  featured: { label: 'Featured case study', title: 'HIPAA platform at 99.95% uptime', href: '#case-hipaa' },
};

/** Headline numbers. Every value comes from the experience bullets below. */
export const highlights = [
  { value: '99.95%', label: 'availability on AWS, sustained over 5 years', short: 'availability, 5 yrs' },
  { value: '~20%', label: 'AWS bill cut via rightsizing, RIs & S3 lifecycle', short: 'AWS costs cut' },
  { value: '~60%', label: 'faster pipeline setup with a shared Jenkins library', short: 'faster pipelines' },
  { value: '30+', label: 'restaurant brands on platforms I run', short: 'brands served' },
];

export const socials = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'in/rocky7139',
    url: 'https://www.linkedin.com/in/rocky7139',
  },
  {
    id: 'github',
    label: 'GitHub',
    handle: 'rocky000',
    url: 'https://github.com/rocky000',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    handle: 'rockibulislamkhan',
    url: 'https://www.facebook.com/rockibulislamkhan',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@rockibulislamkhan',
    url: 'https://www.youtube.com/@rockibulislamkhan',
  },
];

export const skills = [
  {
    category: 'Cloud',
    icon: 'cloud',
    items: [
      'AWS EC2',
      'AWS S3',
      'AWS RDS',
      'AWS VPC',
      'AWS IAM',
      'AWS ALB',
      'AWS Auto Scaling',
      'AWS CloudWatch',
      'AWS EKS',
      'AWS Lambda',
      'AWS EventBridge',
      'AWS CloudTrail',
      'AWS SNS',
    ],
  },
  {
    category: 'Containers',
    icon: 'box',
    items: ['Kubernetes', 'Docker', 'Helm Charts', 'EKS', 'ECS'],
  },
  {
    category: 'CI/CD',
    icon: 'pipeline',
    items: [
      'Jenkins',
      'GitHub Actions',
      'Jenkins Shared Libraries',
      'Slack Integration',
      'Microsoft Teams Integration',
    ],
  },
  {
    category: 'Serverless',
    icon: 'bolt',
    items: ['AWS Lambda', 'Amazon EventBridge', 'CloudTrail', 'SNS'],
  },
  {
    category: 'Code Quality',
    icon: 'check',
    items: ['ESLint', 'Prettier', 'KarmaJS', 'SonarQube', 'CodeQL'],
  },
  {
    category: 'Real-Time',
    icon: 'signal',
    items: ['WebSocket', 'Webhooks', 'REST APIs'],
  },
  {
    category: 'Infrastructure as Code',
    icon: 'code',
    items: ['Terraform', 'Ansible'],
  },
  {
    category: 'Observability',
    icon: 'chart',
    items: ['Elasticsearch', 'Logstash', 'Kibana', 'Prometheus', 'Grafana'],
  },
  {
    category: 'Databases',
    icon: 'database',
    items: ['PostgreSQL', 'MySQL', 'MongoDB'],
  },
  {
    category: 'Programming',
    icon: 'terminal',
    items: ['Bash', 'Python 3', 'Node.js', 'JavaScript'],
  },
  {
    category: 'Security',
    icon: 'shield',
    items: ['HIPAA Compliance', 'Nginx', 'K8s Network Policies', 'Secrets Management'],
  },
  {
    category: 'Practices',
    icon: 'users',
    items: [
      'Agile / Scrum',
      'Full-Stack Development',
      'Linux Administration',
      'Cost Optimization',
    ],
  },
];

export const experience = [
  {
    role: 'Senior DevOps & Cloud Platform Engineer',
    company: 'Katria Bangladesh Limited',
    location: 'Dhaka, Bangladesh',
    period: 'Jul 2024 – Present',
    current: true,
    highlightsHtml: [
      'Built the org-wide Jenkins platform — <strong>~60% faster</strong> pipeline setup.',
      'Cut AWS costs <strong>~20%</strong>; ELK took diagnosis from <strong>hours to minutes</strong>.',
      'Codified infra in Terraform + Ansible; backups meeting <strong>RPO &lt; 24h, RTO &lt; 4h</strong>.',
      'Shipped a real-time POS notification system, live across <strong>30+ brands</strong>.',
      'Mentored <strong>10+ developers</strong> on DevOps and AWS.',
    ],
    bullets: [
      'Architected and operate the organization-wide Jenkins CI/CD platform including a reusable Shared Library framework adopted by all development teams, cutting new pipeline setup time by ~60%.',
      'Deployed a centralized ELK logging platform aggregating logs across all production services, reducing mean time to diagnose incidents from hours to minutes.',
      'Reduced AWS infrastructure costs by ~20% through EC2 rightsizing, Reserved Instance purchasing, and S3 lifecycle policy optimization.',
      'Built end-to-end Slack-to-Jenkins deployment automation via slash commands and webhook notifiers, eliminating manual deployment coordination across teams.',
      'Implemented Grafana + Prometheus monitoring with custom dashboards and alerting, enabling proactive incident detection before user impact.',
      'Automated weekly database and server backup pipelines to S3 with validation, meeting RPO < 24h and RTO < 4h targets for business continuity.',
      'Codified all infrastructure using Terraform and Ansible, enabling repeatable, auditable provisioning and disaster recovery drills.',
      'Built a serverless AWS Lambda–based notification system using CloudTrail + EventBridge to detect and alert on IAM user changes, service events, and security anomalies in real time via Microsoft Teams.',
      'Extended the Lambda notifier to deliver CI/CD pipeline status updates to Microsoft Teams, giving all stakeholders live build and deployment visibility without accessing Jenkins directly.',
      'Engineered an automated GitHub code review pipeline enforcing quality and security across frontend (ESLint, Prettier, KarmaJS) and backend (SonarQube, CodeQL) on every pull request — reducing manual review cycles and catching vulnerabilities pre-merge.',
      'Designed and shipped a real-time POS notification system (WebSocket + Webhook) currently live in production — sole owner of frontend, backend, and DevOps; delivers instant alerts to restaurant POS terminals across all brands with sub-second latency.',
      'Extended the POS notification engine into a targeted POS screen blocker allowing admins to broadcast emergency messages to a specific screen, a single restaurant, an entire chain, or all locations simultaneously.',
      'Built a menu image upload & management pipeline with in-browser cropper UI and direct-to-S3 upload, enabling restaurant teams to manage item images through admin UX without engineering involvement.',
      'Mentored and upskilled 10+ developers on DevOps practices, AWS cloud management, and deployment best practices.',
    ],
  },
  {
    role: 'DevOps Engineer II',
    company: 'Infolytx Limited',
    location: 'Dhaka, Bangladesh',
    period: 'Mar 2019 – Jun 2024',
    current: false,
    highlightsHtml: [
      'Ran EKS for a HIPAA healthcare platform at <strong>99.95% availability</strong>.',
      'Terraform modules took provisioning from <strong>days to under 2 hours</strong>.',
      'Containerized <strong>15+ apps</strong> with Helm; Ansible across <strong>50+ nodes</strong>.',
      'SLO dashboards + PagerDuty cut on-call noise <strong>40%</strong>.',
    ],
    bullets: [
      'Managed production and development Kubernetes clusters on AWS EKS supporting a HIPAA-regulated healthcare platform serving thousands of patients daily.',
      'Enforced HIPAA compliance within Kubernetes environments — implemented network policies, secrets management, pod security policies, and full audit logging.',
      'Containerized 15+ legacy and greenfield applications using Docker and packaged them as Helm charts for versioned, reproducible deployments.',
      'Designed highly available, fault-tolerant AWS architectures (EC2, RDS Multi-AZ, VPC, ALB, Auto Scaling) achieving 99.95% platform availability over 5 years.',
      'Developed reusable Terraform IaC modules for VPC, EKS, RDS, and IAM — reducing infrastructure provisioning time from days to under 2 hours.',
      'Administered and performance-tuned PostgreSQL and MySQL databases including query optimization, replication setup, and automated backup strategies.',
      'Built Ansible configuration management playbooks eliminating manual configuration drift across 50+ server fleet nodes.',
      'Evolved the Prometheus + Grafana observability stack with SLO-aligned dashboards and PagerDuty alerting integration, reducing on-call noise by 40%.',
      'Supported restaurant SaaS and multi-tenant platform infrastructure across 30+ brands, coordinating deployments in Agile sprints using Jira and GitHub.',
    ],
  },
];

export const projects = [
  {
    title: 'Real-Time POS Notification System',
    badge: 'Live in Production',
    featured: true,
    summary:
      'Sole owner of design, development, and deployment of a WebSocket + Webhook-based notification platform delivering real-time alerts to restaurant POS terminals. Responsible for the full stack: Node.js backend, React frontend, and AWS infrastructure. Currently running in production across 30+ restaurant locations.',
    tags: ['WebSocket', 'Webhooks', 'Node.js', 'React', 'AWS'],
  },
  {
    title: 'Enterprise Jenkins Shared Library Framework',
    badge: 'Org-wide',
    featured: true,
    summary:
      'Designed and built a centralized Jenkins Shared Library used by all development teams, standardizing CI/CD pipelines across the organization and reducing pipeline creation time by ~60%.',
    tags: ['Jenkins', 'Groovy', 'CI/CD'],
  },
  {
    title: 'AWS Lambda Real-Time Security & CI/CD Notifier',
    badge: 'Serverless',
    featured: false,
    summary:
      'Built a serverless notification system using AWS Lambda, CloudTrail, and EventBridge to detect IAM user changes, AWS service events, and security anomalies — delivering instant alerts to Microsoft Teams. Extended the same pipeline to push live CI/CD build and deployment status notifications, giving all stakeholders real-time visibility without logging into Jenkins.',
    tags: ['Lambda', 'EventBridge', 'CloudTrail', 'MS Teams'],
  },
  {
    title: 'Centralized ELK Logging Platform',
    badge: 'Observability',
    featured: false,
    summary:
      'Implemented an organization-wide ELK stack (Elasticsearch, Logstash, Kibana) for centralized log aggregation and real-time search across all services, reducing incident diagnosis time from hours to minutes.',
    tags: ['Elasticsearch', 'Logstash', 'Kibana'],
  },
  {
    title: 'Automated GitHub Code Review Pipeline',
    badge: 'Quality Gate',
    featured: false,
    summary:
      'Built a multi-layer code quality gate on GitHub Actions enforcing ESLint and Prettier (frontend), KarmaJS (unit tests), SonarQube (static analysis), and CodeQL (security scanning) on every PR. Eliminated entire classes of bugs and security issues before they reach production review.',
    tags: ['GitHub Actions', 'SonarQube', 'CodeQL', 'ESLint'],
  },
  {
    title: 'POS Screen Blocker — Admin Emergency Broadcast',
    badge: 'Full-Stack',
    featured: false,
    summary:
      'Extended the real-time notification system to support targeted screen takeover: admins can push full-screen emergency messages to a specific POS terminal, a single restaurant, an entire chain, or all locations at once. Built on the same WebSocket infrastructure with a new admin control panel and targeting engine.',
    tags: ['WebSocket', 'Admin UX', 'Targeting Engine'],
  },
  {
    title: 'Slack-to-Jenkins Deployment Automation',
    badge: 'ChatOps',
    featured: false,
    summary:
      'Integrated Slack slash commands with Jenkins via webhooks to trigger and monitor deployments directly from chat, eliminating manual handoffs and improving deployment visibility for 10+ developers.',
    tags: ['Slack API', 'Jenkins', 'Webhooks'],
  },
  {
    title: 'Menu Image Upload Pipeline with S3 & In-Browser Cropper',
    badge: 'Full-Stack',
    featured: false,
    summary:
      'Designed and built an end-to-end image management flow for admin UX — featuring a browser-side image cropper and direct presigned-URL upload to S3. Enabled non-technical restaurant staff to upload and manage menu item images independently, eliminating engineering bottlenecks in content updates.',
    tags: ['S3 Presigned URLs', 'JavaScript', 'Admin UX'],
  },
  {
    title: 'Disaster Recovery & Backup Automation Framework',
    badge: 'RPO < 24h',
    featured: false,
    summary:
      'Built automated weekly backup pipelines for all production databases and servers with S3 uploads and integrity validation, achieving RPO < 24h and RTO < 4h for the organization.',
    tags: ['Bash', 'S3', 'PostgreSQL', 'MySQL'],
  },
  {
    title: 'HIPAA-Compliant Healthcare Infrastructure',
    badge: 'Infolytx',
    featured: false,
    summary:
      'Designed and maintained Kubernetes-based infrastructure for a healthcare SaaS platform with full HIPAA compliance — including network isolation, secrets management, pod security, and continuous audit logging.',
    tags: ['HIPAA', 'Kubernetes', 'Network Policies'],
  },
];

/* --------------------------------------------------------------------------
   CASE STUDIES (the 2x2 grid). `projects` lists titles from `projects` above
   whose full write-ups appear under "Read the case study".
   -------------------------------------------------------------------------- */
export const caseStudies = [
  {
    id: 'case-hipaa',
    tag: 'Healthcare · HIPAA',
    org: 'Infolytx',
    years: '2019–2024',
    title: 'Running a HIPAA-regulated patient platform on EKS',
    problem: 'Thousands of patients a day, strict compliance, no room for downtime.',
    did: 'EKS with network policies, secrets management and audit logging; Multi-AZ RDS; reusable Terraform modules.',
    metrics: [
      { value: '99.95%', label: 'availability, 5 years' },
      { value: 'days → 2h', label: 'infra provisioning' },
    ],
    projects: ['HIPAA-Compliant Healthcare Infrastructure'],
  },
  {
    id: 'case-jenkins',
    tag: 'CI/CD · Platform',
    org: 'Katria',
    years: '2024–now',
    title: 'An org-wide Jenkins platform every team adopted',
    problem: 'Pipelines were set up team by team; deployments needed manual coordination.',
    did: 'A reusable Shared Library, Slack-to-Jenkins ChatOps, and a GitHub Actions quality gate (SonarQube, CodeQL).',
    metrics: [
      { value: '~60%', label: 'faster pipeline setup' },
      { value: 'All teams', label: 'on the shared library' },
    ],
    projects: [
      'Enterprise Jenkins Shared Library Framework',
      'Slack-to-Jenkins Deployment Automation',
      'Automated GitHub Code Review Pipeline',
    ],
  },
  {
    id: 'case-cost',
    tag: 'Cost · Observability',
    org: 'Katria',
    years: '2024–now',
    title: 'Cheaper to run, faster to debug',
    problem: 'Rising AWS spend and incidents that took hours to diagnose.',
    did: 'EC2 rightsizing, Reserved Instances, S3 lifecycle rules; centralized ELK logging; Prometheus + Grafana alerting.',
    metrics: [
      { value: '~20%', label: 'lower AWS costs' },
      { value: 'hrs → mins', label: 'time to diagnose' },
    ],
    projects: ['Centralized ELK Logging Platform'],
  },
  {
    id: 'case-pos',
    tag: 'Real-time · Full-stack',
    org: 'Katria',
    years: '2024–now',
    title: 'Emergency broadcast to every POS screen, in real time',
    problem: 'Admins had no way to reach restaurant terminals instantly.',
    did: 'Designed and shipped a WebSocket targeting engine: one screen, one restaurant, a chain, or all locations.',
    metrics: [
      { value: '30+', label: 'brands reachable' },
      { value: 'Sub-second', label: 'alert delivery' },
    ],
    projects: ['Real-Time POS Notification System', 'POS Screen Blocker — Admin Emergency Broadcast'],
  },
];

export const approach = [
  {
    title: 'Make the right way the easy way',
    body: 'Shared libraries and paved paths beat documentation. That’s why every team adopted the Jenkins platform.',
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

export const education = {
  items: [
    {
      degree: 'B.Sc. in Computer Engineering',
      school: 'American International University – Bangladesh (AIUB)',
      period: '2014 – 2018',
    },
    {
      degree: 'H.S.C. in Science',
      school: 'Cambrian College',
      period: '2011 – 2013',
    },
    {
      degree: 'S.S.C. in Science',
      school: "Sher-e-Bangla Government Boys' High School & College",
      period: '2009 – 2011',
    },
  ],
};

export const certifications = {
  status: 'In Progress / Planned',
  items: [
    { name: 'EC-Council Certified Ethical Hacker', code: 'CEH', state: 'Planned' },
    { name: 'AWS Certified Solutions Architect – Associate', code: 'SAA-C03', state: 'Planned' },
    { name: 'AWS Certified DevOps Engineer – Professional', code: 'DOP-C02', state: 'Planned' },
    { name: 'Certified Kubernetes Administrator', code: 'CKA', state: 'Planned' },
  ],
};

export const awards = [
  {
    title: '1st Place — ACES Project & Thesis Poster Competition',
    date: 'April 2018',
    detail:
      'Real-Time Smart Traffic Management System — recognized as best project at the annual AIUB Computer Engineering symposium.',
  },
];

/** Primary navigation, in page order. `contact` is the separate CTA button. */
export const nav = [
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'approach', label: 'Approach' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
];
