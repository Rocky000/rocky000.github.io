#!/usr/bin/env node
/**
 * Generates the ATS resume PDF from js/data.js (same content as the site).
 *
 *   js/data.js     profile, socials, experience[].bullets, caseStudies, resume
 *   js/resume.js   print-ready HTML template
 *
 * Prints with headless Chrome (no npm packages). Set CHROME_PATH if Chrome or
 * Chromium isn't on PATH. Output: resume.pdf in js/data.js (default
 * assets/resume/Rockibul_Islam_Khan_Resume_ATS.pdf).
 *
 * Usage: node scripts/build-resume.mjs [--html]   (--html also keeps the HTML next to the PDF for review)
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = await import(pathToFileURL(join(root, 'js', 'data.js')).href);
const { renderResume } = await import(pathToFileURL(join(root, 'js', 'resume.js')).href);

const CANDIDATES = [
  process.env.CHROME_PATH,
  'google-chrome',
  'google-chrome-stable',
  'chromium',
  'chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
const chrome = CANDIDATES.find((cmd) => spawnSync(cmd, ['--version'], { stdio: 'ignore' }).status === 0);
if (!chrome) throw new Error('Chrome/Chromium not found. Install it or set CHROME_PATH.');

const out = join(root, data.resume.pdf);
const work = mkdtempSync(join(tmpdir(), 'resume-'));
const htmlFile = join(work, 'resume.html');
const html = renderResume(data);
writeFileSync(htmlFile, html);
if (process.argv.includes('--html')) writeFileSync(out.replace(/\.pdf$/, '.html'), html);

try {
  const run = spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    `--user-data-dir=${join(work, 'profile')}`,
    '--no-pdf-header-footer',
    '--export-tagged-pdf',
    '--generate-pdf-document-outline',
    `--print-to-pdf=${out}`,
    pathToFileURL(htmlFile).href,
  ], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 60_000 });
  if (run.status !== 0 || !existsSync(out)) {
    throw new Error(`Chrome failed to print the PDF:\n${run.stderr?.toString() || run.error || ''}`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

console.log(`Wrote ${data.resume.pdf} (${(statSync(out).size / 1024).toFixed(1)} KB)`);
