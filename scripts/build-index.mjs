#!/usr/bin/env node
/**
 * Assembles index.html from partials/*.html so production does not fetch
 * partials at runtime (avoids CloFix/WAF HTTP/2 bursts).
 *
 * Source of truth for section markup: partials/
 * Generated output: index.html
 *
 * Usage: node scripts/build-index.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const partial = (name) => readFileSync(join(root, 'partials', name), 'utf8').trim();

const CHROME = ['icons.html', 'nav.html'];
const MAIN = [
  'hero.html',
  'about.html',
  'skills.html',
  'experience.html',
  'projects.html',
  'credentials.html',
  'contact.html',
];
const END = ['footer.html'];

const joinPartials = (names) => names.map(partial).join('\n\n');

// Keep in sync with js/data.js → siteRevision
const siteRevision = (() => {
  const data = readFileSync(join(root, 'js', 'data.js'), 'utf8');
  const m = data.match(/export const siteRevision = '([^']+)'/);
  if (!m) throw new Error('siteRevision not found in js/data.js');
  return m[1];
})();

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Md. Rockibul Islam Khan — Senior DevOps &amp; Cloud Platform Engineer</title>
<meta name="description" content="Senior DevOps &amp; Cloud Platform Engineer with 7+ years building and operating business-critical AWS infrastructure — Kubernetes (EKS), Jenkins, Terraform, and real-time full-stack systems live across 30+ restaurant brands.">
<meta name="author" content="Md. Rockibul Islam Khan">
<meta name="keywords" content="Md. Rockibul Islam Khan, Rockibul, Senior DevOps Engineer, Cloud Platform Engineer, AWS, Kubernetes, EKS, Jenkins, Terraform, CI/CD, SRE, Infrastructure as Code, Dhaka, Bangladesh">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#04060d">

<link rel="canonical" href="https://rockibul.info/">
<link rel="sitemap" type="application/xml" title="Sitemap" href="https://rockibul.info/sitemap.xml">

<meta property="og:type" content="website">
<meta property="og:site_name" content="Md. Rockibul Islam Khan">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="https://rockibul.info/">
<meta property="og:title" content="Md. Rockibul Islam Khan — Senior DevOps &amp; Cloud Platform Engineer">
<meta property="og:description" content="7+ years building and operating business-critical AWS infrastructure. Kubernetes, CI/CD, Terraform, and real-time full-stack systems in production.">
<meta property="og:image" content="https://rockibul.info/assets/img/portrait-hero.jpg">
<meta property="og:image:alt" content="Portrait of Md. Rockibul Islam Khan">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Md. Rockibul Islam Khan — Senior DevOps &amp; Cloud Platform Engineer">
<meta name="twitter:description" content="7+ years building and operating business-critical AWS infrastructure. Kubernetes, CI/CD, Terraform, and real-time full-stack systems in production.">
<meta name="twitter:image" content="https://rockibul.info/assets/img/portrait-hero.jpg">

<link rel="icon" type="image/png" href="assets/img/favicon.png?v=${siteRevision}">
<link rel="apple-touch-icon" href="assets/img/myLogo.png?v=${siteRevision}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Syne:wght@500;600;700;800&display=swap" rel="stylesheet">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.css">
<link rel="stylesheet" href="css/style.css?v=${siteRevision}">

<style>
  /* Critical: cover empty shells before style.css / JS finish loading */
  .boot-splash {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: grid;
    place-items: center;
    background: #04060d;
  }
  .boot-splash__inner {
    display: grid;
    justify-items: center;
    gap: 1rem;
  }
  .boot-splash__logo {
    width: 112px;
    height: 112px;
    object-fit: contain;
  }
  .boot-splash__name {
    margin: 0;
    font-family: Syne, ui-sans-serif, system-ui, sans-serif;
    font-size: 0.82rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #9aa5bd;
    text-align: center;
  }
  @media (prefers-reduced-motion: no-preference) {
    .boot-splash__logo {
      animation: boot-pulse 1.6s ease-in-out infinite;
    }
  }
  @keyframes boot-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.06); opacity: 0.88; }
  }
</style>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://rockibul.info/#website",
      "url": "https://rockibul.info/",
      "name": "Md. Rockibul Islam Khan",
      "description": "Senior DevOps & Cloud Platform Engineer with 7+ years building and operating business-critical AWS infrastructure.",
      "inLanguage": "en",
      "publisher": { "@id": "https://rockibul.info/#person" }
    },
    {
      "@type": "Person",
      "@id": "https://rockibul.info/#person",
      "name": "Md. Rockibul Islam Khan",
      "url": "https://rockibul.info/",
      "image": "https://rockibul.info/assets/img/portrait-hero.jpg",
      "jobTitle": "Senior DevOps & Cloud Platform Engineer",
      "email": "mailto:rockibul.islam20@gmail.com",
      "telephone": "+880-1551-806344",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dhaka",
        "addressCountry": "BD"
      },
      "sameAs": [
        "https://www.linkedin.com/in/rocky7139",
        "https://github.com/rocky000",
        "https://www.facebook.com/rockibulislamkhan",
        "https://www.youtube.com/@rockibulislamkhan"
      ]
    },
    {
      "@type": "ProfilePage",
      "@id": "https://rockibul.info/#profilepage",
      "url": "https://rockibul.info/",
      "name": "Md. Rockibul Islam Khan — Senior DevOps & Cloud Platform Engineer",
      "isPartOf": { "@id": "https://rockibul.info/#website" },
      "mainEntity": { "@id": "https://rockibul.info/#person" },
      "about": { "@id": "https://rockibul.info/#person" }
    }
  ]
}
</script>

<script type="importmap">
{
  "imports": {
    "gsap": "https://cdn.jsdelivr.net/npm/gsap@3.12.7/+esm",
    "gsap/ScrollTrigger": "https://cdn.jsdelivr.net/npm/gsap@3.12.7/ScrollTrigger.js/+esm",
    "lenis": "https://cdn.jsdelivr.net/npm/lenis@1.1.20/+esm"
  }
}
</script>
</head>
<body>

<!--
  Generated by scripts/build-index.mjs — do not edit section markup here.
  Edit files under partials/, then run: node scripts/build-index.mjs
-->

<div class="boot-splash" id="bootSplash" role="status" aria-live="polite" aria-label="Loading">
  <div class="boot-splash__inner">
    <img class="boot-splash__logo" src="assets/img/myLogo.png?v=${siteRevision}" alt="" width="112" height="112">
    <p class="boot-splash__name">Rockibul Islam Khan</p>
  </div>
</div>

${joinPartials(CHROME)}

<main>
${joinPartials(MAIN)}
</main>

${joinPartials(END)}

<script type="module">
  // siteRevision must match js/data.js → siteRevision (bump both on content deploys).
  const siteRevision = '${siteRevision}';
  import(\`./js/main.js?v=\${siteRevision}\`);
</script>
</body>
</html>
`;

writeFileSync(join(root, 'index.html'), html);
console.log(`Wrote index.html (siteRevision=${siteRevision})`);
