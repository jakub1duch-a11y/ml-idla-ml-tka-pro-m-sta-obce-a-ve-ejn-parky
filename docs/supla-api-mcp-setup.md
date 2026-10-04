# SUPLA API + MCP bridge

Aplikace používá Base44 serverové funkce `suplaApi` a `suplaMcpBridge`.

## Tajné proměnné
- `SUPLA_API_TOKEN` – Bearer token vytvořený v SUPLA Cloud integraci
- `SUPLA_API_BASE_URL` – volitelné; výchozí `https://cloud.supla.org/api`

Token se nikdy neukládá do entity ani neposílá do klienta. Funkce vyžadují roli administrátora.

## MCP nástroje
- `supla_list_channels`
- `supla_get_channel`
- `supla_toggle_channel`

Rozhraní `suplaMcpBridge` přijímá `tools/list` a `tools/call`. Ovládací operace vyžadují explicitní potvrzení administrátora. Automatické plánované spínání není aktivováno.

Oficiální API dokumentace: https://cloud.supla.org/api-docs/docs.html
