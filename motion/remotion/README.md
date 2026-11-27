# MLŽIDLA × HolmTec — motion production

Source: ProductionHero.tsx (8 seconds, 1920 × 1080, 30 fps). Diagram only; no actual machine footage or manufacturing geometry. Do not label stock as own workshop.

## Workflow
- Canva brand kit kAHbjw1iRlU; web manual R05: https://www.canva.com/d/UB0xGhG1_ZUTRlc
- Existing production/reference design: https://www.canva.com/d/serrBItga6mEEa2 — inspect individual assets and rights before extraction.
- For Remotion create a blank project; copy ProductionHero.tsx to src/Composition.tsx, keep root importing MyComposition. Use Remotion 4.0.547 (CLI and runtime same version). Run npx tsc --noEmit, then npx remotion render ProductionHero out/production-hero.mp4. Confirm render before publishing.
- Export MP4 H.264 and WebM, poster WebP; mobile crop 9:16 must be composed independently. Use muted inline playback, pause offscreen, respect reduced motion and save-data. No remote API credentials in client code.
- Existing Home2026 hero uses HeroMediaSlider and Base44 Realizace; do not override genuine realization videos with schematic film. Use a separate manufacturing scene after editorial content, enabled only following rights and preview validation.
- GSAP ScrollTrigger in HomeHolmTec draws a schematic tube, with independent reduced-motion fallback and cleanup. No scroll hijacking. Keep headings and buttons real HTML; only decorations animate. Use existing font-heading token and verify Czech diacritics. No exact visual copy of GSAP demo.
- Scene order: raw stainless tube / CNC bending (only when actual process footage and equipment are confirmed) / surface and welding detail / finished mlžítko / mist in situ. Filming: close-ups, stable motion, neutral steel, turquoise accents; never fabricate specific product dimensions or certification.
- Publish only from tested PR, Base44 for MLŽIDLA; Vercel reserved for HolmTec. Canva API/MCP remains authoring source; not a direct production runtime connector.
