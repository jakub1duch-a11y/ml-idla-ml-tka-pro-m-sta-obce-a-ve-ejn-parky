// Sestaví strany obrazové nabídky: titulní, produktové listy (každý následují jeho schválené vizualizace), podmínky.
import { createCanvas, loadFonts } from './base';
import { paintBackground } from './chrome';
import { drawCover } from './pageCover';
import { drawProduct } from './pageProduct';
import { drawScene } from './pageScene';
import { drawTerms } from './pageTerms';

export { downloadCanvas } from './base';

export function buildPages(d) {
  const list = [{ key: 'titulni', title: 'Titulní strana a přehled nabídky', draw: (ctx) => drawCover(ctx, d) }];
  d.variants.forEach((v) => {
    list.push({ key: `produkt-${v.key}`, title: v.title, draw: (ctx, meta) => drawProduct(ctx, d, v, meta) });
    d.scenes.filter((s) => s.variantKey === v.key).forEach((s) => {
      list.push({ key: `scena-${s.id}`, title: `${s.envLabel} – ${v.title}`, ai: true, draw: (ctx, meta) => drawScene(ctx, d, s, v, meta) });
    });
  });
  list.push({ key: 'podminky', title: 'Rozsah dodávky a podmínky', draw: (ctx, meta) => drawTerms(ctx, d, meta) });
  return list.map((p, i) => ({
    ...p,
    render: async () => {
      await loadFonts();
      const { canvas, ctx } = createCanvas();
      paintBackground(ctx);
      await p.draw(ctx, { quote: d.client.quote, page: i + 1, total: list.length });
      return canvas;
    },
  }));
}