// Titulní strana podle šablony: obchodní nabídka, klient, hlavní produkty, shrnutí, ceník a základ nabídky.
import { C, text, wrap, roundRect, drawContain, loadImage } from './base';
import { header, footer } from './chrome';
import { summaryCard, offerTable, basics } from './coverSections';

async function heroProduct(ctx, v, x) {
  roundRect(ctx, x, 196, 228, 410, 20, C.white, C.line);
  if (v.images[0]) drawContain(ctx, await loadImage(v.images[0]), x + 10, 206, 208, 390);
  text(ctx, v.title, x + 114, 638, { weight: 700, size: 16, color: C.navy, align: 'center' });
  text(ctx, v.tableSpec, x + 114, 660, { size: 14, color: C.mute, align: 'center' });
}

export async function drawCover(ctx, d) {
  header(ctx, { tagline: true });
  const main = d.variants.find((v) => v.recommended) || d.variants[0];
  const second = d.variants.find((v) => v !== main);
  text(ctx, 'OBCHODNÍ NABÍDKA', 70, 290, { weight: 300, size: 46, family: 'Manrope', color: C.navy });
  let y = wrap(ctx, main.title, 70, 366, 590, 74, { weight: 800, size: 70, family: 'Manrope', color: C.navy, spacing: -1 }, 2);
  y = wrap(ctx, d.intro, 70, y - 14, 580, 30, { size: 22, color: C.mute }, 2);
  ctx.fillStyle = C.blue;
  ctx.fillRect(70, y + 4, 64, 3);
  text(ctx, 'Klient:', 70, y + 52, { weight: 700, size: 20, color: C.navy });
  wrap(ctx, [d.client.name, d.client.company].filter(Boolean).join(' / '), 146, y + 52, 500, 28, { size: 20, color: C.navy }, 2);
  await heroProduct(ctx, main, 700);
  if (second) await heroProduct(ctx, second, 942);
  summaryCard(ctx, d, main);
  offerTable(ctx, d);
  basics(ctx);
  footer(ctx, 'Vizualizace a technické listy jsou součástí dalších stran nabídky.\nCeny dopravy, montáže a instalace nejsou součástí této nabídky.');
}