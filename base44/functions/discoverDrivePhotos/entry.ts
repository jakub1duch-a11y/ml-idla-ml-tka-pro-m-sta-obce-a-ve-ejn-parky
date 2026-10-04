import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { MLZNY_DRIVE_ID } from '../../shared/offerDrive.ts';

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif)$/i;
const IMAGE_MIME = /^image\//;

// Drive thumbnail URL with good resolution for web use
function driveImageUrl(fileId) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
}

async function driveGet(url, accessToken) {
  const fullUrl = url + (url.includes('?') ? '&' : '?') + 'supportsAllDrives=true&includeItemsFromAllDrives=true';
  const res = await fetch(fullUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`Drive API ${res.status}: ${await res.text()}`);
  return res.json();
}

/**
 * Search for image files anywhere in the shared drive, optionally within a folder.
 */
async function searchImages(accessToken, folderId, pageToken) {
  const params = new URLSearchParams({
    corpora: 'drive',
    driveId: MLZNY_DRIVE_ID,
    includeItemsFromAllDrives: 'true',
    supportsAllDrives: 'true',
    pageSize: '200',
    fields: 'files(id,name,mimeType,thumbnailLink,modifiedTime,parents),nextPageToken',
    q: folderId
      ? `('${folderId}' in parents) and (mimeType contains 'image/') and trashed=false`
      : `(mimeType contains 'image/') and trashed=false`,
    orderBy: 'modifiedTime desc',
  });
  if (pageToken) params.set('pageToken', pageToken);
  return driveGet(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, accessToken);
}

/**
 * Guess product slug from filename or path keywords.
 */
function guessProductSlug(name) {
  const lower = name.toLowerCase();
  const map = [
    { slug: 'mlzitko-bendy', keys: ['bendy'] },
    { slug: 'mlzitko-mrak', keys: ['mrak', 'mrac', 'mlzny-mrak'] },
    { slug: 'mlzitko-aura', keys: ['aura'] },
    { slug: 'mlzna-brana-gate', keys: ['gate', 'brana'] },
    { slug: 'mlzna-brana-linea', keys: ['linea'] },
    { slug: 'mlzitko-lolli', keys: ['lolli', 'loly'] },
    { slug: 'mlzny-sloupost-ostrev', keys: ['ostrev', 'ostrev'] },
  ];
  for (const item of map) {
    if (item.keys.some((k) => lower.includes(k))) return item.slug;
  }
  return '';
}

function guessMediaRole(name) {
  const lower = name.toLowerCase();
  if (/hero|hlavni|01-/.test(lower)) return 'hero';
  if (/detail|closeup|makro/.test(lower)) return 'detail';
  if (/realiz|instal|misto|akce/.test(lower)) return 'realization';
  if (/render|vizual|3d/.test(lower)) return 'render';
  if (/video|mp4|mov/.test(lower)) return 'video';
  if (/tech|vyrobek|produkt/.test(lower)) return 'gallery';
  return 'unassigned';
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const folderId = body.folder_id || '';
    const dryRun = body.dry_run !== false;
    const limit = Math.min(Number(body.limit || 100), 500);

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    // Fetch existing MediaFile URLs to avoid duplicates
    const existing = await base44.asServiceRole.entities.MediaFile.list('-updated_date', 500);
    const existingUrls = new Set((existing || []).map((m) => String(m.file_url || '')));
    const existingNames = new Set((existing || []).map((m) => String(m.file_name || '').toLowerCase()));

    // Search for images in the shared drive
    let allFiles = [];
    let pageToken = '';
    let pages = 0;
    do {
      const data = await searchImages(accessToken, folderId, pageToken || undefined);
      allFiles = allFiles.concat(data.files || []);
      pageToken = data.nextPageToken || '';
      pages += 1;
    } while (pageToken && pages < 5 && allFiles.length < limit);

    // Filter: only images, not already registered
    const newImages = allFiles
      .filter((f) => IMAGE_MIME.test(f.mimeType || '') || IMAGE_EXTENSIONS.test(f.name || ''))
      .filter((f) => {
        const url = driveImageUrl(f.id);
        return !existingUrls.has(url) && !existingNames.has(String(f.name || '').toLowerCase());
      })
      .slice(0, limit);

    if (dryRun) {
      return Response.json({
        ok: true,
        dry_run: true,
        total_found: allFiles.length,
        already_registered: allFiles.length - newImages.length,
        new_count: newImages.length,
        new_images: newImages.map((f) => ({
          id: f.id,
          name: f.name,
          thumbnail: f.thumbnailLink || driveImageUrl(f.id),
          guessed_slug: guessProductSlug(f.name),
          guessed_role: guessMediaRole(f.name),
        })),
      });
    }

    // Register new images in MediaFile
    const created = [];
    for (const file of newImages) {
      const url = driveImageUrl(file.id);
      const slug = guessProductSlug(file.name);
      const role = guessMediaRole(file.name);
      const record = await base44.asServiceRole.entities.MediaFile.create({
        file_url: url,
        file_name: file.name,
        file_type: file.mimeType || 'image/jpeg',
        product_slug: slug,
        media_group: slug ? slug.replace(/-/g, ' ') : 'nové',
        media_role: role,
        sort_order: 0,
      });
      created.push({ id: record.id, name: file.name, slug, role });
    }

    return Response.json({
      ok: true,
      total_found: allFiles.length,
      already_registered: allFiles.length - newImages.length,
      new_registered: created.length,
      created: created.slice(0, 50),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}