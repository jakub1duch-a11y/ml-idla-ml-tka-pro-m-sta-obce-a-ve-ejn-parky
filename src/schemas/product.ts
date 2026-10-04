import { z } from 'zod';

export const TeePeeProductSchema = z.object({
  id: z.string(),
  slug: z.string().default('teepee'),
  title: z.string().default('Mlžné TeePee'),
  slogan: z.string().default('Samostojná mlžná trojnožka'),
  priceCzk: z.number().optional(),
  inStock: z.boolean().default(true),

  // Média (URL z úložiště Base44 / Google Drive)
  media: z.object({
    heroImageUrl: z.string().url(),
    studioImageUrl: z.string().url().optional(),
    nozzleDetailUrl: z.string().url().optional(),
    technicalDrawUrl: z.string().url().optional(),
    videoLoopUrl: z.string().url().optional(),
  }),

  // Ověřené parametry referenční varianty TEEPEE_50
  specs: z.object({
    material: z.string().default('Nerezová ocel 1.4301 (AISI 304)'),
    pressureRange: z.string().default('2–8 bar'),
    heightMeters: z.number().default(2.4),
    baseWidthMeters: z.number().default(1.6),
    nozzleCount: z.number().optional(),
  }),

  seo: z.object({
    metaTitle: z.string().default('Mlžné TeePee – samostojná mlžná trojnožka | MLŽIDLA'),
    metaDescription: z.string().default('Samostojná nerezová mlžná trojnožka TEEPEE s provozním tlakem 2–8 bar. Rychlá instalace bez betonování – osvěžení pro náměstí, městské slavnosti a letní akce.'),
  }),
});

export type TeePeeProduct = z.infer<typeof TeePeeProductSchema>;

/** Převod záznamu entity Product (Base44) na TeePeeProduct. */
export function fromProductEntity(p: Record<string, any>): TeePeeProduct {
  return TeePeeProductSchema.parse({
    id: p.id,
    slug: p.slug,
    title: p.name,
    priceCzk: p.price_from,
    media: {
      heroImageUrl: p.hero_background_url || p.image_url,
      videoLoopUrl: p.video_url || undefined,
    },
    specs: { material: p.material, pressureRange: p.pressure },
    seo: { metaTitle: p.seo_title, metaDescription: p.seo_description },
  });
}