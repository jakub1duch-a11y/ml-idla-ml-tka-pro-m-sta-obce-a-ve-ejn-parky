import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Spreadsheet: "Reference web mlzidla.cz"
const SPREADSHEET_ID = '19qyRlTW-jyRO4yg3WYkdZLQMjrBK1GFyT7Q638s_15k';
const SHEET_NAME = 'Reference';

const VALID_CATEGORIES = ['mestsky', 'event', 'soukromy', 'prumyslovy'];

function splitUrls(val) {
  return (val || '').split(',').map((s) => s.trim()).filter(Boolean);
}
function isYes(val) {
  return ['ano', 'yes', 'true', '1'].includes((val || '').trim().toLowerCase());
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const sheetRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A2:L1000`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!sheetRes.ok) return Response.json({ error: 'Sheets API error: ' + (await sheetRes.text()) }, { status: 500 });
    const sheetData = await sheetRes.json();
    const rows = sheetData.values || [];

    const existingRealizace = await base44.asServiceRole.entities.Realizace.list();

    const results = [];
    for (const row of rows) {
      const [name, client, location, year, categoryCol, desc, image, gallery, video, productUsed, homepageCol, publishCol] = row;
      if (!name || !name.trim()) continue;
      if (!isYes(publishCol)) { results.push({ name, action: 'skipped — Publikovat není "ano"' }); continue; }

      const category = VALID_CATEGORIES.includes((categoryCol || '').trim().toLowerCase()) ? categoryCol.trim().toLowerCase() : 'mestsky';

      const realizaceData = {
        name: name.trim(),
        client: client || '',
        location: location || '',
        year: year ? Number(year) : new Date().getFullYear(),
        category,
        description: desc || '',
        image_url: image || '',
        gallery_urls: splitUrls(gallery),
        video_url: video || '',
        product_used: productUsed || '',
        featured: isYes(homepageCol),
        published: true,
      };

      const existing = existingRealizace.find((r) => r.name?.toLowerCase() === name.trim().toLowerCase());
      if (existing) {
        await base44.asServiceRole.entities.Realizace.update(existing.id, realizaceData);
        results.push({ name, action: 'updated' });
      } else {
        await base44.asServiceRole.entities.Realizace.create(realizaceData);
        results.push({ name, action: 'created' });
      }
    }

    return Response.json({ success: true, count: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}