/**
 * ATS-friendly resume as a print-ready HTML document (pure template, no DOM).
 * scripts/build-resume.mjs prints it to PDF with headless Chrome.
 *
 * ATS rules followed: one column, standard section headings, real text only
 * (no images, icons, tables or text boxes), contact details in the body (not a
 * page header), plain separators, dates as "Mon YYYY – Mon YYYY".
 */
import { esc, fillYearsText } from './render.js';

/* Characters some ATS parsers mangle: arrows, Unicode minus, curly quotes. */
const plain = (text) =>
  String(text)
    .replace(/\s*→\s*/g, ' to ')
    .replace(/−/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"');
const t = (text) => esc(plain(text));
const list = (items, fn) => items.map(fn).join('');
const bare = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

export function renderResume(d) {
  const { profile, resume } = d;
  const social = (id) => d.socials.find((s) => s.id === id);
  const contact = [
    t(profile.location),
    `<a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>`,
    `<a href="tel:${esc(profile.phoneHref)}">${esc(profile.phone)}</a>`,
    ...['linkedin', 'github'].map(social).filter(Boolean).map((s) => `<a href="${esc(s.url)}">${esc(bare(s.url))}</a>`),
    '<a href="https://rockibul.info/">rockibul.info</a>',
  ].join(' | ');

  const projects = resume.projects.map((p) => {
    if (!p.case) return p;
    const c = d.caseStudies.find((x) => x.id === p.case);
    return { title: c.title, summary: c.summary, tags: c.stack };
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${t(profile.name)} — Resume</title>
<meta name="author" content="${t(profile.name)}">
<meta name="description" content="${t(profile.title)}">
<style>
  @page { size: Letter; margin: 0.55in 0.6in; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, "Liberation Sans", Helvetica, sans-serif; font-size: 10pt; line-height: 1.38; color: #000; }
  a { color: inherit; text-decoration: none; }
  header { text-align: center; margin-bottom: 10pt; }
  h1 { font-size: 19pt; letter-spacing: .02em; text-transform: uppercase; }
  .title { font-size: 11pt; font-weight: bold; margin-top: 2pt; }
  .contact { margin-top: 4pt; font-size: 9.5pt; }
  h2 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: .06em; border-bottom: 1px solid #000; padding-bottom: 2pt; margin: 12pt 0 6pt; break-after: avoid; }
  h3 { font-size: 10.5pt; break-after: avoid; }
  .meta { break-after: avoid; }
  ul { padding-left: 14pt; }
  li { margin: 2.5pt 0; }
  .skills p { margin: 2pt 0; }
  .job { margin-bottom: 8pt; }
  .job .meta { margin-bottom: 3pt; }
  .item { margin-bottom: 6pt; break-inside: avoid; }
  .tech { font-size: 9.5pt; }
</style>
</head>
<body>
<header>
  <h1>${t(profile.name)}</h1>
  <p class="title">${t(profile.title)}</p>
  <p class="contact">${contact}</p>
</header>

<section>
  <h2>Professional Summary</h2>
  <p>${t(fillYearsText(resume.summary, profile.careerStart))}</p>
</section>

<section class="skills">
  <h2>Technical Skills</h2>
  ${list(resume.skills, (s) => `<p><strong>${t(s.category)}:</strong> ${t(s.items.join(', '))}</p>`)}
</section>

<section>
  <h2>Professional Experience</h2>
  ${list(d.experience, (j) => `
  <div class="job">
    <h3>${t(j.role)}</h3>
    <p class="meta">${t(j.company)} | ${t(j.location)} | ${t(j.period)}</p>
    <ul>${list(j.bullets, (b) => `<li>${t(b)}</li>`)}</ul>
  </div>`)}
</section>

<section>
  <h2>Key Projects</h2>
  ${list(projects, (p) => `
  <div class="item">
    <h3>${t(p.title)}</h3>
    <p>${t(p.summary)}</p>
    <p class="tech"><strong>Technologies:</strong> ${t(p.tags.join(', '))}</p>
  </div>`)}
</section>

<section>
  <h2>Education</h2>
  ${list(resume.education, (e) => `
  <div class="item">
    <h3>${t(e.degree)}</h3>
    <p>${t(e.school)} | ${t(e.period)}</p>
  </div>`)}
</section>

<section>
  <h2>Certifications</h2>
  <ul>${list(resume.certifications, (c) => `<li>${t(c.name)} — ${t(c.state)}</li>`)}</ul>
</section>

<section>
  <h2>Honors &amp; Awards</h2>
  ${list(resume.awards, (a) => `
  <div class="item">
    <h3>${t(a.title)} | ${t(a.date)}</h3>
    <p>${t(a.detail)}</p>
  </div>`)}
</section>
</body>
</html>
`;
}
