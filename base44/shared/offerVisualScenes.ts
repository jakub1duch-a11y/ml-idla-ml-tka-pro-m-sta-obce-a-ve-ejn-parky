import { fetchImageAsBase64 } from './pdfHelpers.ts';
export const CITY_SCENES = ['Městský park', 'Náměstí', 'Rezidenční zahrada', 'Školní zahrada', 'Městská promenáda'];
export async function generateOfferVisualScenes(base44, { product, sourcePhotos = [], quantity = 1, goal = '' }) {
  const productRefs = [product.visual_master_reference_url, product.image_url, ...(product.gallery_urls || [])].filter(Boolean).slice(0, 3);
  if (!productRefs.length) throw new Error('Chybí referenční fotografie produktu. Doplňte ji před generováním vizualizací.');
  const photos = [];
  for (const uri of sourcePhotos.slice(0, 3)) {
    if (/^https:\/\//.test(uri)) photos.push(uri);
    else { const signed = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({ file_uri: uri, expires_in: 900 }); photos.push(signed.signed_url); }
  }
  const angles = ['Celkový pohled v úrovni očí', 'Šikmý pohled zleva', 'Šikmý pohled zprava', 'Pohled směrem k pobytové zóně', 'Detail produktu s okolním prostorem'];
  const jobs = CITY_SCENES.map((scene, i) => ({ title: photos.length ? angles[i] : scene, angle: angles[i], scene }));
  const results = await Promise.all(jobs.map(async (job, i) => {
    const refs = photos.length ? [photos[i % photos.length], ...productRefs] : productRefs;
    const prompt = `Profesionální fotorealistická architektonická fotografie, horizontální kompozice. Produkt ${product.name}, přesně ${quantity} kusů. ${photos.length ? 'PRVNÍ reference je fotografie/náčrt místa klienta, další jsou skutečný produkt. Zachovej architekturu, terén, mobiliář a umístění návrhu. Změň pouze úhel kamery, nepřestavuj prostor. Neviditelné části jsou pouze koncepční rekonstrukce, nikoli dokumentace.' : `Ilustrační české prostředí: ${job.scene}. Nejde o skutečnou realizaci.`} Úhel: ${job.angle}. Zadání: ${goal.slice(0, 1200)}. MASTER PRODUCT LOCK: přesná silueta, počet trubek, ohyby, proporce, kotvení, počet a orientace trysek podle produktové reference. ${product.visual_geometry_lock || ''} ${(product.visual_negative_rules || []).join('; ')} Žádné nové větve, ramena, hadice ani kabely. Mlha pouze z ústí skutečných trysek, jemný fyzikálně věrohodný rozptyl, suchá zem. Přirozené sluneční světlo, saténový nerez, věrohodná perspektiva. Osoby odpovídající účelu místa, děti jen s dohledem, produkt nezakrývat. Bez textu, loga, cen, tlačítek, QR kódu nebo grafických overlayů.`;
    const result = await base44.asServiceRole.integrations.Core.GenerateImage({ prompt, existing_image_urls: refs });
    if (!result?.url) throw new Error(`Nevytvořila se vizualizace: ${job.title}`);
    return { url: result.url, title: job.title, source: photos.length ? 'client_space' : 'illustrative_city', caption: photos.length ? 'Koncepční vizualizace podle podkladů klienta; nové úhly nejsou zaměřením prostoru.' : 'Ilustrační návrh, nikoli fotografie uskutečněné realizace.', sort_order: i };
  }));
  const images = await Promise.all(results.map(async s => ({ ...s, img: await fetchImageAsBase64(s.url) })));
  if (images.some(s => !s.img)) throw new Error('Některou fotografii nelze vložit do PDF. Nabídka nebyla dokončena.');
  return images;
}