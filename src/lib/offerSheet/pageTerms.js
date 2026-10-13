// Závěrečná strana: rozsah dodávky, co se řeší samostatně, další postup, platnost a kontakt s QR kódem.
import QRCode from 'qrcode';
import { W, C, text, fitText, wrap, roundRect, sectionTitle } from './base';
import { header, footer, CONTACT_NOTE } from './chrome';
import { drawIcon } from './icons';

const INCLUDED = [
  ['shield', 'Konstrukce', 'Nerezové mlžítko ve zvolené variantě a provedení dle technického listu, s mlžnými tryskami.'],
  ['waves', 'Napojení', 'Připojení na vodovodní řad. Základní varianta je bez chytrého spouštění.'],
  ['anchor', 'Kotvení', 'Kotvení do betonového základu; krycí patka dle konkrétní produktové varianty.'],
  ['file', 'Dokumentace', 'Provozní a údržbový manuál a doporučení pro zahájení sezóny a spuštění mlžítka.'],
];
const SEPARATE = ['Doprava a montáž', 'Výkopy a stavební připravenost', 'Přívod vody k místu instalace', 'SUPLA chytré řízení (volitelně)'];
const STEPS = [['Výběr varianty', 'Zvolte hlavní řešení nebo jednu z variant k porovnání.'], ['Ověření místa', 'Technik potvrdí umístění, kotvení a přívod vody.'], ['Potvrzení objednávky', 'Objednávku potvrdíte v portálu Můj projekt.']];

function qr(ctx, url, x, y, size) {
  const m = QRCode.create(url, { errorCorrectionLevel: 'M' }).modules;
  const cell = size / (m.size + 4);
  roundRect(ctx, x, y, size, size, 12, C.white);
  ctx.fillStyle = C.ink;
  for (let r = 0; r < m.size; r++) for (let c = 0; c < m.size; c++) if (m.get(r, c)) ctx.fillRect(x + (c + 2) * cell, y + (r + 2) * cell, cell + 0.3, cell + 0.3);
}

function steps(ctx) {
  sectionTitle(ctx, 'Další postup', 70, 1030, 28);
  STEPS.forEach(([title, body], i) => {
    const x = 70 + i * 373;
    roundRect(ctx, x, 1060, 353, 160, 18, C.soft);
    ctx.beginPath(); ctx.arc(x + 44, 1104, 22, 0, Math.PI * 2); ctx.fillStyle = C.blue; ctx.fill();
    text(ctx, String(i + 1), x + 44, 1112, { weight: 800, size: 20, family: 'Manrope', color: C.white, align: 'center' });
    text(ctx, title, x + 24, 1160, { weight: 700, size: 19, color: C.navy });
    wrap(ctx, body, x + 24, 1188, 305, 22, { size: 15.5, color: C.mute }, 2);
  });
}

function contact(ctx, d) {
  const until = d.validUntil ? new Date(d.validUntil).toLocaleDateString('cs-CZ') : 'dle dohody';
  text(ctx, `Platnost nabídky do ${until}`, 70, 1272, { weight: 700, size: 19, color: C.navy });
  text(ctx, 'Ceny jsou uvedeny bez DPH a s DPH 21 %.', 70, 1300, { size: 16, color: C.mute });
  roundRect(ctx, 70, 1330, W - 140, 250, 24, C.ink);
  text(ctx, 'KONTAKT', 110, 1378, { weight: 700, size: 13, color: C.cyan, spacing: 2.5 });
  text(ctx, 'Ing. Radek Meduna', 110, 1426, { weight: 800, size: 34, family: 'Manrope', color: C.white });
  text(ctx, 'HolmTec s.r.o. · MLŽIDLA.cz', 110, 1460, { size: 18, color: C.silver });
  text(ctx, '+420 774 700 390', 110, 1512, { weight: 700, size: 24, color: C.white });
  text(ctx, 'meduna@holmtec.cz · mlzidla.cz', 110, 1546, { size: 18, color: C.silver });
  qr(ctx, 'https://mlzidla.cz/muj-projekt', W - 280, 1362, 170);
  text(ctx, 'Můj projekt', W - 195, 1560, { weight: 600, size: 13, color: C.silver, align: 'center' });
}

export async function drawTerms(ctx, d, meta) {
  header(ctx, meta);
  text(ctx, 'PODMÍNKY A DALŠÍ POSTUP', 70, 222, { weight: 700, size: 15, color: C.deep, spacing: 3 });
  fitText(ctx, 'Rozsah dodávky a obchodní podmínky', 70, 292, W - 140, { weight: 800, size: 52, family: 'Manrope', color: C.navy, spacing: -1 });
  text(ctx, 'Přehled toho, co je součástí ceny výrobku a co se řeší samostatně.', 70, 340, { size: 22, color: C.mute });
  sectionTitle(ctx, 'Součástí ceny výrobku', 70, 420, 28);
  INCLUDED.forEach(([icon, label, body], i) => {
    const y = 450 + i * 84;
    ctx.fillStyle = C.line; ctx.fillRect(70, y, W - 140, 1);
    ctx.beginPath(); ctx.arc(100, y + 42, 26, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,183,255,0.12)'; ctx.fill();
    drawIcon(ctx, icon, 88, y + 30, 24, C.blue);
    text(ctx, label, 146, y + 36, { weight: 700, size: 19, color: C.navy });
    fitText(ctx, body, 146, y + 62, 1020, { size: 17, color: C.mute });
  });
  sectionTitle(ctx, 'Řeší se samostatně', 70, 850, 28);
  SEPARATE.forEach((item, i) => {
    const x = 70 + (i % 2) * 560, y = 900 + Math.floor(i / 2) * 46;
    drawIcon(ctx, 'minus', x, y - 18, 22, C.deep, 2.4);
    text(ctx, item, x + 34, y, { size: 18, color: C.navy });
  });
  steps(ctx);
  contact(ctx, d);
  footer(ctx, CONTACT_NOTE);
}