import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
// "Poptávky a dotazy z webu Mlžidla.cz" spreadsheet, shared with the team.
const SPREADSHEET_ID = '1IcI8zsltInagTR8u5VntZEFOuUAbm5Dy-tjPbcfZbnU';
const SHEET_NAME = 'Poptávky';

const HEADERS = [
  'Datum a čas',
  'Zdroj formuláře',
  'Jméno',
  'Email',
  'Telefon',
  'Firma',
  'Produkt / zájem',
  'Zpráva',
  'Stav',
];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const payload = body.data?.data ?? body.data ?? body;

    if (!payload) {
      return Response.json({ error: 'No data provided' }, { status: 400 });
    }

    if (!SPREADSHEET_ID) {
      return Response.json({ error: 'SHEETS_INQUIRY_SPREADSHEET_ID not configured' }, { status: 500 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const createdAt = new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });

    // Detect source — Poptavka vs ContactInquiry
    const isKontakt = 'name' in payload && !('jmeno' in payload);
    const zdroj = isKontakt ? 'Kontakt (web)' : 'Poptávka (web)';

    const jmeno    = payload.jmeno  || payload.name        || '';
    const email    = payload.email                          || '';
    const telefon  = payload.telefon || payload.phone       || '';
    const firma    = payload.firma   || payload.company     || '';
    const produkt  = payload.produkt || payload.product_interest || '';
    const zprava   = payload.zprava  || payload.message     || '';
    const stav     = payload.status  || 'nová';

    const row = [createdAt, zdroj, jmeno, email, telefon, firma, produkt, zprava, stav];

    // Ensure header row exists
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A1:I1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const checkData = await checkRes.json();
    const hasHeader = checkData.values && checkData.values.length > 0;

    if (!hasHeader) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A1:I1?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [HEADERS] }),
        }
      );
    }

    // Append new row
    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A:I:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
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

    return Response.json({ ok: true, row });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}