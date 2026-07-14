import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const SITE_URL = 'https://mlzidla.cz/';
const SITEMAP_URL = 'https://mlzidla.cz/functions/sitemap';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');

    const submitUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`;
    const response = await fetch(submitUrl, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ error: `Search Console error: ${errorText}` }, { status: response.status });
    }

    return Response.json({ success: true, message: 'Sitemapa byla odeslána do Google Search Console.', sitemapUrl: SITEMAP_URL });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});