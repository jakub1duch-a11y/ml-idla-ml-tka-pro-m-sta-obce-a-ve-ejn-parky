# Product and admin refresh — 4 October 2026

## Application and source

Base44 app: `6a3ee88c10959cd3588c4d68` (Mlžidla & mlžítka pro města, obce a veřejné parky).
Source: `jakub1duch-a11y/ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky`.

The authenticated Base44 MCP connection successfully updated and read back the short description, long description, SEO title and SEO description of 31 non-archived Product records. Archived duplicate records were preserved. Copy is written for customers, distinguishes the shapes and uses of the products, and removes internal visualization instructions and unsubstantiated promises of dry surfaces or guaranteed cooling.

## Website changes

- One homepage hero, using the existing BENDY photo-motion video and an illustrative-visualization label.
- Product cards before categories; the shared product overview defaults to a grid.
- One product-detail layout with the product's main image as header background, prominent name, inquiry CTA, sanitized long description, gallery, specifications, configuration, installation, smart control, FAQ and references.
- Mobile gallery uses a responsive grid, separates rendered concepts from product photos and supports explicit fullscreen viewing with keyboard controls and focus restoration.
- Reusable SUPLA presentation for homepage and detail: conditional features without universal hardware or telemetry claims.
- Dashboard shortcuts to products, media, inquiries, references, pages and integrations; catalog completeness checks, refresh and readable unavailable-analytics states.
- Admin product list includes variants independently of the public catalog filter. Product creation includes the required category. Failed saves preserve form content and display an error. Archive filter, search, refresh and 44px edit/delete targets.

The two earlier SUPLA JPG attachments were unavailable in this workspace. The SUPLA component uses the existing website visual, not those missing attachments.

## Verification

Production build succeeds. Targeted ESLint for changed source files succeeds. Existing repository-wide lint and TypeScript issues require separate maintenance; the latter includes diagnostics in GSAP dependencies. Browser checks use local mocked API responses, not production admin credentials. At 390px the homepage, catalog and product detail have no horizontal overflow; the image dialog opens and closes with Escape. Admin checks confirm that category is required, failed saves retain the form, and the dashboard product shortcut navigates to the correct tab. Existing browser console findings include a WebAssembly/CSP diagnostic and nested-link warnings outside these edits.

## Publishing and connection boundaries

The app's reported `git_remote_source` was `s3`, so current native GitHub synchronization is not verified. The Base44 source-file MCP bridge rejected access with `PREMIUM_REQUIRED` and requires Builder or above. A GitHub branch/PR is not proof that Mlzidla.cz has been deployed.

To publish this change, use the linked Base44 application's dashboard to connect/import the correct GitHub repository and publish the reviewed source. Verify the live product page, catalog and homepage afterwards. The runtime GitHub API connector is separate from source synchronization. Initiation was rejected because the app requires a paid plan with Connectors capability; no new GitHub connector was established.

Local frontend setup uses the existing Base44 SDK and Vite integration. Set the public app identifier and app base URL in ignored `.env.local`, as documented in README. Keep tokens and service-role credentials out of frontend code and git. No new public write endpoint or device-control integration is introduced.

## Architectural catalog, category and collection refresh

- Shared ArchitecturalHero uses editable Czech copy, separate imagery, an architectural frame, clear product/poptávka links and a mobile stacked layout. New 1600×900 WebP (226 KB) is explicitly labeled an illustrative architectural visualization; it contains no invented product geometry.
- Applied the hero to catalog/category filters, all collection pages, sloupková mlžítka, ateliérové prvky and mlžné brány. Category and collection product grids precede marketing sections.
- Reused CatalogProductCard across lists and removed duplicate collection card implementations. Restored the previously empty category overview. Replaced large pre-grid collection cards with an accessible select filter.
- Added catalog/collection load errors and retry, request cleanup on navigation, working anchor targets and 44px controls. Product media menu now sits outside the image link (no nested anchors).
- Product detail keeps its background image hero and gains section navigation. Hero rail, product description, product and category cards use restrained motion with reduced-motion support.
- Validation: targeted ESLint passed; production build passed (87 prerendered pages). Playwright with mocked public product API checked 390px catalog, filtered category, BENDY collection, city collection, both category landing pages, gates and BENDY detail; catalog/BENDY also checked at 1440px. One H1, hero images loaded, no horizontal overflow or nested links, collection grids present and CTA anchor targets valid. Final catalog filter/layout changes rechecked at both widths.
- Existing unrelated model-viewer WebAssembly CSP error remains. Direct Base44 source bridge is still blocked by PREMIUM_REQUIRED (Builder plan); GitHub source and Base44 built-in builder are separate delivery paths. Do not infer live publication from the PR or media registration.

## SVG smart-control section (2026-10-06)

- Added reusable SmartGardenSection with transparent 1200px WebP (124 KB), standalone transparent SVG line drawing and three accessible explanatory controls. Generated hardware is labeled illustrative; remote access and sensor functions are conditional on project configuration.
- Replaced the homepage smart block and automation-page benefit block with this component. The automation mobile navigation includes Ovládání, and its contextual link leads to the on-page flow rather than linking back to itself.
- Applied the same section to the earlier requested Outdoor page and shared product smart-control component, retaining installation illustrations.
- Preserved newer homepage edits from branch head 5ecc00fccd100c9c2c9fa65b0612befefdd85dc1. Only the smart block and its obsolete constants/imports are replaced.
- Validation: targeted ESLint and production build passed. Browser checks at 390 and 1440 pixels passed on / and /smart-ovladani with mocked public data: one section, SVG and cutout loaded, no horizontal overflow, control switching and keyboard activation work. Transparent alpha was checked in the generated PNG and WebP.
- Base44 direct source access is still PREMIUM_REQUIRED on 2026-10-06. Media registration and builder submission do not by themselves confirm a production release.
