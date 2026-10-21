# React framework evaluation for MLŽIDLA.cz

Source list: https://github.com/jakub1duch-a11y/awesome-react-frameworks (checked 2026-10-18).

## Decision

Keep the current **React + Vite + Base44 SDK** application architecture. The linked repository is a curated list of frameworks, not a framework implementation or an npm package to copy into the application. Installing another framework blindly would duplicate routing/build responsibilities and could break Base44 integration, current publishing scripts, product pages, and SEO prerendering.

## Options from the source list

- **Next.js** — consider only if a planned migration requires a unified server-rendering/full-stack architecture and Base44 compatibility has been proven.
- **React Router / Remix** — this project already uses `react-router-dom`; evaluate its current routing capabilities before introducing another routing layer.
- **Astro** — potentially relevant for a content-heavy marketing site, but a migration is not justified by a list alone and would need a route/content migration plan.
- **Gatsby, Redwood, Vike, vite-ssr-boost, after.js** — alternatives to evaluate against a concrete requirement, not dependencies to install together.
- **TanStack Start, Waku, RakkasJS** — the source labels these experimental; do not use in the production path without a separate proof of concept.

## Deployment guard

Run `npm run framework:check` before build/deploy. It verifies required React, Vite, and Base44 dependencies are present and flags competing framework dependencies for review. It does not claim to test runtime behavior or replace a full production build.
