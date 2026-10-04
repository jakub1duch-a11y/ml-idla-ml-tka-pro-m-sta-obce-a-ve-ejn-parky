import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');
    const response = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200', {
      headers: { Authorization: 'Bearer ' + accessToken },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return Response.json({ error: data?.error?.message || `HTTP ${response.status}` }, { status: response.status });
    }

    const accounts = (data.accountSummaries || []).map((account: any) => ({
      account: account.account,
      displayName: account.displayName,
      properties: (account.propertySummaries || []).map((property: any) => ({
        property: property.property,
        displayName: property.displayName,
      })),
    }));

    return Response.json({ ok: true, accounts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
