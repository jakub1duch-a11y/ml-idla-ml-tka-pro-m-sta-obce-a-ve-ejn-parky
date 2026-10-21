// Produktový list varianty: originální fotografie, technické parametry, vhodnost a cena.
import { W, C, money, text, wrap, fitText, roundRect, drawContain, loadImage, pill } from './base';
import { header, footer, CONTACT_NOTE } from './chrome';

async function photoPanel(ctx, v) {
  roundRect(ctx, 70, 385, W - 140, 660, 24, C.soft);
  const imgs = await Promise.all(v.images.slice(0, 2).map(loadImage));
  const gw = (W - 200 - (imgs.length - 1) * 20) / Math.max(imgs.length, 1);
  imgs.forEach((img, i) => drawContain(ctx, img, 100 + i * (gw + 20), 415, gw, 600));
  if (v.recommended) pill(ctx, 'DOPORUČENÉ ŘEŠENÍ', 94, 409, { bg: C.navy, color: C.white });
  pill(ctx, 'ORIGINÁLNÍ FOTOGRAFIE · KONSTRUKCE BEZ AI ÚPRAV', 94, 985, { bg: 'rgba(255,255,255,0.94)' });
}

function specs(ctx, v) {
  text(ctx, 'Technické parametry', 70, 1108, { weight: 800, size: 28, family: 'Manrope', color: C.navy });
  const has = (re) => v.spec.some(([k]) => re.test(k));
  const extra = [['Materiál', !has(/materi/i) && v.material], ['Pracovní tlak', !has(/tlak/i) && v.pressure], ['Spotřeba vody', v.water]];
  [...v.spec, ...extra].filter(([, val]) => val).slice(0, 6).forEach(([k, val], i) => {
    const x = 70 + (i % 2) * 560, y = 1132 + Math.floor(i / 2) * 76;
    ctx.fillStyle = C.line; ctx.fillRect(x, y, 540, 1);
    text(ctx, k.toUpperCase(), x, y + 28, { weight: 700, size: 13, color: C.deep, spacing: 2 });
    fitText(ctx, val, x, y + 58, 540, { weight: 700, size: 21, color: C.navy });
  });
}

function priceBlock(ctx, v) {
  roundRect(ctx, 70, 1468, W - 140, 148, 22, C.ink);
  ctx.fillStyle = C.cyan; ctx.fillRect(110, 1494, 56, 4);
  if (v.price > 0) {
    text(ctx, money(v.price), 110, 1556, { weight: 800, size: 50, family: 'Manrope', color: C.white });
    text(ctx, `bez DPH  ·  s DPH ${money(v.price * 1.21)}`, 110, 1594, { weight: 500, size: 18, color: C.silver });
  } else text(ctx, 'Cena po ověření rozsahu', 110, 1566, { weight: 800, size: 34, family: 'Manrope', color: C.white });
  text(ctx, v.recommended ? 'HLAVNÍ ŘEŠENÍ' : 'VARIANTA K POROVNÁNÍ · NESČÍTÁ SE', 650, 1512, { weight: 700, size: 13, color: C.cyan, spacing: 2 });
  wrap(ctx, v.priceNote || 'Doprava, montáž a stavební práce nejsou zahrnuty. SUPLA chytré řízení je volitelné.', 650, 1544, 480, 24, { size: 16, color: C.silver }, 3);
}

export async function drawProduct(ctx, d, v, meta) {
  header(ctx, meta);
  text(ctx, v.eyebrow, 70, 222, { weight: 700, size: 15, color: C.deep, spacing: 3 });
  fitText(ctx, v.title, 70, 292, W - 140, { weight: 800, size: 60, family: 'Manrope', color: C.navy, spacing: -1 });
  text(ctx, v.subtitle, 70, 342, { weight: 500, size: 24, color: C.deep });
  await photoPanel(ctx, v);
  specs(ctx, v);
  ctx.fillStyle = C.cyan; ctx.fillRect(70, 1386, 4, 58);
  wrap(ctx, v.fit, 92, 1408, 1070, 28, { size: 19.5, color: C.navy }, 2);
  priceBlock(ctx, v);
  footer(ctx, CONTACT_NOTE);
}