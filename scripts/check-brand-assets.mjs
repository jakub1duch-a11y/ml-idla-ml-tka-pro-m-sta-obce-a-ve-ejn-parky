import { readFileSync, existsSync } from 'node:fs';

const base = 'public/brand/official-2026/';
const manifest = JSON.parse(readFileSync(base + 'manifest.json', 'utf8'));
const files = Object.values(manifest.assets);
if (files.length < 10) throw new Error('Incomplete logo set');
for (const name of files) {
  const path = base + name;
  if (!existsSync(path)) throw new Error('Missing brand asset: ' + path);
  const svg = readFileSync(path, 'utf8');
  if (!svg.includes('<svg ') || !svg.includes('viewBox=')) throw new Error('Invalid SVG: ' + path);
  if (/<script\b|<foreignObject\b|javascript:/i.test(svg)) throw new Error('Unsafe SVG: ' + path);
}
const css = readFileSync('src/styles/brand-logo-system.css', 'utf8');
const index = readFileSync('index.html', 'utf8');
const component = readFileSync('src/components/brand/MlzidlaLogoSvg.jsx', 'utf8');
for (const key of ['logo-primary.svg', 'logo-inverse.svg', 'logo-mono.svg']) {
  if (!css.includes('/brand/official-2026/' + key)) throw new Error('CSS logo reference missing: ' + key);
}
if (!index.includes('/brand/official-2026/favicon.svg')) throw new Error('Favicon link missing');
if (!component.includes('M0 100V52') || !component.includes('M60 46c')) throw new Error('Web logo symbol differs from approved geometry');
console.log('MLŽIDLA brand assets OK: ' + files.length + ' SVG variants');
