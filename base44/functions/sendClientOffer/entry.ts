import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { buildClientOfferEmail, loadOfferEmailData } from '../../shared/clientOfferEmail.ts';
import { sendViaGmail } from '../../shared/customerEmails.ts';

const clean = (v: unknown, max = 2000) => String(v || '').trim().slice(0, max);

// Odeslání klientské nabídky zákazníkovi — BEZPEČNOSTNÍ POJISTKA:
// Vyžaduje confirm_send=true a admin schválení (OfferAgentRun.send_allowed=true nebo admin override).
// Nikdy se neodesílá automaticky.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });

    const body = await req.json().catch(() => ({}));
    const projectId = clean(body.project_id || body.project_order_id);
    const confirmSend = Boolean(body.confirm_send);
    const dryRun = Boolean(body.dry_run);

    if (!projectId) return Response.json({ error: 'missing_project_id' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });

    // SAFETY GATE — must explicitly confirm
    if (!confirmSend) {
      return Response.json({
        error: 'BEZPEČNOSTNÍ BRÁNA: Odeslání nabídky vyžaduje explicitní potvrzení (confirm_send: true). AI nikdy neodesílá nabídku automaticky.',
        safety_gate: true,
      }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
    }

    const loaded = await loadOfferEmailData(base44, projectId);
    if (!loaded) return Response.json({ error: 'not_found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

    const { data, project } = loaded;
    const email = buildClientOfferEmail(data);

    // Check OfferAgentRun safety gate
    let safetyGatePassed = true;
    let runId = '';
    try {
      const runs = await base44.asServiceRole.entities.OfferAgentRun.filter({ project_order_id: projectId });
      const latestRun = (runs || []).sort((a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime())[0];
      if (latestRun) {
        runId = latestRun.id;
        // If approval_required and send_allowed is false, block unless admin explicitly overrides
        if (latestRun.approval_required && !latestRun.send_allowed && !body.admin_override) {
          safetyGatePassed = false;
        }
      }
    } catch (_) {}

    if (!safetyGatePassed && !body.admin_override) {
      return Response.json({
        error: 'BEZPEČNOSTNÍ BRÁNA: OfferAgentRun.send_allowed je false. Nejdřív schvalte koncept (approveOfferConcept → schvaleno), nebo použijte admin_override=true pro ruční odeslání.',
        safety_gate: true,
        run_id: runId,
      }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
    }

    if (dryRun) {
      return Response.json({
        ok: true,
        dry_run: true,
        would_send: true,
        recipient: project.client_email,
        subject: email.subject,
        quote_number: project.quote_number,
        visualizations_count: data.visualizations.length,
        safety_gate_passed: safetyGatePassed,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // Send client offer email via Gmail from meduna@holmtec.cz
    const bccRecipients = Array.isArray(project.bcc_recipients) ? project.bcc_recipients : ['jakub1duch@gmail.com', 'duch@holmtec.cz'];
    const result = await sendViaGmail(base44, {
      to: project.client_email,
      fromEmail: project.sender_email || 'meduna@holmtec.cz',
      subject: email.subject,
      text: email.text,
      html: email.html,
      bcc: bccRecipients,
    });

    if (!result.ok) {
      return Response.json({
        ok: false,
        error: result.error || 'gmail_send_failed',
        recipient: project.client_email,
      }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
    }

    const now = new Date().toISOString();
    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Update ProjectOrder — status to 'sent', record approval
    await base44.asServiceRole.entities.ProjectOrder.update(projectId, {
      status: 'sent',
      issued_at: now,
      valid_until: project.valid_until || validUntil,
      approved_by: user.email,
      approved_at: now,
    });

    // Update OfferAgentRun — status to 'sent'
    if (runId) {
      try {
        await base44.asServiceRole.entities.OfferAgentRun.update(runId, {
          run_status: 'sent',
          send_allowed: true,
          approved_by: user.email,
          approved_at: now,
        });
      } catch (_) {}
    }

    // Trigger status change notification tracking (dedup, admin notification)
    try {
      await base44.functions.invoke('dispatchProjectOrderNotification', {
        project_id: projectId,
        status: 'sent',
        dry_run: true, // Just log it — the email was already sent directly above
      });
    } catch (_) {}

    // Admin Slack notification
    try {
      await base44.functions.invoke('notifyAdminChannel', {
        event_type: 'quote_sent',
        client_name: project.client_name,
        client_email: project.client_email,
        quote_number: project.quote_number || '',
        project_name: project.project_name || project.product_name || '',
        total_price: project.total_price,
        admin_url: 'https://mlzidla.cz/admin?tab=poptavky',
      });
    } catch (_) {}

    return Response.json({
      ok: true,
      sent: true,
      recipient: project.client_email,
      subject: email.subject,
      quote_number: project.quote_number,
      approved_by: user.email,
      approved_at: now,
      project_id: projectId,
      visualizations_count: data.visualizations_count,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error?.message || 'send_failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}