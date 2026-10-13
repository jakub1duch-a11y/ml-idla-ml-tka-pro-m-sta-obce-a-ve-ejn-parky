// Strana s fotorealistickou vizualizací v prostoru + originální konstrukcí pro srovnání.
import { W, C, text, wrap, roundRect, drawCover, drawContain, loadImage, pill } from './base';
import { header, footer, CONTACT_NOTE } from './chrome';

const DISCLAIMER = 'Vizualizace je ilustrační – vytvořila ji AI podle originální fotografie produktu. Závazná je konstrukce na originální fotografii a v technickém listu. Umístění, kotvení a přívod vody potvrdí technik HolmTec.';

export async function drawScene(ctx, d, scene, v, meta) {
  header(ctx, meta);
  text(ctx, 'VIZUALIZACE V PROSTORU', 70, 222, { weight: 700, size: 15, color: C.deep, spacing: 3 });
  text(ctx, scene.envLabel, 70, 290, { weight: 800, size: 54, family: 'Manrope', color: C.navy, spacing: -1 });
  text(ctx, v.title, 70, 340, { weight: 500, size: 24, color: C.deep });
  drawCover(ctx, await loadImage(scene.url), 70, 380, W - 140, 825, 24);
  pill(ctx, 'ILUSTRAČNÍ AI VIZUALIZACE', 94, 404, { bg: 'rgba(255,255,255,0.92)' });

  roundRect(ctx, 70, 1240, 250, 340, 18, C.soft);
  if (v.images[0]) drawContain(ctx, await loadImage(v.images[0]), 84, 1254, 222, 262);
  text(ctx, 'Originální konstrukce', 195, 1546, { weight: 700, size: 15, color: C.navy, align: 'center' });
  text(ctx, 'rozhoduje pro výrobu', 195, 1566, { size: 13.5, color: C.mute, align: 'center' });

  text(ctx, 'Umístění v prostoru', 360, 1278, { weight: 800, size: 26, family: 'Manrope', color: C.navy });
  wrap(ctx, scene.note, 360, 1318, 810, 29, { size: 20, color: C.navy }, 3);
  roundRect(ctx, 360, 1430, 810, 150, 16, 'rgba(0,183,255,0.08)');
  wrap(ctx, DISCLAIMER, 384, 1466, 770, 24, { size: 15.5, color: C.mute }, 5);
  footer(ctx, CONTACT_NOTE);
}