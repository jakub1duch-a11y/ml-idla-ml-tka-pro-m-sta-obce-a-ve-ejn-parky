# Mlžidla.cz – vizuální mapa marketingového workflow

Editovatelná mapa: https://www.tldraw.com/f/vVyd90c_amLwiaND55o7E

## Účel
Mapa je dokumentace procesu, nikoli publikační automat. Zdroj pravdy zůstává Base44. GitHub verzování; Canva vizuály; Instagram distribuce; Facebook pouze po ověření crosspostingu; blog samostatně.

## Rozhodovací logika
- Schválená nová vizualizace existujícího produktu: pouze Story 9:16, bez feedu a blogu.
- Publikovaná reference: feed + koncept blogu.
- Nový ověřený produkt: feed + koncept produktového článku.
- Změna ceny, textu či parametru: žádný marketingový výstup.
- Deduplikovat podle zdrojové události; všechny výstupy nejprve draft.
- Každé zveřejnění vyžaduje explicitní schválení administrátora.

## Navazující implementace a testy
1. Marketing Hub spustí ruční dry-run sken a ukáže změny; žádný automatický publish.
2. Koncepty doplní ověřené podklady z Base44/Drive a grafický brief Canva.
3. Zkontrolovat autenticitu realizací, práva, brand, správnou geometrii a CTA.
4. Otestovat feed, Story a IG→FB crossposting odděleně; nepublikovat Story jako feed.
5. Ověřit opakovaný sken bez duplicit a blog bez autoshare.
6. Zapnout plánovaný sken teprve po testech; i poté pouze návrhy.
7. Preview + CI + schválený PR → merge do main; neobcházet chybný produkční build.

Související technická dokumentace: docs/MLZIDLA_SOCIAL_AGENT.md.
