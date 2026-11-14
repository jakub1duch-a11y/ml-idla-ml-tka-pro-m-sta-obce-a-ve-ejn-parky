import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { BUSINESS_EMAIL, CURRENT_PUBLIC_CATALOG, PRODUCT_CATALOG_FOLDER_ID, getBusinessConnectorStatus } from '../../shared/businessWorkflowGuard.mjs';

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

    const businessTypes = ['googledrive', 'googlesheets', 'gmail'];
    const connectors = await Promise.all(CONNECTORS.map(async (connector) => {
      if (businessTypes.includes(connector.type)) {
        const result = await getBusinessConnectorStatus(base44, connector.type);
        return { ...connector, connected: Boolean(result.account || result.ready), ...result };
      }
      try {
        await base44.asServiceRole.connectors.getConnection(connector.type);
        return { ...connector, connected: true, ready: true };
      } catch {
        return { ...connector, connected: false, ready: false };
      }
    }));
    const businessConnections = connectors.filter((item) => businessTypes.includes(item.type));
    const readyForBusinessWorkflow = businessConnections.every((item) => item.ready === true);

    return Response.json({
      ok: true,
      checked_at: new Date().toISOString(),
      connectors,
      business_account: BUSINESS_EMAIL,
      ready_for_business_workflow: readyForBusinessWorkflow,
      missing_requirements: businessConnections.filter((item) => !item.ready).map((item) => item.error || `${item.label} není autorizován.`),
      public_catalog: { id: CURRENT_PUBLIC_CATALOG.id, sheet: CURRENT_PUBLIC_CATALOG.sheet, public_price_column: CURRENT_PUBLIC_CATALOG.public_price_column, drive_folder_id: PRODUCT_CATALOG_FOLDER_ID },
      external_integrations: { canva: 'Připojeno v ChatGPT, není ověřená automatizace v Base44', chatgpt_sites: 'Není potvrzeno API pro přímý zápis' },
      policy: {
        publish_requires_confirmation: true,
        email_mode: 'draft_only',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message || 'Connector health check failed' }, { status: 500 });
  }
}
