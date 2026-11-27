# Agent Skills – MLŽIDLA.cz

Tato složka obsahuje opakovaně použitelné instrukce pro AI agenty. Samotné uložení `SKILL.md` do GitHubu **neinstaluje skill do ChatGPT ani nemění produkční Base44 aplikaci**. Aktivace závisí na agentním prostředí, které složku načítá.

## Přehled

- **MLŽIDLA – marketing a design:** `mlzidla-urban-cooling`, `mlzidla-mestske-ochlazovani`, `mlzidla-scrollcraft-astra`, `mlzidla-figma-motion-design`.
- **Base44 – vývoj:** `base44-sdk`, `base44-cli`, `base44-sandbox`, `base44-remote-dev`, `base44-troubleshooter`.
- **Údržba dokumentace:** `sync-cli-skill`, `sync-sdk-skill`.
- **Správa skills:** `skill-creator`, `review-skills`.
- **Observabilita:** `otel-collector`, `otel-ottl`, `otel-instrumentation`, `otel-semantic-conventions`.

Podrobná pravidla pro web a produkty MLŽIDLA.cz jsou v [hlavním projektovém skillu](../../base44/agent-skills/mlzidla-agent-skills/SKILL.md). Při práci na webu používejte projektová pravidla společně s příslušným Base44 nebo designovým skillem. Specifické technické údaje, ceny a fotografie ověřujte ze schválených zdrojů.

## Bezpečný workflow pro web

1. **Identifikovat prostředí.** Nejprve ověřit konkrétní Base44 aplikaci, repozitář, aktuální větev a skutečnou strukturu souborů. Nepředpokládat naslepo, že každá stránka je Markdown nebo že každá změna v GitHubu přímo nasazuje Base44.
2. **Oddělit režimy práce.** GitHub PR workflow a přímé úpravy Base44 cloud sandboxu jsou odlišné postupy. U požadavku na změny pouze v GitHubu nepoužívat přímé zápisy do produkčního sandboxu ani automatický deploy.
3. **Provádět změny ve feature větvi.** Neměnit přímo `main`. Udržet malý a přehledný diff, popsat rizika a vytvořit Pull Request.
4. **Ověřit změny.** Provést relevantní testy, build, kontrolu responsivity, přístupnosti, SEO a produktových vizualizací. Netvrdit, že kontroly prošly, pokud nebyly skutečně spuštěny.
5. **Publikovat jen po schválení.** Před sloučením ověřit preview a schválení správce. Stav commitu, preview a skutečně publikovaného webu ověřovat odděleně.

## Produktová a obchodní pravidla

- Zachovat **reálnou geometrii** pojmenovaných výrobků, počty trysek, konstrukční rozměry a správné přiřazení fotografií. Neověřený parametr nebo obrázek označit k revizi.
- Při práci s cenami vycházet z aktuální schválené kalkulace (např. `Kalkulace 2026` na připojeném Google Disku), nikoli z odhadů nebo starých hodnot v dokumentaci.
- Nabídky, technické závazky a externí obchodní komunikace podléhají schválení; dokumentace ke skillům sama nikoho neopravňuje odesílat zprávy.
- Chránit zákaznická data, API klíče a přihlašovací údaje. Neumisťovat je do veřejného GitHubu ani do logů. Oprávnění k datům v Base44 vynucovat na serveru, ne jen skrýváním prvků rozhraní.

## Kontrola formátu

Každý skill musí být v adresáři stejného názvu jako `name` a obsahovat `SKILL.md` se standardním YAML frontmatter:

```yaml
---
name: mlzidla-example
description: "Use when preparing a specific MLŽIDLA.cz workflow."
metadata:
  version: "1.0"
---
```

Povolené vrcholové klíče: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Verze patří do `metadata.version`, ne do samostatného `version` klíče. Název musí odpovídat názvu adresáře (malá písmena, číslice a pomlčky). Při kontrole referencí ověřit, že odkazované soubory skutečně existují.

**Rozsah tohoto katalogu:** `agent/skills/`. Případné kopie v `skills/`, `.agents/skills/` či `.claude/skills/` jsou jiné cesty a neaktualizují se automaticky s touto složkou.
