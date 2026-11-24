// Fail the production build if the public React entry can fail at startup.
// Vite transpiles JSX but does not report an undefined React namespace.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const app = read('src/App.jsx');
const entry = read('src/main.jsx');
const auth = read('src/lib/AuthContext.jsx');
const boundary = read('src/components/common/AppErrorBoundary.jsx');
const failures = [];

const usesReactNamespace = /\\bReact\\.(?:lazy|Suspense)\\b/.test(app);
const importsReactNamespace = /\\bimport\\s+(?:React\\b|\\*\\s+as\\s+React\\b)[^\\n]*\\bfrom\\s*['\"]react['\"]/.test(app);
if (usesReactNamespace && !importsReactNamespace) {
  failures.push('src/App.jsx uses React.lazy/Suspense without importing React.');
}
if (!entry.includes('<AppErrorBoundary>') || !entry.includes('</AppErrorBoundary>')) {
  failures.push('The app entry is missing its user-visible error boundary.');
}
if (!auth.includes('withDeadline(') || !auth.includes('setIsLoadingAuth(false)')) {
  failures.push('Authentication startup needs both a timeout and a loading fallback.');
}
if (!boundary.includes('window.location.reload()') || !boundary.includes('role="alert"')) {
  failures.push('The error fallback needs an accessible retry button.');
}
if (failures.length) {
  failures.forEach((message) => console.error('[startup-check] ' + message));
  process.exitCode = 1;
} else {
  console.log('[startup-check] React import, auth timeout, and error fallback verified.');
}
