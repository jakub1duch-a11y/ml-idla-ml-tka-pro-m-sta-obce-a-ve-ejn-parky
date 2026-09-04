import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';

const clean = (value: unknown) => String(value || '').trim();

// Status flow: nova_poptavka → koncept → k_overeni → schvaleno → odeslano
// Safety gate: AI never sends. "odeslano" requires explicit human action.
const VALID_TRANSITIONS: Record<string, string[]> = {
  nova_poptavka: ['koncept'],
  koncept: ['k_overeni'],
  k_overeni: ['schvaleno'],
  schvaleno: ['odeslano'],
  odeslano: [],
};

Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const inquiryId = body.inquiry_id;
    const inquiryType = body.inquiry_type === 'contact' ? 'contact' : 'poptavka';
    const targetStatus = body.target_status;
    const action = body.action || 'transition';

    if (!inquiryId || !targetStatus) return Response.json({ error: 'Missing inquiry_id or target_status' }, { status: 400 });

    // Only Poptavka supports offer_status flow (ContactInquiry uses its own status)
    if (inquiryType !== 'poptavka') {
      return Response.json({ error: 'offer_status flow is only supported for Poptavka' }, { status: 400 });
    }

    const poptavka = await base44.asServiceRole.entities.Poptavka.get(inquiryId);
    if (!poptavka) return Response.json({ error: 'Poptavka not found' }, { status: 404 });

    const currentStatus = poptavka.offer_status || 'nova_poptavka';

    // ── Action: get current status ──
    if (action === 'get_status') {
      return Response.json({
        ok: true,
        inquiry_id: inquiryId,
        current_status: currentStatus,
        available_transitions: VALID_TRANSITIONS[currentStatus] || [],
      });
    }

    // ── Action: transition status ──
    const allowed = (VALID_TRANSITIONS[currentStatus] || []);
    if (!allowed.includes(targetStatus)) {
      return Response.json({
        error: `Invalid transition: ${currentStatus} → ${targetStatus}. Allowed: ${allowed.join(', ') || 'none'}`,
      }, { status: 400 });
    }

    // ── Safety gate: odeslano requires explicit confirmation ──
    if (targetStatus === 'odeslano') {
      if (!body.confirm_send) {
        return Response.json({
          error: 'BEZPEČNOSTNÍ BRÁNA: Odeslání nabídky vyžaduje explicitní potvrzení (confirm_send: true). AI nikdy neodesílá nabídku automaticky.',
        }, { status: 403 });
      }
      // The actual email sending is handled by the existing sendOfferMessage function,
      // called separately by the salesperson. This function only updates the status.
    }

    // ── Update Poptavka ──
    const updated = await base44.asServiceRole.entities.Poptavka.update(inquiryId, {
      offer_status: targetStatus,
      status: targetStatus === 'odeslano' ? 'v_reseni' : (targetStatus === 'schvaleno' ? 'v_reseni' : 'v_reseni'),
    });

    // ── Update OfferAgentRun if exists ──
    try {
      const runs = await base44.asServiceRole.entities.OfferAgentRun.filter({ inquiry_id: inquiryId });
      const latestRun = (runs || []).sort((a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime())[0];
      if (latestRun) {
        const runStatusMap: Record<string, string> = {
          koncept: 'pending_approval',
          k_overeni: 'pending_approval',
          schvaleno: 'approved',
          odeslano: 'sent',
        };
        const updateData: any = { run_status: runStatusMap[targetStatus] };
        if (targetStatus === 'schvaleno') {
          updateData.approved_by = user.email;
          updateData.approved_at = new Date().toISOString();
          updateData.send_allowed = true; // Now allowed to send, but still requires explicit action
        }
        if (targetStatus === 'odeslano') {
          updateData.send_allowed = true;
        }
        await base44.asServiceRole.entities.OfferAgentRun.update(latestRun.id, updateData);
      }
    } catch (_) {}

    return Response.json({
      ok: true,
      inquiry_id: inquiryId,
      previous_status: currentStatus,
      new_status: targetStatus,
      updated,
      safety_note: targetStatus === 'odeslano'
        ? 'Nabídka byla označena jako ODESLÁNO. E-mail byl odeslán obchodníkem ručně.'
        : targetStatus === 'schvaleno'
          ? 'Koncept schválen obchodníkem. AI nyní může asistovat s odesláním, ale neodesílá automaticky.'
          : 'Stav aktualizován.',
    });
  } catch (error) {
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
});