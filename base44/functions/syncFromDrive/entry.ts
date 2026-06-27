import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Syncs products and realizace from Google Drive folder structure
// 
// Expected folder structure:
//   /[Root]/
//     Produkty/
//       OSTEV/
//         01-foto.jpg (main), 02-detail.jpg (gallery), ...
//         info.txt (optional: slug, short_description, material, pressure, micron_size, water_consumption, coverage_area, power_supply, featured)
//       MRAK/
//     Realizace/  (nebo Realizace/)
//       Projektový název/
//         01-foto.jpg (main), 02-foto.jpg (gallery)
//         realizace.txt (optional: client, location, year, category, description, product_used, featured)

async function driveGet(url, accessToken) {
  const sep = url.includes('?') ? '&' : '?';
  const fullUrl = url + sep + 'supportsAllDrives=true&includeItemsFromAllDrives=true';
  const res = await fetch(fullUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`Drive API ${res.status}: ${await res.text()}`);
  return res.json();
}

function parseTextFile(text) {
  const data = {};
  for (const line of text.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase().replace(/[\s-]/g, '_');
    const val = line.slice(idx + 1).trim();
    if (key && val) data[key] = val;
  }
  return data;
}

function driveImageUrl(fileId) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
}

async function listFolderContents(folderId, accessToken) {
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    `'${folderId}' in parents and trashed=false`
  )}&fields=files(id,name,mimeType)&pageSize=1000&supportsAllDrives=true&includeItemsFromAllDrives=true`;
  const data = await driveGet(url, accessToken);
  return data.files || [];
}

async function listSubfolders(folderId, accessToken) {
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
  )}&fields=files(id,name)&pageSize=1000&supportsAllDrives=true&includeItemsFromAllDrives=true`;
  const data = await driveGet(url, accessToken);
  return data.files || [];
}

async function getFileContent(fileId, accessToken) {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  return res.text();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const rootFolderId = body.folderId;
    if (!rootFolderId) return Response.json({ error: 'folderId required' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    // Load existing entities
    const [existingProducts, existingRealizace, categories] = await Promise.all([
      base44.asServiceRole.entities.Product.list(),
      base44.asServiceRole.entities.Realizace.list(),
      base44.asServiceRole.entities.ProductCategory.list(),
    ]);

    const results = { products: [], realizace: [] };

    // ────────────────────────────────────────────────────────────────────────
    // SYNC PRODUKTY
    // ────────────────────────────────────────────────────────────────────────
    const rootContents = await listSubfolders(rootFolderId, accessToken);
    const produktyFolder = rootContents.find(f => /^(produkty|products)$/i.test(f.name));

    if (produktyFolder) {
      const productFolders = await listSubfolders(produktyFolder.id, accessToken);

      for (const folder of productFolders) {
        const productName = folder.name;
        const contents = await listFolderContents(folder.id, accessToken);

        // Separate images from info files
        const imageFiles = contents
          .filter(f => f.mimeType.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(f.name))
          .sort((a, b) => a.name.localeCompare(b.name));

        const infoFile = contents.find(f => /^(info|data|produkt)\.txt$/i.test(f.name));

        let parsedInfo = {};
        if (infoFile) {
          const text = await getFileContent(infoFile.id, accessToken);
          if (text) parsedInfo = parseTextFile(text);
        }

        const mainImageUrl = imageFiles.length > 0 ? driveImageUrl(imageFiles[0].id) : '';
        const galleryUrls = imageFiles.slice(1).map(f => driveImageUrl(f.id));

        const slug = parsedInfo.slug ||
          productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const matchedCategory = categories.find(c =>
          productName.toLowerCase().includes(c.name.toLowerCase()) ||
          (c.name || '').toLowerCase().includes(productName.toLowerCase().split(' ')[0])
        ) || categories[0];

        const productData = {
          name: productName,
          slug,
          category_id: matchedCategory?.id || '',
          short_description: parsedInfo.short_description || '',
          description: parsedInfo.description || '',
          image_url: mainImageUrl,
          gallery_urls: galleryUrls,
          material: parsedInfo.material || '',
          pressure: parsedInfo.pressure || '',
          micron_size: parsedInfo.micron_size || '',
          water_consumption: parsedInfo.water_consumption || '',
          coverage_area: parsedInfo.coverage_area || '',
          power_supply: parsedInfo.power_supply || '',
          featured: parsedInfo.featured === 'true' || parsedInfo.featured === 'ano',
        };

        const existing = existingProducts.find(p =>
          p.name?.toLowerCase() === productName.toLowerCase() || p.slug === slug
        );

        if (existing) {
          await base44.asServiceRole.entities.Product.update(existing.id, productData);
          results.products.push({ name: productName, action: 'updated', images: imageFiles.length });
        } else {
          await base44.asServiceRole.entities.Product.create(productData);
          results.products.push({ name: productName, action: 'created', images: imageFiles.length });
        }
      }
    }

    // ────────────────────────────────────────────────────────────────────────
    // SYNC REALIZACE
    // ────────────────────────────────────────────────────────────────────────
    const realizaceFolder = rootContents.find(f => /^(realizace|realizações|projects?)$/i.test(f.name));

    if (realizaceFolder) {
      const projectFolders = await listSubfolders(realizaceFolder.id, accessToken);

      for (const folder of projectFolders) {
        const projectName = folder.name;
        const contents = await listFolderContents(folder.id, accessToken);

        const imageFiles = contents
          .filter(f => f.mimeType.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(f.name))
          .sort((a, b) => a.name.localeCompare(b.name));

        const infoFile = contents.find(f => /^(realizace|project|data)\.txt$/i.test(f.name));

        let parsedInfo = {};
        if (infoFile) {
          const text = await getFileContent(infoFile.id, accessToken);
          if (text) parsedInfo = parseTextFile(text);
        }

        const mainImageUrl = imageFiles.length > 0 ? driveImageUrl(imageFiles[0].id) : '';
        const galleryUrls = imageFiles.slice(1).map(f => driveImageUrl(f.id));

        const realizaceData = {
          name: projectName,
          client: parsedInfo.client || parsedInfo.klient || '',
          location: parsedInfo.location || parsedInfo.lokace || '',
          year: parsedInfo.year ? Number(parsedInfo.year) : new Date().getFullYear(),
          category: parsedInfo.category || 'mestsky', // default to mestsky
          description: parsedInfo.description || '',
          image_url: mainImageUrl,
          gallery_urls: galleryUrls,
          product_used: parsedInfo.product_used || parsedInfo.produkt || '',
          featured: parsedInfo.featured === 'true' || parsedInfo.featured === 'ano',
          published: parsedInfo.published === 'true' || parsedInfo.published === 'ano' || false,
        };

        // Match by name
        const existing = existingRealizace.find(r => r.name?.toLowerCase() === projectName.toLowerCase());

        if (existing) {
          await base44.asServiceRole.entities.Realizace.update(existing.id, realizaceData);
          results.realizace.push({ name: projectName, action: 'updated', images: imageFiles.length });
        } else {
          await base44.asServiceRole.entities.Realizace.create(realizaceData);
          results.realizace.push({ name: projectName, action: 'created', images: imageFiles.length });
        }
      }
    }

    return Response.json({
      success: true,
      synced: results.products.length + results.realizace.length,
      results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});