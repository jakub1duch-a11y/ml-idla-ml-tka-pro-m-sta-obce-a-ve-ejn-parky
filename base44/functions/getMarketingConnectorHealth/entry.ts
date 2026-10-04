import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const CONNECTORS = [
  { type: 'instagram', label: 'Instagram', role: 'Publikace po potvrzení' },
  { type: 'googledrive', label: 'Google Drive', role: 'Archivace vizuálů' },
  { type: 'gmail', label: 'Gmail', role: 'Pouze koncepty zpráv' },
  { type: 'googlesheets', label: 'Google Sheets', role: 'Evidence a datové podklady' },
  { type: 'googledocs', label: 'Google Docs', role: 'Textové podklady' },
  { type: 'googleslides', label: 'Google Slides', role: 'Prezentace kampaní' },
  { type: 'googletasks', label: 'Google Tasks', role: 'Navazující úkoly' },
  { type: 'google_analytics', label: 'Google Analytics', role: 'Výkon webu' },
  { type: 'google_search_console', label: 'Search Console', role: 'SEO signály' },
  { type: 'linkedin', label: 'LinkedIn', role: 'Firemní obsah po schválení' },
  { type: 'slackbot', label: 'Slack Bot', role: 'Interní upozornění' },
];

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const connectors = await Promise.all(CONNECTORS.map(async (connector) => {
      try {
        await base44.asServiceRole.connectors.getConnection(connector.type);
        return { ...connector, connected: true };
      } catch {
        return { ...connector, connected: false };
      }
    }));

    return Response.json({
      ok: true,
      checked_at: new Date().toISOString(),
      connectors,
      policy: {
        publish_requires_confirmation: true,
        email_mode: 'draft_only',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message || 'Connector health check failed' }, { status: 500 });
  }
}
