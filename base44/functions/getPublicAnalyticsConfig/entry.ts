import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const GA4_PROPERTY_ID = 'properties/496002660';
const GOOGLE_ADS_ID = 'AW-18276263329';
const SITE_HOST = 'mlzidla.cz';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');

    const response = await fetch(
      `https://analyticsadmin.googleapis.com/v1beta/${GA4_PROPERTY_ID}/dataStreams?pageSize=100`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data?.error?.message || 'Unable to read GA4 data streams.' }, { status: response.status });
    }

    const streams = Array.isArray(data.dataStreams) ? data.dataStreams : [];
    const webStreams = streams.filter((stream) => stream.type === 'WEB_DATA_STREAM' && stream.webStreamData);
    const selected = webStreams.find((stream) =>
      String(stream.webStreamData?.defaultUri || '').toLowerCase().includes(SITE_HOST)
    ) || webStreams[0];

    const measurementId = selected?.webStreamData?.measurementId || '';
    if (!measurementId) {
      return Response.json({ error: 'GA4 web data stream or Measurement ID was not found for the connected property.' }, { status: 404 });
    }

    return Response.json({
      measurementId,
      propertyId: GA4_PROPERTY_ID,
      defaultUri: selected.webStreamData?.defaultUri || '',
      streamName: selected.displayName || '',
      googleAdsId: GOOGLE_ADS_ID,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});