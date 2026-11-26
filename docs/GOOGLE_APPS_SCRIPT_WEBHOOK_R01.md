# Base44 → Google Apps Script R01
Existující Google projekt: https://script.google.com/home/projects/1wumXP3aizds1sV5q4TVBdc4lBi5jgkNSZrEYoOqXGnT12nfGBB_2JklQ/edit

- Base44 backend: googleAppsScriptWebhook (admin-only, POST, synthetic health probe).
- Google: Automation.gs, merge existing doPost router; never overwrite existing project blindly.
- Both: GOOGLE_SHEETS_WEBHOOK_SECRET (same new random secret, >=32 characters, secret storage only).
- Base44 only: GOOGLE_SHEETS_WEBHOOK_URL = exact deployed script.google.com/macros/s/.../exec URL. Editor URL is not endpoint.
- Deploy Google web app as verified company account meduna@holmtec.cz. If external requests require anonymous endpoint, only signed health probes are accepted by this handler; review existing doPost routes before changing exposure.
- Invoke backend with {} as admin. Requires actual verified ack matching messageId and dry_run. No customer data, writes, mail, or scheduled tasks.
- Existing syncInquiryToSheets and reconcileBusinessRecords stay unchanged. Before production forwarding, agree on data mapping, target sheet, stable IDs, conflict handling and disable duplicate triggers.
- This source does not install/deploy the Google project, set credentials, or establish live connectivity.
