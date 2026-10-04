import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Spreadsheet: "Novinky a Blog — Mlžidla.cz"
const SPREADSHEET_ID = '1BYwWTeu61H66DStEWOykH0HLkHabF2QwNeNrPLlJF2A';
const SHEET_NAME = 'Plán sezóny';

const VALID_CATEGORIES = ['inspirace', 'realizace', 'technika', 'novinky'];
const VALID_AUDIENCE = ['firmy', 'soukrome', 'oboji'];

function slugify(text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A2:J1000`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!sheetRes.ok) return Response.json({ error: 'Sheets API error: ' + (await sheetRes.text()) }, { status: 500 });
    const sheetData = await sheetRes.json();
    const rows = sheetData.values || [];

    const existingPosts = await base44.asServiceRole.entities.BlogPost.list();

    const results = [];
    for (const row of rows) {
      const [dateCol, purpose, title, categoryCol, audienceCol, perex, content, image, tagsCol, publishCol] = row;
      if (!title || !title.trim() || !content || !content.trim()) {
        results.push({ purpose: purpose || '(bez tématu)', action: 'skipped — chybí Název nebo Obsah' });
        continue;
      }
      if (!isYes(publishCol)) { results.push({ title, action: 'skipped — Publikovat není "ano"' }); continue; }

      const slug = slugify(title);
      const category = VALID_CATEGORIES.includes((categoryCol || '').trim().toLowerCase()) ? categoryCol.trim().toLowerCase() : 'novinky';
      const audience = VALID_AUDIENCE.includes((audienceCol || '').trim().toLowerCase()) ? audienceCol.trim().toLowerCase() : 'oboji';

      const postData = {
        title: title.trim(),
        slug,
        category,
        audience,
        perex: perex || '',
        content: content || '',
        image_url: image || '',
        tags: (tagsCol || '').split(',').map((t) => t.trim()).filter(Boolean),
        published: true,
        published_date: dateCol || new Date().toISOString().split('T')[0],
      };

      const existing = existingPosts.find((p) => p.slug === slug || p.title?.toLowerCase() === title.trim().toLowerCase());
      if (existing) {
        await base44.asServiceRole.entities.BlogPost.update(existing.id, postData);
        results.push({ title, action: 'updated' });
      } else {
        await base44.asServiceRole.entities.BlogPost.create(postData);
        results.push({ title, action: 'created' });
      }
    }

    return Response.json({ success: true, count: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}