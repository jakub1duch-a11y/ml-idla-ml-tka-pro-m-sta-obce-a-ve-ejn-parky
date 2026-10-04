import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { callSupla, suplaConfigStatus, type SuplaAction } from '../../shared/suplaApi.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const input = await req.json().catch(() => ({}));
    const action = (input.action || 'list_channels') as SuplaAction;
    if (action === 'status') return Response.json({ ok: true, ...suplaConfigStatus() });
    const data = await callSupla(action, input);
    return Response.json({ ok: true, action, data });
  } catch (error) {
    return Response.json({ ok: false, error: error?.message || String(error) }, { status: 502 });
  }
}