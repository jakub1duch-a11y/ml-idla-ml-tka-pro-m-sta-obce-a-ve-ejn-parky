# HolmTec R01 – review of supplied consolidated Apps Script (2026-11-26)
Target project: 1wumXP3aizds1sV5q4TVBdc4lBi5jgkNSZrEYoOqXGnT12nfGBB_2JklQ.
Baseline: latest SYSTEM_CONFIG / doGet / getPipelineData / updateProjectPhase / onEditAutomation / syncBase44ToSheets supplied by owner. Google editor not accessible from MCP. Do not install multiple versions of testBase44Schema or syncBase44ToSheets.

Add R01Review.gs only to existing private project. Use its holmtecR01ReadOnlyProbe, with existing BASE44_API_KEY property, not a second token property. API URL from supplied script; live authentication not verified. Helper functions are staged and not yet wired into existing functions.

Required fixes before activation:
- DRY_RUN currently creates tabs and adds headers; move creation behind write gate; audit writes must be explicit and separate. Do not change notes in protected sheets.
- Check row number, expected stable BT, unique existing BT match, whitelist phase, current revision before writes; T02 exact SENT for BT AND CN. A draft or unrelated CN does not count. T03 deny backward order transition. Use one edit trigger; onEdit observes edits after they occurred and cannot enforce dry-run by itself.
- Existing ProjectOrder fields are client_name/client_company/client_email/client_phone/quote_number; B2BLead fields are contactPerson/companyName. Include Poptavka (jmeno/firma/telefon/zprava) in the diagnostic. No verified BT field in these schemas. Never infer BT from quote_number. Orders are separate from inquiries.
- Use stable entity + record ID in sheet, not solely ScriptProperties, for idempotence; compare actual rows and snapshots, paginate, detect conflicts, use RAW writes to prevent formula injection, avoid partial writes.
- Restrict Google Sites to authorized identities; do not turn the same internal web app into an anonymous webhook. Keep existing doGet private. If a public external receiver is needed, use a separate minimal signed probe deployment, no Sheets/Gmail scopes. No customer data forwarded in R01. Existing Base44 Google OAuth integrations remain unchanged.
- No live changes to 0_BT, MLŽIDLA CRM, audit, Gmail, prices or statuses until approved tests. The T01–T07 full specifications not supplied; do not claim their completion.
