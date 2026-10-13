import { loadOriginalProductScenes } from './offerProductReferences.ts';
export const CITY_SCENES = ['Městský park', 'Náměstí', 'Rezidenční zahrada', 'Školní zahrada', 'Městská promenáda'];
export async function generateOfferVisualScenes(base44, { product }) {
  // Exactness takes priority over invented camera angles or regenerated product geometry.
  return await loadOriginalProductScenes(base44, product);
}