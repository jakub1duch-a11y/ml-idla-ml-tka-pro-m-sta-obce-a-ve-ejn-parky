// Stavitel 9stránkového PDF nabídky MLŽIDLA.cz — zelený design podle testové nabídky
import { pt } from './pdfHelpers.ts';

export const GREEN = '#4f6b2e';
export const SOFT = '#eef1e6';
export const INK = '#111613';
export const MUTE = '#4b524a';
export const WHITE = '#fbfcf8';
export const CARD = '#eef1e8';
export const CARD_DARK = '#e1e6d6';

const t = (doc: any, text: any, x: number, y: number, opts?: any) => doc.text(pt(text), x, y, opts);
const fmtKc = (v: any) => `${new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 }).format(Number(v || 0))} Kc`;

export interface PdfImg { data: string; format: string }
export interface OfferCtx {
  productName: string; clientName: string; clientCompany: string;
  goal: string; solution: string; benefits: string[];
  lines: { label: string; quantity: number; unit: string; total: number }[];
  total: number; smart: boolean; quoteNum: string; validUntil: string; today: string;
  product: any; imgs: (PdfImg | null)[];
}

function drawLogo(doc: any, x = 11, y = 12) {
  doc.setTextColor(INK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  t(doc, 'MLZIDLA.cz', x, y);
  doc.setFillColor(GREEN);
  doc.rect(x + 27, y + 0.5, 20, 0.4, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  t(doc, 'by HolmTec', x + 47, y + 1.2, { align: 'right' });
}

function drawFooter(doc: any, W: number, H: number, cta = 'Ukazte nam svuj prostor.') {
  doc.setFillColor(SOFT);
  doc.rect(0, H - 28, W, 4, 'F');
  doc.setFillColor(WHITE);
  doc.rect(0, H - 24, W, 24, 'F');
  doc.setFillColor(GREEN);
  doc.roundedRect(10, H - 19, 60, 12, 6, 6, 'F');
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  t(doc, cta + ' ->', 14, H - 12);
  doc.setTextColor(INK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  t(doc, 'Ing. Radek Meduna', 74, H - 15);
  doc.setFont('helvetica', 'normal');
  t(doc, 'meduna@holmtec.cz  +420 774 700 390', 74, H - 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  t(doc, 'mlzidla.cz', W - 10, H - 13, { align: 'right' });
}

function iconCircle(doc: any, x: number, y: number, r: number, letter: string) {
  doc.setFillColor(SOFT);
  doc.circle(x, y, r, 'F');
  doc.setTextColor(GREEN);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(r * 2.2);
  t(doc, letter, x, y + r * 0.6, { align: 'center' });
}

function productTitle(doc: any, name: string, x: number, y: number, size: number) {
  const parts = pt(name).trim().split(/\s+/);
  const last = parts.length > 1 ? parts.pop() : '';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(size);
  const first = parts.join(' ');
  if (first) { doc.setTextColor(INK); t(doc, first, x, y); }
  if (last) {
    const w = first ? doc.getTextWidth(first) + doc.getTextWidth(' ') : 0;
    doc.setTextColor(GREEN);
    t(doc, last, x + w, y);
  }
}

function addImg(doc: any, img: PdfImg | null, x: number, y: number, w: number, h: number, fallback = SOFT) {
  if (img) {
    try { doc.addImage(img.data, img.format, x, y, w, h, undefined, 'FAST'); } catch { doc.setFillColor(fallback); doc.rect(x, y, w, h, 'F'); }
  } else { doc.setFillColor(fallback); doc.rect(x, y, w, h, 'F'); }
}

const BENEFITS_DEF = [
  ['J', 'Jemna vodni mlha', 'Prijemne ochlazuje, zvlhcuje vzduch a vytvari cerstve prostredi.'],
  ['B', 'Bezpecne a atraktivni reseni', 'Moderni design, ktery splnuje vysoke naroky na bezpecnost.'],
  ['N', 'Nerezova konstrukce', 'Kvalitni nerezova ocel pro dlouhou zivotnost a minimalni udrzbu.'],
  ['V', 'Vhodne pro skoly, parky a zahrady', 'Idealni pro verejna prostranstvi i soukrome zahrady.'],
  ['U', 'Nizke provozni naklady', 'Usorny provoz a efektivni chlazeni s minimalni spotrebou vody.'],
];
const ICON_LETTERS = ['J', 'B', 'N', 'V', 'U'];

// ── PAGE 1: COVER ──
export function drawCoverPage(doc: any, ctx: OfferCtx) {
  const { W, H } = { W: 210, H: 297 };
  addImg(doc, ctx.imgs[0], 0, 42, W, 186);
  doc.setFillColor(WHITE);
  doc.rect(0, 0, W, 42);
  doc.rect(0, 228, W, 45);
  drawLogo(doc);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(INK);
  t(doc, 'Designova mlzitka.', 11, 28);
  doc.setTextColor(GREEN);
  t(doc, 'Chytry provoz.', 11, 38);
  doc.setTextColor(INK);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  t(doc, 'Ceska nerezova reseni', 11, 48);
  t(doc, 'pro mesta, parky a zahrady.', 11, 53);
  productTitle(doc, ctx.productName, 11, 242, 16);
  doc.setFillColor(GREEN);
  doc.rect(11, 245, 25, 0.6, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.5);
  doc.setTextColor(MUTE);
  t(doc, 'MRAK  STEBLO  LINEA  BENDY', 11, 250);
  if (ctx.smart) {
    doc.setFillColor(WHITE);
    doc.rect(115, 232, 85, 38, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.5);
    doc.setTextColor(GREEN);
    t(doc, 'AUTOMATIZACE / SUPLA', 118, 238);
    const feats = [['C', 'Casove rezimy'], ['T', 'Podle teploty'], ['M', 'Ovladani z mobilu']];
    feats.forEach(([letter, label], i) => {
      const cx = 125 + i * 26;
      iconCircle(doc, cx, 248, 4, letter);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(3.5);
      doc.setTextColor(INK);
      t(doc, label, cx, 258, { align: 'center' });
    });
  }
  drawFooter(doc, W, H);
}

// ── PAGE 2: SOLUTION ──
export function drawSolutionPage(doc: any, ctx: OfferCtx) {
  const { W, H } = { W: 210, H: 297 };
  addImg(doc, ctx.imgs[1] || ctx.imgs[0], 0, 0, W, 210);
  doc.setFillColor(WHITE);
  doc.rect(0, 0, W, 14);
  drawLogo(doc);
  doc.setFillColor(WHITE);
  doc.rect(0, 35, W, 45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(INK);
  t(doc, 'Reseni pro', 11, 50);
  doc.setTextColor(GREEN);
  const w1 = doc.getTextWidth(pt('Reseni pro '));
  t(doc, ctx.clientCompany || ctx.clientName, 11 + w1, 50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(INK);
  t(doc, ctx.productName + ' pro prijemne letni osvezeni.', 11, 58);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(MUTE);
  const goalLines = doc.splitTextToSize(pt(ctx.goal || ctx.solution), 110);
  doc.text(goalLines.slice(0, 5), 11, 66);
  // Benefits box
  doc.setFillColor(WHITE);
  doc.rect(140, 82, 62, 120, 'F');
  doc.setFillColor(SOFT);
  doc.roundedRect(140, 82, 62, 120, 2, 2, 'F');
  const benefits = ctx.benefits.length ? ctx.benefits.slice(0, 5) : BENEFITS_DEF.map((b) => b[1]);
  benefits.forEach((benefit, i) => {
    const letter = ctx.benefits.length ? ICON_LETTERS[i % 5] : BENEFITS_DEF[i][0];
    const desc = ctx.benefits.length ? '' : BENEFITS_DEF[i][2];
    const by = 92 + i * 22;
    iconCircle(doc, 148, by, 4, letter);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(INK);
    t(doc, benefit, 157, by - 1);
    if (desc) { doc.setFont('helvetica', 'normal'); doc.setFontSize(4); doc.setTextColor(MUTE); t(doc, desc, 157, by + 3); }
  });
  // 3-image gallery
  const galleryImgs = [ctx.imgs[2] || ctx.imgs[0], ctx.product?.gallery_urls?.[1] ? null : ctx.imgs[0], ctx.imgs[3] || ctx.imgs[0]];
  const galleryData = [
    [ctx.imgs[2] || ctx.imgs[0], 'Jemna a osvezujici mlha', 'Specialni trysky vytvareji jemnou vodni mlhu.'],
    [ctx.imgs[0], 'Kvalitni nerezove provedeni', 'Odolna nerezova ocel a precizni zpracovani.'],
    [ctx.imgs[3] || ctx.imgs[0], 'Atraktivni prvek', 'Moderni design podporuje pobyt venku.'],
  ];
  galleryData.forEach(([img, title, desc], i) => {
    const x = 10 + i * 64;
    addImg(doc, img, x, 215, 60, 36);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    doc.setTextColor(INK);
    t(doc, title, x, 256);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4);
    doc.setTextColor(MUTE);
    t(doc, desc, x, 260);
  });
  drawFooter(doc, W, H);
}

// ── PAGE 3: TECH ──
export function drawTechPage(doc: any, ctx: OfferCtx) {
  const { W, H } = { W: 210, H: 297 };
  doc.setFillColor(WHITE);
  doc.rect(0, 0, W, H, 'F');
  doc.setFillColor(SOFT);
  doc.rect(0, H - 24, W, 24, 'F');
  drawLogo(doc);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(INK);
  t(doc, 'Technicke informace', 11, 30);
  doc.setTextColor(GREEN);
  t(doc, ctx.productName, 11, 39);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(MUTE);
  t(doc, 'Design, funkcnost a kvalita', 11, 46);
  t(doc, 'pro moderni verejna prostranstvi.', 11, 51);
  const p = ctx.product || {};
  const rows = [
    ['R', 'Rozmer', p.coverage_area ? `Pokryti: ${pt(p.coverage_area)}` : 'dle zvolene konfigurace'],
    ['M', 'Material', pt(p.material) || 'nerezova ocel'],
    ['J', 'Jemne mlzeni', p.micron_size ? `kapky ${pt(p.micron_size)}` : 'pomoci trysek'],
    ['P', 'Pripojeni vody', p.pressure ? `tlak ${pt(p.pressure)}` : 'dle konfigurace'],
    ['K', 'Kotveni', 'do zpevneneho podkladu'],
    ['U', 'Pouziti', 'vhodne pro venkovni pouziti'],
  ];
  rows.forEach(([letter, title, desc], i) => {
    const y = 62 + i * 18;
    iconCircle(doc, 18, y, 5, letter);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(INK);
    t(doc, title, 30, y - 1);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(MUTE);
    t(doc, desc, 30, y + 3);
  });
  // Product image right
  addImg(doc, ctx.imgs[3] || null, 110, 56, 90, 130, SOFT);
  // 4-image gallery
  const galleryImgs = [ctx.imgs[0], ctx.imgs[1] || ctx.imgs[0], ctx.imgs[2] || ctx.imgs[0], ctx.imgs[3] || ctx.imgs[0]];
  const caps = ['Jemne mlzeni', 'Odolna konstrukce', 'Stabilni kotveni', 'Precizni detaily'];
  caps.forEach((cap, i) => {
    const x = 10 + i * 48;
    addImg(doc, galleryImgs[i], x, 215, 44, 36);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4);
    doc.setTextColor(GREEN);
    t(doc, cap, x, 256);
  });
  drawFooter(doc, W, H);
}

// ── PAGE 4: PLACEMENT ──
export function drawPlacementPage(doc: any, ctx: OfferCtx) {
  const { W, H } = { W: 210, H: 297 };
  drawLogo(doc);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(INK);
  t(doc, 'Navrh umisteni.', 11, 30);
  doc.setFontSize(11);
  doc.setTextColor(GREEN);
  t(doc, 'Moznosti zaceleneni do prostoru.', 11, 38);
  const scenes = [
    ['Z', 'Zahrada / skolka', 'Hravy prvek, ktery nadchne a zaroven prijemne ochladi okoli.'],
    ['P', 'Parkove prostredi', 'Osvezeni pro navstevniky a stylovy doplnek prostoru.'],
    ['O', 'Odpočinkova zona', 'Elegantni reseni pro zahrady a vnitrobloky.'],
  ];
  scenes.forEach(([letter, title, desc], i) => {
    const y = 50 + i * 60;
    addImg(doc, ctx.imgs[i] || ctx.imgs[0], 10, y, 130, 50);
    doc.setFillColor(WHITE);
    doc.rect(10, y + 38, 130, 12, 'F');
    iconCircle(doc, 18, y + 44, 3.5, letter);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(INK);
    t(doc, title, 25, y + 43);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4);
    doc.setTextColor(MUTE);
    t(doc, desc, 25, y + 47);
  });
  // Benefits column
  doc.setFillColor(CARD);
  doc.roundedRect(148, 50, 54, 180, 2, 2, 'F');
  const sideFeats = [
    ['D', 'Design, ktery zaujme', 'Organicky tvar se stava prirozenou dominantou prostoru.'],
    ['T', 'Prijemne osvezeni', 'Jemna vodni mlha zvyuje komfort i v horkych dnech.'],
    ['Z', 'Prirozene zaceleneni', 'Nerez ladi s prirodou, zeleni i architekturou.'],
    ['U', 'Univerzalni vyuziti', 'Skoly, parky, verejna prostranstvi i zahrady.'],
  ];
  sideFeats.forEach(([letter, title, desc], i) => {
    const y = 60 + i * 42;
    iconCircle(doc, 156, y, 4, letter);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(INK);
    t(doc, title, 165, y - 1);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4);
    doc.setTextColor(MUTE);
    const dl = doc.splitTextToSize(pt(desc), 38);
    doc.text(dl.slice(0, 3), 165, y + 3);
  });
  drawFooter(doc, W, H);
}

// ── PAGE 5: SMART ──
export function drawSmartPage(doc: any, ctx: OfferCtx) {
  const { W, H } = { W: 210, H: 297 };
  addImg(doc, ctx.imgs[0], 0, 0, W, 210);
  doc.setFillColor(WHITE);
  doc.rect(0, 0, W, 14);
  drawLogo(doc);
  doc.setFillColor(WHITE);
  doc.rect(0, 35, W, 50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(INK);
  t(doc, 'Automatizace /', 11, 50);
  doc.setTextColor(GREEN);
  t(doc, 'SUPLA', 11 + doc.getTextWidth(pt('Automatizace / ')), 50);
  doc.setFontSize(12);
  t(doc, 'Chytre ovladani pro pohodlny provoz.', 11, 58);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(MUTE);
  const descLines = doc.splitTextToSize(pt('Ovladejte mlzitko jednoduse a chytre. Diky systemu SUPLA prizpusobite provoz aktualnim podminkam, vytvorite casove plany a mate vse pod kontrolou.'), 100);
  doc.text(descLines, 11, 66);
  // Phone mockup
  doc.setFillColor('#1a1a1a');
  doc.roundedRect(145, 80, 50, 80, 4, 4, 'F');
  doc.setFillColor('#fff');
  doc.roundedRect(148, 84, 44, 72, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(GREEN);
  t(doc, 'supla', 152, 91);
  doc.setFillColor(CARD);
  doc.roundedRect(152, 94, 36, 12, 1, 1, 'F');
  doc.setFontSize(5);
  doc.setTextColor(INK);
  t(doc, ctx.productName, 154, 100);
  doc.setFontSize(4);
  doc.setTextColor(GREEN);
  t(doc, 'Prave mlzi', 154, 104);
  doc.setFillColor(CARD);
  doc.roundedRect(152, 109, 36, 8, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(3.5);
  doc.setTextColor(INK);
  t(doc, 'Casovy rezim  Aktivni', 154, 114);
  doc.setFillColor(CARD);
  doc.roundedRect(152, 119, 36, 8, 1, 1, 'F');
  t(doc, 'Podle teploty  Od 26 C', 154, 124);
  doc.setFillColor(GREEN);
  doc.roundedRect(152, 140, 36, 10, 1.5, 1.5, 'F');
  doc.setTextColor('#fff');
  doc.setFontSize(4.5);
  t(doc, 'Spustit mlzitko', 170, 146, { align: 'center' });
  // 5 features
  const feats = [
    ['C', 'Casove rezimy', 'Nastavte si mlzeni podle denniho rezimu.'],
    ['T', 'Spinani podle teploty', 'Automaticke spusteni pri vyssich teplotach.'],
    ['M', 'Ovladani z mobilu', 'Plna kontrola diky aplikaci SUPLA.'],
    ['P', 'Prehledny provoz', 'Sledujte stav, statistiky a historii provozu.'],
    ['I', 'Individualni konfigurace', 'Prizpusobime funkce vasim pozadavkum.'],
  ];
  feats.forEach(([letter, title, desc], i) => {
    const x = 10 + i * 39;
    iconCircle(doc, x + 16, 230, 5, letter);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.5);
    doc.setTextColor(INK);
    t(doc, title, x + 16, 242, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(3.5);
    doc.setTextColor(MUTE);
    const dl = doc.splitTextToSize(pt(desc), 34);
    doc.text(dl.slice(0, 2), x + 16, 246, { align: 'center' });
  });
  drawFooter(doc, W, H, 'Chytre reseni pro vas prostor.');
}

// ── PAGE 6: PRICE ──
export function drawPricePage(doc: any, ctx: OfferCtx) {
  const { W, H } = { W: 210, H: 297 };
  addImg(doc, ctx.imgs[0], 0, 0, W, 130);
  doc.setFillColor(WHITE);
  doc.rect(0, 0, 90, 130);
  drawLogo(doc);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(INK);
  t(doc, 'Cenova nabidka', 11, 30);
  doc.setTextColor(GREEN);
  doc.setFontSize(13);
  t(doc, 'Prehled navrzeneho reseni.', 11, 38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(INK);
  t(doc, 'Pro: ' + ctx.clientName, 11, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.setTextColor(MUTE);
  t(doc, 'Nabidka ' + ctx.quoteNum + '  platnost do ' + ctx.validUntil, 11, 55);
  // Line items
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(INK);
  t(doc, 'Polozky nabidky', 11, 120);
  ctx.lines.slice(0, 5).forEach((line, i) => {
    const y = 128 + i * 20;
    doc.setFillColor(CARD);
    doc.roundedRect(10, y, 190, 17, 1.5, 1.5, 'F');
    doc.setFillColor(CARD_DARK);
    doc.rect(10, y, 40, 17, 'F');
    if (i === 0 && ctx.product?.image_url) addImg(doc, ctx.imgs[3] || null, 10, y, 40, 17, CARD_DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(INK);
    t(doc, line.label, 54, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.5);
    doc.setTextColor(MUTE);
    t(doc, (line.quantity ? `${line.quantity} ${line.unit || 'ks'}` : ''), 54, y + 12);
    doc.setFillColor(CARD_DARK);
    doc.rect(160, y, 40, 17, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(GREEN);
    t(doc, fmtKc(line.total), 195, y + 11, { align: 'right' });
  });
  // Total
  const ty = 128 + Math.min(ctx.lines.length, 5) * 20 + 6;
  doc.setFillColor(CARD);
  doc.roundedRect(10, ty, 190, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(INK);
  t(doc, 'Celkem', 16, ty + 12);
  doc.setFontSize(16);
  doc.setTextColor(GREEN);
  t(doc, fmtKc(ctx.total), 195, ty + 12, { align: 'right' });
  // Notes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(INK);
  t(doc, 'Vsechny ceny jsou uvedeny bez DPH.', 11, ty + 26);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(MUTE);
  t(doc, 'Montaz, doprava a stavebni pripravenost nejsou zahrnuty.', 11, ty + 31);
  drawFooter(doc, W, H, 'Radi s Vami probereme detaily.');
}

// ── PAGE 7: DARK HERO ──
export function drawDarkHeroPage(doc: any, ctx: OfferCtx) {
  const { W, H } = { W: 210, H: 297 };
  addImg(doc, ctx.imgs[1] || ctx.imgs[0], 0, 0, W, H, DARK);
  doc.setFillColor(DARK);
  doc.rect(0, H - 50, W, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor('#ffffff');
  productTitle(doc, ctx.productName, W / 2, H - 32, 14);
  doc.setFillColor(GREEN);
  doc.rect(W / 2 - 12, H - 28, 24, 0.6, 'F');
}

// ── PAGE 8: PHOTO HERO ──
export function drawPhotoHeroPage(doc: any, ctx: OfferCtx) {
  const { W, H } = { W: 210, H: 297 };
  addImg(doc, ctx.imgs[2] || ctx.imgs[0], 0, 0, W, H, SOFT);
  doc.setFillColor(WHITE);
  doc.rect(0, 0, W, 80);
  drawLogo(doc);
  productTitle(doc, ctx.productName, 15, 35, 17);
  doc.setFillColor(GREEN);
  doc.rect(15, 38, 25, 0.6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(INK);
  t(doc, 'Prijemne letni osvezeni', 15, 48);
}

// ── PAGE 9: RECAP ──
export function drawRecapPage(doc: any, ctx: OfferCtx) {
  const { W, H } = { W: 210, H: 297 };
  doc.setFillColor(WHITE);
  doc.rect(0, 0, W, H, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(INK);
  t(doc, 'REKAPITULACE A PODMINKY', 15, 25);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(MUTE);
  t(doc, ctx.clientName + (ctx.clientCompany ? '  |  ' + ctx.clientCompany : ''), 15, 35);
  t(doc, ctx.productName, 15, 41);
  let y = 55;
  ctx.lines.forEach((line) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(INK);
    t(doc, line.label, 15, y);
    t(doc, fmtKc(line.total), 195, y, { align: 'right' });
    y += 7;
  });
  doc.setDrawColor('#d6d9cb');
  doc.line(15, y, 195, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(GREEN);
  t(doc, 'CELKEM BEZ DPH', 15, y);
  t(doc, fmtKc(ctx.total), 195, y, { align: 'right' });
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(INK);
  t(doc, 'VSECHNY CENY JSOU UVEDENY BEZ DPH.', 15, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(MUTE);
  const terms = [
    'Cena nezahrnuje dopravu, montaz ani stavebni pripravu.',
    'Rozsah sestavy SUPLA, technicke vybaveni a cena podlehaji potvrzeni.',
    'Obrazove vizualizace jsou ilustrační; mohou zobrazovat odlisne detaily.',
    'Pro realizaci je nutne overit skutecne rozmery, umisteni, kotveni, rozvod vody a elektroinstalaci podle projektu.',
    'Platnost nabidky do ' + ctx.validUntil + '. Termin dodani, zaloha a dalsi podminky budou upresneny.',
    'Zpracovani: MLZIDLA.cz by HolmTec | Ing. Radek Meduna',
    'Kontakt: meduna@holmtec.cz | +420 774 700 390',
    'Datum pripravy: ' + ctx.today,
  ];
  terms.forEach((term) => { t(doc, term, 15, y); y += 6; });
  doc.setDrawColor('#d6d9cb');
  doc.line(15, H - 20, 195, H - 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.5);
  doc.setTextColor(MUTE);
  t(doc, 'MLZIDLA.cz | Nabidka c. ' + ctx.quoteNum, 15, H - 15);
}