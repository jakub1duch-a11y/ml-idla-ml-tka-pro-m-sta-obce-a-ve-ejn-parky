/**
 * Schválené produktové vizualizace pro hero sekce.
 * Zdroj: Base44 → Administrace → Marketing → Produktové vizualizace.
 * U všech položek: approval_status=approved, approved_for_presentation=true.
 * Nepoužívat tyto snímky jako fotografie skutečných realizací.
 * Před nasazením kontrolovat geometrii výrobku a ořez na mobilu.
 */
const MEDIA_ROOT = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/';

export const APPROVED_HERO_VISUALS = Object.freeze({
  city: {
    src: MEDIA_ROOT + 'b6bb9ff63_generated_image.png',
    product: 'BRÁNA GATE',
    productSlug: 'mlzna-brana-gate',
    environment: 'namesti',
    alt: 'Schválená vizualizace nerezové mlžné brány GATE v městském prostoru',
    objectPosition: '67% center',
  },
  catalog: {
    src: MEDIA_ROOT + '7dec9fed7_generated_image.png',
    product: 'LINEA',
    productSlug: 'linea-mlzitko',
    environment: 'mestsky_park',
    alt: 'Schválená vizualizace rovného nerezového mlžítka LINEA v městském parku',
    objectPosition: '64% center',
  },
  school: {
    src: MEDIA_ROOT + '1827cf284_generated_image.png',
    product: 'AURA',
    productSlug: 'aura-mlzitko',
    environment: 'skola_skolka',
    alt: 'Schválená vizualizace kruhového mlžítka AURA ve školním venkovním prostoru',
    objectPosition: '68% center',
  },
  park: {
    src: MEDIA_ROOT + 'dd69813c9_generated_image.png',
    product: 'STÉBLO',
    productSlug: 'mlzitko-steblo',
    environment: 'mestsky_park',
    alt: 'Schválená vizualizace nerezového mlžítka STÉBLO v městském parku',
    objectPosition: '68% center',
  },
  architects: {
    src: MEDIA_ROOT + '9ec530cce_generated_image.png',
    product: 'LINEA',
    productSlug: 'linea-mlzitko',
    environment: 'namesti',
    alt: 'Schválená vizualizace městských mlžných sloupů LINEA v architektonickém prostoru',
    objectPosition: '66% center',
  },
});
