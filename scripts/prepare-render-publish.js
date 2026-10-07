// Publish the current build to both supported Render roots.
// This service currently has rootDir=src and publishPath=mlzidla, so it serves
// src/mlzidla. Keep the repository-root path for services with an empty rootDir.
// Generated files are excluded by .gitignore and eslint.config.js.
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(scriptDir, '..');
const sourceDir = join(projectRoot, 'dist');
const publishDirs = [join(projectRoot, 'mlzidla'), join(projectRoot, 'src', 'mlzidla')];

if (!existsSync(join(sourceDir, 'index.html'))) {
  throw new Error('[render-publish] dist/index.html is missing after build.');
}

for (const publishDir of publishDirs) {
  rmSync(publishDir, { recursive: true, force: true });
  cpSync(sourceDir, publishDir, { recursive: true });
}
console.log('[render-publish] copied current dist to mlzidla and src/mlzidla.');
