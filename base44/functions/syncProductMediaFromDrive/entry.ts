import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { MLZNY_DRIVE_ID } from '../../shared/offerDrive.ts';
import { CATALOG_LINES, SKIP_FOLDER_RE, guessRole } from '../../shared/driveCatalogMap.ts';

const IMG_RE = /^image\//;
const MAX_IMAGE_BYTES = 40 * 1024 * 1024;
const MAX_VIDEO_BYTES = 30 * 1024 * 1024;
const MAX_PDF_BYTES = 20 * 1024 * 1024;

async function driveList(token, folderId) {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed=false`,
    corpora: 'drive',
    driveId: MLZNY_DRIVE_ID,
    includeItemsFromAllDrives: 'true',
    supportsAllDrives: 'true',
    pageSize: '200',
    fields: 'files(id,name,mimeType,size,thumbnailLink,modifiedTime)',
    orderBy: 'name',
  });
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Drive list ${res.status}: ${await res.text()}`);
  return (await res.json()).files || [];
}

async function walk(token, folderId, depth, acc, pathName) {
  const files = await driveList(token, folderId);
  for (const f of files) {
    const isDir = f.mimeType === 'application/vnd.google-apps.folder';
    if (isDir) {
      if (depth < 2 && !SKIP_FOLDER_RE.test(f.name)) await walk(token, f.id, depth + 1, acc, `${pathName}/${f.name}`);
      continue;
    }
    acc.push({ ...f, path: `${pathName}/${f.name}` });
  }
  return acc;
}

async function fetchBytes(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  return new Uint8Array(await res.arrayBuffer());
}

function safeName(name, ext) {
  const base = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 60);
  return `${base || 'media'}.${ext}`;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const lineKey = String(body.line || '');
    const line = CATALOG_LINES[lineKey];
    if (!line) return Response.json({ error: 'Unknown line', lines: Object.keys(CATALOG_LINES) }, { status: 400 });

    const dryRun = body.dry_run !== false;
    const maxImages = Math.min(Number(body.max_images ?? 6), 16);
    const maxVideos = Math.min(Number(body.max_videos ?? 1), 3);
    const maxDocs = Math.min(Number(body.max_docs ?? 3), 6);

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const seenNames = new Set();
    const files = (await walk(accessToken, line.folderId, 0, [], lineKey)).filter((f) => {
      const key = `${f.name}|${f.size || 0}`.toLowerCase();
      if (seenNames.has(key)) return false;
      seenNames.add(key);
      return true;
    });

    // Už zpracované soubory (klíč = Drive file id uložený v media_group)
    const existing = await base44.asServiceRole.entities.MediaFile.filter({ media_group: { $regex: `^drive:` } }, '-created_date', 500).catch(() => []);
    const done = new Set((existing || []).map((m) => String(m.media_group).replace('drive:', '')));

    const images = files.filter((f) => IMG_RE.test(f.mimeType) && !done.has(f.id) && Number(f.size || 0) < MAX_IMAGE_BYTES && f.thumbnailLink)
      .sort((a, b) => {
        const score = (f) => (/vizual|render|gemini|chatgpt|ai_/i.test(f.path) ? 2 : /foto_real|_foto|realiz|reference|\.jpe?g$|\.heic$/i.test(f.path) ? 0 : 1);
        return score(a) - score(b) || String(b.modifiedTime).localeCompare(String(a.modifiedTime));
      })
      .slice(0, maxImages);
    const videos = files.filter((f) => f.mimeType === 'video/mp4' && !done.has(f.id) && Number(f.size || 0) > 0 && Number(f.size) < MAX_VIDEO_BYTES)
      .sort((a, b) => Number(b.size) - Number(a.size)).slice(0, maxVideos);
    const docs = files.filter((f) => (f.mimeType === 'application/pdf' && Number(f.size || 0) < MAX_PDF_BYTES) || f.mimeType === 'application/vnd.google-apps.document')
      .filter((f) => !done.has(f.id) && !/nabidk|cenov|offer|smlouv|faktur/i.test(f.name)).slice(0, maxDocs);

    if (dryRun) {
      return Response.json({ ok: true, dry_run: true, line: lineKey, total_files: files.length, images: images.map((f) => f.path), videos: videos.map((f) => `${f.path} (${Math.round(Number(f.size) / 1e6)} MB)`), docs: docs.map((f) => f.path) });
    }

    const upload = async (bytes, name, type) => {
      const file = new File([bytes], name, { type });
      const { file_url } = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file });
      return file_url;
    };

    const uploaded = { images: [], videos: [], docs: [] };
    for (const f of images) {
      const big = f.thumbnailLink.replace(/=s\d+(-[a-z]+)?$/, '=s1600');
      const bytes = await fetchBytes(big, accessToken);
      if (!bytes) continue;
      const url = await upload(bytes, safeName(f.name, 'jpg'), 'image/jpeg');
      uploaded.images.push({ url, role: guessRole(f.path), name: f.name, id: f.id });
    }
    for (const f of videos) {
      const bytes = await fetchBytes(`https://www.googleapis.com/drive/v3/files/${f.id}?alt=media&supportsAllDrives=true`, accessToken);
      if (!bytes) continue;
      const url = await upload(bytes, safeName(f.name, 'mp4'), 'video/mp4');
      uploaded.videos.push({ url, name: f.name, id: f.id });
    }
    for (const f of docs) {
      const src = f.mimeType === 'application/pdf'
        ? `https://www.googleapis.com/drive/v3/files/${f.id}?alt=media&supportsAllDrives=true`
        : `https://www.googleapis.com/drive/v3/files/${f.id}/export?mimeType=application/pdf`;
      const bytes = await fetchBytes(src, accessToken);
      if (!bytes) continue;
      const url = await upload(bytes, safeName(f.name, 'pdf'), 'application/pdf');
      uploaded.docs.push({ url, name: f.name, id: f.id });
    }

    // Registrace do MediaFile (drive id v media_group brání duplicitám)
    const primarySlug = line.slugs[0];
    const records = [
      ...uploaded.images.map((m, i) => ({ file_url: m.url, file_name: m.name, file_type: 'image/jpeg', product_slug: primarySlug, media_group: `drive:${m.id}`, media_role: m.role, sort_order: i })),
      ...uploaded.videos.map((m, i) => ({ file_url: m.url, file_name: m.name, file_type: 'video/mp4', product_slug: primarySlug, media_group: `drive:${m.id}`, media_role: 'video', sort_order: i })),
      ...uploaded.docs.map((m, i) => ({ file_url: m.url, file_name: m.name, file_type: 'application/pdf', product_slug: primarySlug, media_group: `drive:${m.id}`, media_role: 'technology', sort_order: i })),
    ];
    if (records.length) await base44.asServiceRole.entities.MediaFile.bulkCreate(records);

    // Všechna média z Drivu pro tuto řadu (včetně dříve nahraných) — funkce je idempotentní
    const lineMedia = (existing || []).filter((m) => m.product_slug === primarySlug);
    const imageUrls = [...lineMedia.filter((m) => m.media_role !== 'video' && m.media_role !== 'technology').map((m) => m.file_url), ...uploaded.images.map((m) => m.url)];
    const docUrls = [...lineMedia.filter((m) => m.media_role === 'technology').map((m) => m.file_url), ...uploaded.docs.map((m) => m.url)];
    const videoUrl = uploaded.videos[0]?.url || lineMedia.find((m) => m.media_role === 'video')?.file_url || '';

    // Doplnění produktů dané řady
    const updated = [];
    for (const slug of line.slugs) {
      const found = await base44.asServiceRole.entities.Product.filter({ slug });
      const p = found?.[0];
      if (!p) continue;
      const gallery = [...new Set([...(p.gallery_urls || []), ...imageUrls])].slice(0, 24);
      const documents = [...new Set([...(p.documents_urls || []), ...docUrls])].slice(0, 12);
      const patch = { gallery_urls: gallery, documents_urls: documents };
      if (!p.video_url && videoUrl) patch.video_url = videoUrl;
      if (!p.image_url && gallery[0]) patch.image_url = gallery[0];
      // updateMany + $set: neprovádí validaci starých polí (např. prázdné hero_updated_at)
      await base44.asServiceRole.entities.Product.updateMany({ id: p.id }, { $set: patch });
      updated.push({ slug, gallery: gallery.length, documents: documents.length, video: Boolean(patch.video_url || p.video_url) });
    }

    return Response.json({ ok: true, line: lineKey, uploaded: { images: uploaded.images.length, videos: uploaded.videos.length, docs: uploaded.docs.length }, updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}