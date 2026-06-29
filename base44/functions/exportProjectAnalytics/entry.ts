import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SPREADSHEET_ID = Deno.env.get('SHEETS_INQUIRY_SPREADSHEET_ID') || '';
const SHEET_NAME = 'Projekt Analytika';

async function sheetsRequest(url, method, accessToken, body) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Sheets error ${res.status}: ${JSON.stringify(data.error?.message || data)}`);
  return data;
}

async function ensureSheet(spreadsheetId, sheetName, accessToken) {
  // Get existing sheets
  const meta = await sheetsRequest(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`,
    'GET', accessToken
  );
  const exists = meta.sheets?.some(s => s.properties?.title === sheetName);
  if (!exists) {
    await sheetsRequest(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      'POST', accessToken,
      { requests: [{ addSheet: { properties: { title: sheetName } } }] }
    );
  }
}

async function clearAndWrite(spreadsheetId, sheetName, rows, accessToken) {
  // Clear existing content
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}:clear`,
    { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } }
  );
  // Write all rows
  await sheetsRequest(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1?valueInputOption=RAW`,
    'PUT', accessToken,
    { values: rows }
  );
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    if (!SPREADSHEET_ID) return Response.json({ error: 'SHEETS_INQUIRY_SPREADSHEET_ID not configured' }, { status: 500 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Fetch all inquiries
    const inquiries = await base44.asServiceRole.entities.ContactInquiry.list('-created_date', 500);

    const now = new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });

    // ── Summary sheet ──────────────────────────────────────────────────────────
    const total = inquiries.length;
    const byStatus = {};
    const byScope = {};
    const byMonth = {};

    for (const inq of inquiries) {
      byStatus[inq.status || 'new'] = (byStatus[inq.status || 'new'] || 0) + 1;
      byScope[inq.project_scope || 'neznámo'] = (byScope[inq.project_scope || 'neznámo'] || 0) + 1;
      const month = inq.created_date ? inq.created_date.slice(0, 7) : 'neznámo';
      byMonth[month] = (byMonth[month] || 0) + 1;
    }

    const rows = [
      [`HolmTec — Export projektové analytiky`, '', `Vygenerováno: ${now}`],
      [],
      ['SOUHRN', '', ''],
      ['Celkem poptávek', total, ''],
      [],
      ['STAV', 'Počet', '% z celku'],
      ...Object.entries(byStatus).map(([k, v]) => [k, v, total ? `${Math.round(v / total * 100)} %` : '0 %']),
      [],
      ['TYP PROJEKTU', 'Počet', '% z celku'],
      ...Object.entries(byScope).map(([k, v]) => [k, v, total ? `${Math.round(v / total * 100)} %` : '0 %']),
      [],
      ['MĚSÍC', 'Počet poptávek', ''],
      ...Object.entries(byMonth).sort().map(([k, v]) => [k, v, '']),
      [],
      ['DETAIL POPTÁVEK', '', '', '', '', ''],
      ['Datum', 'Jméno', 'Email', 'Typ projektu', 'Status', 'Zpráva'],
      ...inquiries.map(inq => [
        inq.created_date ? new Date(inq.created_date).toLocaleDateString('cs-CZ') : '',
        inq.name || '',
        inq.email || '',
        inq.project_scope || '',
        inq.status || 'new',
        (inq.message || '').slice(0, 200),
      ]),
    ];

    await ensureSheet(SPREADSHEET_ID, SHEET_NAME, accessToken);
    await clearAndWrite(SPREADSHEET_ID, SHEET_NAME, rows, accessToken);

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`;

    return Response.json({
      success: true,
      exported: total,
      sheetUrl,
      exportedAt: now,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});