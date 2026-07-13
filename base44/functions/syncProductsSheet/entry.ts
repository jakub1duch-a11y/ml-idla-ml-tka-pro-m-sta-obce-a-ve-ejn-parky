import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Spreadsheet: "Produkty web mlzidla.cz"
const SPREADSHEET_ID = '10y9i61PrrewifFTLwrXia9IF0ogC_zLqqKdBi98nvWI';
const SHEET_NAME = 'Produkty';

function slugify(text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
function splitUrls(val) {
  return (val || '').split(',').map((s) => s.trim()).filter(Boolean);
}
function isYes(val) {
  return ['ano', 'yes', 'true', '1'].includes((val || '').trim().toLowerCase());
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Allow scheduled/automation calls (no user session); if a user IS present, require admin.
    const user = await base44.auth.me().catch(() => null);
    if (user && user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const sheetRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A2:R1000`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!sheetRes.ok) return Response.json({ error: 'Sheets API error: ' + (await sheetRes.text()) }, { status: 500 });
    const sheetData = await sheetRes.json();
    const rows = sheetData.values || [];

    const [existingProducts, categories] = await Promise.all([
      base44.asServiceRole.entities.Product.list(),
      base44.asServiceRole.entities.ProductCategory.list(),
    ]);

    const results = [];
    for (const row of rows) {
      const [name, slugCol, categoryCol, shortDesc, desc, image, gallery, video, material, pressure, micron, water, coverage, power, price, featuredCol, docsCol, publishCol] = row;
      if (!name || !name.trim()) continue;
      if (!isYes(publishCol)) { results.push({ name, action: 'skipped — Publikovat není "ano"' }); continue; }

      const slug = (slugCol && slugCol.trim()) || slugify(name);
      const matchedCategory = categories.find((c) =>
        (c.slug || '').toLowerCase() === (categoryCol || '').trim().toLowerCase() ||
        (c.name || '').toLowerCase() === (categoryCol || '').trim().toLowerCase()
      ) || categories[0];

      const productData = {
        name: name.trim(),
        slug,
        category_id: matchedCategory?.id || '',
        short_description: shortDesc || '',
        description: desc || '',
        image_url: image || '',
        gallery_urls: splitUrls(gallery),
        video_url: video || '',
        material: material || '',
        pressure: pressure || '',
        micron_size: micron || '',
        water_consumption: water || '',
        coverage_area: coverage || '',
        power_supply: power || '',
        featured: isYes(featuredCol),
        documents_urls: splitUrls(docsCol),
      };
      const parsedPrice = price ? Number(String(price).replace(/[^0-9.]/g, '')) : NaN;
      if (!isNaN(parsedPrice)) productData.price_from = parsedPrice;

      const existing = existingProducts.find((p) => p.slug === slug || p.name?.toLowerCase() === name.trim().toLowerCase());
      if (existing) {
        await base44.asServiceRole.entities.Product.update(existing.id, productData);
        results.push({ name, action: 'updated' });
      } else {
        await base44.asServiceRole.entities.Product.create(productData);
        results.push({ name, action: 'created' });
      }
    }

    return Response.json({ success: true, count: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});