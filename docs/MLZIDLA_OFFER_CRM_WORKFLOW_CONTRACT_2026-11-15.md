# MLŽIDLA.cz — závazné workflow zpracování poptávek (15. 11. 2026)

Stav: pracovní specifikace k revizi v PR #123. Žádná automatická publikace ani odesílání.

## Účty a zdroje
- Base44: 6a3ee88c10959cd3588c4d68. Zdroj poptávek a ověřených produktových parametrů.
- HubSpot: pouze portál 149778217, meduna@holmtec.cz, pipeline 4351532258 (Mlžidla.cz – poptávky a nabídky).
- Cenový zdroj: `Kalkulace mlžítka 2026` (Google Sheets ID `1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8`), veřejná cena pro přesnou variantu ze sloupce H listu `💧 Katalog produktů 2026`. Vždy čerstvě ověřit; neodvozovat cenu z historických nabídek, Base44 Product.price_from ani partner sloupců.
- Canva: použít kopii schválené MLŽIDLA brand šablony; aktuálně šablony EAHZTN-hiGc, EAHZVIjydfU a EAHaESdCDrg vracejí dataset `{}`, takže programové Autofill není připravené. Dokud nejsou pojmenované datové prvky, generování PDF musí být ručně ověřené.
- Gmail / Google Drive / Sheets uvnitř Base44: zapisovat pouze při ověřené identitě `meduna@holmtec.cz`; autorizace Google Drive byla k 15. 11. stále `PENDING` a dříve připojený účet `jakub1duch@gmail.com`. Při nesouladu okamžitý stop; ChatGPT konektor automaticky neznamená Base44 autorizaci.

## Pořadí akcí na konkrétní poptávce
1. Načíst a uložit původní Base44 poptávku podle jejího jedinečného ID. Poznat produkt, variantu, množství, prostor, termín, zákazníka, obrázky a poznámky.
2. Ověřit CRM portál přes skutečný token, nikoli hodnotu z UI. Normalizovat kontaktní e-mail a vyhledat kontakt; firmu párovat dle ověřené domény/IČO a dalších silných identifikátorů. Při více shodách zastavit a předat ke kontrole.
3. Pro neexistující potvrzený kontakt a firmu vytvořit CRM záznam s externím ID zdrojové poptávky a vhodnými vazbami. Nesmí vzniknout duplicita při opakovaném pokusu (idempotence). Před write operací zobrazit náhled změn a potvrdit správnou vazbu.
4. Pro poptávku vytvořit či aktualizovat jediný Deal ve správné pipeline `4351532258`. Ověřit existenci podle externího ID; existující obchodní případ nepřepisovat bez porovnání. Výchozí stav `6441744588` Nová poptávka; dále Upřesnění `6441744589`, Příprava nabídky `6441744590`, Nabídka odeslána `6441744591`, Vyhráno `6441744592`, Prohráno `6441744593`. Neoznačit „Nabídka odeslána“ před potvrzením skutečného odeslání.
5. Navrhnout technicky správný produkt MLŽIDLA.cz pro park, náměstí, školu, komerční či soukromou zahradu. Vybrat skutečný MASTER produktu a vizualizace. Pro dětská hřiště uvést, že mlžítko není herní prvek podle ČSN EN 1176.
6. Čerstvě ověřit cenu v aktuální kalkulaci dle varianty, u institucí bez DPH, u soukromých zákazníků s DPH, s jasným rozpisem. Pokud není autoritativní cena dostupná, neuvádět vymyšlené částky — stav „čeká na cenu“.
7. V Canvě vytvořit editovatelnou kopii brand šablony, profesionální produktové listy, vizualizace, položkovou kalkulaci, technické řešení a samostatný list SUPLA; bez datových polí neslibovat Autofill. Export PDF a náhled potvrdit až po porovnání cen, parametrů, písem, obrázků a loga.
8. Archivace PDF do správné složky Mlžného disku a odkaz v CRM pouze po ověření Google OAuth identity.
9. V Gmailu pouze uložit koncept do správného vlákna; zkontrolovat adresáta, předmět, fotobloky, PDF přílohu, produktový list a odkazy. Nikdy neodeslat automaticky.
10. Obchodník schválí text, nabídku, dokumenty a případné odeslání. Až potom ověřit skutečnou odeslanou zprávu a aktualizovat CRM, follow-up a evidenci kontaktů. Neoznačovat navržený stav jako provedený.

## Předprodukční brány
- Produktové parametry a veřejná cena ověřeny.
- OAuth firemních účtů prokazatelný.
- HubSpot portál potvrzen z tokenu, zamezení duplicit.
- Canva Autofill lze použít pouze s reálným datasetem; PDF vizuálně zkontrolováno.
- Gmail koncept ověřen; nic nebylo odesláno bez schválení.
- Tests, CI/build, preview, PR review, schválení správce před merge a ostrým nasazením.

## Otevřené blokace
- Google Drive Base44 stále ukazuje jakub1duch@gmail.com a nový OAuth je PENDING.
- Gmail/Sheets v Base44 nemají potvrzený připojený firemní účet.
- Canva brand šablony neposkytují pojmenovaná Autofill pole.
- HubSpot pipeline existuje, avšak koncový proces Base44 → HubSpot Deal → Canva PDF → Gmail draft není end-to-end ověřen.
- PR #123 opravuje staré ID portálu v importu produktů; do merge jen po kontrole náhledu a potvrzení.

## Aktualizace 15. 11. 2026 – závazný výchozí Canva design
- Správce určil brand šablonu `EAHbBX1hTpE` („Mlžítka HolmTec“), https://www.canva.com/brand/brand-templates/EAHbBX1hTpE, pro produktové listy s cenou i individuální nabídky včetně vizualizací.
- Existence šablony ověřena v Canva. Dataset je prázdný `{}` – nelze tvrdit, že je funkční automatické Autofill, PDF export nebo Gmail přiložení.
- Pro každou klientskou poptávku vytvořit vlastní designovou kopii, naplnit ověřenými parametry, cenami z aktuální kalkulace, fotkami a vizualizacemi. Po kontrole PDF připojit ke správnému HubSpot Dealu a pouze do Gmail konceptu v účtu meduna@holmtec.cz. Automatické odesílání zakázáno.
