import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import {
  ensurePipelineGroups,
  createItemInGroup,
  moveItemToGroup,
  postUpdate,
  mapProjectOrderStatusToStage,
} from '../../shared/mondayPipeline.ts';

function buildPayload(entityName: string, record: any) {
  const isContact = entityName === 'ContactInquiry' || (!('jmeno' in record) && 'name' in record);
  return {
    source: 'mlzidla.cz',
    entity_type: entityName,
    inquiry_id: record.id,
    created_date: record.created_date,
    name: isContact ? record.name : record.jmeno,
    email: record.email,
    phone: isContact ? record.phone : record.telefon,
    company: isContact ? record.company : record.firma,
    product: isContact ? record.product_interest : record.produkt,
    message: isContact ? record.message : record.zprava,
    status: record.status || (isContact ? 'new' : 'nova'),
  };
}

async function postJson(url: string, body: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  const text = await res.text();
  return { ok: res.ok, status: res.status, response: text.slice(0, 400) };
}

async function pushMake(payload: any) {
  const url = process.env.MAKE_WEBHOOK_URL;
  if (!url) return { target: 'make', skipped: true, reason: 'MAKE_WEBHOOK_URL not set' };
  return { target: 'make', ...(await postJson(url, payload)) };
}

async function pushSidekick(payload: any) {
  const url = process.env.SIDEKICK_WEBHOOK_URL;
  if (!url) return { target: 'sidekick', skipped: true, reason: 'SIDEKICK_WEBHOOK_URL not set' };
  return { target: 'sidekick', ...(await postJson(url, payload)) };
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const action = body.action || 'create';
    const entityName = body.entity_name || body?.event?.entity_name || '';
    const entityId = body.entity_id || body?.event?.entity_id || body?.data?.id || '';

    const token = process.env.MONDAY_API_TOKEN;
    const boardId = Number(process.env.MONDAY_BOARD_ID);

    // Přesun položky v Monday podle stavu ProjectOrder
    if (action === 'move') {
      if (!entityName || !entityId || !base44.asServiceRole.entities[entityName]) {
        return Response.json({ error: 'entity_name and entity_id required' }, { status: 400 });
      }
      if (!token || !boardId) return Response.json({ ok: true, monday: { skipped: true, reason: 'Monday not configured' } });

      const order = await base44.asServiceRole.entities[entityName].get(entityId);
      const inquiryType = order.inquiry_type === 'contact' ? 'ContactInquiry' : 'Poptavka';
      const inquiryId = order.inquiry_id;
      if (!inquiryId || !base44.asServiceRole.entities[inquiryType]) {
        return Response.json({ ok: true, monday: { skipped: true, reason: 'no inquiry linked' } });
      }
      const inquiry = await base44.asServiceRole.entities[inquiryType].get(inquiryId).catch(() => null);
      const mondayItemId = inquiry?.monday_item_id;
      if (!mondayItemId) return Response.json({ ok: true, monday: { skipped: true, reason: 'inquiry has no monday_item_id' } });

      const groups = await ensurePipelineGroups(token, boardId);
      const stageKey = mapProjectOrderStatusToStage(order.status);
      const groupId = groups[stageKey];
      if (!groupId) return Response.json({ ok: true, monday: { skipped: true, reason: `stage ${stageKey} group missing` } });

      const moved = await moveItemToGroup(token, Number(mondayItemId), groupId);
      return Response.json({ ok: true, action: 'move', stage: stageKey, moved, item_id: mondayItemId });
    }

    // Vytvoření položky v Monday (nová poptávka) + Make + Sidekick
    if (!entityName || !entityId || !base44.asServiceRole.entities[entityName]) {
      return Response.json({ error: 'entity_name and entity_id required' }, { status: 400 });
    }
    const record = await base44.asServiceRole.entities[entityName].get(entityId);
    const payload = buildPayload(entityName, record);

    let mondayResult: any = { target: 'monday', skipped: true, reason: 'Monday not configured' };
    if (token && boardId) {
      const groups = await ensurePipelineGroups(token, boardId);
      const groupId = groups.nove;
      const itemName = [payload.company, payload.name, payload.product].filter(Boolean).join(' · ') || `Nová poptávka ${payload.inquiry_id || ''}`;
      const itemId = groupId ? await createItemInGroup(token, boardId, groupId, itemName) : null;
      if (itemId) {
        const detailBody = [
          `Zdroj: ${payload.source}`,
          `Typ: ${payload.entity_type}`,
          `ID: ${payload.inquiry_id || ''}`,
          `Vytvořeno: ${payload.created_date || ''}`,
          `Jméno: ${payload.name || ''}`,
          `E-mail: ${payload.email || ''}`,
          `Telefon: ${payload.phone || ''}`,
          `Firma: ${payload.company || ''}`,
          `Produkt: ${payload.product || ''}`,
          `Stav: ${payload.status || ''}`,
          `Zpráva:`,
          payload.message || '',
        ].join('\n');
        await postUpdate(token, Number(itemId), detailBody).catch(() => {});
        try { await base44.asServiceRole.entities[entityName].update(entityId, { monday_item_id: String(itemId) }); } catch (_) {}
        mondayResult = { target: 'monday', ok: true, item_id: String(itemId), stage: 'nove' };
      } else {
        mondayResult = { target: 'monday', ok: false, reason: 'create_item failed' };
      }
    }

    const [make, sidekick] = await Promise.allSettled([pushMake(payload), pushSidekick(payload)]);
    return Response.json({
      ok: true,
      inquiry_id: payload.inquiry_id,
      results: {
        monday: mondayResult,
        make: make.status === 'fulfilled' ? make.value : { target: 'make', ok: false, reason: make.reason?.message },
        sidekick: sidekick.status === 'fulfilled' ? sidekick.value : { target: 'sidekick', ok: false, reason: sidekick.reason?.message },
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}