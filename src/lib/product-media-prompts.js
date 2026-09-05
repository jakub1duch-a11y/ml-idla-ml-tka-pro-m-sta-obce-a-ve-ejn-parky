const MASTER_RULES = [
  'Preserve the exact silhouette, number of tubes, bends, proportions, nozzle count and nozzle positions from the approved MASTER reference images.',
  'Do not redesign, mirror, add branches, duplicate the product or invent structural joints.',
  'Brushed stainless steel must look physically plausible, premium and clean; no chrome-plastic appearance.',
  'Mist is fine water fog, subtle and translucent. Keep the surrounding surface visibly dry unless the brief explicitly asks otherwise.',
  'Use realistic human scale, safe clearances and believable anchoring. No floating product and no exposed utility clutter.',
  'No text, logos, labels or watermarks inside the generated image or video.'
];

const productFacts = (product = {}) => [
  'Product: ' + (product.name || 'MLŽIDLA product'),
  product.material ? 'Verified material: ' + product.material : '',
  product.coverage_area ? 'Verified size / height: ' + product.coverage_area : '',
  product.pressure ? 'Verified pressure: ' + product.pressure : '',
  product.water_consumption ? 'Verified water consumption: ' + product.water_consumption : ''
].filter(Boolean);

export function buildHeroVideoPrompt(product, referenceNote = '') {
  return [
    'Create a premium architectural product hero video, 16:9, 8–10 seconds, seamless loop.',
    ...productFacts(product),
    ...MASTER_RULES,
    'Scene: a refined Czech public space during a warm summer afternoon transitioning subtly toward blue hour.',
    'Camera: slow controlled dolly arc, 35–50 mm lens feeling, no dramatic distortion, no drone movement.',
    'Action: one gentle mist cycle reveals the stainless-steel surface and nozzle detail; people remain secondary and naturally scaled.',
    'Lighting: soft directional sunlight, restrained highlights on brushed steel, cinematic but documentary-real.',
    'Editing: one continuous shot or invisible transition, suitable for muted autoplay on a product page.',
    referenceNote
  ].filter(Boolean).join('\n');
}

export function buildSpaceVisualizationPrompt({ product, installation = 'prepared_water', photoContext = '' }) {
  const installationText = {
    full_excavation: 'Permanent turnkey installation with a concealed underground water route and fully restored final surface.',
    prepared_water: 'Permanent installation with the water supply already prepared directly beside the concealed anchor plate.',
    temporary_manhole: 'Temporary safe installation close to a manhole cover, with the water line protected and routed through the channel without a trip hazard.'
  }[installation] || 'Installation method must remain technically plausible and visually unobtrusive.';

  return [
    'Photorealistically place the exact approved product into the customer-provided space photograph.',
    ...productFacts(product),
    ...MASTER_RULES,
    'Installation scenario: ' + installationText,
    'Match the source photo perspective, horizon, lens, sunlight direction, shadows, reflections and colour temperature.',
    'Keep all original architecture, trees, paving, street furniture and access routes unchanged unless they physically overlap the selected installation point.',
    'Show a restrained cooling zone with realistic people using the space naturally. The product remains the visual focus.',
    photoContext
  ].filter(Boolean).join('\n');
}

export function buildAnchoringVisualizationPrompt({ product, installation = 'prepared_water' }) {
  return [
    'Create a precise architectural cutaway visual of the selected installation option for a product page.',
    ...productFacts(product),
    ...MASTER_RULES,
    installation === 'full_excavation'
      ? 'Show the new underground water route, trench layers, concrete foundation, stainless anchor plate and restored top surface.'
      : installation === 'temporary_manhole'
        ? 'Show the manhole cover, protected temporary water route, stable reversible anchoring and clear pedestrian safety zone.'
        : 'Show the prepared water outlet immediately beside the concealed stainless anchor plate, foundation and finished paving.',
    'Style: premium technical editorial rendering, white and pale-slate background, restrained cyan accents, readable material separation.',
    'No dimensions unless they are supplied as verified input. Do not invent structural values.'
  ].join('\n');
}

export function buildRealInstallationPrompt(product, locationType = 'Czech public square') {
  return [
    'Create a documentary-style architectural photograph of a completed real-world installation.',
    ...productFacts(product),
    ...MASTER_RULES,
    'Location type: ' + locationType + '.',
    'Show clean finished paving around the concealed anchor, realistic water connection hidden below the surface and a safe public circulation zone.',
    'Include natural Czech urban vegetation and ordinary visitors, avoiding luxury-resort clichés.',
    'Photography: full-frame realism, 40 mm lens, natural dynamic range, subtle filmic colour, no CGI glow.'
  ].join('\n');
}

export const SPIRALA_HIGGSFIELD_BRIEF = {
  slug: 'mlzna-spirála',
  title: 'MLŽNÁ SPIRÁLA · filmový hero loop',
  aspectRatio: '16:9',
  durationSeconds: 8,
  prompt: [
    'Create an 8-second seamless cinematic hero loop of the exact MLŽNÁ SPIRÁLA stainless-steel mist sculpture.',
    'The approved Fibonacci-inspired rising spiral geometry must remain unchanged from the reference images: one continuous TR40 tube rising from base to the top nozzle.',
    'Warm summer afternoon in a refined public space in Trutnov, Czech Republic; subtle transition toward blue hour.',
    'Slow 35–50 mm camera arc, physically accurate brushed stainless reflections, delicate 50–100 μm mist illuminated from the side.',
    'The concealed anchor and water supply remain invisible below the finished surface.',
    'Two naturally scaled people pass in the background; no posing, no wet paving, no fantasy fog, no additional tubes, no logo, no text.',
    'Premium architectural-film realism matching the colour, contrast and material quality of existing MLŽIDLA product photography.'
  ].join('\n')
};
