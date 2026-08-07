/* ==========================================================================
   SINGLE EDIT POINT
   Everything the site displays is defined in this file.
   Change a value here and it updates everywhere it appears.
   ========================================================================== */

/* --------------------------------------------------------------------------
   SECTION HEADINGS
   `kicker` is the small label above the heading.
   `title` may contain <span class="accent">…</span> to apply the gradient.
   `note`  is the optional line under the heading.
   -------------------------------------------------------------------------- */
export const sections = {
  about: {
    kicker: 'About Me',
    title: 'Infrastructure that people<br><span class="accent">actually depend on</span>',
  },
  skills: {
    kicker: 'My Skills',
    title: 'The stack I <span class="accent">run in production</span>',
    note: 'Auto-advances. Drag sideways anytime to browse.',
  },
  experience: {
    kicker: 'My Experience',
    title: '7 years of <span class="accent">shipping and operating</span>',
    note: 'Auto-advances between roles. Scroll inside the card for the full list.',
  },
  projects: {
    kicker: 'My Selected Work',
    title: 'Things I built <span class="accent">end to end</span>',
    note: 'Auto-advances. Drag sideways anytime to browse.',
  },
  credentials: {
    kicker: 'My Credentials',
    title: 'Education, certifications <span class="accent">&amp; honors</span>',
    note: 'Auto-advances. Drag sideways anytime to browse.',
  },
  gallery: {
    kicker: 'Off the terminal',
    title: 'A little <span class="accent">outside the cloud</span>',
    note: 'Drag, scroll, or use the arrows to spin the carousel. Click a photo to enlarge.',
  },
  contact: {
    kicker: 'Contact Me',
    title: "Let's build something <span class=\"accent\">reliable</span>",
    note: 'Open to platform engineering, SRE, and cloud architecture conversations.',
  },
};

/* --------------------------------------------------------------------------
   DECK TUNING
   One card visible at a time. `default` applies to every deck; a named block
   overrides only the keys it lists.

   cardW / cardH  card size in pixels
   autoplayMs     pause before advancing to the next card (loops forever)
   -------------------------------------------------------------------------- */
export const deckSettings = {
  // One card at a time. autoplayMs is the pause before advancing (loop).
  default: { cardW: 420, cardH: 460, autoplayMs: 4500 },
  skills: { cardW: 340, cardH: 360, autoplayMs: 4000 },
  experience: { cardW: 640, cardH: 500, autoplayMs: 6000 },
  credentials: { cardW: 460, cardH: 440, autoplayMs: 5000 },
};

export const profile = {
  name: 'Md. Rockibul Islam Khan',
  shortName: 'Rockibul Islam Khan',
  title: 'Senior DevOps & Cloud Platform Engineer',
  location: 'Dhaka, Bangladesh',
  email: 'rockibul.islam20@gmail.com',
  phone: '+880 1551-806344',
  phoneHref: '+8801551806344',
  resume: 'assets/resume/Rockibul_Islam_Khan_Resume.docx',
  heroPhoto: 'assets/img/portrait-hero.jpg',
  aboutPhoto: 'assets/img/portrait-about.jpg',
  tagline: 'I build and operate the cloud infrastructure that keeps healthcare and restaurant SaaS platforms running.',
  summary:
    'Senior DevOps & Cloud Platform Engineer with 7+ years of experience building and operating business-critical infrastructure on AWS for healthcare and restaurant SaaS platforms. Beyond infrastructure, brings rare full-stack capability — having sole-owned the design, development, and production deployment of real-time systems (WebSocket/Webhook) and admin tooling for restaurant POS platforms. Deep expertise in Kubernetes (EKS), CI/CD automation (Jenkins, GitHub Actions), Infrastructure as Code (Terraform, Ansible), serverless architecture (AWS Lambda, EventBridge), and automated code quality pipelines (ESLint, SonarQube, CodeQL). Proven track record of driving cloud cost optimization, enforcing HIPAA compliance, and delivering systems that are live in production across 30+ restaurant brands.',
};

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
    handle: '@alvrocky',
    url: 'https://www.youtube.com/@alvrocky',
  },
];

export const stats = [
  { value: 7, suffix: '+', label: 'Years in DevOps' },
  { value: 30, suffix: '+', label: 'Restaurant brands served' },
  { value: 99.9, suffix: '%', label: 'Platform uptime', decimals: 1 },
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
    title: 'AWS EKS Platform Engineering',
    badge: '99.9% uptime',
    featured: false,
    summary:
      'Designed, deployed, and operate multi-cluster EKS environments hosting 20+ production applications. Achieved 99.9% availability through automated rollouts, pod disruption budgets, and cluster autoscaling.',
    tags: ['EKS', 'Kubernetes', 'Helm'],
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

export const education = {
  items: [
    {
      degree: 'B.Sc. in Computer Engineering',
      school: 'American International University – Bangladesh (AIUB)',
      period: '2014 – 2018',
    },
    {
      degree: 'HSC. in Science',
      school: 'Cambrian College',
      period: '2011 – 2013',
    },
    {
      degree: 'SSC. in Science',
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

// `ratio` is width / height, used to size the carousel planes correctly.
export const gallery = [
  {
    src: 'assets/img/fjord-bow.jpg',
    ratio: 4 / 3,
    caption: 'Norwegian fjords',
    alt: 'Standing at the bow of a boat cruising through the Norwegian fjords',
  },
  {
    src: 'assets/img/oslo-waterfront.jpg',
    ratio: 1,
    caption: 'Oslo waterfront',
    alt: 'Leaning on a railing at the Oslo harbour waterfront',
  },
  {
    src: 'assets/img/team-gokart.jpg',
    ratio: 4 / 3,
    caption: 'Team day out',
    alt: 'Go-karting with the engineering team',
  },
  {
    src: 'assets/img/sea-breeze.jpg',
    ratio: 4 / 3,
    caption: 'Open water',
    alt: 'On a boat with the open sea in the background',
  },
  {
    src: 'assets/img/oslo-night-square.jpg',
    ratio: 3 / 4,
    caption: 'Oslo after dark',
    alt: 'Standing in a city square in Oslo at night',
  },
  {
    src: 'assets/img/boat-deck.jpg',
    ratio: 4 / 3,
    caption: 'Deck days',
    alt: 'Relaxing in a deck chair on a boat',
  },
  {
    src: 'assets/img/oslo-street.jpg',
    ratio: 3 / 4,
    caption: 'City streets',
    alt: 'Leaning against a building on a quiet Oslo street',
  },
  {
    src: 'assets/img/train-window.jpg',
    ratio: 4 / 3,
    caption: 'Always on the move',
    alt: 'Reading on a phone next to a train window',
  },
  {
    src: 'assets/img/boat-relax.jpg',
    ratio: 4 / 3,
    caption: 'Slow afternoons',
    alt: 'Sitting back in a deck chair by the water',
  },
  {
    src: 'assets/img/lounge-armchair.jpg',
    ratio: 3 / 4,
    caption: 'Off the clock',
    alt: 'Sitting in an armchair holding a phone',
  },
  {
    src: 'assets/img/portrait-about.jpg',
    ratio: 4 / 3,
    caption: 'Somewhere green',
    alt: 'Sitting on a park bench surrounded by trees',
  },
  {
    src: 'assets/img/portrait-hero.jpg',
    ratio: 3 / 4,
    caption: 'Logic',
    alt: 'Portrait standing in front of a wall reading LOGIC',
  },
];

export const nav = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
];
