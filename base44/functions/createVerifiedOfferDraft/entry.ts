import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { buildClientOfferEmail, loadOfferEmailData } from '../../shared/clientOfferEmail.ts';
import { buildMimeMessage, mimeToBase64Url } from '../../shared/customerEmails.ts';
import { BUSINESS_EMAIL, assertBusinessAccount, getVerifiedGoogleAccount, getBusinessConnectorStatus } from '../../shared/businessWorkflowGuard.mjs';

// Creates a Gmail DRAFT only. No messages/send endpoint is called here.
// Server verifies the actual Gmail identity; a mismatched Drive identity is never used.
const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const clean = (v: unknown, limit = 200) => String(v || '').trim().slice(0, limit);
const isEmail = (value: string) => /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(value);
const escapeHtml = (v: unknown) => String(v || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const drivePdfId = (value: unknown) => {
  try {
    const u = new URL(String(value || ''));
    if (u.protocol !== 'https:' || u.hostname !== 'drive.google.com') return '';
    const m = u.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]{12,})\/view\/?$/);
    return m ? m[1] : '';
  } catch { return ''; }
};
const safeCanva = (value: unknown) => {
  try {
    const u = new URL(String(value || ''));
    return u.protocol === 'https:' && (u.hostname === 'www.canva.com' || u.hostname === 'canva.com') ? u.toString() : '';
  } catch { return ''; }
};
async function verifiedPdf(base44: any, url: string) {
  const id = drivePdfId(url);
  if (!id) return { attachment: null, warning: 'PDF má nepodporovaný odkaz. Zůstane jako odkaz v textu.' };
  const status = await getBusinessConnectorStatus(base44, 'googledrive');
  if (!status.ready) return { attachment: null, warning: 'PDF není přiloženo: Google Drive v Base44 není ověřen pod obchodním účtem.' };
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
  const meta = await fetch('https://www.googleapis.com/drive/v3/files/' + id + '?fields=id,name,mimeType,size&supportsAllDrives=true', {
    headers: { Authorization: 'Bearer ' + accessToken }, signal: AbortSignal.timeout(12000),
  });
  if (!meta.ok) return { attachment: null, warning: 'PDF z Google Disku nelze číst: HTTP ' + meta.status };
  const info = await meta.json();
  if (info.mimeType !== 'application/pdf' || Number(info.size || 0) > 9 * 1024 * 1024) {
    return { attachment: null, warning: 'Soubor na Disku není PDF nebo překračuje limit 9 MB.' };
  }
  const response = await fetch('https://www.googleapis.com/drive/v3/files/' + id + '?alt=media&supportsAllDrives=true', {
    headers: { Authorization: 'Bearer ' + accessToken }, signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) return { attachment: null, warning: 'PDF nelze stáhnout: HTTP ' + response.status };
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > 9 * 1024 * 1024 || String.fromCharCode(...bytes.slice(0, 5)) !== '%PDF-') {
    return { attachment: null, warning: 'Stažený dokument neprošel kontrolou PDF.' };
  }
  const filename = clean(info.name, 130).replace(/[\r\n"\\]/g, '_') || 'nabidka-MLZIDLA.pdf';
  return { attachment: { filename, content: bytes, contentType: 'application/pdf' }, warning: '' };
}

export default async function(req: Request) {
  if (req.method !== 'POST') return Response.json({ error: 'method_not_allowed' }, { status: 405, headers });
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'forbidden' }, { status: 403, headers });

    const body = await req.json().catch(() => ({}));
    const projectId = clean(body.project_order_id || body.project_id, 100);
    if (!projectId) return Response.json({ error: 'project_order_id_required' }, { status: 400, headers });

    const loaded = await loadOfferEmailData(base44, projectId);
    if (!loaded) return Response.json({ error: 'project_not_found' }, { status: 404, headers });
    const { data, project } = loaded;
    const clientEmail = clean(project.client_email, 200).toLowerCase();
    if (!isEmail(clientEmail)) return Response.json({ error: 'invalid_client_email' }, { status: 422, headers });

    // Validate the active OAuth identity, not merely the "connected" flag.
    const gmail = await base44.asServiceRole.connectors.getConnection('gmail');
    const actualMailbox = await getVerifiedGoogleAccount(gmail.accessToken, 'gmail');
    assertBusinessAccount(actualMailbox, 'gmail');

    const runs = await base44.asServiceRole.entities.OfferAgentRun.filter({ project_order_id: projectId });
    const latest = (runs || []).sort((x: any, y: any) =>
      new Date(y.created_date || 0).getTime() - new Date(x.created_date || 0).getTime())[0];
    const checked = Boolean(latest?.qa_passed && Array.isArray(latest?.pricing_sources)
      && latest.pricing_sources.length && ['pending_approval', 'approved'].includes(latest.run_status));
    const humanApproved = Boolean(latest?.run_status === 'approved'
      && String(latest?.approved_by || '').trim().toLowerCase() === BUSINESS_EMAIL
      && latest?.approved_at && latest?.send_allowed === true);

    // Unverified offers go to an INTERNAL draft only, never pre-addressed to the client.
    const emailData = checked ? data : { ...data, totalPrice: undefined, smartControlIncluded: false };
    const email = buildClientOfferEmail(emailData);
    const assets = await base44.asServiceRole.entities.OfferAsset.filter({ project_order_id: projectId }).catch(() => []);
    const canva = (assets || []).map((x: any) => safeCanva(x.file_url)).filter(Boolean).slice(0, 8);

    let pdf: any = null;
    let pdfWarning = '';
    if (project.quote_pdf_url) {
      try {
        const fetched = await verifiedPdf(base44, project.quote_pdf_url);
        pdf = fetched.attachment;
        pdfWarning = fetched.warning;
      } catch { pdfWarning = 'Přílohu PDF nebylo možné bezpečně ověřit.'; }
    } else pdfWarning = 'Cenová nabídka zatím nemá export PDF.';
    const sendable = checked && humanApproved && Boolean(pdf);

    // Even if QA passed, missing PDF keeps draft addressed only to the owner.
    const recipient = sendable ? clientEmail : BUSINESS_EMAIL;
    const reviewNote = !checked
      ? 'INTERNÍ NÁVRH: není ověřené QA a zdroje cen. Před odesláním doplňte skutečné ceny, produkt, Canva list a přílohy.'
      : !humanApproved ? 'INTERNÍ NÁVRH: čeká na výhradní schválení vlastníkem meduna@holmtec.cz. Není určen k odeslání klientovi.'
      : !pdf ? 'INTERNÍ NÁVRH: přiložené PDF chybí nebo není ověřené. Tento koncept není určen k odeslání klientovi.' : '';
    const subject = (sendable ? '' : '[INTERNÍ KONTROLA] ') + email.subject;
    const title = reviewNote ? '<p style="padding:12px;background:#fff3cd;color:#614b00;font-weight:bold">' + escapeHtml(reviewNote) + '</p>' : '';
    const canvaHtml = canva.length ? '<p><strong>Editace nabídky v Canvě (pouze interně):</strong></p><ul>'
      + canva.map((u: string) => '<li><a href="' + escapeHtml(u) + '">' + escapeHtml(u) + '</a></li>').join('') + '</ul>' : '';
    const extras = sendable ? '' : title + canvaHtml;
    const html = extras + email.html;
    const plain = [reviewNote, !sendable ? canva.join('\n') : '', email.text].filter(Boolean).join('\n\n');
    const raw = buildMimeMessage({
      to: recipient, fromEmail: BUSINESS_EMAIL, subject, text: plain, html,
      attachments: sendable ? [pdf] : [],
    });
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + gmail.accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: { raw: mimeToBase64Url(raw) } }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return Response.json({ error: 'gmail_draft_api_failed', status: response.status }, { status: 502, headers });
    const created = await response.json();
    const draftId = clean(created.id, 160);
    if (latest?.id && draftId) {
      const notes = [String(latest.notes || '').slice(-4000), 'Gmail draft created ' + new Date().toISOString() + ' · id=' + draftId + ' · ' + (sendable ? 'client-addressed' : 'internal-review')]
        .filter(Boolean).join('\n').slice(-5000);
      await base44.asServiceRole.entities.OfferAgentRun.update(latest.id, { notes }).catch(() => null);
    }
    return Response.json({
      ok: true, mode: 'gmail_draft_only', draft_id: draftId,
      recipient, intended_client: clientEmail, ready_for_manual_review: sendable,
      pdf_attached: sendable, pdf_warning: pdfWarning,
      canva_designs_found: canva.length, qa_verified: checked,
      gmail_drafts_url: 'https://mail.google.com/mail/u/?authuser=' + encodeURIComponent(BUSINESS_EMAIL) + '#drafts',
      sent: false,
    }, { headers });
  } catch (error: any) {
    const message = String(error?.message || '');
    return Response.json({ error: /Nesprávný účet|Není ověřena identita|OAuth API/.test(message)
      ? message.slice(0, 300) : 'draft_preparation_failed' }, { status: 409, headers });
  }
}