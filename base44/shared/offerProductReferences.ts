import { fetchImageAsBase64, toBase64 } from './pdfHelpers.ts';
// Explicit variant folders prevent mixing TR60/J70, MRAK/1414 or different animal silhouettes.
const SOURCES = {
  'mlzitko-mrak': { folder: '18V4_DMRqXPhf6IxP4WFzi_lE8rfT8FqL', files: ['1dEX1K4GDx1VKBVJx1nBCJDsdaqbhHJKR'] },
  'mlzitko-mrak-1414': { folder: '1AxkE9buFAlk9CMNUxqE6shNEEGxwrZBi', files: ['1saDqN3I7w3Ny_MPK9sgRXRBJewEErbw-', '1W7pELD1L6vnOaz1wAhSz1oNjLaTX3C9F', '1DNnQJwMkSGfHOne0waKUClPLtgWNdYPT'] },
  'mlzitko-volavka': { folder: '1zGOImiXGwAlEcCv7Xs66c32kuvnG2G7v', files: ['1vR1mTmP8UracPKV6KN0Ay9XjGqC0JVFw', '1kti2ovtuGrI-lcUtC4jzQHpkUbZQVUSC', '1Ul6PK5dcwz_ZJG8U-m4jLZwchzcon5_B'] },
  'y-armist-tr60': { folder: '1OtbstfDyf0yWodTet3asJfYPg-odzfNn', files: ['17fq2ZQLEuUjUrjoBzUifs7kcdFvXfqTz', '1YFQNuQL1NX3B8vIa0N60-RW83V-RzPTx', '1_mM5cMKHuUWSn0G4XOjEdgsXI8oekAxt'] },
  'y-armist-j70': { folder: '1OtbstfDyf0yWodTet3asJfYPg-odzfNn', files: ['13EsB-_vBL6QVoLRUG8TIYgqXVuVcEV_v', '1L5tweFHDdejBarr69_gS8GBT1Cb4JjTf', '1axlLHd0nett_LkN-Z5pDsvwXvZX3sCKB'] },
};
export async function loadOriginalProductScenes(base44, product) {
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