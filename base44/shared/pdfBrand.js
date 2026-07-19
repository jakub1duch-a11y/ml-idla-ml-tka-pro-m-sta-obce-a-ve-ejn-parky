export const PDF = { width: 210, height: 297, margin: 15, ink: [13, 17, 23], cyan: [34, 211, 238], muted: [100, 116, 139] };

function toBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(binary);
}

export async function registerCzechFonts(doc) {
  const fonts = [
    ['https://raw.githubusercontent.com/openmaptiles/fonts/master/noto-sans/NotoSans-Regular.ttf', 'NotoSans-Regular.ttf', 'normal'],
    ['https://raw.githubusercontent.com/openmaptiles/fonts/master/noto-sans/NotoSans-Bold.ttf', 'NotoSans-Bold.ttf', 'bold'],
  ];
  for (const [url, file, style] of fonts) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Český PDF font se nepodařilo načíst');
    doc.addFileToVFS(file, toBase64(new Uint8Array(await response.arrayBuffer())));
    doc.addFont(file, 'DejaVu', style);
  }
  doc.setFont('DejaVu', 'normal');
}

export function cleanText(value = '') {
  return String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function drawBrandHeader(doc, title, subtitle) {
  const { width, margin, ink, cyan } = PDF;
  doc.setFillColor(...ink); doc.rect(0, 0, width, 42, 'F');
  doc.setFillColor(...cyan); doc.circle(margin + 5, 16, 5, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('DejaVu', 'bold'); doc.setFontSize(17); doc.text('mlzidla.cz', margin + 14, 18);
  doc.setTextColor(...cyan); doc.setFontSize(7); doc.text('MLŽNÉ SOCHY · BRÁNY · SMART ŘÍZENÍ', margin + 14, 24);
  doc.setTextColor(255, 255, 255); doc.setFontSize(13); doc.text(title, width - margin, 17, { align: 'right' });
  doc.setTextColor(148, 163, 184); doc.setFont('DejaVu', 'normal'); doc.setFontSize(7.5); doc.text(subtitle, width - margin, 25, { align: 'right' });
  doc.setFillColor(...cyan); doc.rect(0, 39.5, width, 2.5, 'F');
}

export function drawSectionTitle(doc, title, y) {
  doc.setTextColor(...PDF.ink); doc.setFont('DejaVu', 'bold'); doc.setFontSize(10); doc.text(title.toUpperCase(), PDF.margin, y);
  doc.setDrawColor(...PDF.cyan); doc.setLineWidth(0.6); doc.line(PDF.margin, y + 2.5, PDF.width - PDF.margin, y + 2.5);
  return y + 9;
}

export function ensureSpace(doc, y, needed = 35, headerTitle = 'TECHNICKÁ DOKUMENTACE') {
  if (y + needed < PDF.height - 20) return y;
  doc.addPage(); drawBrandHeader(doc, headerTitle, 'mlzidla.cz · profesionální mlžná řešení');
  return 53;
}

export async function addProductImage(doc, url, x, y, width, height) {
  if (!url) return false;
  const response = await fetch(url); if (!response.ok) return false;
  const type = response.headers.get('content-type') || 'image/jpeg';
  const data = `data:${type};base64,${toBase64(new Uint8Array(await response.arrayBuffer()))}`;
  doc.setFillColor(241, 245, 249); doc.roundedRect(x, y, width, height, 2, 2, 'F');
  doc.addImage(data, type.includes('png') ? 'PNG' : 'JPEG', x + 1, y + 1, width - 2, height - 2, undefined, 'FAST');
  return true;
}

export function addBrandFooters(doc) {
  const count = doc.getNumberOfPages();
  for (let page = 1; page <= count; page++) {
    doc.setPage(page); doc.setFillColor(...PDF.ink); doc.rect(0, 281, PDF.width, 16, 'F');
    doc.setFont('DejaVu', 'normal'); doc.setFontSize(6.8); doc.setTextColor(148, 163, 184);
    doc.text('HolmTec s.r.o. · Trutnov · +420 774 700 390 · obchod1@holmtec.cz', PDF.margin, 289);
    doc.setTextColor(...PDF.cyan); doc.setFont('DejaVu', 'bold'); doc.text(`mlzidla.cz   |   ${page}/${count}`, PDF.width - PDF.margin, 289, { align: 'right' });
  }
}

export function pdfBase64(doc) {
  return toBase64(new Uint8Array(doc.output('arraybuffer')));
}