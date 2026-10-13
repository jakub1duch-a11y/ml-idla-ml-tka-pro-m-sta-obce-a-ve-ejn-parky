// Společné prvky stran podle šablony MLŽIDLA.cz: světlé pozadí s mlžnými vlnami, logo, hlavička a patička.
import { W, H, C, text, loadImage } from './base';

export function paintBackground(ctx) {
  ctx.fillStyle = C.white;
  ctx.fillRect(0, 0, W, H);
  const glow = (x, y, r, color) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,183,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  };
  glow(W * 0.86, 280, 640, 'rgba(0,183,255,0.10)');
  glow(W * 0.08, H - 150, 720, 'rgba(8,120,232,0.08)');
  for (let i = 0; i < 9; i++) {
    const y0 = H - 250 + i * 16;
    ctx.beginPath();
    ctx.moveTo(0, y0 + 60);
    ctx.bezierCurveTo(W * 0.3, y0 - 40 + i * 4, W * 0.62, y0 + 120, W, y0 - 10);
    ctx.strokeStyle = `rgba(0,150,230,${0.05 + i * 0.012})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, H - 120);
  ctx.bezierCurveTo(W * 0.35, H - 210, W * 0.65, H - 40, W, H - 170);
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  const g = ctx.createLinearGradient(0, H - 220, 0, H);
  g.addColorStop(0, 'rgba(0,183,255,0.10)'); g.addColorStop(1, 'rgba(0,183,255,0.02)');
  ctx.fillStyle = g; ctx.fill();
}

// Oficiální logo MLŽIDLA (stejný soubor jako v e-mailech). Zdrojový obrázek 1024×512 má bílé okraje, kreslí se ořezané na motiv.
const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png';
const LOGO_CROP = { x: 70, y: 165, w: 890, h: 180 };
let logoImage = null;

export async function loadLogo() {
  if (!logoImage) logoImage = await loadImage(LOGO_URL);
  return logoImage;
}

function logo(ctx, x, y) {
  if (!logoImage) return;
  const h = 84;
  const w = (LOGO_CROP.w / LOGO_CROP.h) * h;
  ctx.drawImage(logoImage, LOGO_CROP.x, LOGO_CROP.y, LOGO_CROP.w, LOGO_CROP.h, x, y, w, h);
}

export function header(ctx, meta = {}) {
  logo(ctx, 70, 48);
  if (meta.tagline) {
    ctx.fillStyle = C.cyan;
    ctx.fillRect(W - 300, 52, 2, 76);
    ['PŘÍJEMNĚJŠÍ', 'PROSTŘEDÍ', 'PRO LEPŠÍ ŽIVOT'].forEach((l, i) => text(ctx, l, W - 282, 72 + i * 25, { weight: 600, size: 14, color: C.navy, spacing: 3 }));
    return;
  }
  text(ctx, `NABÍDKA ${meta.quote || ''}`, W - 70, 82, { weight: 600, size: 14, color: C.mute, spacing: 2.5, align: 'right' });
  text(ctx, `STRANA ${meta.page} / ${meta.total}`, W - 70, 108, { weight: 700, size: 14, color: C.deep, spacing: 2.5, align: 'right' });
  ctx.fillStyle = C.line;
  ctx.fillRect(70, 150, W - 140, 1);
}

export function footer(ctx, note) {
  const y = H - 92;
  ctx.fillStyle = C.deep;
  ctx.fillRect(70, y - 22, 2, 46);
  String(note).split('\n').forEach((l, i) => text(ctx, l, 88, y - 4 + i * 21, { size: 14, color: C.mute }));
  ctx.fillStyle = C.cyan;
  ctx.fillRect(W - 400, y - 4, 90, 2);
  text(ctx, 'CHLADÍME SVĚT', W - 292, y - 6, { weight: 700, size: 14, color: C.navy, spacing: 3 });
  text(ctx, 'MLŽENÍM', W - 292, y + 16, { weight: 800, size: 14, color: C.cyan, spacing: 3 });
}

export const CONTACT_NOTE = 'HolmTec s.r.o. · Ing. Radek Meduna · +420 774 700 390 · meduna@holmtec.cz';