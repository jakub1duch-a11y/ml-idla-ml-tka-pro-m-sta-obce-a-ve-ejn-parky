import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const all = { ...pkg.dependencies, ...pkg.devDependencies };
const required = ['react', 'react-dom', 'vite', '@base44/sdk', '@base44/vite-plugin'];
const missing = required.filter((name) => !all[name]);
if (missing.length) {
  console.error(`[framework-check] Missing required Base44/Vite dependencies: ${missing.join(', ')}`);
  process.exit(1);
}

// The linked repository is a curated list, not an installable framework package.
// Keep the existing Base44 + React + Vite architecture unless a deliberate migration is approved.
const incompatibleFrameworks = ['next', 'gatsby', '@redwoodjs/core', 'vike'];
const installedAlternatives = incompatibleFrameworks.filter((name) => all[name]);
if (installedAlternatives.length) {
  console.error(`[framework-check] Review alternative framework dependencies before deployment: ${installedAlternatives.join(', ')}`);
  process.exit(1);
}

console.log('[framework-check] OK — React + Vite + Base44 dependencies are present; no competing SSR framework detected.');
