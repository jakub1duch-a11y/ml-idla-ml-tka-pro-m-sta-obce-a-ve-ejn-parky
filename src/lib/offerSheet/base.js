// Kreslicí primitiva obrazové nabídky: A4 na výšku v jednotkách 1240 × 1754, export ve 1,5× rozlišení.
export const W = 1240, H = 1754, SCALE = 1.5;
export const C = { navy: '#0B2A4A', ink: '#071A2F', blue: '#0878E8', cyan: '#00B7FF', deep: '#007ACB', soft: '#EEF7FC', mute: '#607789', line: '#D6EAF3', silver: '#B8C6CE', white: '#FFFFFF' };
export const money = (v) => `${new Intl.NumberFormat('cs-CZ').format(Math.round(v)).replace(/\s/g, ' ')} Kč`;

const FONTS = ['300 46px Manrope', '800 60px Manrope', '400 20px Inter', '500 20px Inter', '600 16px Inter', '700 20px Inter'];
export const loadFonts = () => Promise.all(FONTS.map((f) => document.fonts.load(f)));

export const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  if (!String(src).startsWith('data:')) img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error('Obrázek nabídky nelze načíst.'));
  img.src = src;
});

export function font(ctx, { weight = 400, size = 20, family = 'Inter', spacing = 0 } = {}) {
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.letterSpacing = `${spacing}px`;
}

export function text(ctx, value, x, y, opts = {}) {
  font(ctx, opts);
  ctx.fillStyle = opts.color || C.ink;
  ctx.textAlign = opts.align || 'left';
  ctx.fillText(String(value ?? ''), x, y);
  ctx.textAlign = 'left';
  ctx.letterSpacing = '0px';
}

export function fitText(ctx, value, x, y, maxW, opts = {}) {
  let size = opts.size || 20;
  font(ctx, { ...opts, size });
  while (size > 12 && ctx.measureText(String(value)).width > maxW) { size -= 1; font(ctx, { ...opts, size }); }
  text(ctx, value, x, y, { ...opts, size });
}

export function wrap(ctx, value, x, y, maxW, lineH, opts = {}, maxLines = 6) {
  font(ctx, opts);
  ctx.fillStyle = opts.color || C.ink;
  const lines = [];
  let line = '';
  for (const word of String(value || '').split(/\s+/).filter(Boolean)) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; } else line = test;
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) shown[maxLines - 1] += '…';
  shown.forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  ctx.letterSpacing = '0px';
  return y + shown.length * lineH;
}

export function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}

export function drawContain(ctx, img, x, y, w, h) {
  const s = Math.min(w / img.width, h / img.height);
  ctx.drawImage(img, x + (w - img.width * s) / 2, y + (h - img.height * s) / 2, img.width * s, img.height * s);
}

export function drawCover(ctx, img, x, y, w, h, r = 0) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.clip();
  const s = Math.max(w / img.width, h / img.height);
  ctx.drawImage(img, x + (w - img.width * s) / 2, y + (h - img.height * s) / 2, img.width * s, img.height * s);
  ctx.restore();
}

export function pill(ctx, label, x, y, { bg = C.white, color = C.navy, size = 13 } = {}) {
  font(ctx, { weight: 700, size, spacing: 1.6 });
  const w = ctx.measureText(label).width + 32;
  roundRect(ctx, x, y, w, size + 22, (size + 22) / 2, bg);
  text(ctx, label, x + 16, y + size + 7, { weight: 700, size, spacing: 1.6, color });
}

export function sectionTitle(ctx, label, x, y, size = 32) {
  text(ctx, label, x, y, { weight: 800, size, family: 'Manrope', color: C.navy, spacing: -0.3 });
  ctx.fillStyle = C.blue;
  ctx.fillRect(x, y + 16, 48, 4);
}

export function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);
  return { canvas, ctx };
}

export function downloadCanvas(canvas, filename) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = filename;
  a.click();
}