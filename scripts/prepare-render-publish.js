// Render static-site compatibility step.
// The existing Render service is configured to publish the `mlzidla` directory,
// while the Vite/Base44 build correctly outputs production files into `dist`.
// Copy the final built site so Render can publish without changing app behavior.

import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const sourceDir = join(rootDir, 'dist');
const publishDir = join(rootDir, 'mlzidla');

if (!existsSync(sourceDir)) {
  throw new Error('[render-publish] dist directory does not exist after build.');
}

rmSync(publishDir, { recursive: true, force: true });
cpSync(sourceDir, publishDir, { recursive: true });

console.log('[render-publish] copied dist -> mlzidla for Render static-site publishing.');
