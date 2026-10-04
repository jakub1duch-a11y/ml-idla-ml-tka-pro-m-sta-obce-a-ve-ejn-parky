export const TECHNICAL_EXTRACTION_RULES = [
  'Use null when a value is not explicitly present in the source.',
  'Do not infer, estimate, interpolate, calculate or invent technical specifications.',
  'Preserve original source wording for dimensions, pressure, water consumption and material.',
  'Always return source_url for each extracted product or pricing item.',
  'Mark confidence as low when the source is ambiguous or marketing-only.',
];

export const COMPETITOR_PRODUCT_SCHEMA = {
  type: 'object',
  properties: {
    products: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          category: { type: ['string', 'null'] },
          material: { type: ['string', 'null'] },
          dimensions: { type: ['string', 'null'] },
          water_consumption: { type: ['string', 'null'] },
          operating_pressure: { type: ['string', 'null'] },
          nozzle_count: { type: ['number', 'null'] },
          coverage: { type: ['string', 'null'] },
          pump_required: { type: ['boolean', 'null'] },
          smart_control: { type: ['string', 'null'] },
          installation: { type: ['string', 'null'] },
          price: { type: ['number', 'null'] },
          currency: { type: ['string', 'null'] },
          warranty: { type: ['string', 'null'] },
          source_url: { type: ['string', 'null'] },
          confidence: { type: ['string', 'null'] },
        },
        required: ['name'],
      },
    },
  },
  required: ['products'],
};

export const FIRECRAWL_COMPETITOR_PROMPT = `Extract all misting products and solutions. Capture product name, category, material, dimensions, water consumption, operating pressure, nozzle count, coverage, pump requirement, smart control, installation type, price, warranty and source URL. Use null for unknown values and never infer, estimate, calculate or invent technical specifications. Preserve the exact source wording for all technical parameters.`;

export const buildFirecrawlCommand = (url) => `firecrawl agent "${FIRECRAWL_COMPETITOR_PROMPT}" --urls "${url}" --schema '${JSON.stringify(COMPETITOR_PRODUCT_SCHEMA)}' --wait --json -o .firecrawl/competitor-products.json`;
