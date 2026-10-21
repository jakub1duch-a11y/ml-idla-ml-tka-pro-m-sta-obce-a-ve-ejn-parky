# Awesome React Frameworks — MLŽIDLA.cz engineering reference

Upstream source: https://github.com/jakub1duch-a11y/awesome-react-frameworks/tree/main

This repository is a curated list of React server-rendering and application frameworks, not an installable framework package. Its entries are recorded here for technical evaluation; they are not all installed in the MLŽIDLA.cz runtime.

## Listed frameworks

- [Next.js](https://nextjs.org) — React framework.
- [Remix / React Router](https://remix.run) — web fundamentals and declarative routing; the upstream list notes the relationship with React Router v7.
- [Astro](https://astro.build) — framework for content-driven websites.
- [Gatsby](https://www.gatsbyjs.com) — framework with performance, scalability and security features.
- [Redwood](https://redwoodjs.com) — application framework for startups.
- [Vike](https://vike.dev) — flexible Vite-based framework.
- [vite-ssr-boost](https://github.com/Lomray-Software/vite-ssr-boost) — Vite-based SSR/SPA approach using React and React Router.
- [after.js](https://github.com/jaredpalmer/after.js) — Next.js-like server-rendered React framework using React Router.

## Experimental entries in the upstream list

- [Waku](https://github.com/dai-shi/waku) — minimal React framework.
- [TanStack Start](https://tanstack.com/start/latest) — full-stack React framework powered by TanStack Router.
- [RakkasJS](https://github.com/rakkasjs/rakkasjs) — experimental Vite-powered React framework.

## MLŽIDLA.cz integration decision

The current application already uses React 18, Vite, and React Router 7. Therefore, importing this list does not justify replacing the existing application framework or adding a second framework at runtime. Keep the current stack unless a measured requirement calls for a migration. Prioritize low-risk improvements within the existing stack: route-level code splitting, image/media optimization, accessible UI, SEO/prerender verification, and build checks.

Before adopting any listed framework, verify its current maintenance status, compatibility with Base44, deployment requirements, and impact on existing product pages and lead-generation flows. Experimental frameworks should not be introduced into the production runtime without a separate proof of concept and rollback plan.
