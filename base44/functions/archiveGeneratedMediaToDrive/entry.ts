import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const DRIVE_VIDEO_ROOT = '1Yio91tKJgFxUZ8IXkZdSVty5Xvdq-H_d';
const DRIVE_PHOTO_ROOT = '1A0dHtpLXc_WV2836HAmVH_SyuTX_4Cfp';
const DRIVE_PRODUCT_ROOT = '1psx_yBPFjkIRYZkeT3L0SuckMgMgpILG';

const sanitizeName = (value = '') => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9._ -]+/g, '_')
  .replace(/\s+/g, '_')
  .replace(/_+/g, '_')
  .slice(0, 120) || `MLZIDLA_${Date.now()}`;

const allowedMediaUrl = (raw) => {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && (
      url.hostname === 'media.base44.com' ||
      url.hostname.endsWith('.base44.com') ||
      url.hostname.endsWith('.base44.app')
    );
  } catch {
    return false;
  }
};

async function driveJson(url, accessToken, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Drive API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function ensureFolder(name, parentId, accessToken) {
  const escaped = name.replace(/'/g, "\\'");
  const q = `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${escaped}' and trashed=false`;
  const search = await driveJson(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)&pageSize=10&supportsAllDrives=true&includeItemsFromAllDrives=true`,
    accessToken,
  );
  if (search.files?.[0]) return search.files[0];

  return driveJson('https://www.googleapis.com/drive/v3/files?supportsAllDrives=true', accessToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    }),
  });
}

async function uploadBlob(name, parentId, blob, mimeType, accessToken) {
  const boundary = `mlzidla_${crypto.randomUUID()}`;
  const metadata = JSON.stringify({ name, parents: [parentId] });
  const prefix = new TextEncoder().encode(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`
  );
  const suffix = new TextEncoder().encode(`\r\n--${boundary}--`);
  const bytes = new Uint8Array(prefix.length + blob.size + suffix.length);
  bytes.set(prefix, 0);
  bytes.set(new Uint8Array(await blob.arrayBuffer()), prefix.length);
  bytes.set(suffix, prefix.length + blob.size);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,mimeType,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: bytes,
    },
  );
  if (!res.ok) throw new Error(`Drive upload ${res.status}: ${await res.text()}`);
  return res.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const fileUrl = String(body.fileUrl || '');
    const productSlug = String(body.productSlug || '').trim();
    const requestedRole = String(body.mediaRole || '').trim();

    if (!fileUrl || !allowedMediaUrl(fileUrl)) {
      return Response.json({ error: 'Unsupported media URL.' }, { status: 400 });
    }

    const source = await fetch(fileUrl);
    if (!source.ok) throw new Error(`Source media ${source.status}`);
    const blob = await source.blob();
    const mimeType = String(body.mimeType || blob.type || source.headers.get('content-type') || 'application/octet-stream').split(';')[0];
    const isVideo = mimeType.startsWith('video/');
    const isImage = mimeType.startsWith('image/');
    if (!isVideo && !isImage) return Response.json({ error: 'Only image/video media can be archived.' }, { status: 400 });

    const ext = isVideo ? '.mp4' : (mimeType.includes('webp') ? '.webp' : mimeType.includes('png') ? '.png' : '.jpg');
    const fileName = sanitizeName(String(body.fileName || `MLZIDLA_${Date.now()}${ext}`));

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const products = productSlug ? await base44.asServiceRole.entities.Product.filter({ slug: productSlug }) : [];
    const product = products?.[0] || null;
    const folderLabel = sanitizeName(product?.name || productSlug || 'GENERAL');

    const mediaRoot = isVideo ? DRIVE_VIDEO_ROOT : DRIVE_PHOTO_ROOT;
    const mediaProductFolder = await ensureFolder(folderLabel, mediaRoot, accessToken);
    const primaryDriveFile = await uploadBlob(fileName, mediaProductFolder.id, blob, mimeType, accessToken);

    let productDriveFile = null;
    let productFolder = null;
    if (product) {
      productFolder = await ensureFolder(folderLabel, DRIVE_PRODUCT_ROOT, accessToken);
      productDriveFile = await uploadBlob(fileName, productFolder.id, blob, mimeType, accessToken);
    }

    const mediaRole = requestedRole || (isVideo ? 'video' : 'render');
    const existingMedia = await base44.asServiceRole.entities.MediaFile.filter({ file_url: fileUrl });
    if (!existingMedia?.length) {
      await base44.asServiceRole.entities.MediaFile.create({
        file_url: fileUrl,
        file_name: fileName,
        file_type: mimeType,
        product_slug: product?.slug || productSlug || '',
        media_group: product?.product_family || folderLabel,
        media_role: mediaRole,
        sort_order: Date.now(),
      });
    }

    if (product && isImage) {
      const gallery = Array.isArray(product.gallery_urls) ? product.gallery_urls : [];
      if (!gallery.includes(fileUrl) && product.image_url !== fileUrl) {
        await base44.asServiceRole.entities.Product.update(product.id, {
          gallery_urls: [...gallery, fileUrl],
        });
      }
    }

    return Response.json({
      success: true,
      archived: {
        media_folder: `https://drive.google.com/drive/folders/${mediaProductFolder.id}`,
        media_file: `https://drive.google.com/file/d/${primaryDriveFile.id}/view`,
        product_folder: productFolder ? `https://drive.google.com/drive/folders/${productFolder.id}` : null,
        product_file: productDriveFile ? `https://drive.google.com/file/d/${productDriveFile.id}/view` : null,
      },
      linked_product: product ? { id: product.id, slug: product.slug, name: product.name } : null,
    });
  } catch (error) {
    console.error('archiveGeneratedMediaToDrive failed', error);
    return Response.json({ error: error.message || 'Archive failed' }, { status: 500 });
  }
});
