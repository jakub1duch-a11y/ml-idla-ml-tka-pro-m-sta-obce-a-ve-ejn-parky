import { fetchImageAsBase64, toBase64 } from './pdfHelpers.ts';
// Explicit variant folders prevent mixing TR60/J70, MRAK/1414 or different animal silhouettes.
const SOURCES = {
  'mlzitko-mrak': { folder: '18V4_DMRqXPhf6IxP4WFzi_lE8rfT8FqL', files: ['1dEX1K4GDx1VKBVJx1nBCJDsdaqbhHJKR'] },
  'mlzitko-mrak-1414': { folder: '1AxkE9buFAlk9CMNUxqE6shNEEGxwrZBi', files: ['1saDqN3I7w3Ny_MPK9sgRXRBJewEErbw-', '1W7pELD1L6vnOaz1wAhSz1oNjLaTX3C9F', '1DNnQJwMkSGfHOne0waKUClPLtgWNdYPT'] },
  'mlzitko-volavka': { folder: '1zGOImiXGwAlEcCv7Xs66c32kuvnG2G7v', files: ['1vR1mTmP8UracPKV6KN0Ay9XjGqC0JVFw', '1kti2ovtuGrI-lcUtC4jzQHpkUbZQVUSC', '1Ul6PK5dcwz_ZJG8U-m4jLZwchzcon5_B'] },
  'y-armist-tr60': { folder: '1OtbstfDyf0yWodTet3asJfYPg-odzfNn', files: ['17fq2ZQLEuUjUrjoBzUifs7kcdFvXfqTz', '1YFQNuQL1NX3B8vIa0N60-RW83V-RzPTx', '1_mM5cMKHuUWSn0G4XOjEdgsXI8oekAxt'] },
  'y-armist-j70': { folder: '1OtbstfDyf0yWodTet3asJfYPg-odzfNn', files: ['13EsB-_vBL6QVoLRUG8TIYgqXVuVcEV_v', '1L5tweFHDdejBarr69_gS8GBT1Cb4JjTf', '1axlLHd0nett_LkN-Z5pDsvwXvZX3sCKB'] },
};
// Always resolve offer imagery from the current Base44 administration at generation time.
// Only images explicitly approved for client presentations are eligible.
export async function listApprovedProductVisuals(base44, product, options = {}) {
  const slug = String(product?.slug || '').toLowerCase();
  if (!slug) return [];
  const isMrak = slug.includes('mrak');
  const requestedVariant = `${slug} ${product?.name || ''}`.match(/(?:^|\D)(1413|1414|1480|2424)(?:\D|$)/)?.[1] || '';
  let response;
  try {
    response = await base44.asServiceRole.entities.VisualizationAsset.filter(
      { approval_status: 'approved', approved_for_presentation: true },
      { sort: '-updated_date', limit: 500 },
    );
  } catch (error) {
    console.warn('Approved Base44 visuals unavailable', error);
    return [];
  }
  const rows = Array.isArray(response) ? response : (response?.items || []);
  const matching = rows.filter((item) => {
    if (!item?.image_url || item.approval_status !== 'approved' || item.approved_for_presentation !== true) return false;
    const assetSlug = String(item.product_slug || '').toLowerCase();
    if (assetSlug === slug) return true;
    // The older MRAK family uses a generic slug; prevent mixing the 1413, 1414, 1480 and 2424 geometries.
    if (isMrak && requestedVariant && assetSlug === 'mlzitko-mrak') {
      const label = String(item.title || item.product_name || '');
      return new RegExp(`(?:^|\\D)${requestedVariant}(?:\\D|$)`).test(label);
    }
    return false;
  });
  const inquiryId = String(options.inquiryId || '');
  const environment = String(options.environment || '');
  return matching.sort((a, b) => {
    const score = (item) =>
      (inquiryId && item.source_inquiry_id === inquiryId ? 1000 : 0) +
      (String(item.product_slug).toLowerCase() === slug ? 200 : 0) +
      (environment && item.environment === environment ? 100 : 0) +
      (item.is_primary_for_variant ? 20 : 0);
    return score(b) - score(a) ||
      Date.parse(b.updated_date || b.created_date || 0) - Date.parse(a.updated_date || a.created_date || 0);
  });
}

export async function loadOriginalProductScenes(base44, product, options = {}) {
  const approved = await listApprovedProductVisuals(base44, product, options);
  const scenes = [];
  for (const visual of approved.slice(0, 6)) {
    if (scenes.length >= 3) break;
    const img = await fetchImageAsBase64(visual.image_url);
    if (!img) continue;
    scenes.push({
      url: visual.image_url,
      title: visual.title || product.name,
      source: 'base44_approved_visual',
      source_visualization_id: visual.id,
      geometry_preserved: false,
      generated_by_ai: true,
      caption: 'Vizualizace schválená v administraci MLŽIDLA.cz; finální geometrii potvrzuje výrobní dokumentace.',
      sort_order: scenes.length,
      img,
    });
  }
  if (scenes.length) return scenes;
  const source = SOURCES[product.slug];
  if (source) {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    return await Promise.all(source.files.map(async (id, i) => {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const metadataResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?supportsAllDrives=true&fields=name,mimeType,parents,thumbnailLink`, { headers, signal: AbortSignal.timeout(15000) });
      if (!metadataResponse.ok) throw new Error('Produktový podklad na Mlžném disku není dostupný.');
      const meta = await metadataResponse.json();
      if (!meta.parents?.includes(source.folder) || !/^image\/(png|jpeg)$/.test(meta.mimeType)) throw new Error('Produktový podklad nepatří do složky zvolené varianty.');
      const downloadUrl = meta.thumbnailLink ? meta.thumbnailLink.replace(/=s\d+$/, '=s1400') : `https://www.googleapis.com/drive/v3/files/${id}?alt=media&supportsAllDrives=true`;
      const response = await fetch(downloadUrl, { headers, signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error('Nelze načíst originální produktový podklad.');
      const blob = await response.blob();
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const uploaded = await base44.asServiceRole.integrations.Core.UploadPrivateFile({ file: new File([bytes], meta.name, { type: blob.type }) });
      const { signed_url } = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({ file_uri: uploaded.file_uri, expires_in: 3600 });
      return { url: signed_url, file_uri: uploaded.file_uri, title: `${product.name} / produktový pohled ${i + 1}`, source: 'drive_original', source_file_id: id, geometry_preserved: true, generated_by_ai: false, caption: 'Originální produktový podklad z Mlžného disku. Konstrukce nebyla AI překreslena; nejde o zaměření místa klienta.', sort_order: i, img: { data: toBase64(bytes), format: blob.type.includes('png') ? 'PNG' : 'JPEG' } };
    }));
  }
  const url = product.visual_master_reference_url || product.image_url;
  if (!url) throw new Error('Chybí katalogový podklad zvoleného produktu.');
  const img = await fetchImageAsBase64(url);
  if (!img) throw new Error('Katalogovou fotografii nelze načíst. Doplňte dostupnou referenci produktu.');
  return [{ url, title: product.name, source: 'catalog_original', geometry_preserved: true, generated_by_ai: false, caption: 'Původní katalogový podklad bez AI změny geometrie. Technické provedení se potvrzuje podle dokumentace.', sort_order: 0, img }];
}