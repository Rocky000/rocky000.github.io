/**
 * DEPRECATED — unused in production.
 *
 * Partials are inlined into index.html by `node scripts/build-index.mjs`
 * so the site does not fetch /partials/*.html at runtime (CloFix/WAF-safe).
 *
 * Kept only as a reference of the old mount map.
 */

export async function loadPartials() {
  console.warn(
    '[load-partials] skipped: sections are already inlined in index.html. Run scripts/build-index.mjs after editing partials/.',
  );
}
