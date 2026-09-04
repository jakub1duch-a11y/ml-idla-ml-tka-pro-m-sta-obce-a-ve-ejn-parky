import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const MONDAY_API = 'https://api.monday.com/v2';

function buildPayload(entityName, record) {
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

async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, response: text.slice(0, 400) };
}

async function pushMake(payload) {
  const url = process.env.MAKE_WEBHOOK_URL;
  if (!url) return { target: 'make', skipped: true, reason: 'MAKE_WEBHOOK_URL not set' };
  return { target: 'make', ...(await postJson(url, payload)) };
}

async function pushSidekick(payload) {
  const url = process.env.SIDEKICK_WEBHOOK_URL;
  if (!url) return { target: 'sidekick', skipped: true, reason: 'SIDEKICK_WEBHOOK_URL not set' };
  return { target: 'sidekick', ...(await postJson(url, payload)) };
}

async function mondayGql(token, query, variables) {
  const res = await fetch(MONDAY_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

async function pushMonday(payload) {
  const token = process.env.MONDAY_API_TOKEN;
  const boardId = process.env.MONDAY_BOARD_ID;
  if (!token || !boardId) return { target: 'monday', skipped: true, reason: 'MONDAY_API_TOKEN / MONDAY_BOARD_ID not set' };

  const itemName = [payload.company, payload.name, payload.product].filter(Boolean).join(' · ') || `Nová poptávka ${payload.inquiry_id || ''}`;
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

  const createRes = await mondayGql(
    token,
    `mutation($b: Int!, $n: String!) { create_item(board_id: $b, item_name: $n) { id } }`,
    { b: Number(boardId), n: itemName }
  );
  const itemId = createRes?.data?.data?.create_item?.id || createRes?.data?.create_item?.id;
  if (!itemId) return { target: 'monday', ok: false, reason: 'create_item failed', response: createRes };

  const updateRes = await mondayGql(
    token,
    `mutation($i: Int!, $b: String!) { create_update(item_id: $i, body: $b) { id } }`,
    { i: Number(itemId), b: detailBody }
  );

  return { target: 'monday', ok: true, item_id: String(itemId), update_ok: Boolean(updateRes?.data?.data?.create_update?.id || updateRes?.data?.create_update?.id) };
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const entityName = body.entity_name || body?.event?.entity_name || '';
    const entityId = body.entity_id || body?.event?.entity_id || body?.data?.id || '';
    if (!entityName || !entityId || !base44.asServiceRole.entities[entityName]) {
      return Response.json({ error: 'entity_name and entity_id required' }, { status: 400 });
    }

    const record = await base44.asServiceRole.entities[entityName].get(entityId);
    const payload = buildPayload(entityName, record);

    const [make, monday, sidekick] = await Promise.allSettled([
      pushMake(payload),
      pushMonday(payload),
      pushSidekick(payload),
    ]);

    return Response.json({
      ok: true,
      inquiry_id: payload.inquiry_id,
      results: {
        make: make.status === 'fulfilled' ? make.value : { target: 'make', ok: false, reason: make.reason?.message },
        monday: monday.status === 'fulfilled' ? monday.value : { target: 'monday', ok: false, reason: monday.reason?.message },
        sidekick: sidekick.status === 'fulfilled' ? sidekick.value : { target: 'sidekick', ok: false, reason: sidekick.reason?.message },
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}