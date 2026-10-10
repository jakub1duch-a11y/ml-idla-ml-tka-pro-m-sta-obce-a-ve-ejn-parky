import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { buildEmailHtml, buildEmailText, sendViaGmail, BRAND, buildSummaryBlock } from '../../shared/customerEmails.ts';
import { dispatchNotification, buildDedupKey } from '../../shared/notificationQueue.ts';

const escapeHtml = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c] as string));
const clean = (v: unknown, max = 2000) => String(v || '').trim().slice(0, max);
const money = (v: unknown) => new Intl.NumberFormat('cs-CZ').format(Math.round(Number(v || 0)));

const STATUS_LABELS: Record<string, string> = {
  sent: 'Cenová nabídka odeslána',
  viewed: 'Nabídka zobrazena',
  extension_requested: 'Žádost o prodloužení platnosti',
  approved: 'Objednávka potvrzena',
  expired: 'Platnost nabídky skončila',
  in_production: 'Výroba zahájena',
  ready: 'Připraveno k předání',
  delivered: 'Realizováno / doručeno',
};

const STATUS_DESCRIPTIONS: Record<string, string> = {
  sent: 'Vaše cenová nabídka je připravená. Najdete ji v klientské sekci společně s vizualizacemi a projektovými podklady.',
  in_production: 'Vaše objednávka přešla do výroby. Náš tým připravuje komponenty a kompletuje řešení podle schválené specifikace.',
  ready: 'Vaše řešení je hotové a připravené k předání. Ozveme se vám pro dohodnutí termínu dodání nebo montáže.',
  delivered: 'Vaše řešení bylo realizováno a předáno. Děkujeme za důvěru — nyní můžete řešení plně využívat.',
  expired: 'Platnost vaší cenové nabídky bohužel skončila. Pokud máte zájem, rádi připravíme aktualizovanou nabídku.',
};

// Stavy, které spouští notifikaci klientovi (pouze zákaznicky viditelné, ne interní)
const CLIENT_VISIBLE_STATUSES = ['sent', 'in_production', 'ready', 'delivered', 'expired'];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const projectId = clean(body.project_id || body.entity_id);
    const newStatus = clean(body.status || body.new_status);
    const oldStatus = clean(body.old_status || body.previous_status);
    const dryRun = Boolean(body.dry_run);
    const previewOnly = Boolean(body.preview);

    if (!projectId) return Response.json({ error: 'missing_project_id' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });

    const project = await base44.asServiceRole.entities.ProjectOrder.get(projectId).catch(() => null);
    if (!project) return Response.json({ error: 'not_found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

    // Urči aktuální stav — buď z payloadu nebo z entity
    const currentStatus = newStatus || project.status;

    // Nespouštět na interní stavy nebo pokud se stav nezměnil
    if (!CLIENT_VISIBLE_STATUSES.includes(currentStatus)) {
      return Response.json({ ok: true, skipped: true, reason: 'internal_status', status: currentStatus }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // Pokud preview, vrať HTML bez odeslání
    if (previewOnly) {
      const content = buildEmailContent(project, currentStatus);
      return Response.json({
        ok: true,
        preview: true,
        subject: content.subject,
        html: buildEmailHtml(content.htmlContent),
        text: buildEmailText(content.htmlContent),
        recipient: project.client_email,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // Dedup: pokud už byla pro tento stav odeslána notifikace, přeskoč
    const dedupKey = buildDedupKey('status_change', projectId, currentStatus, 'client');
    if (!dryRun) {
      const existing = await base44.asServiceRole.entities.NotificationLog.filter({ dedup_key: dedupKey }, { limit: 1 }).catch(() => ({ items: [] }));
      if (existing?.items?.[0]?.status === 'sent') {
        return Response.json({ ok: true, deduplicated: true, dedup_key: dedupKey }, { headers: { 'Cache-Control': 'no-store' } });
      }
    }

    const content = buildEmailContent(project, currentStatus);
    const html = buildEmailHtml(content.htmlContent);
    const text = buildEmailText(content.htmlContent);

    if (dryRun) {
      return Response.json({
        ok: true,
        dry_run: true,
        would_send: true,
        recipient: project.client_email,
        subject: content.subject,
        dedup_key: dedupKey,
        content_summary: content.htmlContent.summaryBlock || '',
        html_preview: html.slice(0, 2000) + '...',
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // Odeslání přes Gmail
    const result = await dispatchNotification(base44, {
      dedupKey,
      eventType: currentStatus === 'sent' ? 'quote_sent' : 'status_change',
      channelType: 'email',
      recipient: project.client_email,
      entityId: projectId,
      entityType: 'ProjectOrder',
      subject: content.subject,
      contentSummary: `${STATUS_LABELS[currentStatus] || currentStatus} · ${project.quote_number || project.project_name || ''}`,
      sendFn: () => sendViaGmail(base44, {
        to: project.client_email,
        fromEmail: BRAND.CONTACT_EMAIL,
        subject: content.subject,
        text,
        html,
      }),
      metadata: JSON.stringify({ old_status: oldStatus, new_status: currentStatus }),
    });

    // Admin notifikace pro klientem iniciované akce (viewed, extension_requested, approved)
    const clientInitiatedStatuses = ['viewed', 'extension_requested', 'approved'];
    if (clientInitiatedStatuses.includes(currentStatus) && oldStatus !== currentStatus) {
      const adminEventType = currentStatus === 'approved' ? 'offer_approved' : currentStatus === 'extension_requested' ? 'extension_requested' : 'offer_viewed';
      try {
        await base44.functions.invoke('notifyAdminChannel', {
          event_type: adminEventType,
          client_name: project.client_name,
          client_email: project.client_email,
          quote_number: project.quote_number || '',
          project_name: project.project_name || project.product_name || '',
          total_price: project.total_price,
          admin_url: `${BRAND.SITE_URL}/admin?tab=poptavky`,
        });
      } catch (_) { /* admin notifikace je best-effort */ }
    }

    // Admin notifikace pro novou nabídku (sent) — akce týmu, ale tým by měl vidět potvrzení
    if (currentStatus === 'sent' && result.status === 'sent') {
      try {
        await base44.functions.invoke('notifyAdminChannel', {
          event_type: 'quote_sent',
          client_name: project.client_name,
          client_email: project.client_email,
          quote_number: project.quote_number || '',
          project_name: project.project_name || project.product_name || '',
          total_price: project.total_price,
          admin_url: `${BRAND.SITE_URL}/admin?tab=poptavky`,
        });
      } catch (_) { /* admin notifikace je best-effort */ }
    }

    return Response.json({ ok: true, ...result }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error?.message || 'dispatch_failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}

function buildEmailContent(project: any, status: string): { subject: string; htmlContent: any } {
  const statusLabel = STATUS_LABELS[status] || status;
  const statusDesc = STATUS_DESCRIPTIONS[status] || '';
  const quoteNumber = project.quote_number || '';
  const portalUrl = `${BRAND.PORTAL_URL}${quoteNumber ? `?quote=${encodeURIComponent(quoteNumber)}` : ''}`;
  const orderUrl = `${portalUrl}${quoteNumber ? `&` : `?`}action=order${quoteNumber ? `` : ``}`;

  const summaryFields: Array<[string, string | undefined]> = [
    ['Projekt', project.project_name || project.product_name],
    ['Číslo nabídky', quoteNumber],
    ['Produkt', project.product_name],
    ['Cena bez DPH', project.total_price ? `${money(project.total_price)} Kč` : 'dle nabídky'],
    ['Platnost do', project.valid_until ? new Date(project.valid_until).toLocaleDateString('cs-CZ') : undefined],
  ];

  const ctaButtons: Array<{ label: string; url: string; bg?: string; color?: string }> = [];
  if (['sent', 'viewed', 'extension_requested'].includes(status)) {
    ctaButtons.push({ label: 'Zobrazit nabídku', url: portalUrl, bg: '#0e5b67' });
    ctaButtons.push({ label: 'Potvrdit nabídku', url: orderUrl, bg: '#0e7584' });
  } else {
    ctaButtons.push({ label: 'Otevřít Můj projekt', url: portalUrl, bg: '#0e5b67' });
  }

  const subject = `${statusLabel}${quoteNumber ? ` · ${quoteNumber}` : ''} | MLŽIDLA®`.replace('  ', ' ');

  const bodyHtml = `<p style="margin:0 0 14px;line-height:1.7;color:#50666c;font-size:14px">${escapeHtml(statusDesc)}</p>`;

  return {
    subject,
    htmlContent: {
      typeLabel: statusLabel,
      title: statusLabel,
      greeting: `Dobrý den ${clean(project.client_name || '')},`,
      bodyHtml,
      ctaButtons,
      summaryBlock: buildSummaryBlock(summaryFields),
    },
  };
}