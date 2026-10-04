export const MONDAY_API = 'https://api.monday.com/v2';

export const PIPELINE_STAGES = [
  { key: 'nove', title: 'Nové poptávky' },
  { key: 'rozpracovane', title: 'Rozpracované nabídky' },
  { key: 'potvrzene', title: 'Potvrzené nabídky' },
  { key: 'objednavky', title: 'Objednávky / termín' },
  { key: 'vyroba', title: 'Výroba (po záloze)' },
  { key: 'hotovo', title: 'Hotovo' },
];

export function mapProjectOrderStatusToStage(status: string): string {
  switch (status) {
    case 'approved':
      return 'potvrzene';
    case 'deposit_invoice_issued':
    case 'awaiting_deposit':
      return 'objednavky';
    case 'deposit_paid':
    case 'released_to_production':
    case 'in_production':
      return 'vyroba';
    case 'ready':
    case 'delivered':
    case 'final_invoice_issued':
    case 'closed':
      return 'hotovo';
    default:
      return 'rozpracovane';
  }
}

async function mondayGql(token: string, query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(MONDAY_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

function mondayErrorMessage(res: { ok: boolean; status: number; data: any }): string {
  const errs = res?.data?.errors || res?.data?.data?.errors;
  if (Array.isArray(errs) && errs.length) return errs.map((e: any) => e?.message || JSON.stringify(e)).join('; ');
  if (!res.ok && res.data?.error_code) return `${res.data.error_code}: ${res.data.error_message || ''}`;
  if (!res.ok) return `HTTP ${res.status}`;
  return '';
}

export async function ensurePipelineGroups(token: string, boardId: number): Promise<Record<string, string>> {
  const boardRes = await mondayGql(token, `query($b: [ID!]) { boards(ids: $b) { groups { id title } } }`, { b: [String(boardId)] });
  const boardErr = mondayErrorMessage(boardRes);
  if (boardErr) throw new Error(`Monday boards query failed: ${boardErr}`);
  const existing = boardRes?.data?.data?.boards?.[0]?.groups || boardRes?.data?.boards?.[0]?.groups || [];
  const byTitle = new Map<string, string>(existing.map((g: any) => [String(g.title).toLowerCase(), String(g.id)]));
  const groups: Record<string, string> = {};
  for (const stage of PIPELINE_STAGES) {
    const found = byTitle.get(stage.title.toLowerCase());
    if (found) { groups[stage.key] = found; continue; }
    const createRes = await mondayGql(
      token,
      `mutation($b: ID!, $n: String!) { create_group(board_id: $b, group_name: $n) { id } }`,
      { b: String(boardId), n: stage.title },
    );
    const createErr = mondayErrorMessage(createRes);
    if (createErr) throw new Error(`Monday create_group "${stage.title}" failed: ${createErr}`);
    const id = createRes?.data?.data?.create_group?.id || createRes?.data?.create_group?.id;
    if (id) groups[stage.key] = String(id);
  }
  return groups;
}

export async function createItemInGroup(token: string, boardId: number, groupId: string, name: string): Promise<string | null> {
  const res = await mondayGql(
    token,
    `mutation($b: ID!, $g: String!, $n: String!) { create_item(board_id: $b, group_id: $g, item_name: $n) { id } }`,
    { b: String(boardId), g: groupId, n: name },
  );
  return res?.data?.data?.create_item?.id || res?.data?.create_item?.id || null;
}

export async function moveItemToGroup(token: string, itemId: number, groupId: string): Promise<boolean> {
  const res = await mondayGql(
    token,
    `mutation($i: Int!, $g: String!) { move_item_to_group(item_id: $i, group_id: $g) { id } }`,
    { i: itemId, g: groupId },
  );
  return Boolean(res?.data?.data?.move_item_to_group?.id || res?.data?.move_item_to_group?.id);
}

export async function postUpdate(token: string, itemId: number, body: string): Promise<boolean> {
  const res = await mondayGql(
    token,
    `mutation($i: Int!, $b: String!) { create_update(item_id: $i, body: $b) { id } }`,
    { i: itemId, b: body },
  );
  return Boolean(res?.data?.data?.create_update?.id || res?.data?.create_update?.id);
}