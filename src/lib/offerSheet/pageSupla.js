// Strana Chytré řízení SUPLA: vizuály značky, hlavní funkce, rozvaděč a cenová kalkulace (volitelný doplněk).
import { W, C, money, text, wrap, fitText, roundRect, drawCover, drawContain, loadImage, pill, sectionTitle } from './base';
import { header, footer, CONTACT_NOTE } from './chrome';
import { SUPLA_ASSETS, SUPLA_FUNCTIONS } from './suplaAssets';

function hero(img) {
  return (ctx) => {
    drawCover(ctx, img, 70, 380, W - 140, 400, 24);
    pill(ctx, 'ILUSTRAČNÍ VIZUALIZACE', 94, 404, { bg: 'rgba(255,255,255,0.92)' });
  };
}

function functions(ctx) {
  sectionTitle(ctx, 'Hlavní funkce', 70, 850, 28);
  SUPLA_FUNCTIONS.forEach(([label, body], i) => {
    const x = 70 + i * 224;
    roundRect(ctx, x, 890, 208, 150, 16, C.soft);
    ctx.beginPath(); ctx.arc(x + 36, 930, 18, 0, Math.PI * 2); ctx.fillStyle = C.blue; ctx.fill();
    text(ctx, String(i + 1), x + 36, 937, { weight: 800, size: 17, family: 'Manrope', color: C.white, align: 'center' });
    fitText(ctx, label, x + 16, 984, 180, { weight: 700, size: 17, color: C.navy });
    wrap(ctx, body, x + 16, 1008, 180, 20, { size: 14, color: C.mute }, 2);
  });
}

async function boxPanel(ctx) {
  const [box, service] = await Promise.all([loadImage(SUPLA_ASSETS.box), loadImage(SUPLA_ASSETS.service)]);
  roundRect(ctx, 70, 1070, 360, 380, 20, C.soft);
  drawContain(ctx, box, 82, 1082, 336, 356);
  drawCover(ctx, service, 450, 1070, 280, 182, 20);
  drawCover(ctx, await loadImage(SUPLA_ASSETS.boxTerrace), 450, 1268, 280, 182, 20);
  text(ctx, 'Rozvaděč s řízením', 760, 1108, { weight: 800, size: 25, family: 'Manrope', color: C.navy });
  const items = ['Nerezový rozvaděč MLŽIDLA', 'Řídicí jednotka SUPLA / Wi-Fi', 'Ventil, filtrace a manometr', 'Box v zemi nebo na sloupku'];
  items.forEach((t, i) => {
    ctx.beginPath(); ctx.arc(772, 1148 + i * 44, 5, 0, Math.PI * 2); ctx.fillStyle = C.cyan; ctx.fill();
    fitText(ctx, t, 790, 1154 + i * 44, 380, { size: 18, color: C.navy });
  });
  wrap(ctx, 'Technik ověří umístění boxu, přívod vody a napájení při návštěvě místa.', 760, 1340, 410, 24, { size: 15.5, color: C.mute }, 3);
}

function priceCard(ctx, x, w, label, price, note, dark) {
  roundRect(ctx, x, 1478, w, 140, 20, dark ? C.ink : C.soft, dark ? null : C.line);
  text(ctx, label, x + 28, 1514, { weight: 700, size: 13, color: dark ? C.cyan : C.deep, spacing: 2 });
  if (price > 0) {
    text(ctx, money(price), x + 28, 1566, { weight: 800, size: 40, family: 'Manrope', color: dark ? C.white : C.navy });
    text(ctx, `bez DPH · s DPH ${money(price * 1.21)}`, x + 28, 1596, { size: 16, color: dark ? C.silver : C.mute });
  } else text(ctx, 'Cena po ověření', x + 28, 1570, { weight: 800, size: 28, family: 'Manrope', color: dark ? C.white : C.navy });
  if (note) text(ctx, note, x + w - 28, 1514, { size: 13, color: dark ? C.silver : C.mute, align: 'right' });
}

export async function drawSupla(ctx, d, meta) {
  header(ctx, meta);
  text(ctx, 'VOLITELNÉ CHYTRÉ ŘÍZENÍ', 70, 222, { weight: 700, size: 15, color: C.deep, spacing: 3 });
  fitText(ctx, 'Mlžení řízené z mobilu', 70, 292, W - 140, { weight: 800, size: 58, family: 'Manrope', color: C.navy, spacing: -1 });
  text(ctx, 'Komfortní ovládání, automatizace a přehledný provoz se SUPLA.', 70, 342, { weight: 500, size: 24, color: C.deep });
  hero(await loadImage(SUPLA_ASSETS.phone))(ctx);
  functions(ctx);
  await boxPanel(ctx);
  const s = d.supla || {};
  priceCard(ctx, 70, 560, 'SUPLA STANDARD', s.standard || 0, 'doporučeno', true);
  priceCard(ctx, 650, 520, 'SUPLA PREMIUM', s.premium || 0, 'chytrý ventil', false);
  footer(ctx, CONTACT_NOTE);
}