# HubSpot → MLŽIDLA Obchodní centrum: integrační kontrakt (návrh, 2026-11-17)

## Stav
HubSpot portal 149778217 je ověřen. Pipeline MLŽIDLA 4351532258, HolmTec 4351897791. Konektor samostatného Obchodního centra vrací při pokusu o zápis `Invalid record schema`; skutečné validační schéma jeho úložiště není zpřístupněno. Tento dokument **není aktivní integrace**.

## Mapování obchodního případu
| HubSpot Deal | Interní kanonický záznam |
|---|---|
| hs_object_id | hubspot_deal_id (string, neměnný) |
| portal | hubspot_portal_id = 149778217 |
| dealname | name |
| pipeline | pipeline_id |
| dealstage | stage_id |
| obchodni_znacka | brand (mlzidla / holmtec) |
| obchodni_zdroj_poptavky | inquiry_source |
| obchodni_cislo_nabidky | offer_number |
| obchodni_stav_podkladu | documents_status |
| obchodni_pdf_nabidky | offer_pdf_url |
| obchodni_gmail_vlakno | gmail_thread_url |
| hs_next_step | next_step |
| hs_lastmodifieddate | hubspot_updated_at |

## Pravidla
1. Před zápisem načíst skutečný validátor/DTO aplikace Obchodní centrum; nenahrazovat jej tímto návrhem.
2. Upsert pouze podle kombinace `hubspot_portal_id:hubspot_deal_id`; u jiných záznamů neodvozovat identitu podle názvu.
3. Nejprve zálohovat existující záznam, ověřit oprávnění, vyzkoušet jeden záznam a přečíst jej zpět; až pak dávkové zápisy.
4. Oddělit značky, chránit osobní údaje, neexportovat interní nákupní ceny a kalkulace.
5. Žádné e-maily zákazníkům, žádný merge/produkční deployment bez testu.
6. HubSpot MLŽIDLA: aktuálně 2 obchody; HolmTec: 0. Obchodní centrum před testem hlásilo 606 záznamů.
