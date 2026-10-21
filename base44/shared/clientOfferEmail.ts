// Sdílený modul pro klientskou e-mailovou šablonu nabídky MLŽIDLA.cz
// Jednotná grafika: hlavička s logem, světlý základ, modré akcenty, inline vizualizace,
// odkaz na Můj projekt, přílohy, postup spolupráce, platnost, patička.

const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png';
const HOLMTEC_LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/holmtec_logo_bez_pozadi.png';
const SITE_URL = 'https://mlzidla.cz';
const CONTACT_EMAIL = 'meduna@holmtec.cz';
const INFO_EMAIL = 'info@mlzidla.cz';
const CONTACT_PHONE = '+420 774 700 390';
const PORTAL_URL = `${SITE_URL}/muj-projekt`;

const ACCENT_BLUE = '#0B5FFF';
const ACCENT_CYAN = '#00A8E8';
const TEXT_DARK = '#0B2034';
const TEXT_MUTED = '#586A72';
const BG_LIGHT = '#F8FBFC';
const CARD_SURFACE = '#FFFFFF';
const BORDER_LIGHT = '#D3E2E8';

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c] as string));
const clean = (value: unknown, max = 2000) => String(value || '').trim().slice(0, max);
const money = (v: unknown) => Number.isFinite(Number(v)) && Number(v) > 0 ? `${new Intl.NumberFormat('cs-CZ').format(Math.round(Number(v)))} Kč` : 'dle nabídky';
const formatDate = (value: unknown) => value ? new Date(String(value)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

export interface OfferEmailData {
  clientName: string;
  productName: string;
  productDescription?: string;
  quantity: number;
  location?: string;
  visualizations: string[];
  portalUrl: string;
  quoteNumber: string;
  validUntil?: string;
  attachments: Array<{ name: string; url?: string }>;
  smartControlIncluded: boolean;
  totalPrice?: number;
  inquirySummary?: string;
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

const COOPERATION_STEPS = [
  { num: '1', title: 'Nabídka', desc: 'Připravili jsme pro vás cenovou nabídku s vizualizacemi.' },
  { num: '2', title: 'Potvrzení', desc: 'Potvrďte zájem v sekci Můj projekt nebo e-mailem.' },
  { num: '3', title: 'Výrobní záloha 50 %', desc: 'Po potvrzení vystavíme daňový doklad na 50 % výrobní zálohy.' },
  { num: '4', title: 'Výroba', desc: 'Zahájíme výrobu vašeho řešení na míru (typicky 2–4 týdny).' },
  { num: '5', title: 'Dodání / instalace', desc: 'Doručíme a případně nainstalujeme řešení na vašem místě.' },
];

function buildVisualizationBlock(visualizations: string[]): string {
  if (!visualizations?.length) return '';
  const images = visualizations.slice(0, 3).map((url, i) => `
    <div style="margin-bottom:20px;border-radius:16px;overflow:hidden;border:1px solid ${BORDER_LIGHT};background:${CARD_SURFACE}">
      <img src="${escapeHtml(url)}" alt="Vizualizace ${i + 1} — ${'MLŽIDLA.cz'}" style="display:block;width:100%;max-width:100%;height:auto;border:0" loading="lazy">
      <div style="padding:10px 16px;font-size:11px;color:${TEXT_MUTED};letter-spacing:.04em">Vizualizace ${i + 1} — koncept umístění produktu ve vašem prostoru</div>
    </div>`).join('');
  return `
    <div style="margin:28px 0 8px">
      <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${ACCENT_CYAN};margin-bottom:10px;font-weight:700">Vizualizace vašeho projektu</div>
      ${images}
      <p style="margin:10px 0 0;font-size:11px;line-height:1.6;color:${TEXT_MUTED}">Vizualizace mají konceptní charakter a slouží k představě umístění produktu. Finální provedení může mírně lišovat podle technických podmínek lokality.</p>
    </div>`;
}

function buildAttachmentsBlock(attachments: Array<{ name: string; url?: string }>): string {
  if (!attachments?.length) return '';
  const items = attachments.map(a => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER_LIGHT}">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:36px;height:36px;border-radius:8px;background:${BG_LIGHT};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${ACCENT_BLUE};flex-shrink:0">${escapeHtml((a.name.match(/\.(\w{2,4})$/)?.[1] || 'PDF').toUpperCase())}</div>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:600;color:${TEXT_DARK}">${escapeHtml(a.name)}</div>
            ${a.url ? `<a href="${escapeHtml(a.url)}" style="font-size:11px;color:${ACCENT_CYAN};text-decoration:none">Stáhnout</a>` : '<span style="font-size:11px;color:' + TEXT_MUTED + '">Dostupné v sekci Můj projekt</span>'}
          </div>
        </div>
      </td>
    </tr>`).join('');
  return `
    <div style="margin:28px 0">
      <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${ACCENT_CYAN};margin-bottom:12px;font-weight:700">Přílohy nabídky</div>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${items}</table>
    </div>`;
}

function buildCooperationSteps(): string {
  const steps = COOPERATION_STEPS.map(s => `
    <div style="display:flex;gap:14px;margin-bottom:16px;align-items:flex-start">
      <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,${ACCENT_BLUE},${ACCENT_CYAN});color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">${s.num}</div>
      <div style="flex:1;padding-top:2px">
        <div style="font-size:14px;font-weight:700;color:${TEXT_DARK};margin-bottom:3px">${escapeHtml(s.title)}</div>
        <div style="font-size:12px;line-height:1.6;color:${TEXT_MUTED}">${escapeHtml(s.desc)}</div>
      </div>
    </div>`).join('');
  return `
    <div style="margin:28px 0;padding:24px;background:${BG_LIGHT};border-radius:16px;border:1px solid ${BORDER_LIGHT}">
      <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${ACCENT_CYAN};margin-bottom:16px;font-weight:700">Postup spolupráce</div>
      ${steps}
    </div>`;
}

function buildSmartControlBlock(smartControlIncluded: boolean): string {
  if (!smartControlIncluded) return '';
  return `
    <div style="margin:24px 0;padding:20px 24px;background:linear-gradient(135deg,rgba(11,95,255,.04),rgba(0,168,232,.04));border:1px solid rgba(11,95,255,.15);border-radius:16px">
      <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${ACCENT_BLUE};margin-bottom:8px;font-weight:700">Chytré ovládání SUPLA</div>
      <p style="margin:0;font-size:13px;line-height:1.65;color:${TEXT_DARK}">Nabídka zahrnuje chytré řízení mlžení přes platformu SUPLA — teplotní automatika (aktivace nad 25 °C), časové plány, monitoring spotřeby vody a možnost dálkového přehledu a řízení z mobilní aplikace.</p>
    </div>`;
}

const FOOTER_HTML = `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:32px;border-top:2px solid ${ACCENT_CYAN};padding-top:24px">
    <tr>
      <td style="padding-bottom:16px">
        <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${ACCENT_CYAN};margin-bottom:8px;font-weight:700">Projektový kontakt</div>
        <div style="font-size:18px;font-weight:700;color:${TEXT_DARK};margin-bottom:4px">Ing. Radek Meduna</div>
        <div style="font-size:13px;line-height:1.8;color:${TEXT_MUTED}">
          <a href="tel:${CONTACT_PHONE.replace(/\s/g, '')}" style="color:${TEXT_DARK};text-decoration:none">${CONTACT_PHONE}</a> ·
          <a href="mailto:${CONTACT_EMAIL}" style="color:${ACCENT_BLUE};text-decoration:none">${CONTACT_EMAIL}</a><br>
          <a href="${SITE_URL}" style="color:${ACCENT_BLUE};text-decoration:none">mlzidla.cz</a> ·
          <a href="${SITE_URL}/podpora" style="color:${ACCENT_BLUE};text-decoration:none">Podpora</a> ·
          <a href="${SITE_URL}/katalog-mlzitek" style="color:${ACCENT_BLUE};text-decoration:none">Katalog</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding-top:16px;border-top:1px solid ${BORDER_LIGHT}">
        <table cellpadding="0" cellspacing="0" role="presentation"><tr>
          <td style="padding-right:16px"><img src="${LOGO_URL}" width="120" alt="MLŽIDLA.cz" style="display:block;width:120px;max-width:100%;height:auto;border:0"></td>
          <td><img src="${HOLMTEC_LOGO_URL}" width="90" alt="HolmTec" style="display:block;width:90px;max-width:100%;height:auto;border:0;opacity:.85"></td>
        </tr></table>
      </td>
    </tr>
  </table>`;

const COMPANY_BAR = `
  <tr><td align="center" style="background:${TEXT_DARK};padding:16px 26px">
    <div style="font-size:12px;color:#fff;font-weight:700">MLŽIDLA® / HolmTec s.r.o.</div>
    <div style="margin-top:4px;font-size:11px;color:rgba(255,255,255,.6)">Chytré mlžení · by HolmTec · Trutnov · Česká republika</div>
  </td></tr>`;

export function buildClientOfferEmail(data: OfferEmailData): BuiltEmail {
  const firstName = clean(data.clientName).split(' ')[0] || 'vážený zákazníku';
  const subject = `Cenová nabídka${data.quoteNumber ? ` · ${data.quoteNumber}` : ''} — ${data.productName}${data.quantity > 1 ? ` (${data.quantity} ks)` : ''} | MLŽIDLA®`;

  const summaryRows = [
    ['Produkt', data.productName],
    ['Počet ks', data.quantity > 1 ? `${data.quantity} ks` : '1 ks'],
    ['Lokalita', data.location],
    ['Číslo nabídky', data.quoteNumber],
    ['Cena bez DPH', data.totalPrice ? money(data.totalPrice) : 'dle nabídky'],
    ['Platnost do', data.validUntil ? formatDate(data.validUntil) : '30 dnů od odeslání'],
  ].filter(([, v]) => v) as Array<[string, string]>;

  const summaryBlock = summaryRows.map(([label, value]) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid ${BORDER_LIGHT};font-size:12px;color:${TEXT_MUTED};width:40%">${escapeHtml(label)}</td>
      <td style="padding:8px 0;border-bottom:1px solid ${BORDER_LIGHT};font-size:13px;font-weight:600;color:${TEXT_DARK}">${escapeHtml(value)}</td>
    </tr>`).join('');

  const inquirySummaryBlock = data.inquirySummary ? `
    <div style="margin:20px 0;padding:16px 20px;background:${BG_LIGHT};border-radius:12px;border:1px solid ${BORDER_LIGHT}">
      <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${TEXT_MUTED};margin-bottom:6px">Shrnutí poptávky</div>
      <div style="font-size:13px;line-height:1.65;color:${TEXT_DARK}">${escapeHtml(clean(data.inquirySummary, 600))}</div>
    </div>` : '';

  const html = `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:${BG_LIGHT};font-family:'Inter','Helvetica Neue',Arial,sans-serif;color:${TEXT_DARK}">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${BG_LIGHT}"><tr><td align="center" style="padding:28px 14px">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:680px;background:${CARD_SURFACE};border:1px solid ${BORDER_LIGHT};border-radius:24px;overflow:hidden">

  <!-- Header band -->
  <tr><td style="background:linear-gradient(135deg,${ACCENT_BLUE},${ACCENT_CYAN});padding:28px 36px">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
      <td><img src="${LOGO_URL}" width="180" alt="MLŽIDLA.cz" style="display:block;width:180px;max-width:70%;height:auto;border:0"></td>
      <td align="right" valign="bottom" style="color:rgba(255,255,255,.85);font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;text-align:right">Chytré mlžení<br>by HolmTec</td>
    </tr></table>
    <div style="margin-top:14px;font-size:15px;color:#fff;font-weight:600;letter-spacing:.02em">Chladíme svět mlžením</div>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:32px 36px 8px">
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:${TEXT_DARK};font-family:'Manrope','Inter',sans-serif">Cenová nabídka${data.quoteNumber ? ` ${escapeHtml(data.quoteNumber)}` : ''}</h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${TEXT_MUTED}">Dobrý den ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:${TEXT_DARK}">děkujeme za vaši poptávku. Na základě vašeho zadání jsme připravili cenovou nabídku na <strong>${escapeHtml(data.productName)}</strong>${data.quantity > 1 ? ` (${data.quantity} ks)` : ''}${data.location ? ` pro lokalitu <strong>${escapeHtml(data.location)}</strong>` : ''}. Vizualizace a kompletní podklady najdete níže a v klientské sekci Můj projekt.</p>
    ${inquirySummaryBlock}

    <!-- Summary table -->
    <div style="margin:24px 0">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${summaryBlock}</table>
    </div>

    <!-- Visualizations -->
    ${buildVisualizationBlock(data.visualizations)}

    <!-- Smart control -->
    ${buildSmartControlBlock(data.smartControlIncluded)}

    <!-- CTA button -->
    <div style="margin:28px 0;text-align:center">
      <a href="${escapeHtml(data.portalUrl)}" style="display:inline-block;padding:14px 36px;border-radius:999px;background:linear-gradient(135deg,${ACCENT_BLUE},${ACCENT_CYAN});color:#fff;text-decoration:none;font-weight:700;font-size:14px;font-family:'Manrope','Inter',sans-serif">Zobrazit nabídku v Můj projekt</a>
      <p style="margin:10px 0 0;font-size:11px;color:${TEXT_MUTED}">Odkaz na vaši soukromou sekci, kde najdete všechny podklady a můžete nabídku potvrdit.</p>
    </div>

    <!-- Attachments -->
    ${buildAttachmentsBlock(data.attachments)}

    <!-- Cooperation steps -->
    ${buildCooperationSteps()}

    <!-- Validity -->
    <div style="margin:20px 0;padding:14px 20px;background:rgba(0,168,232,.06);border-radius:10px;border-left:3px solid ${ACCENT_CYAN}">
      <div style="font-size:12px;color:${TEXT_DARK}"><strong>Platnost nabídky:</strong> ${escapeHtml(data.validUntil ? formatDate(data.validUntil) : '30 dnů od odeslání')}. Po tomto termínu si vyhrazujeme právo na úpravu cen materiálů.</div>
    </div>

    ${FOOTER_HTML}
  </td></tr>

  ${COMPANY_BAR}
</table>
</td></tr></table>
</body></html>`;

  // Plain text version
  const textLines: string[] = [
    subject,
    '',
    `Dobrý den ${firstName},`,
    '',
    `děkujeme za vaši poptávku. Na základě vašeho zadání jsme připravili cenovou nabídku na ${data.productName}${data.quantity > 1 ? ` (${data.quantity} ks)` : ''}${data.location ? ` pro lokalitu ${data.location}` : ''}.`,
    '',
    'SHRNUTÍ:',
    ...summaryRows.map(([l, v]) => `${l}: ${v}`),
    '',
    data.inquirySummary ? `Shrnutí poptávky: ${clean(data.inquirySummary, 400)}` : '',
    '',
    'VIZUALIZACE:',
    ...data.visualizations.map((url, i) => `Vizualizace ${i + 1}: ${url}`),
    '',
    data.smartControlIncluded ? 'CHYTRÉ OVLÁDÁNÍ SUPLA: Nabídka zahrnuje chytré řízení mlžení — teplotní automatika, časové plány, monitoring spotřeby a dálkové řízení z mobilní aplikace.' : '',
    '',
    'POSTUP SPOLUPRÁCE:',
    ...COOPERATION_STEPS.map(s => `${s.num}. ${s.title} — ${s.desc}`),
    '',
    `PLATNOST NABÍDKY: ${data.validUntil ? formatDate(data.validUntil) : '30 dnů od odeslání'}`,
    '',
    `Nabídku najdete také v sekci Můj projekt: ${data.portalUrl}`,
    '',
    'PŘÍLOHY:',
    ...data.attachments.map(a => `- ${a.name}${a.url ? ` (${a.url})` : ''}`),
    '',
    'S pozdravem,',
    '',
    'Ing. Radek Meduna',
    'MLŽIDLA.cz by HolmTec',
    CONTACT_PHONE,
    CONTACT_EMAIL,
    INFO_EMAIL,
    SITE_URL,
  ].filter(Boolean);
  const text = textLines.join('\n');

  return { subject, html, text };
}

export async function loadOfferEmailData(base44: any, projectId: string): Promise<{ data: OfferEmailData; project: any } | null> {
  const project = await base44.asServiceRole.entities.ProjectOrder.get(projectId).catch(() => null);
  if (!project) return null;

  // Load visualizations (OfferAsset with asset_type=generated_visualization, selected_for_offer=true)
  const assetPage = await base44.asServiceRole.entities.OfferAsset.filter(
    { project_order_id: projectId, asset_type: 'generated_visualization', selected_for_offer: true },
    { sort: 'sort_order', limit: 10 }
  ).catch(() => ({ items: [] }));
  const visualizations = (assetPage?.items || []).map((a: any) => a.file_url).filter(Boolean);

  // Load inquiry for location and summary
  let location = '';
  let inquirySummary = '';
  if (project.inquiry_id) {
    const inquiry = project.inquiry_type === 'contact'
      ? await base44.asServiceRole.entities.ContactInquiry.get(project.inquiry_id).catch(() => null)
      : await base44.asServiceRole.entities.Poptavka.get(project.inquiry_id).catch(() => null);
    if (inquiry) {
      location = (inquiry as any).installation_location || (inquiry as any).location || '';
      inquirySummary = (inquiry as any).zprava || (inquiry as any).message || (inquiry as any).description || '';
    }
  }

  // Build portal URL with shared_token
  const portalUrl = project.shared_token
    ? `${PORTAL_URL}?token=${encodeURIComponent(project.shared_token)}`
    : PORTAL_URL;

  // Build attachments list
  const attachments: Array<{ name: string; url?: string }> = [];
  if (project.quote_pdf_url) attachments.push({ name: `Cenová nabídka ${project.quote_number || ''}.pdf`, url: project.quote_pdf_url });
  if (project.presentation_pdf_url) attachments.push({ name: `Prezentace ${project.quote_number || ''}.pdf`, url: project.presentation_pdf_url });
  visualizations.forEach((url: string, i: number) => {
    if (url.startsWith('http')) attachments.push({ name: `Vizualizace ${i + 1}.webp`, url });
  });

  const data: OfferEmailData = {
    clientName: project.client_name || '',
    productName: project.product_name || 'mlžící systém',
    quantity: 1,
    location,
    visualizations,
    portalUrl,
    quoteNumber: project.quote_number || '',
    validUntil: project.valid_until,
    attachments,
    smartControlIncluded: Boolean(project.smart_control_included),
    totalPrice: project.total_price,
    inquirySummary,
  };

  return { data, project };
}