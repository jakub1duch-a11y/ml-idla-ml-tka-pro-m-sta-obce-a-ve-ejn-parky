import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const clean = (v: unknown, max = 2000) => String(v || '').trim().slice(0, max);

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });

    const body = await req.json().catch(() => ({}));
    const url = new URL(req.url);
    const status = clean(body.status || url.searchParams.get('status') || '');
    const eventType = clean(body.event_type || url.searchParams.get('event_type') || '');
    const limit = Math.min(Number(body.limit || url.searchParams.get('limit') || 50), 200);

    const query: any = {};
    if (status) query.status = status;
    if (eventType) query.event_type = eventType;

    const page = await base44.asServiceRole.entities.NotificationLog.filter(
      query,
      { sort: '-created_date', limit, fields: ['id', 'dedup_key', 'event_type', 'channel_type', 'recipient', 'entity_id', 'entity_type', 'status', 'subject', 'content_summary', 'error_message', 'attempts', 'sent_at', 'created_date', 'metadata'] }
    );

    // Statistiky
    const stats = {
      total: page.items?.length || 0,
      sent: 0,
      failed: 0,
      pending: 0,
      deduplicated: 0,
    };
    (page.items || []).forEach((item: any) => {
      if (item.status === 'sent') stats.sent++;
      else if (item.status === 'failed') stats.failed++;
      else if (item.status === 'pending') stats.pending++;
      else if (item.status === 'deduplicated') stats.deduplicated++;
    });

    return Response.json({
      ok: true,
      items: page.items || [],
      stats,
      has_more: page.has_more || false,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error?.message || 'query_failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}