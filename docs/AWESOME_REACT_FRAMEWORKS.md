# Awesome React Frameworks — reference for MLŽIDLA.cz

Zdrojový repozitář: https://github.com/jakub1duch-a11y/awesome-react-frameworks/tree/main

Tento soubor uchovává obsah seznamu frameworků přímo v kódu MLŽIDLA.cz, aby byla reference dostupná i bez otevírání GitHubu. Jde o katalog odkazů a autorských popisů, nikoli o aplikaci nebo balíček, který by se instaloval přes npm.

## Main list

- [Next.js](https://nextjs.org) — "The React Framework."
- [Remix](https://remix.run) — "Build Better Websites. Create modern, resilient user experiences with web fundamentals" using "Declarative routing for React" (Powered by [React Router](https://reactrouter.com/), and [identical](https://remix.run/blog/merging-remix-and-react-router) to it in Remix v3 aka. React Router v7).
- [Astro](https://astro.build) — "The web framework for content-driven websites."
- [Gatsby](https://www.gatsbyjs.com) — "Framework with performance, scalability and security built in."
- [Redwood](https://redwoodjs.com) — "The App Framework for Startups."
- [Vike](https://vike.dev) — "Fast Vite-based framework that is flexible, lean, community-driven, and dependable."
- [vite-ssr-boost](https://github.com/Lomray-Software/vite-ssr-boost) — "Super easy framework based on Vite for create awesome SSR or SPA applications on React and React Router."
- [after.js](https://github.com/jaredpalmer/after.js) — "Next.js-like framework for server-rendered React apps built with React Router"

## Experimental in the upstream repository

- [Waku](https://github.com/dai-shi/waku) — "The minimal React framework."
- [TanStack Start](https://tanstack.com/start/latest) — "Full-stack React framework powered by TanStack Router."
- [RakkasJS](https://github.com/rakkasjs/rakkasjs) — "Bleeding-edge React framework powered by Vite."

## Decision for the current MLŽIDLA app

The current app is already based on Vite, React, React Router and the Base44 Vite plugin. This reference alone does not justify replacing that runtime or adding multiple SSR frameworks as dependencies. A framework migration would need a separate, evidence-based plan and validation of Base44 SDK/auth, routes, content, form flows, SEO/prerender, assets, build and publishing.

Recommended action now: keep the existing runtime and use this catalog as an internal evaluation reference. Do not load these frameworks all together into production dependencies.

## Upstream contribution notes

The upstream repository describes itself as a list of React frameworks that can do SSR; it excludes SSG-only frameworks. The list order and descriptions follow its maintainers' contribution guidelines. Check each framework's current documentation and maintenance status before selecting it for a production migration.
