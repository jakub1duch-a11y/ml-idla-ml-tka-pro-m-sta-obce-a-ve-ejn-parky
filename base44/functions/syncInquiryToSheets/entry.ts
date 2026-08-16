import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const SPREADSHEET_ID = '1IcI8zsltInagTR8u5VntZEFOuUAbm5Dy-tjPbcfZbnU';
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

async function ensureSheet(accessToken, title) {
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!metaRes.ok) throw new Error(`Sheets metadata failed: ${await metaRes.text()}`);
  const meta = await metaRes.json();
  const exists = (meta.sheets || []).some((sheet) => sheet?.properties?.title === title);
  if (exists) return;
  const createRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title } } }] }),
  });
  if (!createRes.ok) throw new Error(`Create sheet ${title} failed: ${await createRes.text()}`);
}

async function ensureHeaders(accessToken, sheetName, headers) {
  const range = `${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1`;
  const readRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!readRes.ok) throw new Error(`Read headers ${sheetName} failed: ${await readRes.text()}`);
  const data = await readRes.json();
  if (Array.isArray(data.values?.[0]) && data.values[0].length) return;
  const writeRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=RAW`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [headers] }),
  });
  if (!writeRes.ok) throw new Error(`Write headers ${sheetName} failed: ${await writeRes.text()}`);
}

async function appendRow(accessToken, sheetName, width, row) {
  const lastCol = String.fromCharCode(64 + width);
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(`${sheetName}!A:${lastCol}`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) throw new Error(`Append ${sheetName} failed: ${await res.text()}`);
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
    await appendRow(accessToken, CLIENTS_SHEET, CLIENT_HEADERS.length, [
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
    await ensureSheet(accessToken, INQUIRIES_SHEET);
    await ensureSheet(accessToken, CLIENTS_SHEET);
    await ensureHeaders(accessToken, INQUIRIES_SHEET, INQUIRY_HEADERS);
    await ensureHeaders(accessToken, CLIENTS_SHEET, CLIENT_HEADERS);

    await appendRow(accessToken, INQUIRIES_SHEET, INQUIRY_HEADERS.length, [
      client.timestamp, client.zdroj, client.jmeno, client.email, client.telefon,
      client.firma, client.produkt, client.zprava, client.stav, client.entityId
    ]);
    const clientResult = await upsertClient(accessToken, client);

    return Response.json({ ok: true, inquiry_id: client.entityId, client: clientResult });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
