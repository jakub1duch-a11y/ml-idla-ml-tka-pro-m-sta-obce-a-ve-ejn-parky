import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { buildEmailHtml, buildEmailText, sendViaGmail, BRAND, buildSummaryBlock } from '../../shared/customerEmails.ts';
import { dispatchNotification, buildDedupKey } from '../../shared/notificationQueue.ts';
import { clean, buildReference, formatDate } from '../../shared/pdfHelpers.ts';

const escapeHtml = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c] as string));

function buildSalutation(name: string): string {
  const trimmed = clean(name, 100);
  if (!trimmed) return '';
  const titles = ['ing', 'mgr', 'bc', 'bca', 'mga', 'rndr', 'phdr', 'thlic', 'th', 'arch', 'judr', 'doc', 'prof'];
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const firstName = parts.find((p) => !titles.includes(p.toLowerCase().replace(/[,.;]/g, ''))) || parts[0] || '';
  return firstName ? `, ${firstName}` : '';
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const documentId = clean(body.document_id, 100);
    const dryRun = Boolean(body.dry_run);

    if (!documentId) return Response.json({ error: 'missing_document_id' }, { status: 400 });

    const doc = await base44.asServiceRole.entities.MisterDocument.get(documentId).catch(() => null);
    if (!doc) return Response.json({ error: 'document_not_found' }, { status: 404 });

    // Načtení projektu a poptávky pro kontext
    const project = doc.project_order_id
      ? await base44.asServiceRole.entities.ProjectOrder.get(doc.project_order_id).catch(() => null)
      : null;

    let inquiry = null;
    if (project?.inquiry_id) {
      inquiry = await base44.asServiceRole.entities.Poptavka.get(project.inquiry_id).catch(() => null);
    }

    const clientEmail = clean(doc.client_email || project?.client_email || inquiry?.email || '', 254).toLowerCase();
    if (!clientEmail) return Response.json({ error: 'missing_client_email' }, { status: 400 });

    const reference = buildReference(project?.inquiry_id || project?.id || doc.id);
    const salutation = buildSalutation(inquiry?.jmeno || project?.client_name || '');
    const projectName = clean(project?.project_name || inquiry?.produkt || 'váš projekt', 200);

    if (dryRun) {
      return Response.json({
        ok: true, dry_run: true,
        document_id: doc.id,
        client_email: clientEmail,
        reference: `P-${reference}`,
        project_name: projectName,
        document_title: doc.title,
        current_client_visible: doc.client_visible,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // Schválení zveřejnění
    await base44.asServiceRole.entities.MisterDocument.update(doc.id, {
      client_visible: true,
      notes: clean(`${doc.notes || ''} | Schváleno k zveřejnění: ${new Date().toLocaleString('cs-CZ')} (${user.email})`, 2000),
    });

    // Vytvoření signed URL pro dokument
    let signedUrl = '';
    if (String(doc.file_url).startsWith('private/')) {
      try {
        const signed = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({ file_uri: doc.file_url });
        signedUrl = signed?.signed_url || '';
      } catch {}
    } else if (doc.file_url) {
      signedUrl = doc.file_url;
    }

    // ── Notifikace klientovi ──
    const dedupKey = buildDedupKey('document_published', doc.id, doc.version || '1', clientEmail);

    const portalUrl = `${BRAND.PORTAL_URL}`;
    const ctaButtons = [
      { label: 'Otevřít v Můj projekt', url: portalUrl, bg: '#0e5b67' },
    ];

    const summaryFields: Array<[string, string | undefined]> = [];
    if (reference) summaryFields.push(['Reference', `P-${reference}`]);
    if (projectName) summaryFields.push(['Projekt', projectName]);
    summaryFields.push(['Dokument', clean(doc.title, 200)]);
    if (doc.version) summaryFields.push(['Verze', doc.version]);

    const bodyHtml = `
    <p style="margin:0 0 16px;line-height:1.7;color:#50666c;font-size:14px">Dobrý den${escapeHtml(salutation)}, připravili jsme pro vás novou projektovou dokumentaci. Najdete v ní souhrn zadání, produktové listy, vizuální návrh řešení, cenovou nabídku a postup naší spolupráce.</p>

    <div style="margin:22px 0;padding:18px 20px;background:#f5f8f8;border:1px solid #e1e9ea;border-radius:16px">
      <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6e858b;margin-bottom:10px;font-weight:700">Co najdete v dokumentu</div>
      <div style="font-size:13px;line-height:1.75;color:#3f5560">${buildSummaryBlock(summaryFields)}</div>
    </div>

    <p style="margin:18px 0 0;line-height:1.7;color:#50666c;font-size:14px">Dokument si můžete prohlédnout a stáhnout v klientském portálu. Pokud máte dotazy, neváhejte se na nás obrátit.</p>`;

    const htmlContent = {
      typeLabel: 'Nová dokumentace',
      title: 'Připravili jsme vaši projektovou dokumentaci',
      greeting: `Dobrý den${salutation},`,
      bodyHtml,
      ctaButtons,
      summaryBlock: '',
    };

    const html = buildEmailHtml(htmlContent);
    const text = buildEmailText(htmlContent);
    const subject = `Nová dokumentace k projektu ${projectName} | MLŽIDLA.cz`;

    const result = await dispatchNotification(base44, {
      dedupKey,
      eventType: 'offer_approved',
      channelType: 'email',
      recipient: clientEmail,
      entityId: doc.id,
      entityType: 'MisterDocument',
      subject,
      contentSummary: `Dokumentace k projektu ${projectName} připravena`,
      sendFn: () => sendViaGmail(base44, {
        to: clientEmail,
        fromEmail: BRAND.CONTACT_EMAIL,
        subject,
        text,
        html,
      }),
      metadata: JSON.stringify({ reference: `P-${reference}`, document_id: doc.id, project_name: projectName }),
    });

    // ── Interní oznámení admin týmu ──
    try {
      await base44.functions.invoke('notifyAdminChannel', {
        event_type: 'document_published',
        client_name: inquiry?.jmeno || project?.client_name || '',
        client_email: clientEmail,
        project_name: projectName,
        document_title: doc.title,
        document_id: doc.id,
        admin_url: `${BRAND.SITE_URL}/admin?tab=orders`,
      });
    } catch { /* best-effort */ }

    return Response.json({
      ok: true,
      document_id: doc.id,
      client_visible: true,
      notification: result,
      signed_url: signedUrl,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error?.message || 'publish_document_failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}