# AGENTS.md

## Project Context

This is a Base44 app repository. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and publish workflow.

## MLŽIDLA × Superpowers — závazné workflow

- Před změnou architektury používat Superpowers: brainstorming → schválená specifikace → writing-plans → TDD → verification-before-completion → PR review.
- Vždy samostatná pracovní větev, bez merge do main bez náhledu a schválení správcem. Žádné neprověřené změny ostrých dat.
- Obchodní Google konektory musí prokazatelně používat `meduna@holmtec.cz`; nesprávný nebo neověřený účet zablokuje archivaci a synchronizaci.
- Veřejná nabídková cena pochází z `Kalkulace mlžítka 2026`, sloupec H dané varianty; partner/interní ceny jsou neveřejné a bez fallbacku do veřejného výstupu.
- Canva: originální editovatelná brand šablona a samostatný list SUPLA; přesná geometrie podle lidsky ověřeného MASTER pro konkrétní variantu.
- E-mail připravovat jako koncept ke kontrole, bez automatického odeslání.
- Dokud ChatGPT Sites neposkytne ověřené API, nepovažovat exportní nebo ruční import za živou synchronizaci.
- Pro přehled aktuálních blokací číst `docs/MLZIDLA_CANVA_SITES_INTEGRATION_STATUS.md`.

## Base44 References

- CLI overview: https://docs.base44.com/developers/references/cli/get-started/overview.md
- Agent skills: https://docs.base44.com/developers/backend/overview/skills.md

If your agent supports Agent Skills, install or update Base44 skills before Base44-specific work:

```bash
npx skills add base44/skills
```

## Key Files

- `src/`: frontend application source.
- `src/api/base44Client.js`: frontend Base44 SDK client.
- `vite.config.js`: Vite config and Base44 Vite plugin setup.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- Use `base44 dev` as the default local development command when you need the local Base44 backend. It can run the backend and frontend together.
- When docs or code mention the frontend being started automatically, that usually means the Base44 project config includes `site.serveCommand`, for example `"serveCommand": "npm run dev"` in `base44/config.jsonc`.
- Use `npm run dev` only for frontend-only work against the hosted Base44 backend.
- Prefer the existing Base44 CLI workflow over adding new npm scripts for Base44-specific tasks.
- Reuse the existing SDK client and Vite plugin patterns before adding new Base44 integration paths.
- **NON-NEGOTIABLE VISUAL QUALITY GATE:** Before any MLŽIDLA product visual, animated product, 3D, Canva offer, Google Stitch design handoff or ChatGPT Sites dashboard image is created or reused, read `docs/MLZIDLA_VERIFIED_PRODUCT_BRAND_WORKFLOW.md`. Use the exact product MASTER referenced by the Base44 admin record and approved MLŽNÝ DISK technical source. Never invent/bend/replace geometry, nozzles, profile, anchors or product family. A missing or unverified MASTER must block product-accurate image generation and client publication, not trigger a lookalike. Reuse the real on-site `MlzidlaLogoSvg`/brand assets; never AI-redraw the logo. Apply the same requirements to automated sync. Never approve or publish unreviewed AI product assets.
- Run the relevant checks from `package.json` before finishing code changes.
- Deployment policy for MLŽIDLA.cz: this repository is edited through the Base44 cloud sandbox. Completed Base44 code, UI, content, entity, workflow, or related production changes should be treated as publishable by default unless the user explicitly requests a draft/preview-only change.
- For any public MLŽIDLA.cz web-design, UX, navigation, hero, footer, product-presentation, Smart Cooling or motion-graphics work, read and apply `skills/mlzidla-scrollcraft-astra/SKILL.md` before editing. Prioritize readability, navigation clarity, mobile ergonomics and product truth before decorative motion.
- For Figma webdesign, animated sections, blur/focus transitions, scroll-triggered content, sliders, interactive media, 3D/Spline concepts, prototyping or Figma-to-Base44 conversion, also read and apply `skills/mlzidla-figma-motion-design/SKILL.md`.
- Keep both MLŽIDLA design skills synchronized for agent runtimes in `.claude/skills/`, `.agents/skills/` and `agent/skills/` whenever their rules change.
- In the Base44 cloud sandbox, do NOT run project-level `base44 deploy`, `site deploy`, entity push, function deploy, or similar CLI deployment commands. Sandbox writes auto-commit and the platform ships/syncs them automatically. After changes, run the production build and relevant targeted checks, allow the auto-commit to land, and create/verify a checkpoint when appropriate.
