#!/usr/bin/env node
/**
 * Builds index.html: a fully prerendered page with no runtime data fetch.
 *
 *   partials/page.html     body layout with <!-- render:x --> and <!-- partial:file --> slots
 *   js/data.js             all content (single edit point)
 *   js/render.js           pure templates that turn data into markup
 *
 * Every local asset URL (assets/, css/, js/) gets ?v=<content-hash>, so
 * caches can hold files forever while each deploy still picks up changes.
 * One request chain (HTML -> CSS + one font + one deferred module) also keeps
 * the page clear of CloFix/WAF HTTP/2 burst limits.
 *
 * Usage: node scripts/build-index.mjs
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');

const data = await import(pathToFileURL(join(root, 'js', 'data.js')).href);
const { regions } = await import(pathToFileURL(join(root, 'js', 'render.js')).href);

const SITE = 'https://rockibul.info/';
const TITLE = 'Md. Rockibul Islam Khan — Senior DevOps &amp; Cloud Platform Engineer';
const DESCRIPTION =
  'Senior DevOps &amp; Cloud Platform Engineer keeping healthcare and restaurant SaaS on AWS up, fast and affordable — 7 years of EKS, Terraform and CI/CD in production, 99.95% availability, 30+ restaurant brands.';
const SOCIAL_DESCRIPTION =
  '7 years running EKS, Terraform and CI/CD in production — from a HIPAA-regulated healthcare platform to real-time POS systems across 30+ restaurant brands.';

const body = read('partials/page.html')
  .replace(/<!-- partial:([\w.-]+) -->/g, (_, file) => read(`partials/${file}`).trim())
  .replace(/<!-- render:(\w+) -->/g, (_, name) => {
    if (!regions[name]) throw new Error(`Unknown render slot: ${name}`);
    return regions[name](data).trim();
  });

const sameAs = data.socials.map((s) => `        "${s.url}"`).join(',\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${TITLE}</title>
<meta name="description" content="${DESCRIPTION}">
<meta name="author" content="${data.profile.name}">
<meta name="keywords" content="Md. Rockibul Islam Khan, Rockibul, Senior DevOps Engineer, Cloud Platform Engineer, AWS, Kubernetes, EKS, Jenkins, Terraform, CI/CD, SRE, Infrastructure as Code, Dhaka, Bangladesh">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#07080c">
<meta name="color-scheme" content="dark">

<link rel="canonical" href="${SITE}">
<link rel="sitemap" type="application/xml" title="Sitemap" href="${SITE}sitemap.xml">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${data.profile.name}">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="${SITE}">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${SOCIAL_DESCRIPTION}">
<meta property="og:image" content="${SITE}assets/img/portrait-hero.jpg">
<meta property="og:image:alt" content="Portrait of ${data.profile.name}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${TITLE}">
<meta name="twitter:description" content="${SOCIAL_DESCRIPTION}">
<meta name="twitter:image" content="${SITE}assets/img/portrait-hero.jpg">

<link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon-32.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">

<link rel="preload" href="assets/fonts/syne-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>
  @font-face { font-family: Syne; src: url("assets/fonts/syne-latin.woff2") format("woff2"); font-weight: 700 800; font-style: normal; font-display: swap; }
  @font-face { font-family: "DM Sans"; src: url("assets/fonts/dm-sans-latin.woff2") format("woff2"); font-weight: 400 600; font-style: normal; font-display: swap; }
</style>
<link rel="stylesheet" href="css/style.css">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "${SITE}#website",
      "url": "${SITE}",
      "name": "${data.profile.name}",
      "description": "Senior DevOps & Cloud Platform Engineer with 7+ years building and operating business-critical AWS infrastructure.",
      "inLanguage": "en",
      "publisher": { "@id": "${SITE}#person" }
    },
    {
      "@type": "Person",
      "@id": "${SITE}#person",
      "name": "${data.profile.name}",
      "url": "${SITE}",
      "image": "${SITE}assets/img/portrait-hero.jpg",
      "jobTitle": "${data.profile.title}",
      "email": "mailto:${data.profile.email}",
      "telephone": "+880-1551-806344",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dhaka",
        "addressCountry": "BD"
      },
      "sameAs": [
${sameAs}
      ]
    },
    {
      "@type": "ProfilePage",
      "@id": "${SITE}#profilepage",
      "url": "${SITE}",
      "name": "${data.profile.name} — ${data.profile.title}",
      "isPartOf": { "@id": "${SITE}#website" },
      "mainEntity": { "@id": "${SITE}#person" },
      "about": { "@id": "${SITE}#person" }
    }
  ]
}
</script>

<script type="module" src="js/main.js"></script>
</head>
<body>

<!--
  Generated by scripts/build-index.mjs — do not edit this file.
  Content: js/data.js · Templates: js/render.js · Layout: partials/page.html
-->

${body}
</body>
</html>
`;

const hashes = new Map();
const hashOf = (rel) => {
  if (!hashes.has(rel)) {
    const file = join(root, rel);
    if (!existsSync(file)) throw new Error(`Referenced asset is missing: ${rel}`);
    hashes.set(rel, createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 10));
  }
  return hashes.get(rel);
};

// Stamp relative asset URLs only (absolute og:image etc. are preceded by "/").
const stamped = html.replace(
  /(?<![\w/.-])((?:assets|css|js)\/[\w./-]+\.(?:css|js|woff2|png|jpe?g|avif|svg|pdf))(?![\w?])/g,
  (path) => `${path}?v=${hashOf(path)}`,
);

writeFileSync(join(root, 'index.html'), stamped);
console.log(`Wrote index.html (${(Buffer.byteLength(stamped) / 1024).toFixed(1)} KB, ${hashes.size} hashed assets)`);
