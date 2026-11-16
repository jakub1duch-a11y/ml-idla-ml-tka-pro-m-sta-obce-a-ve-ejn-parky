#!/usr/bin/env node
/**
 * Browser smoke test of the real hydrated React app, not just HTTP 200.
 * Read-only: never submits forms, signs in, or sends e-mail.
 *
 * node scripts/smoke-public-web.mjs http://127.0.0.1:4173
 * node scripts/smoke-public-web.mjs https://mlzidla.cz
 */
import { chromium } from 'playwright';

const origin = String(process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '');
if (!/^https?:\/\/[^/]+$/.test(origin)) {
  console.error('Specify a base URL without a path, e.g. https://mlzidla.cz');
  process.exit(2);
}
const routes = ['/', '/katalog-mlzitek', '/kontakt'];
const profiles = [
  { label: 'desktop', viewport: { width: 1365, height: 900 }, isMobile: false },
  { label: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true },
];
let browser;
const failures = [];
try {
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  for (const profile of profiles) {
    const context = await browser.newContext({
      viewport: profile.viewport, isMobile: profile.isMobile,
      hasTouch: profile.isMobile, reducedMotion: 'reduce',
      serviceWorkers: 'block',
    });
    for (const route of routes) {
      const page = await context.newPage();
      const clientErrors = [];
      page.on('pageerror', error => clientErrors.push(error.message.slice(0, 300)));
      const url = origin + route;
      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        if (!response || response.status() >= 400) throw new Error('HTTP ' + response?.status());
        await page.waitForFunction(() => {
          const root = document.getElementById('root');
          if (!root) return false;
          const heading = root.querySelector('h1');
          const error = root.querySelector('[role="alert"]');
          if (error && /stránku se nepodařilo zobrazit/i.test(error.textContent || '')) return false;
          return Boolean(heading && (heading.textContent || '').trim().length >= 5);
        }, null, { timeout: 22000 });
        await page.waitForTimeout(1400);
        const check = await page.evaluate(() => {
          const root = document.getElementById('root');
          const heading = root?.querySelector('h1');
          const body = root?.innerText || '';
          return {
            h1: (heading?.textContent || '').trim().slice(0, 100),
            bodyLength: body.length,
            visibleSpinner: [...document.querySelectorAll('[role="status"]')].some(el =>
              /načítání/i.test(el.textContent || '') &&
              getComputedStyle(el).visibility !== 'hidden' &&
              el.getClientRects().length > 0 &&
              el.closest('.fixed.inset-0')
            ),
          };
        });
        if (check.bodyLength < 90) throw new Error('Content is unexpectedly empty');
        if (check.visibleSpinner) throw new Error('Loading overlay is still visible');
        if (clientErrors.length) throw new Error('Browser JS error: ' + clientErrors.join(' | '));
        console.log('PASS', profile.label, route, JSON.stringify(check));
      } catch (error) {
        failures.push({ profile: profile.label, route, error: error.message, clientErrors });
        console.error('FAIL', profile.label, route, error.message);
      } finally {
        await page.close();
      }
    }
    await context.close();
  }
} catch (error) {
  failures.push({ error: error.message });
  console.error('BROWSER FAILED', error.message);
} finally {
  if (browser) await browser.close();
}
if (failures.length) {
  console.error(JSON.stringify({ outcome: 'FAILED', origin, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ outcome: 'PASSED', origin, checkedRoutes: routes.length * profiles.length }));
