# Rychlá poptávka a varianty – zadání pro implementaci

## Rozsah
Všechny produktové detaily MLŽIDLA.cz, včetně VOLAVKA, MRAK, LINEA, AURA, BENDY, LÍZÁTKO a MLŽNÉ BRÁNY. Sdílená komponenta, bez duplikace logiky.

## Přehled variant
Pod hlavním přehledem produktu kompaktní přístupná responzivní tabulka s **pouze rozdílovými parametry**. Pro každou variantu odkaz na její **ověřený** technický list; neexistující PDF neodkazovat. Tlačítko „Zjistit cenu“ pro každou variantu. Pod tabulkou „Poptat cenu všech variant“. U produktu s jedinou variantou společné tlačítko nezobrazovat. U VOLAVKA Gracilis/Gigantea ověřit výšku, počet trysek a aktuální varianty v produktových datech.

## Dialog rychlé poptávky
Kliknutí na CTA otevře modal nad stránkou bez navigace. Povinná pole: jméno, příjmení, e-mail, telefon. Nepovinná: město, místo instalace, volný popis a fotografie prostoru. Nahrání více fotografií z telefonu, kontrola MIME, velikosti, počtu souborů, bezpečné neveřejné uložení a ochrana před zneužitím. Uživatel může odeslat i bez nepovinných polí. Přístupnost: focus trap, Escape, zavření, popisky, chyby validace, klávesnice a mobilní zobrazení.

## Data a odeslání
Odeslat product ID, variant IDs, režim single/all, source URL, čas, kontaktní údaje a volitelná upřesnění. Server musí validovat a bezpečně uložit poptávku a přílohy. Po úspěchu zobrazit potvrzení; při chybě zachovat vyplněné údaje a nabídnout opakování. Zamezit duplicitám opakovaného odeslání. Napojit na existující obchodní centrum; HubSpot synchronizovat pouze pokud je skutečně funkční, jinak bezpečně evidovat stav synchronizace. Neodesílat zákazníkům automaticky nabídky.

## Ověření před nasazením
Zkontrolovat skutečné komponenty, datový model, API, oprávnění a existující poptávkové workflow. Test: jednotlivá varianta, všechny varianty, jediná varianta, chybějící PDF, validace, fotografie, úspěch/chyba, desktop/mobil, přístupnost, bezpečnost, build a CI. Preview a kontrola; merge a produkce pouze při zeleném CI a schváleném výsledku. Bez vymyšlených cen, parametrů nebo PDF.
