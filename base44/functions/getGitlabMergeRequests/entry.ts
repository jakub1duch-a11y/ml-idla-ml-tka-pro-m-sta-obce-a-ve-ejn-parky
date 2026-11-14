import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const ALLOWED_SCOPES = new Set(['created_by_me', 'assigned_to_me', 'reviews_for_me']);
const responseHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

function asText(value: unknown, max = 300): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function safeGitlabUrl(value: unknown): string {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:' && url.hostname === 'gitlab.com' ? url.toString() : '';
  } catch {
    return '';
  }
}

export default async function(req: Request): Promise<Response> {
  const base44 = createClientFromRequest(req);
  const caller = await base44.auth.me().catch(() => null);

  if (!caller) return Response.json({ error: 'unauthorized' }, { status: 401, headers: responseHeaders });
  if (caller.role !== 'admin') return Response.json({ error: 'forbidden' }, { status: 403, headers: responseHeaders });
  if (req.method !== 'POST') return Response.json({ error: 'method_not_allowed' }, { status: 405, headers: responseHeaders });

  const body = await req.json().catch(() => ({}));
  const scope = asText(body?.scope, 30) || 'created_by_me';
  if (!ALLOWED_SCOPES.has(scope)) {
    return Response.json({ error: 'invalid_scope' }, { status: 400, headers: responseHeaders });
  }

  let accessToken: string;
  try {
    const connection = await base44.asServiceRole.connectors.getConnection('gitlab');
    accessToken = connection.accessToken;
    if (!accessToken) throw new Error('not_connected');
  } catch {
    // Do not disclose connector tokens or error details to the client.
    return Response.json({ error: 'gitlab_not_connected', items: [] }, { status: 503, headers: responseHeaders });
  }

  const url = new URL('https://gitlab.com/api/v4/merge_requests');
  url.search = new URLSearchParams({
    state: 'opened',
    scope,
    per_page: '50',
    order_by: 'updated_at',
    sort: 'desc',
  }).toString();

  try {
    const upstream = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(12000),
    });
    if (!upstream.ok) {
      const code = upstream.status === 429 ? 'gitlab_rate_limited'
        : upstream.status === 401 || upstream.status === 403 ? 'gitlab_auth_required'
        : 'gitlab_api_failed';
      return Response.json({ error: code, items: [] }, { status: upstream.status === 429 ? 429 : 502, headers: responseHeaders });
    }

    const result = await upstream.json();
    if (!Array.isArray(result)) return Response.json({ error: 'invalid_gitlab_response' }, { status: 502, headers: responseHeaders });
    const items = result.slice(0, 50).map((mr: any) => ({
      id: Number(mr.id) || 0,
      iid: Number(mr.iid) || 0,
      title: asText(mr.title, 240),
      web_url: safeGitlabUrl(mr.web_url),
      project_id: Number(mr.project_id) || 0,
      project: asText(mr.references?.full?.split('!')[0] || mr.web_url?.split('/-/merge_requests/')[0]?.replace('https://gitlab.com/', ''), 180),
      source_branch: asText(mr.source_branch, 100),
      target_branch: asText(mr.target_branch, 100),
      author: asText(mr.author?.name || mr.author?.username, 120),
      updated_at: asText(mr.updated_at, 40),
      created_at: asText(mr.created_at, 40),
      draft: Boolean(mr.draft || mr.work_in_progress),
      merge_status: asText(mr.detailed_merge_status || mr.merge_status, 80),
      labels: Array.isArray(mr.labels) ? mr.labels.filter((x: unknown) => typeof x === 'string').slice(0, 5).map((x: string) => asText(x, 40)) : [],
    }));

    return Response.json({
      ok: true,
      scope,
      items,
      has_more: Boolean(upstream.headers.get('x-next-page')),
      fetched_at: new Date().toISOString(),
    }, { headers: responseHeaders });
  } catch {
    return Response.json({ error: 'gitlab_unavailable', items: [] }, { status: 502, headers: responseHeaders });
  }
}
