import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const GOOGLE_ADS_ID = 'AW-18276263329';
const META_PIXEL_ID = Deno.env.get('META_PIXEL_ID') || '';
const SITE_HOST = 'mlzidla.cz';

async function resolveGa4WebStream(accessToken: string) {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const summariesResponse = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200', { headers });
  const summaries = await summariesResponse.json().catch(() => ({}));
  if (!summariesResponse.ok) throw new Error(summaries?.error?.message || 'Unable to list GA4 properties.');

  const properties = (summaries.accountSummaries || []).flatMap((account: any) => account.propertySummaries || []);
  for (const property of properties) {
    const streamsResponse = await fetch(`https://analyticsadmin.googleapis.com/v1beta/${property.property}/dataStreams?pageSize=100`, { headers });
    if (!streamsResponse.ok) continue;
    const streams = await streamsResponse.json().catch(() => ({}));
    const selected = (streams.dataStreams || []).find((stream: any) =>
      stream.type === 'WEB_DATA_STREAM' &&
      String(stream.webStreamData?.defaultUri || '').toLowerCase().includes(SITE_HOST)
    );
    if (selected) return { propertyId: property.property, propertyName: property.displayName || '', stream: selected };
  }

  throw new Error(`GA4 property with a WEB stream for ${SITE_HOST} was not found for the connected Google account.`);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');
    const { propertyId, propertyName, stream: selected } = await resolveGa4WebStream(accessToken);

    const measurementId = selected?.webStreamData?.measurementId || '';
    if (!measurementId) {
      return Response.json({ error: 'GA4 web data stream or Measurement ID was not found for the connected property.' }, { status: 404 });
    }

    return Response.json({
      measurementId,
      propertyId,
      propertyName,
      defaultUri: selected.webStreamData?.defaultUri || '',
      streamName: selected.displayName || '',
      googleAdsId: GOOGLE_ADS_ID,
      // Meta Pixel ID is a public browser identifier, never an access token or secret.
      metaPixelId: META_PIXEL_ID,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});