// Vykreslení obrazové nabídky (PNG) v canvasu. Produktová fotografie je originál, nikdy se nepřekresluje.
const W = 1080, H = 1350;
const C = { ink: '#071A2F', green: '#007ACB', soft: '#EAF6FC', mute: '#607789', white: '#F5FAFD', cyan: '#00B7FF', line: '#D6EAF3' };
const money = (v) => `${new Intl.NumberFormat('cs-CZ').format(Math.round(v)).replace(/\s/g, ' ')} Kč`;

const loadImage = (src) => new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = src; });

function wrap(ctx, text, x, y, maxW, lineH, maxLines = 4) {
  const words = String(text || '').split(' '); let line = ''; let n = 0;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); y += lineH; line = w; if (++n >= maxLines) return y; } else line = test;
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineH;
}

function drawContain(ctx, img, x, y, w, h) {
  const s = Math.min(w / img.width, h / img.height); const dw = img.width * s, dh = img.height * s;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

export async function renderOfferCard({ variant, client, logo }) {
  await document.fonts.load('800 60px Manrope'); await document.fonts.load('400 24px Inter');
  const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = C.white; ctx.fillRect(0, 0, W, H);
  // Hlavička
  if (logo) { try { const li = await loadImage(logo); drawContain(ctx, li, 60, 40, 240, 70); } catch (_) { /* logo volitelné */ } }
  else { ctx.fillStyle = C.ink; ctx.font = '800 38px Manrope'; ctx.fillText('MLŽIDLA.cz', 60, 88); }
  ctx.fillStyle = C.mute; ctx.font = '500 22px Inter'; ctx.textAlign = 'right'; ctx.fillText('OBRAZOVÁ NABÍDKA · by HolmTec', W - 60, 84); ctx.textAlign = 'left';
  ctx.fillStyle = C.cyan; ctx.fillRect(60, 130, 90, 6);
  // Nadpis
  ctx.fillStyle = C.ink; ctx.font = '800 66px Manrope'; wrap(ctx, variant.title, 60, 215, W - 120, 72, 2);
  ctx.fillStyle = C.green; ctx.font = '600 28px Inter'; ctx.fillText(variant.subtitle, 60, 305);
  // Foto
  const top = 340, ph = 560;
  ctx.fillStyle = C.soft; ctx.fillRect(0, top, W, ph);
  const imgs = (variant.images || []).slice(0, 2);
  if (imgs.length) {
    const loaded = await Promise.all(imgs.map(loadImage));
    if (loaded.length === 1) drawContain(ctx, loaded[0], 40, top + 20, W - 80, ph - 40);
    else loaded.forEach((im, i) => drawContain(ctx, im, 40 + i * (W / 2 - 20), top + 20, W / 2 - 60, ph - 40));
  }
  if (variant.recommended) { ctx.fillStyle = C.ink; ctx.fillRect(60, top + 24, 250, 48); ctx.fillStyle = C.white; ctx.font = '700 20px Inter'; ctx.fillText('DOPORUČENÉ ŘEŠENÍ', 78, top + 55); }
  // Parametry
  const py = top + ph + 40; const colW = (W - 120 - 40) / 3;
  variant.spec.forEach(([k, v], i) => {
    const x = 60 + i * (colW + 20);
    ctx.fillStyle = C.soft; ctx.fillRect(x, py, colW, 110);
    ctx.fillStyle = C.green; ctx.font = '700 18px Inter'; ctx.fillText(k.toUpperCase(), x + 18, py + 36);
    ctx.fillStyle = C.ink; ctx.font = '700 28px Manrope'; ctx.fillText(v, x + 18, py + 78);
  });
  // Materiál / tlak
  ctx.fillStyle = C.mute; ctx.font = '400 22px Inter';
  const meta = [variant.material, variant.pressure].filter(Boolean).join('  ·  ');
  if (meta) ctx.fillText(meta, 60, py + 150);
  // Cena
  const by = H - 210;
  ctx.fillStyle = C.ink; ctx.fillRect(0, by, W, 210);
  ctx.fillStyle = C.cyan; ctx.fillRect(60, by + 30, 70, 5);
  if (variant.price > 0) {
    ctx.fillStyle = C.white; ctx.font = '800 62px Manrope'; ctx.fillText(`${money(variant.price)}`, 60, by + 105);
    ctx.font = '500 24px Inter'; ctx.fillStyle = '#B8C6CE'; ctx.fillText(`bez DPH  ·  s DPH ${money(variant.price * 1.21)}`, 60, by + 145);
  } else { ctx.fillStyle = C.white; ctx.font = '700 36px Manrope'; ctx.fillText('Cena po ověření rozsahu', 60, by + 100); }
  ctx.fillStyle = '#B8C6CE'; ctx.font = '400 20px Inter';
  ctx.fillText(variant.priceNote || 'Doprava, montáž a stavební práce nejsou zahrnuty. SUPLA řízení je volitelné.', 60, by + 180);
  ctx.textAlign = 'right'; ctx.fillStyle = C.white; ctx.font = '700 22px Inter';
  ctx.fillText(`Pro: ${client.company || client.name}`, W - 60, by + 105); ctx.font = '400 20px Inter'; ctx.fillStyle = '#B8C6CE';
  ctx.fillText(`${client.quote} · Ing. Radek Meduna`, W - 60, by + 140); ctx.fillText('+420 774 700 390 · mlzidla.cz', W - 60, by + 172); ctx.textAlign = 'left';
  return canvas;
}

export const canvasToBase64 = (canvas) => canvas.toDataURL('image/png');