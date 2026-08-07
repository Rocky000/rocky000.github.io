/**
 * Loads HTML partials into the page shell.
 * Edit files under /partials/ — this file only wires them together.
 *
 * Mount map:
 *   #mount-chrome  → icons + nav + social rail
 *   #mount-main    → page sections (hero … contact)
 *   #mount-end     → footer
 */

const PARTIALS = {
  chrome: ['icons.html', 'nav.html'],
  main: [
    'hero.html',
    'about.html',
    'skills.html',
    'experience.html',
    'projects.html',
    'credentials.html',
    'contact.html',
  ],
  end: ['footer.html'],
};

async function fetchPartial(name) {
  // Bust browser HTTP cache so local edits to partials always show up.
  const res = await fetch(`partials/${name}?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load partials/${name} (${res.status})`);
  return res.text();
}

async function inject(mountSelector, files) {
  const mount = document.querySelector(mountSelector);
  if (!mount) throw new Error(`Mount point missing: ${mountSelector}`);
  const chunks = await Promise.all(files.map(fetchPartial));
  mount.insertAdjacentHTML('beforebegin', chunks.join('\n'));
  mount.remove();
}

export async function loadPartials() {
  await Promise.all([
    inject('#mount-chrome', PARTIALS.chrome),
    inject('#mount-main', PARTIALS.main),
    inject('#mount-end', PARTIALS.end),
  ]);
}
