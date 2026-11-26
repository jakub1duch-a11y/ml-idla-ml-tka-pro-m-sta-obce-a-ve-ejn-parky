import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const headers = { 'Cache-Control': 'no-store' };
const reply = (body: object, status = 200) => Response.json(body, { status, headers });
const encoder = new TextEncoder();

export default async function(req: Request): Promise<Response> {
  if (req.method !== 'POST') return reply({ ok: false, error: 'method_not_allowed' }, 405);
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return reply({ ok: false, error: 'forbidden' }, 403);

    const url = Deno.env.get('GOOGLE_SHEETS_WEBHOOK_URL') || '';
    const secret = Deno.env.get('GOOGLE_SHEETS_WEBHOOK_SECRET') || '';
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url) || secret.length < 32)
      return reply({ ok: false, error: 'webhook_not_configured' }, 503);

    // R01 intentionally sends a synthetic probe only. No CRM records, prices, emails or BT.
    const id = crypto.randomUUID();
    const envelope = JSON.stringify({ source: 'Base44_Function', messageId: id,
      timestamp: Date.now(), entity: 'HealthCheck', mode: 'dry_run' });
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(envelope)));
    const signature = Array.from(sig, x => x.toString(16).padStart(2, '0')).join('');
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ envelope, signature }), signal: AbortSignal.timeout(20000) });
    if (!res.ok) return reply({ ok: false, error: 'google_http_' + res.status }, 502);
    const result = await res.json().catch(() => null);
    if (result?.ok !== true || result?.messageId !== id || result?.mode !== 'dry_run')
      return reply({ ok: false, error: 'google_ack_invalid' }, 502);
    return reply({ ok: true, messageId: id, mode: 'dry_run', recordsWritten: 0 });
  } catch {
    return reply({ ok: false, error: 'webhook_test_failed' }, 502);
  }
}
