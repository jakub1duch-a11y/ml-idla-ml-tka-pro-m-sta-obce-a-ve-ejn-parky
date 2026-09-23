import {
  buildProductVisualizationGuard,
  getProductReferenceImages,
  VISUAL_RULE_VERSION,
} from './productVisualizationRules'
import { validateProductForVisualization } from './driveProductMasterRegistry'

export const MARKETING_GENERATION_SKILL = {
  id: 'mlzidla-exact-product-marketing',
  version: '2026-09-21.1',
  visualRuleVersion: VISUAL_RULE_VERSION,
  purpose: 'Přesné produktové vizualizace MLŽIDLA pro sociální sítě, web a reklamu.',
  rules: [
    'MASTER produktová reference je zdroj geometrie, proporcí, počtu ramen, trysek, materiálu a základny.',
    'Nedoplňovat konstrukci, hadice, kabely, kotvení, trysky ani dekorace, které nejsou v referenci nebo ve skutečných datech produktu.',
    'Generovaný návrh je ilustrační, dokud není potvrzen jako skutečná realizace.',
    'Do obrazu nevkládat text, logo ani vodoznak; text patří do vrstvy kampaně.',
    'Při chybějící MASTER referenci generování zastavit a vyžádat kontrolu.',
  ],
}

export const MARKETING_CHANNELS = {
  instagram_feed: {
    label: 'Instagram feed',
    aspectRatio: '4:5',
    format: '1080x1350',
    safeArea: 'Střední plocha bez textu, produkt celý v záběru.',
  },
  instagram_carousel: {
    label: 'Instagram carousel',
    aspectRatio: '4:5',
    format: '1080x1350',
    safeArea: 'Každý panel drží stejný produktový úhel a měřítko.',
  },
  instagram_reels: {
    label: 'Instagram Reels / Stories',
    aspectRatio: '9:16',
    format: '1080x1920',
    safeArea: 'Horní a dolní 15 % ponechat volných pro UI platformy.',
  },
  facebook: {
    label: 'Facebook',
    aspectRatio: '4:5',
    format: '1080x1350',
    safeArea: 'Produkt a mlha uprostřed, bez textu v obraze.',
  },
  linkedin: {
    label: 'LinkedIn',
    aspectRatio: '1.91:1',
    format: '1200x628',
    safeArea: 'Široký klidný záběr, produkt čitelný i bez ořezu.',
  },
  blog: {
    label: 'Web / blog',
    aspectRatio: '16:9',
    format: '1600x900',
    safeArea: 'Horizontální kompozice s prostorem pro HTML titulek mimo obrázek.',
  },
  google_ads: {
    label: 'Display reklama',
    aspectRatio: '1.91:1',
    format: '1200x628',
    safeArea: 'Jednoduché pozadí, žádné tvrzení nebo text uvnitř renderu.',
  },
}

export const MARKETING_VISUAL_MODES = [
  { value: 'product_in_space', label: 'Produkt v prostoru' },
  { value: 'product_detail', label: 'Detail produktu' },
  { value: 'installation', label: 'Instalace / montáž' },
  { value: 'production', label: 'Výroba / materiál' },
  { value: 'carousel', label: 'Carousel / sekvence' },
]

export function getMarketingChannel(channel = 'instagram_feed') {
  return MARKETING_CHANNELS[channel] || MARKETING_CHANNELS.instagram_feed
}

export function getMarketingReferences(product) {
  if (!product) return []
  return [...new Set(getProductReferenceImages(product).filter(Boolean))].slice(0, 6)
}

export function buildMarketingVisualizationPrompt({
  product,
  channel = 'instagram_feed',
  visualMode = 'product_in_space',
  topic = '',
  extraScene = '',
  environment = '',
  configuration = 'single',
  quantity = 1,
}) {
  const format = getMarketingChannel(channel)
  const guard = buildProductVisualizationGuard(product, {
    environment,
    configuration,
    quantity,
  })
  const validation = validateProductForVisualization(product)
  const referenceReady = validation.ok && getMarketingReferences(product).length > 0

  return [
    'MLŽIDLA MARKETING GENERATION SKILL',
    `RULE VERSION: ${MARKETING_GENERATION_SKILL.version}`,
    `CHANNEL: ${format.label} | ${format.format} | aspect ${format.aspectRatio}`,
    `VISUAL MODE: ${visualMode}`,
    `SAFE AREA: ${format.safeArea}`,
    `TOPIC: ${topic || 'Přirozené použití mlžicího systému v reálném prostoru.'}`,
    extraScene ? `SCENE NOTES: ${extraScene}` : '',
    guard.prompt,
    referenceReady
      ? `REFERENCE STATUS: VERIFIED. Use the exact Google Drive MASTER source (${validation.driveSource?.folderId || 'unknown'}) and approved product reference as the primary visual truth.`
      : `REFERENCE STATUS: STOP. ${validation.errors.join(' ')} Do not generate, substitute or approximate the product.`,
    'MARKETING OUTPUT: image/video only, no text, logo, watermark, badge, invented claim, price, location or performance metric inside the visual.',
    'HONESTY LABEL: If this is a proposal or generated space, describe it outside the image as “Ilustrační vizualizace – přesné řešení se ověřuje podle skutečného prostoru”.',
    'COMPOSITION: Keep the full product visible, preserve scale and nozzle placement, and make the mist visibly originate only from actual nozzles.',
  ].filter(Boolean).join('\n')
}

export function buildMarketingCaptionPrompt({
  product,
  channel = 'instagram_feed',
  visualMode = 'product_in_space',
  captionGoal = '',
}) {
  const format = getMarketingChannel(channel)
  const name = product?.name || 'vybraný produkt MLŽIDLA'
  const slug = product?.slug || product?.id || ''
  const isProposal = visualMode !== 'installation' && visualMode !== 'production'

  return [
    'MLŽIDLA MARKETING COPY SKILL',
    `RULE VERSION: ${MARKETING_GENERATION_SKILL.version}`,
    `CHANNEL: ${format.label}`,
    `PRODUCT: ${name}${slug ? ` (slug: ${slug})` : ''}`,
    `GOAL: ${captionGoal || 'Představit produkt srozumitelně a bez nátlaku.'}`,
    'Use only product facts supplied in the record. Never invent price, reference, installation, location, technical value, certification or result.',
    isProposal
      ? 'The visual is a proposal: clearly use “Ilustrační vizualizace” and do not write as if the installation already exists.'
      : 'If the source is an approved realization, describe only the supplied realization facts.',
    'Do not claim automatic cooling, guaranteed temperature reduction or health effects.',
    'Keep Czech, concise, concrete and helpful. Add a low-pressure CTA to mlzidla.cz only when appropriate.',
  ].join('\n')
}
