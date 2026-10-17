/**
 * Renders the app icons from the Body Do mark. Run it after changing the
 * mark: `node scripts/build-icons.ts`. The PNGs are committed.
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import sharp from 'sharp';

const out = join(import.meta.dirname, '..', 'public', 'icons');
mkdirSync(out, { recursive: true });

const ACCENT = '#ff2a40';
const INK = '#ffffff';

/** The mark on a 30 × 30 grid: a vertical dumbbell. */
const lines = `
  <rect x="11.85" y="5" width="6.3" height="1.6" rx="0.5" fill="${INK}"/>
  <rect x="14.59" y="7.4" width="0.82" height="9.8" fill="${INK}"/>
  <rect x="8.9" y="18" width="12.2" height="1.6" rx="0.4" fill="${INK}"/>
  <rect x="7.68" y="20.5" width="14.65" height="1.6" rx="0.4" fill="${INK}"/>
  <rect x="6.05" y="23" width="17.9" height="1.6" rx="0.4" fill="${INK}"/>`;

/** Rounded square, as used in the browser tab and on home screens that do not mask. */
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><rect width="30" height="30" rx="9" fill="${ACCENT}"/>${lines}</svg>`;

/** Full-bleed square with the mark inside the safe zone, for platforms that apply their own mask. */
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><rect width="30" height="30" fill="${ACCENT}"/><g transform="translate(15 15) scale(0.72) translate(-15 -15)">${lines}</g></svg>`;

const icons: [name: string, svg: string, size: number][] = [
  ['icon-192.png', rounded, 192],
  ['icon-512.png', rounded, 512],
  ['maskable-512.png', maskable, 512],
  ['apple-touch-icon.png', maskable, 180],
];

for (const [name, svg, size] of icons) {
  await sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toFile(join(out, name));
  console.log(`+ public/icons/${name}`);
}
