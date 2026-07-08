import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SITE_URL = 'sc-domain:mlzidla.cz';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const days = body.days || 28;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const fmt = (d) => d.toISOString().split('T')[0];

    const res = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: fmt(startDate),
          endDate: fmt(endDate),
          dimensions: ['query'],
          rowLimit: 50,
          dataState: 'all',
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) return Response.json({ error: data }, { status: res.status });

    const rows = (data.rows || []).map((r) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Math.round(r.ctr * 1000) / 10,
      position: Math.round(r.position * 10) / 10,
    }));

    return Response.json({ rows, siteUrl: SITE_URL, startDate: fmt(startDate), endDate: fmt(endDate) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});