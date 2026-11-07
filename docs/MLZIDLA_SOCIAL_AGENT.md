# MLŽIDLA.cz – Marketingový AI agent (Instagram, Facebook, blog)

Stav: **pracovní větev, čeká na PR/preview a publikační testy**. Dosavadní změny nic samy veřejně nepublikují.

## Zdroj pravdy a routing

| Schválená událost v Base44 | Instagram | Facebook | Blog Mlžidla.cz |
| --- | --- | --- | --- |
| Nová vizualizace existujícího produktu (VisualizationAsset approved, approved_for_presentation, MASTER geometrie) | **Pouze Story**, 9:16 | Výhradně přes křížové sdílení IG → FB, pokud je ověřené | **Nevytvářet** |
| Nová publikovaná reference (Realizace published, autentická fotografie) | **Feed** | Pouze ověřené IG → FB | **Nový koncept článku** |
| Nový schválený produkt (Product visual_master_verified a MASTER foto) | **Feed** | Pouze ověřené IG → FB | **Nový koncept článku** |
| Úprava ceny, popisu, parametrů a ostatní drobné změny | Nic | Nic | Nic |

Na každou událost se vytváří nejvýše jeden soubor marketingových konceptů. Klíč MarketingPost.admin_sync_key zajišťuje deduplikaci. U změněné URL vizualizace vznikne nový Story návrh. Každý obsah je **status=draft**, blog vždy **published=false**.

## Jak použít v administraci

1. **Admin → Marketing → Marketingový agent → Zkontrolovat novinky**. Výchozí okno je posledních 14 dnů, maximálně 10 náhledů.
2. Zobrazí se klasifikace: pouze Stories / feed + blog. Zdroje musí mít příslušné schválení.
3. **Vytvořit koncepty** (potvrzení). Agent navrhne copy, text blogu, SEO a brief pro Canvu a uloží do MarketingPost / BlogPost. Text generuje LLM jen z ověřených faktů; při nedostupné AI vznikne redakční návrh bez domýšlení.
4. V **Canvě** použít Brand Kit Mlžidla.cz, připravené foto a brief. Exportovat Story **1080×1920 JPEG nebo MP4**; feed **1080×1350**. Vložit finální URL do MarketingPost. Žádné vodoznaky, změny geometrie ani falešné instalace.
5. V administraci zkontrolovat zdroj, věcnou správnost, práva k fotografiím a souhlas s uvedením klienta.
6. Teprve pak **Zkontrolovat a publikovat** s výslovným potvrzením administrátora. Blog se publikuje samostatně v jeho editoru. Marketingové články mají blokaci duplicitního automatického sdílení do Instagramu.

## Facebook a Instagram – podmínky

- V Base44 je ověřeno připojení Instagramu, Facebook Pages konektor nebyl připojen.
- Uživatel chce IG → FB bez druhého duplicitního postu. Implementace proto **nevytváří samostatné Facebook příspěvky**.
- **Pozor:** propojení účtů v Meta Accounts Center nedokazuje, že se média zveřejněná přes Instagram Graph API automaticky objeví na Facebooku. Ověřit testem jednotlivě feed / Stories / Reels. Pokud test neprojde, potřebujeme Facebook Pages konektor nebo ruční publikační krok.
- Stories API může vyžadovat účet Instagram Business a odpovídající oprávnění. Chybějící oprávnění znamená chybové hlášení, nikoli náhradní publikaci do feedu.
- API Stories nepřidává interaktivní nálepky, např. link sticker. Ty se přidávají ručně.

## Technické části

- base44/functions/scanMarketingNews/entry.ts: administrátorský scan, idempotentní návrhy MarketingPost / BlogPost. dryRun:true jen čte, dryRun:false a confirmed:true tvoří výhradně koncepty.
- src/components/admin/marketing/MarketingNewsAgentPanel.jsx: ovládací panel v Marketing Hub.
- base44/agents/marketing_content_agent.jsonc: trvalé redakční a produktové zásady.
- base44/shared/instagram.ts a publishInstagramPost: Stories používají media_type=STORIES, takže nejdou omylem do feedu.
- publishScheduledInstagramPosts: automatický plánovač nezveřejňuje neověřené Stories/Reels.
- autoShareBlogPost: agentem vytvořené články nemají duplicitní Instagram autoshare.

## Než půjde do produkce

- Preview musí projít buildem a vizuální kontrolou na mobilu i desktopu.
- Ověřit suchý běh pro: vizualizaci, referenci, produkt a opakované načtení bez duplicit.
- Ověřit blogový editor a obsah.
- Ověřit Instagram API Story na schváleném testovacím médiu a křížové sdílení na Facebook.
- **Automatické časované nebo událostní spouštění není zatím aktivované.** Bezpečný ruční sken funguje z administrace; pro nepřetržitý provoz je potřeba doplnit Base44 Workflows po ověření autorizace.
- Ostrou verzi měnit až po zeleném preview a merge do main.