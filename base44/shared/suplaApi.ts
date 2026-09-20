const DEFAULT_BASE = 'https://cloud.supla.org/api';

export type SuplaAction = 'list_channels' | 'get_channel' | 'toggle_channel' | 'set_channel';

function getConfig() {
  const baseUrl = (Deno.env.get('SUPLA_API_BASE_URL') || DEFAULT_BASE).replace(/\/$/, '');
  const token = Deno.env.get('SUPLA_API_TOKEN');
  return { baseUrl, token };
}

export async function callSupla(action: SuplaAction, payload: Record<string, unknown> = {}) {
  const { baseUrl, token } = getConfig();
  if (!token) throw new Error('SUPLA_API_TOKEN není nastaven. Přidejte jej do tajných proměnných Base44.');
  const channelId = payload.channelId;
  const path = action === 'list_channels' ? '/channels'
    : `/channels/${encodeURIComponent(String(channelId))}`;
  if (action !== 'list_channels' && !channelId) throw new Error('Pro tuto operaci je vyžadován channelId.');
  const method = action === 'list_channels' || action === 'get_channel' ? 'GET' : 'PATCH';
  const body = action === 'toggle_channel' ? { on: Boolean(payload.on) }
    : action === 'set_channel' ? (payload.value ?? payload.body ?? {}) : undefined;
  const response = await fetch(baseUrl + path, {
    method,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const raw = await response.text();
  let data: unknown = raw;
  try { data = raw ? JSON.parse(raw) : null; } catch { /* non-JSON response */ }
  if (!response.ok) throw new Error(`SUPLA API ${response.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
  return data;
}

export function suplaConfigStatus() {
  const { baseUrl, token } = getConfig();
  return { configured: Boolean(token), baseUrl, auth: token ? 'bearer_token' : 'missing' };
}