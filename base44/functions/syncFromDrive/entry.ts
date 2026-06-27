import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Reads a Google Drive folder and syncs products + photos into the Product entity.
//
// Folder structure expected:
//   /[Root Folder]/
//     [ProductName]/          ← subfolder per product
//       *.jpg / *.png         ← photos (first = main image, rest = gallery)
//       info.txt OR data.txt  ← optional text file with product data (key: value lines)
//
// Supported keys in info.txt:
//   slug, short_description, description, material, pressure,
//   micron_size, water_consumption, coverage_area, power_supply, featured

async function driveGet(url, accessToken) {
  // Always add Shared Drive support params
  const sep = url.includes('?') ? '&' : '?';
  const fullUrl = url + sep + 'supportsAllDrives=true&includeItemsFromAllDrives=true';
  const res = await fetch(fullUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Drive API error ${res.status}: ${err}`);
  }
  return res.json();
}

function parseInfoTxt(text) {
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

// Make a Drive file publicly readable and return a direct image URL
function driveImageUrl(fileId) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const folderId = body.folderId;
    if (!folderId) return Response.json({ error: 'folderId is required' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    // 1. List subfolders (each subfolder = one product)
    const foldersUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
    )}&fields=files(id,name)&pageSize=100&supportsAllDrives=true&includeItemsFromAllDrives=true`;

    const foldersData = await driveGet(foldersUrl, accessToken);
    const productFolders = foldersData.files || [];

    if (productFolders.length === 0) {
      return Response.json({ error: 'No product subfolders found in the specified folder.' }, { status: 400 });
    }

    // 2. Load existing products & categories for matching
    const [existingProducts, categories] = await Promise.all([
      base44.asServiceRole.entities.Product.list(),
      base44.asServiceRole.entities.ProductCategory.list(),
    ]);

    const results = [];

    for (const folder of productFolders) {
      const productName = folder.name;

      // List all files in this product subfolder
      const filesUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        `'${folder.id}' in parents and trashed=false`
      )}&fields=files(id,name,mimeType)&pageSize=100&supportsAllDrives=true&includeItemsFromAllDrives=true`;

      const filesData = await driveGet(filesUrl, accessToken);
      const files = filesData.files || [];

      // Separate images from info file
      const imageFiles = files.filter(f =>
        f.mimeType.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(f.name)
      ).sort((a, b) => a.name.localeCompare(b.name));

      const infoFile = files.find(f => /^(info|data|produkt)\.txt$/i.test(f.name));

      // Parse info.txt if present
      let parsedInfo = {};
      if (infoFile) {
        const textRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${infoFile.id}?alt=media&supportsAllDrives=true`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (textRes.ok) {
          const text = await textRes.text();
          parsedInfo = parseInfoTxt(text);
        }
      }

      // Build image URLs
      const mainImageUrl = imageFiles.length > 0 ? driveImageUrl(imageFiles[0].id) : '';
      const galleryUrls = imageFiles.slice(1).map(f => driveImageUrl(f.id));

      // Auto-generate slug from name if not in info.txt
      const slug = parsedInfo.slug ||
        productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // Find matching category (first category that matches by name substring, else first)
      const matchedCategory = categories.find(c =>
        productName.toLowerCase().includes(c.name.toLowerCase()) ||
        (c.name || '').toLowerCase().includes(productName.toLowerCase().split(' ')[0])
      ) || categories[0];

      const productData = {
        name: productName,
        slug,
        category_id: matchedCategory?.id || '',
        short_description: parsedInfo.short_description || parsedInfo.kratky_popis || '',
        description: parsedInfo.description || parsedInfo.popis || '',
        image_url: mainImageUrl,
        gallery_urls: galleryUrls,
        material: parsedInfo.material || parsedInfo.material || '',
        pressure: parsedInfo.pressure || parsedInfo.tlak || '',
        micron_size: parsedInfo.micron_size || parsedInfo.micron || '',
        water_consumption: parsedInfo.water_consumption || parsedInfo.spotreba_vody || '',
        coverage_area: parsedInfo.coverage_area || parsedInfo.plocha || '',
        power_supply: parsedInfo.power_supply || parsedInfo.napajeni || '',
        featured: parsedInfo.featured === 'true' || parsedInfo.zvyrazneny === 'ano',
      };

      // Check if product already exists (match by name or slug)
      const existing = existingProducts.find(p =>
        p.name?.toLowerCase() === productName.toLowerCase() || p.slug === slug
      );

      if (existing) {
        await base44.asServiceRole.entities.Product.update(existing.id, productData);
        results.push({ name: productName, action: 'updated', images: imageFiles.length });
      } else {
        await base44.asServiceRole.entities.Product.create(productData);
        results.push({ name: productName, action: 'created', images: imageFiles.length });
      }
    }

    return Response.json({
      success: true,
      synced: results.length,
      results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});