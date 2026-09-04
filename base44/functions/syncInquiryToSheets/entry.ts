import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensureSheet, ensureHeaders, appendRow } from '../../shared/googleSheets.ts';

const SPREADSHEET_ID = '1MS4i00ekY3Pf3fY-AsUdCT7GtNiCk5XPDr8CLiwym6M';
const INQUIRIES_SHEET = 'Poptávky';
const CLIENTS_SHEET = 'Klienti';

const INQUIRY_HEADERS = [
  'Datum a čas', 'Zdroj formuláře', 'Jméno', 'Email', 'Telefon', 'Firma',
  'Produkt / zájem', 'Zpráva', 'Stav', 'ID poptávky'
];
const CLIENT_HEADERS = [
  'První kontakt', 'Poslední kontakt', 'Jméno', 'Email', 'Telefon', 'Firma',
  'Poslední zájem', 'Zdroj', 'Stav', 'Počet poptávek'
];

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const normalizePhone = (value) => String(value || '').replace(/\D/g, '').replace(/^420/, '');

async function inquiryAlreadySynced(accessToken, entityId) {
  if (!entityId) return false;
  const range = `${INQUIRIES_SHEET}!J2:J`;
  const readRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!readRes.ok) throw new Error(`Read inquiry ids failed: ${await readRes.text()}`);
  const data = await readRes.json();
  return (data.values || []).some((row) => String(row?.[0] || '') === String(entityId));
}

async function upsertClient(accessToken, client) {
  const range = `${CLIENTS_SHEET}!A2:J`;
  const readRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!readRes.ok) throw new Error(`Read client list failed: ${await readRes.text()}`);
  const data = await readRes.json();
  const rows = data.values || [];
  const email = normalizeEmail(client.email);
  const phone = normalizePhone(client.telefon);
  const index = rows.findIndex((row) => {
    const rowEmail = normalizeEmail(row[3]);
    const rowPhone = normalizePhone(row[4]);
    return (email && rowEmail === email) || (phone && rowPhone === phone);
  });

  if (index === -1) {
    await appendRow(accessToken, SPREADSHEET_ID, CLIENTS_SHEET, CLIENT_HEADERS.length, [
      client.timestamp, client.timestamp, client.jmeno, client.email, client.telefon,
      client.firma, client.produkt, client.zdroj, client.stav, 1
    ]);
    return { created: true };
  }

  const existing = rows[index];
  const rowNumber = index + 2;
  const count = Math.max(1, Number(existing[9] || 0)) + 1;
  const updated = [
    existing[0] || client.timestamp,
    client.timestamp,
    client.jmeno || existing[2] || '',
    client.email || existing[3] || '',
    client.telefon || existing[4] || '',
    client.firma || existing[5] || '',
    client.produkt || existing[6] || '',
    client.zdroj || existing[7] || '',
    client.stav || existing[8] || 'nová',
    count,
  ];
  const updateRange = `${CLIENTS_SHEET}!A${rowNumber}:J${rowNumber}`;
  const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(updateRange)}?valueInputOption=RAW`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [updated] }),
  });
  if (!updateRes.ok) throw new Error(`Update client failed: ${await updateRes.text()}`);
  return { created: false, row: rowNumber };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const entityName = body.entity_name || body?.event?.entity_name || '';
    const entityId = body.entity_id || body?.event?.entity_id || body?.data?.id || '';
    let payload = body.data?.data ?? body.data ?? body;

    if (entityId && (entityName === 'Poptavka' || entityName === 'ContactInquiry')) {
      payload = await base44.asServiceRole.entities[entityName].get(entityId);
    }
    if (!payload) return Response.json({ error: 'No data provided' }, { status: 400 });

    const isContact = entityName === 'ContactInquiry' || ('name' in payload && !('jmeno' in payload));
    const zdroj = isContact ? 'Kontakt (web)' : 'Poptávka (web)';
    const timestamp = new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });
    const client = {
      timestamp,
      zdroj,
      jmeno: payload.jmeno || payload.name || '',
      email: payload.email || '',
      telefon: payload.telefon || payload.phone || '',
      firma: payload.firma || payload.company || '',
      produkt: payload.produkt || payload.product_interest || payload.product_id || '',
      zprava: payload.zprava || payload.message || '',
      stav: payload.status || 'nová',
      entityId: entityId || payload.id || '',
    };

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    await ensureSheet(accessToken, SPREADSHEET_ID, INQUIRIES_SHEET);
    await ensureHeaders(accessToken, SPREADSHEET_ID, INQUIRIES_SHEET, INQUIRY_HEADERS);

    if (await inquiryAlreadySynced(accessToken, client.entityId)) {
      return Response.json({ ok: true, inquiry_id: client.entityId, duplicate_skipped: true });
    }

    await appendRow(accessToken, SPREADSHEET_ID, INQUIRIES_SHEET, INQUIRY_HEADERS.length, [
      client.timestamp, client.zdroj, client.jmeno, client.email, client.telefon,
      client.firma, client.produkt, client.zprava, client.stav, client.entityId
    ]);

    let clientResult = { skipped: true };
    try {
      await ensureSheet(accessToken, SPREADSHEET_ID, CLIENTS_SHEET);
      await ensureHeaders(accessToken, SPREADSHEET_ID, CLIENTS_SHEET, CLIENT_HEADERS);
      clientResult = await upsertClient(accessToken, client);
    } catch (clientError) {
      console.warn('Klienti sync skipped:', clientError?.message || clientError);
    }

    return Response.json({ ok: true, inquiry_id: client.entityId, client: clientResult, duplicate_skipped: false });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}