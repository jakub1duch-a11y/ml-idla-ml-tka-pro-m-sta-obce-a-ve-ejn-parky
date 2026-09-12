import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const SITE_HOST = 'mlzidla.cz';

async function resolveGa4Property(accessToken: string) {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const summariesResponse = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200', { headers });
  const summaries = await summariesResponse.json().catch(() => ({}));
  if (!summariesResponse.ok) throw new Error(summaries?.error?.message || 'Unable to list GA4 properties.');

  const properties = (summaries.accountSummaries || []).flatMap((account: any) => account.propertySummaries || []);
  for (const property of properties) {
    const streamsResponse = await fetch(`https://analyticsadmin.googleapis.com/v1beta/${property.property}/dataStreams?pageSize=100`, { headers });
    if (!streamsResponse.ok) continue;
    const streams = await streamsResponse.json().catch(() => ({}));
    const matchesSite = (streams.dataStreams || []).some((stream: any) =>
      stream.type === 'WEB_DATA_STREAM' &&
      String(stream.webStreamData?.defaultUri || '').toLowerCase().includes(SITE_HOST)
    );
    if (matchesSite) return property.property;
  }

  throw new Error(`GA4 property with a WEB stream for ${SITE_HOST} was not found for the connected Google account.`);
}
const PRIMARY_KEY_EVENT = 'generate_lead';

async function readJson(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error: any = new Error(data?.error?.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.payload = data;
    throw error;
  }
  return data;
}

async function getAdmin(accessToken: string, path: string) {
  return readJson(await fetch(`https://analyticsadmin.googleapis.com/v1beta/${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }));
}

async function postAdmin(accessToken: string, path: string, body: Record<string, unknown>) {
  return readJson(await fetch(`https://analyticsadmin.googleapis.com/v1beta/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
}

export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const ensure = Boolean(body.ensure);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');

    const [keyEventData, adsLinkData] = await Promise.all([
      getAdmin(accessToken, `${GA4_PROPERTY_ID}/keyEvents?pageSize=100`),
      getAdmin(accessToken, `${GA4_PROPERTY_ID}/googleAdsLinks?pageSize=100`),
    ]);

    let keyEvents = Array.isArray(keyEventData.keyEvents) ? keyEventData.keyEvents : [];
    const googleAdsLinks = Array.isArray(adsLinkData.googleAdsLinks) ? adsLinkData.googleAdsLinks : [];
    let generateLead = keyEvents.find((item: any) => item.eventName === PRIMARY_KEY_EVENT) || null;
    let created = false;
    let needsEditScope = false;
    let setupError = '';

    if (ensure && !generateLead) {
      try {
        generateLead = await postAdmin(accessToken, `${GA4_PROPERTY_ID}/keyEvents`, {
          eventName: PRIMARY_KEY_EVENT,
          countingMethod: 'ONCE_PER_EVENT',
        });
        created = true;
        keyEvents = [...keyEvents, generateLead];
      } catch (error: any) {
        setupError = error.message || 'Key event creation failed.';
        needsEditScope = error.status === 401 || error.status === 403 || /scope|permission|insufficient/i.test(setupError);
      }
    }

    return Response.json({
      ok: true,
      propertyId: GA4_PROPERTY_ID,
      primaryEvent: PRIMARY_KEY_EVENT,
      keyEventReady: Boolean(generateLead),
      keyEventCreated: created,
      keyEvent: generateLead,
      keyEvents: keyEvents.map((item: any) => ({
        name: item.name,
        eventName: item.eventName,
        countingMethod: item.countingMethod,
        custom: item.custom,
      })),
      googleAdsLinked: googleAdsLinks.length > 0,
      googleAdsLinks: googleAdsLinks.map((item: any) => ({
        name: item.name,
        customerId: item.customerId,
        adsPersonalizationEnabled: item.adsPersonalizationEnabled,
      })),
      needsEditScope,
      setupError,
      recommendation: googleAdsLinks.length
        ? 'GA4 je propojeno s Google Ads. Web posílá přímou Google Ads lead konverzi s vlastním conversion label a transaction_id; tuto přímou konverzi ponechte jako primární. generate_lead v GA4 používejte jako Key event pro analytiku a případný import do Ads nastavte pouze jako sekundární, aby se jeden lead nezapočítal dvakrát.'
        : 'GA4 zatím nemá zjištěný Google Ads link. Propojte Google Ads účet s touto GA4 property, zapněte auto-tagging a po propojení ponechte pouze jeden primární zdroj lead konverze.',
    });
  } catch (error: any) {
    return Response.json({ error: error.message || 'GA4 Ads configuration failed.' }, { status: 500 });
  }
}
