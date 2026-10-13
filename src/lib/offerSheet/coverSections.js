// Sekce titulní strany: Shrnutí poptávky, tabulka Naše nabídka a Základ nabídky.
import { W, C, money, text, fitText, wrap, roundRect, pill, sectionTitle, font } from './base';
import { drawIcon } from './icons';

const BASICS = [['droplet', 'Mlžné', 'trysky'], ['waves', 'Napojení na', 'vodovodní řad'], ['anchor', 'Kotvení', 'do betonu'], ['shield', 'Nerezová', 'konstrukce']];
const variantsWord = (n) => (n >= 5 ? 'dalších variant' : n >= 2 ? 'další varianty' : 'další variantu');

export function summaryCard(ctx, d, main) {
  const top = 700;
  roundRect(ctx, 70, top, W - 140, 200, 20, 'rgba(0,183,255,0.07)', C.line);
  const g = ctx.createLinearGradient(94, top + 36, 162, top + 104);
  g.addColorStop(0, C.cyan); g.addColorStop(1, C.blue);
  ctx.beginPath(); ctx.arc(128, top + 70, 34, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
  drawIcon(ctx, 'file', 111, top + 53, 34, C.white);
  text(ctx, 'Shrnutí poptávky', 192, top + 58, { weight: 800, size: 26, family: 'Manrope', color: C.navy });
  const others = d.variants.length - 1;
  wrap(ctx, `${d.summary} Nabízíme hlavní řešení ${main.title} a ${others} ${variantsWord(others)} k porovnání.`, 192, top + 96, 940, 27, { size: 18.5, color: C.ink }, 4);
}

export function offerTable(ctx, d) {
  sectionTitle(ctx, 'Naše nabídka', 70, 968);
  const x = 70, w = W - 140, top = 1010, rh = 47, cols = [94, 470, 770, 975];
  const height = 50 + rh * d.variants.length;
  ctx.save();
  ctx.beginPath(); ctx.roundRect(x, top, w, height, 14); ctx.clip();
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  g.addColorStop(0, C.blue); g.addColorStop(1, C.cyan);
  ctx.fillStyle = g; ctx.fillRect(x, top, w, 50);
  ['Produkt', 'Specifikace', 'Cena bez DPH', 'Cena s DPH'].forEach((h, i) => text(ctx, h, cols[i], top + 32, { weight: 600, size: 16, color: C.white }));
  d.variants.forEach((v, i) => {
    const y = top + 50 + i * rh;
    ctx.fillStyle = v.recommended ? 'rgba(0,183,255,0.12)' : i % 2 ? '#F4FAFD' : C.white;
    ctx.fillRect(x, y, w, rh);
    ctx.fillStyle = C.line; ctx.fillRect(x, y + rh - 1, w, 1);
    fitText(ctx, v.title, cols[0], y + 30, 250, { weight: 700, size: 16.5, color: C.navy });
    if (v.recommended) {
      font(ctx, { weight: 700, size: 16.5 });
      pill(ctx, 'DOPORUČENO', cols[0] + Math.min(250, ctx.measureText(v.title).width) + 12, y + 8, { bg: C.navy, color: C.white, size: 10 });
    }
    fitText(ctx, v.tableSpec, cols[1], y + 30, 280, { size: 15.5, color: C.mute });
    const has = v.price > 0;
    text(ctx, has ? money(v.price) : 'po ověření', cols[2], y + 30, { weight: has ? 700 : 500, size: 16.5, color: has ? C.navy : C.mute });
    text(ctx, has ? money(v.price * 1.21) : '—', cols[3], y + 30, { weight: 700, size: 16.5, color: has ? C.navy : C.mute });
  });
  ctx.restore();
  roundRect(ctx, x, top, w, height, 14, null, C.line);
  text(ctx, 'Varianty se nesčítají – vybíráte jednu. Doprava, montáž a stavební práce nejsou zahrnuty; SUPLA chytré řízení je volitelné.', 70, top + height + 34, { size: 14.5, color: C.mute });
}

export function basics(ctx) {
  sectionTitle(ctx, 'Základ nabídky', 70, 1478);
  BASICS.forEach(([icon, a, b], i) => {
    const x = 70 + i * 280;
    ctx.beginPath(); ctx.arc(x + 32, 1556, 30, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,183,255,0.12)'; ctx.fill();
    drawIcon(ctx, icon, x + 17, 1541, 30, C.blue);
    text(ctx, a, x + 76, 1551, { weight: 600, size: 17, color: C.navy });
    text(ctx, b, x + 76, 1574, { weight: 600, size: 17, color: C.navy });
    if (i < 3) { ctx.fillStyle = C.line; ctx.fillRect(x + 262, 1530, 1, 54); }
  });
}