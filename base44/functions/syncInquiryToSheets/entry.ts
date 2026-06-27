import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ─── CONFIGURATION ───────────────────────────────────────────────────────────
// Replace with your actual Google Spreadsheet ID
// (the long string in the URL: docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit)
const SPREADSHEET_ID = Deno.env.get('SHEETS_INQUIRY_SPREADSHEET_ID') || 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Poptávky';
// ─────────────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { data } = body;

    if (!data) {
      return Response.json({ error: 'No data provided' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const createdAt = new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });

    const row = [
      createdAt,
      data.name || '',
      data.email || '',
      data.message || '',
      data.status || 'new',
    ];

    // First, try to ensure the header row exists (only if sheet is empty)
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A1:E1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const checkData = await checkRes.json();
    const hasHeader = checkData.values && checkData.values.length > 0;

    if (!hasHeader) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A1:E1?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [['Datum', 'Jméno', 'Email', 'Zpráva', 'Status']] }),
        }
      );
    }

    // Append the new inquiry row
    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A:E:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [row] }),
      }
    );

    if (!appendRes.ok) {
      const err = await appendRes.json();
      return Response.json({ error: err }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});