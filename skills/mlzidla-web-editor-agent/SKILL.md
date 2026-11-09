---
name: mlzidla-web-editor-agent
description: Bezpečné návrhy hero sekcí, produktových stránek, novinek, Markdown blogu a marketingových podkladů na Mlžidla.cz s PR/preview kontrolou.
---

# MLŽIDLA.cz — webový editor AI

## Source of truth
Nejdříve čti `AGENTS.md`, `README.md`, `docs/MLZIDLA_SOCIAL_AGENT.md`, `docs/MLZIDLA_OFFER_WORKFLOW.md`; pro UX a pohyb také `skills/mlzidla-scrollcraft-astra/SKILL.md` a `skills/mlzidla-figma-motion-design/SKILL.md`. Existuje agent `base44/agents/marketing_content_agent.jsonc` a návrh v PR #90 — neimplementuj druhý nezávislý publikační systém.

## Pravidla editace
- Blogový článek `content/blog/<slug>.md` s YAML front matter (title, description, layout, date pokud existující parser podporuje). Vždy nejdříve ověř aktuální loader a konvenci; samotný soubor neznamená automaticky publikovaný článek.
- Produktové údaje z Base44 Product/VisualizationAsset a aktuálního datového modelu, nikoli ze staré SEO kopie ani z odhadu. Neznámé údaje `null`.
- Hero může zdůraznit produkt, benefit a CTA; zachovat aktuální design, přístupnost, kontrast, mobilní výřez, navigaci, výkon, strukturu slideru a uživatelské formuláře.
- Výhody mlžení popisovat pravdivě bez konkrétního neověřeného snížení teploty nebo zdravotních tvrzení.
- Produkty se v galeriích nesmějí míchat: LINEA AVENUE = počet stejných LINEA modulů, ne BENDY a ne LINEA CE. Kontrolovat přesný počet trysek u konkrétní ověřené varianty.
- Fotografii označit jako „Realizace“ jen při doložené reálné instalaci; render je „Ilustrační vizualizace“. Nová fotografie pro web max. cca 2000 px, optimalizované WebP/JPEG, přístupný `alt`.

## Trigger a schvalování obsahu
1. Nová schválená vizualizace → koncept Story, nikoli nový blog.
2. Nová publikovaná reference nebo schválený produkt → koncept IG feed + blog.
3. Cena, technická oprava a drobný text → bez automatického marketingového postu.
4. Změna hero/banneru jen po schválení produktu a kreativního zadání; nepromítnout generovaný vizuál jako reálnou instalaci.

## Release
Aktualizovat aktuální `main`, vytvořit pracovní větev, změny s kontrolovatelným diffem, spustit `npm run framework:check`, `npm run build`, případně `npm run lint`. Založit draft PR a ověřit preview ve desktopu i mobilu. **Neprovádět samovolný merge, deploy nebo publikaci**; bez zeleného CI a vizuální kontroly nepřecházet do produkce.

## Návrh obsahu
Texty mají mít komerční háček, stručný technický přínos, reálné umístění, přímé CTA („Získat návrh“, „Poptat mlžítko“) a přirozená klíčová slova. Výstup musí obsahovat zdrojová fakta, návrh textu, potřebné obrázky, alt text, meta description a seznam věcí ke schválení.
