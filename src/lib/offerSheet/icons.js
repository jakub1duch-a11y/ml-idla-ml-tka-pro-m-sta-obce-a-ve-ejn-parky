// Ikony (lucide, viewBox 24×24) jako SVG path data pro kreslení do canvasu.
export const ICONS = {
  droplet: ['M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z'],
  waves: [
    'M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
    'M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
    'M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
  ],
  anchor: ['M12 22V8', 'M5 12H2a10 10 0 0 0 20 0h-3', 'M15 5a3 3 0 1 1 -6 0a3 3 0 0 1 6 0'],
  shield: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1 -.67 -.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1 -1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'],
  file: ['M15 2H6a2 2 0 0 0 -2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V7Z', 'M14 2v4a2 2 0 0 0 2 2h4', 'M10 9H8', 'M16 13H8', 'M16 17H8'],
  minus: ['M5 12h14'],
};

export function drawIcon(ctx, name, x, y, size, color, width = 2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  (ICONS[name] || []).forEach((d) => ctx.stroke(new Path2D(d)));
  ctx.restore();
}