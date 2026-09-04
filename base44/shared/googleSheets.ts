// Shared Google Sheets utilities — used by all Sheets-sync backend functions.
// Plain module (no Deno.serve), imported by functions via "../../shared/googleSheets.ts".

/**
 * Ensure a sheet tab exists in the spreadsheet. Creates it if missing.
 */
export async function ensureSheet(accessToken, spreadsheetId, title) {
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!metaRes.ok) throw new Error(`Sheets metadata failed: ${await metaRes.text()}`);
  const meta = await metaRes.json();
  const exists = (meta.sheets || []).some((s) => s?.properties?.title === title);
  if (exists) return;
  const createRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title } } }] }),
  });
  if (!createRes.ok) throw new Error(`Create sheet ${title} failed: ${await createRes.text()}`);
}

/**
 * Ensure header row exists in a sheet. Writes headers only if the first row is empty.
 */
export async function ensureHeaders(accessToken, spreadsheetId, sheetName, headers) {
  const range = `${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1`;
  const readRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!readRes.ok) throw new Error(`Read headers ${sheetName} failed: ${await readRes.text()}`);
  const data = await readRes.json();
  if (Array.isArray(data.values?.[0]) && data.values[0].length) return;
  const writeRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [headers] }),
  });
  if (!writeRes.ok) throw new Error(`Write headers ${sheetName} failed: ${await writeRes.text()}`);
}

/**
 * Append a single row to the end of a sheet (INSERT_ROWS mode).
 */
export async function appendRow(accessToken, spreadsheetId, sheetName, width, row) {
  const lastCol = String.fromCharCode(64 + width);
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${sheetName}!A:${lastCol}`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) throw new Error(`Append ${sheetName} failed: ${await res.text()}`);
}

/**
 * Get a set of existing values in a specific column (deduplication check).
 */
export async function getExistingColumnValues(accessToken, spreadsheetId, sheetName, col) {
  const range = `${sheetName}!${col}2:${col}`;
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return new Set();
  const data = await res.json();
  return new Set((data.values || []).map((r) => String(r?.[0] || '')));
}

/**
 * Update a single cell value by row number and column letter.
 */
export async function updateCell(accessToken, spreadsheetId, sheetName, col, rowNumber, value) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${sheetName}!${col}${rowNumber}`)}?valueInputOption=RAW`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [[value]] }),
  });
  if (!res.ok) throw new Error(`Update ${sheetName}!${col}${rowNumber} failed: ${await res.text()}`);
}

/**
 * Create a spreadsheet inside a shared Drive. Returns existing ID if one with the same name exists.
 */
export async function ensureSpreadsheetInDrive(accessToken, driveId, name) {
  const q = encodeURIComponent(`name='${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`);
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=10&corpora=drive&driveId=${driveId}&includeItemsFromAllDrives=true&supportsAllDrives=true`;
  const searchRes = await fetch(searchUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!searchRes.ok) throw new Error(`Drive search failed: ${await searchRes.text()}`);
  const searchData = await searchRes.json();
  if (searchData.files?.[0]?.id) return searchData.files[0].id;

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name&supportsAllDrives=true', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.spreadsheet', parents: [driveId] }),
  });
  if (!createRes.ok) throw new Error(`Create spreadsheet failed: ${await createRes.text()}`);
  const created = await createRes.json();
  return created.id;
}