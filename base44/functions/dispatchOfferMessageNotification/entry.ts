import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { buildEmailHtml, buildEmailText, sendViaGmail, BRAND, buildSummaryBlock } from '../../shared/customerEmails.ts';
import { dispatchNotification, buildDedupKey } from '../../shared/notificationQueue.ts';

const escapeHtml = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c] as string));
const clean = (v: unknown, max = 2000) => String(v || '').trim().slice(0, max);

const CATEGORY_LABELS: Record<string, string> = {
  question: 'Odpověď na váš dotaz',
  solution_change: 'Úprava řešení',
  technical: 'Technická odpověď',
  delivery: 'Informace o termínu',
  other: 'Zpráva k projektu',
};

// Pouze zprávy od týmu (ne od klienta) spouští notifikaci klientovi
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const messageId = clean(body.message_id || body.entity_id);
    const dryRun = Boolean(body.dry_run);
    const previewOnly = Boolean(body.preview);

    if (!messageId) return Response.json({ error: 'missing_message_id' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });

    const message = await base44.asServiceRole.entities.OfferMessage.get(messageId).catch(() => null);
    if (!message) return Response.json({ error: 'not_found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

    // Zprávy od klienta → admin notifikace do chatu (notifikace klientovi se neposílá)
    if (message.sender_type === 'customer') {
      if (dryRun || previewOnly) {
        return Response.json({ ok: true, dry_run: dryRun, preview: previewOnly, route: 'admin_chat', client_name: project.client_name, client_email: project.client_email, quote_number: project.quote_number, message_preview: clean(message.message, 200) }, { headers: { 'Cache-Control': 'no-store' } });
      }
      try {
        await base44.functions.invoke('notifyAdminChannel', {
          event_type: 'client_message',
          client_name: project.client_name,
          client_email: project.client_email,
          quote_number: project.quote_number || '',
          project_name: project.project_name || project.product_name || '',
          message: clean(message.message, 500),
          admin_url: `${BRAND.SITE_URL}/admin?tab=poptavky`,
        });
      } catch (_) { /* best-effort */ }
      return Response.json({ ok: true, route: 'admin_chat' }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // Pouze zprávy od týmu spouští notifikaci klientovi
    if (message.sender_type !== 'team') {
      return Response.json({ ok: true, skipped: true, reason: 'unknown_sender' }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const project = await base44.asServiceRole.entities.ProjectOrder.get(message.project_order_id).catch(() => null);
    if (!project) return Response.json({ ok: true, skipped: true, reason: 'project_not_found' }, { headers: { 'Cache-Control': 'no-store' } });

    const categoryLabel = CATEGORY_LABELS[message.category] || 'Zpráva k projektu';
    const quoteNumber = project.quote_number || '';
    const portalUrl = `${BRAND.PORTAL_URL}${quoteNumber ? `?quote=${encodeURIComponent(quoteNumber)}` : ''}`;
    const replyUrl = `${BRAND.PORTAL_URL}${quoteNumber ? `&` : `?`}action=reply`;

    const summaryFields: Array<[string, string | undefined]> = [
      ['Projekt', project.project_name || project.product_name],
      ['Číslo nabídky', quoteNumber],
      ['Kategorie', categoryLabel],
    ];

    const subject = `${categoryLabel}${quoteNumber ? ` · ${quoteNumber}` : ''} | MLŽIDLA®`.replace('  ', ' ');

    const htmlContent = {
      typeLabel: categoryLabel,
      title: categoryLabel,
      greeting: `Dobrý den ${clean(project.client_name || '')},`,
      bodyHtml: `<p style="margin:0 0 14px;line-height:1.7;color:#50666c;font-size:14px">Náš tým vám zaslal novou zprávu k vašemu projektu. Zprávu si můžete přečíst a odpovědět přímo v klientské sekci.</p><div style="margin:18px 0;padding:16px 18px;background:#f5f8f8;border:1px solid #e1e9ea;border-radius:14px;font-size:14px;line-height:1.65;color:#3f5560">${escapeHtml(clean(message.message, 800)).replace(/\n/g, '<br>')}</div>`,
      ctaButtons: [
        { label: 'Zobrazit zprávu', url: portalUrl, bg: '#0e5b67' },
        { label: 'Odpovědět', url: replyUrl, bg: '#0e7584' },
      ],
      summaryBlock: buildSummaryBlock(summaryFields),
    };

    const html = buildEmailHtml(htmlContent);
    const text = buildEmailText(htmlContent);

    if (previewOnly) {
      return Response.json({ ok: true, preview: true, subject, html, text, recipient: project.client_email }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const dedupKey = buildDedupKey('admin_message', messageId, '1', project.client_email);

    if (dryRun) {
      return Response.json({ ok: true, dry_run: true, would_send: true, recipient: project.client_email, subject, dedup_key: dedupKey }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const result = await dispatchNotification(base44, {
      dedupKey,
      eventType: 'admin_message',
      channelType: 'email',
      recipient: project.client_email,
      entityId: messageId,
      entityType: 'OfferMessage',
      subject,
      contentSummary: `${categoryLabel} · ${quoteNumber || project.project_name || ''}`,
      sendFn: () => sendViaGmail(base44, {
        to: project.client_email,
        fromEmail: BRAND.CONTACT_EMAIL,
        subject,
        text,
        html,
      }),
      metadata: JSON.stringify({ message_id: messageId, category: message.category }),
    });

    return Response.json({ ok: true, ...result }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error?.message || 'dispatch_failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}