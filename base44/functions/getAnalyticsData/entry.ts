import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const GA4_PROPERTY_ID = 'properties/496002660';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const days = body.days || 28;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');

    const endDate = 'today';
    const startDate = `${days}daysAgo`;

    // Daily sessions + users
    const dailyRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'date' }],
          metrics: [
            { name: 'sessions' },
            { name: 'activeUsers' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
          ],
          orderBys: [{ dimension: { dimensionName: 'date' } }],
        }),
      }
    );
    const dailyData = await dailyRes.json();

    // Top pages
    const pagesRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10,
        }),
      }
    );
    const pagesData = await pagesRes.json();

    // Traffic sources
    const sourcesRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 8,
        }),
      }
    );
    const sourcesData = await sourcesRes.json();

    // New users (first-time visitors)
    const newUsersRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'newUsers' }],
        }),
      }
    );
    const newUsersData = await newUsersRes.json();

    // Product clicks (pageviews na /produkt/:slug)
    const productClicksRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }],
          dimensionFilter: {
            filter: {
              fieldName: 'pagePath',
              stringFilter: { matchType: 'BEGINS_WITH', value: '/produkt/' }
            }
          },
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10,
        }),
      }
    );
    const productClicksData = await productClicksRes.json();

    const parseRows = (data, dimCount, metricCount) => {
      if (!data.rows) return [];
      return data.rows.map(row => ({
        dims: row.dimensionValues.slice(0, dimCount).map(d => d.value),
        metrics: row.metricValues.slice(0, metricCount).map(m => parseFloat(m.value) || 0),
      }));
    };

    const daily = parseRows(dailyData, 1, 4).map(r => ({
      date: r.dims[0],
      sessions: r.metrics[0],
      users: r.metrics[1],
      pageviews: r.metrics[2],
      bounceRate: Math.round(r.metrics[3] * 100),
    }));

    const pages = parseRows(pagesData, 1, 2).map(r => ({
      path: r.dims[0],
      views: r.metrics[0],
      users: r.metrics[1],
    }));

    const sources = parseRows(sourcesData, 1, 1).map(r => ({
      channel: r.dims[0],
      sessions: r.metrics[0],
    }));

    const newUsers = newUsersData.rows?.[0]?.metricValues?.[0]?.value ? parseFloat(newUsersData.rows[0].metricValues[0].value) : 0;

    const productClicks = parseRows(productClicksData, 1, 1).map(r => ({
      path: r.dims[0],
      views: r.metrics[0],
    }));

    const totals = daily.reduce((acc, d) => ({
      sessions: acc.sessions + d.sessions,
      users: acc.users + d.users,
      pageviews: acc.pageviews + d.pageviews,
    }), { sessions: 0, users: 0, pageviews: 0 });

    // Get form submissions count from database
    let inquiries = 0;
    try {
      const inqList = await base44.asServiceRole.entities.ContactInquiry.filter({});
      if (Array.isArray(inqList)) {
        const inqDate = new Date();
        inqDate.setDate(inqDate.getDate() - days);
        inquiries = inqList.filter(i => {
          const createdDate = new Date(i.created_date);
          return createdDate >= inqDate;
        }).length;
      }
    } catch (e) {
      console.log('Could not fetch inquiries:', e);
    }

    return Response.json({ daily, pages, sources, productClicks, totals, newUsers, inquiries });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});