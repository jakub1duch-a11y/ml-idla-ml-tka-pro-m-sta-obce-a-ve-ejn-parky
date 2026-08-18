import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const GA4_PROPERTY_ID = 'properties/496002660';
const SEARCH_CONSOLE_SITE = 'sc-domain:mlzidla.cz';
const REPORT_RECIPIENTS = ['jakub1duch@gmail.com', 'duch@holmtec.cz', 'meduna@holmtec.cz'];
const TZ = 'Europe/Prague';
const GRAPH_VERSION = 'v23.0';

function esc(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function num(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function pct(value: number, digits = 1) {
  return `${value.toFixed(digits).replace('.', ',')} %`;
}

function money(value: number, currency = 'CZK') {
  try {
    return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value || 0);
  } catch (_) {
    return `${Math.round(value || 0).toLocaleString('cs-CZ')} ${currency}`;
  }
}

function localDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '';
  return { year: get('year'), month: get('month'), day: get('day') };
}

function localDateString(date = new Date()) {
  const p = localDateParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

function monthStart() {
  const p = localDateParts();
  return `${p.year}-${p.month}-01`;
}

function localDateOffset(days: number) {
  return localDateString(new Date(Date.now() + days * 86400000));
}

function reportDateLabel() {
  const date = new Date(Date.now() - 86400000);
  return new Intl.DateTimeFormat('cs-CZ', {
    timeZone: TZ,
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(date);
}

async function fetchJson(url: string, init: RequestInit = {}) {
  const response = await fetch(url, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || data?.error_description || data?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }
  return data;
}

async function gaRun(accessToken: string, body: Record<string, unknown>) {
  return fetchJson(`https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runReport`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function metric(data: any, index: number) {
  return num(data?.rows?.[0]?.metricValues?.[index]?.value);
}

function rows(data: any, dimensions: string[], metrics: string[]) {
  return (data?.rows || []).map((row: any) => {
    const output: Record<string, any> = {};
    dimensions.forEach((name, i) => { output[name] = row.dimensionValues?.[i]?.value || ''; });
    metrics.forEach((name, i) => { output[name] = num(row.metricValues?.[i]?.value); });
    return output;
  });
}

async function getGa4(base44: any) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');
  const commonMetrics = [
    { name: 'sessions' },
    { name: 'activeUsers' },
    { name: 'screenPageViews' },
    { name: 'newUsers' },
    { name: 'averageSessionDuration' },
    { name: 'engagementRate' },
  ];

  const [todayRaw, yesterdayRaw, dayBeforeRaw, monthRaw, sourcesRaw, pagesRaw, devicesRaw, eventsRaw, trendRaw, yesterdaySourcesRaw, yesterdayPagesRaw, yesterdayEventsRaw] = await Promise.all([
    gaRun(accessToken, { dateRanges: [{ startDate: 'today', endDate: 'today' }], metrics: commonMetrics }),
    gaRun(accessToken, { dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }], metrics: commonMetrics }),
    gaRun(accessToken, { dateRanges: [{ startDate: '2daysAgo', endDate: '2daysAgo' }], metrics: commonMetrics }),
    gaRun(accessToken, { dateRanges: [{ startDate: monthStart(), endDate: 'today' }], metrics: commonMetrics }),
    gaRun(accessToken, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionSourceMedium' }],
      metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }, { name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 12,
    }),
    gaRun(accessToken, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }, { name: 'averageSessionDuration' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 12,
    }),
    gaRun(accessToken, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    }),
    gaRun(accessToken, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: { values: ['generate_lead','phone_click','email_click','cta_click','form_start','quick_inquiry_click','view_item','select_item','scroll_depth','section_view','video_start','video_complete','sign_up','visualization_complete','file_download','funnel_cities_landing_view','funnel_cities_consultation_click','funnel_cities_visualizer_click','funnel_cities_references_all_click','funnel_cities_reference_open','funnel_cities_lead_submit','funnel_architects_landing_view','funnel_architects_consultation_click','funnel_architects_visualizer_click','funnel_architects_downloads_click','funnel_architects_references_all_click','funnel_architects_reference_open','funnel_architects_lead_submit','funnel_residential_landing_view','funnel_residential_consultation_click','funnel_residential_visualizer_click','funnel_residential_catalog_click','funnel_residential_reference_open','funnel_residential_lead_submit'] },
        },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    }),
    gaRun(accessToken, {
      dateRanges: [{ startDate: '6daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'screenPageViews' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }),
    gaRun(accessToken, {
      dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
      dimensions: [{ name: 'sessionSourceMedium' }],
      metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }, { name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 8,
    }),
    gaRun(accessToken, {
      dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }, { name: 'averageSessionDuration' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 8,
    }),
    gaRun(accessToken, {
      dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: { values: ['generate_lead','phone_click','email_click','cta_click','form_start','quick_inquiry_click','view_item','select_item','section_view','video_start','video_complete','sign_up','visualization_complete','file_download','funnel_cities_landing_view','funnel_cities_consultation_click','funnel_cities_visualizer_click','funnel_cities_references_all_click','funnel_cities_reference_open','funnel_cities_lead_submit','funnel_architects_landing_view','funnel_architects_consultation_click','funnel_architects_visualizer_click','funnel_architects_downloads_click','funnel_architects_references_all_click','funnel_architects_reference_open','funnel_architects_lead_submit','funnel_residential_landing_view','funnel_residential_consultation_click','funnel_residential_visualizer_click','funnel_residential_catalog_click','funnel_residential_reference_open','funnel_residential_lead_submit'] },
        },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    }),
  ]);

  const toSummary = (data: any) => ({
    sessions: metric(data, 0), users: metric(data, 1), views: metric(data, 2), newUsers: metric(data, 3),
    avgSessionDuration: metric(data, 4), engagementRate: metric(data, 5),
  });

  const eventRows = rows(eventsRaw, ['eventName'], ['eventCount', 'totalUsers']);
  const eventMap = Object.fromEntries(eventRows.map((r: any) => [r.eventName, r]));
  const yesterdayEventRows = rows(yesterdayEventsRaw, ['eventName'], ['eventCount', 'totalUsers']);
  const yesterdayEventMap = Object.fromEntries(yesterdayEventRows.map((r: any) => [r.eventName, r]));

  return {
    today: toSummary(todayRaw),
    yesterday: toSummary(yesterdayRaw),
    dayBefore: toSummary(dayBeforeRaw),
    month: toSummary(monthRaw),
    sources: rows(sourcesRaw, ['sourceMedium'], ['sessions', 'engagedSessions', 'activeUsers']),
    pages: rows(pagesRaw, ['pagePath'], ['views', 'activeUsers', 'avgSessionDuration']),
    devices: rows(devicesRaw, ['deviceCategory'], ['sessions', 'activeUsers', 'engagementRate']),
    events: eventRows,
    eventMap,
    yesterdaySources: rows(yesterdaySourcesRaw, ['sourceMedium'], ['sessions', 'engagedSessions', 'activeUsers']),
    yesterdayPages: rows(yesterdayPagesRaw, ['pagePath'], ['views', 'activeUsers', 'avgSessionDuration']),
    yesterdayEvents: yesterdayEventRows,
    yesterdayEventMap,
    trend: rows(trendRaw, ['date'], ['sessions', 'activeUsers', 'views']),
  };
}

async function getDatabaseLeads(base44: any) {
  const [contact, poptavky] = await Promise.all([
    base44.asServiceRole.entities.ContactInquiry.filter({}),
    base44.asServiceRole.entities.Poptavka.filter({}),
  ]);
  const today = localDateString();
  const yesterday = localDateOffset(-1);
  const dayBefore = localDateOffset(-2);
  const month = monthStart();
  const normalizeDate = (record: any) => localDateString(new Date(record.created_date));
  const all = [
    ...(Array.isArray(contact) ? contact.map((r: any) => ({ ...r, _kind: 'ContactInquiry' })) : []),
    ...(Array.isArray(poptavky) ? poptavky.map((r: any) => ({ ...r, _kind: 'Poptavka' })) : []),
  ];
  const todayRows = all.filter((r: any) => normalizeDate(r) === today);
  const yesterdayRows = all.filter((r: any) => normalizeDate(r) === yesterday);
  const dayBeforeRows = all.filter((r: any) => normalizeDate(r) === dayBefore);
  const monthRows = all.filter((r: any) => normalizeDate(r) >= month && normalizeDate(r) <= today);
  return {
    today: todayRows.length,
    yesterday: yesterdayRows.length,
    dayBefore: dayBeforeRows.length,
    month: monthRows.length,
    recent: yesterdayRows.slice(-10).map((r: any) => ({
      name: r.name || r.jmeno || '',
      company: r.firma || '',
      product: r.produkt || r.service_type || r.project_scope || '',
      created: r.created_date,
    })),
  };
}

async function getSearchConsole(base44: any) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');
    const end = localDateString();
    const startDateObj = new Date();
    startDateObj.setDate(startDateObj.getDate() - 28);
    const start = localDateString(startDateObj);
    const call = async (dimensions: string[]) => fetchJson(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SEARCH_CONSOLE_SITE)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: start, endDate: end, dimensions, rowLimit: 25, dataState: 'all' }),
      }
    );
    const [queryData, pageData] = await Promise.all([call(['query']), call(['page'])]);
    const mapRows = (data: any) => (data.rows || []).map((r: any) => ({
      key: r.keys?.[0] || '', clicks: num(r.clicks), impressions: num(r.impressions), ctr: num(r.ctr), position: num(r.position),
    }));
    return { available: true, queries: mapRows(queryData), pages: mapRows(pageData) };
  } catch (error) {
    return { available: false, error: error.message, queries: [], pages: [] };
  }
}

async function getInstagram(base44: any) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    const profile = await fetchJson(`https://graph.instagram.com/me?fields=id,username,followers_count,media_count&access_token=${encodeURIComponent(accessToken)}`);
    const media = await fetchJson(`https://graph.instagram.com/me/media?fields=id,caption,media_type,permalink,timestamp,like_count,comments_count&limit=20&access_token=${encodeURIComponent(accessToken)}`);
    const recent = (media.data || []).filter((m: any) => {
      const d = new Date(m.timestamp);
      return Date.now() - d.getTime() <= 35 * 86400000;
    });

    const enriched = [];
    for (const item of recent.slice(0, 12)) {
      let insights: Record<string, number> = {};
      const metricSets = item.media_type === 'REEL'
        ? ['views,reach,total_interactions,likes,comments,saved,shares', 'reach,total_interactions,saved,shares']
        : ['reach,total_interactions,likes,comments,saved,shares', 'reach,saved,shares'];
      for (const metrics of metricSets) {
        try {
          const response = await fetchJson(`https://graph.instagram.com/${item.id}/insights?metric=${encodeURIComponent(metrics)}&access_token=${encodeURIComponent(accessToken)}`);
          insights = Object.fromEntries((response.data || []).map((r: any) => [r.name, num(r.values?.[0]?.value ?? r.value)]));
          break;
        } catch (_) {}
      }
      const interactions = num(insights.total_interactions) || num(item.like_count) + num(item.comments_count) + num(insights.saved) + num(insights.shares);
      enriched.push({ ...item, insights, interactions });
    }
    enriched.sort((a: any, b: any) => b.interactions - a.interactions);
    const interactions = enriched.reduce((sum: number, p: any) => sum + p.interactions, 0);
    const avgEngagement = profile.followers_count && enriched.length ? (interactions / enriched.length / profile.followers_count) * 100 : 0;
    return {
      available: true,
      username: profile.username,
      followers: num(profile.followers_count),
      mediaCount: num(profile.media_count),
      avgEngagement,
      topPosts: enriched.slice(0, 5),
      insightsEnabled: enriched.some((p: any) => Object.keys(p.insights || {}).length > 0),
    };
  } catch (error) {
    return { available: false, error: error.message, topPosts: [] };
  }
}

function actionCount(actions: any[] = [], names: string[]) {
  return actions.filter((a: any) => names.some((name) => String(a.action_type || '').includes(name)))
    .reduce((sum: number, a: any) => sum + num(a.value), 0);
}

async function getFacebook(base44: any) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');
    const accounts = await fetchJson(`https://graph.facebook.com/${GRAPH_VERSION}/me/accounts?fields=id,name,access_token,fan_count,followers_count&limit=50&access_token=${encodeURIComponent(accessToken)}`);
    const pages = accounts.data || [];
    const page = pages.find((p: any) => /ml[žz]|holm/i.test(p.name || '')) || pages[0];
    if (!page) throw new Error('Nenalezena spravovaná Facebook Page.');
    const pageToken = page.access_token || accessToken;
    const posts = await fetchJson(`https://graph.facebook.com/${GRAPH_VERSION}/${page.id}/posts?fields=id,message,created_time,permalink_url,shares,reactions.limit(0).summary(true),comments.limit(0).summary(true)&limit=20&access_token=${encodeURIComponent(pageToken)}`);
    const topPosts = (posts.data || []).map((p: any) => ({
      ...p,
      reactions: num(p.reactions?.summary?.total_count),
      comments: num(p.comments?.summary?.total_count),
      sharesCount: num(p.shares?.count),
      interactions: num(p.reactions?.summary?.total_count) + num(p.comments?.summary?.total_count) + num(p.shares?.count),
    })).sort((a: any, b: any) => b.interactions - a.interactions).slice(0, 5);
    return {
      available: true, name: page.name, followers: num(page.followers_count || page.fan_count), topPosts,
    };
  } catch (error) {
    return { available: false, error: error.message, topPosts: [] };
  }
}

async function getMetaAds(base44: any) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('meta_ads');
    const accounts = await fetchJson(`https://graph.facebook.com/${GRAPH_VERSION}/me/adaccounts?fields=id,name,currency,account_status&limit=25&access_token=${encodeURIComponent(accessToken)}`);
    const account = accounts.data?.[0];
    if (!account) throw new Error('Nenalezen Meta Ads účet.');
    const report = await fetchJson(`https://graph.facebook.com/${GRAPH_VERSION}/${account.id}/insights?level=campaign&date_preset=last_7d&fields=campaign_name,spend,impressions,reach,clicks,ctr,cpc,actions&limit=100&access_token=${encodeURIComponent(accessToken)}`);
    const campaigns = (report.data || []).map((r: any) => {
      const leads = actionCount(r.actions || [], ['lead', 'contact', 'complete_registration']);
      return {
        campaign: r.campaign_name || '', spend: num(r.spend), impressions: num(r.impressions), reach: num(r.reach), clicks: num(r.clicks),
        ctr: num(r.ctr), cpc: num(r.cpc), leads, cpl: leads ? num(r.spend) / leads : 0,
      };
    }).sort((a: any, b: any) => b.spend - a.spend);
    const total = campaigns.reduce((acc: any, c: any) => ({
      spend: acc.spend + c.spend, impressions: acc.impressions + c.impressions, clicks: acc.clicks + c.clicks, leads: acc.leads + c.leads,
    }), { spend: 0, impressions: 0, clicks: 0, leads: 0 });
    const ctr = total.impressions ? total.clicks / total.impressions * 100 : 0;
    const cpc = total.clicks ? total.spend / total.clicks : 0;
    const cpl = total.leads ? total.spend / total.leads : 0;
    return { available: true, account, campaigns, total: { ...total, ctr, cpc, cpl } };
  } catch (error) {
    return { available: false, error: error.message, campaigns: [] };
  }
}

async function getGoogleAdsSetup(base44: any) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');
    const [keys, links] = await Promise.all([
      fetchJson(`https://analyticsadmin.googleapis.com/v1beta/${GA4_PROPERTY_ID}/keyEvents?pageSize=100`, { headers: { Authorization: `Bearer ${accessToken}` } }),
      fetchJson(`https://analyticsadmin.googleapis.com/v1beta/${GA4_PROPERTY_ID}/googleAdsLinks?pageSize=100`, { headers: { Authorization: `Bearer ${accessToken}` } }),
    ]);
    const keyEvents = Array.isArray(keys.keyEvents) ? keys.keyEvents : [];
    const googleAdsLinks = Array.isArray(links.googleAdsLinks) ? links.googleAdsLinks : [];
    return {
      available: true,
      generateLeadKeyEvent: keyEvents.some((item: any) => item.eventName === 'generate_lead'),
      googleAdsLinked: googleAdsLinks.length > 0,
      googleAdsLinks: googleAdsLinks.map((item: any) => ({ customerId: item.customerId, adsPersonalizationEnabled: item.adsPersonalizationEnabled })),
    };
  } catch (error) {
    return { available: false, generateLeadKeyEvent: false, googleAdsLinked: false, googleAdsLinks: [], error: error.message };
  }
}

function buildRecommendations(data: any) {
  const recs: string[] = [];
  const wins: string[] = [];
  const { ga4, leads, metaAds, googleAds } = data;

  const dbConversion = ga4.month.sessions ? (leads.month / ga4.month.sessions) * 100 : 0;
  const yesterdayConversion = ga4.yesterday.sessions ? (leads.yesterday / ga4.yesterday.sessions) * 100 : 0;
  const trafficChange = ga4.dayBefore.sessions ? ((ga4.yesterday.sessions - ga4.dayBefore.sessions) / ga4.dayBefore.sessions) * 100 : 0;
  const leadEvents = ga4.yesterdayEventMap?.generate_lead?.eventCount || 0;
  const formStarts = ga4.yesterdayEventMap?.form_start?.eventCount || 0;

  if (trafficChange >= 10) wins.push(`Návštěvnost vzrostla o ${Math.round(trafficChange)} % proti předchozímu dni.`);
  if (ga4.yesterday.engagementRate >= 0.5) wins.push(`Engagement rate dosáhl ${pct(ga4.yesterday.engagementRate * 100)}.`);
  if (leads.yesterday > 0) wins.push(`Web přinesl ${leads.yesterday} ${leads.yesterday === 1 ? 'poptávku' : 'poptávky'}; denní konverzní poměr ${pct(yesterdayConversion)}.`);
  const topSource = ga4.yesterdaySources?.[0];
  if (topSource?.sourceMedium) wins.push(`Nejsilnější zdroj: ${topSource.sourceMedium} (${Math.round(topSource.sessions)} návštěv).`);
  const topPage = ga4.yesterdayPages?.find((p: any) => p.pagePath !== '/');
  if (topPage?.pagePath) wins.push(`Nejsilnější stránka: ${topPage.pagePath} (${Math.round(topPage.views)} zobrazení).`);

  if (leads.yesterday > 0 && leadEvents === 0) recs.push('Databáze eviduje poptávku, ale GA4 nemá generate_lead. Ověřit konverzní event a jeho odeslání po úspěšném formuláři.');
  if (formStarts > 0 && leadEvents === 0) recs.push(`Bylo zahájeno ${formStarts} formulářů bez měřené GA4 konverze. Prověřit formulářový funnel a CTA.`);
  if (ga4.yesterday.sessions >= 20 && yesterdayConversion < 1) recs.push('Denní konverzní poměr je pod 1 %. Priorita: zkrátit cestu k poptávce a zesílit produktové CTA.');
  if (ga4.yesterday.engagementRate < 0.45 && ga4.yesterday.sessions > 0) recs.push('Engagement je pod 45 %. Prověřit mobilní hero, rychlost a viditelnost hlavního CTA.');
  if (!googleAds?.generateLeadKeyEvent || !googleAds?.googleAdsLinked) recs.push('Dokončit Google Ads konverzní propojení: generate_lead jako Key event + GA4 ↔ Google Ads.');
  if (metaAds.available && metaAds.total?.spend > 0 && metaAds.total?.leads === 0) recs.push('Meta Ads má útratu bez evidovaných leadů. Před změnou rozpočtu ověřit Lead event a atribuci.');

  if (!wins.length) wins.push('Data za předchozí den jsou načtena; bez výrazné pozitivní odchylky proti předchozímu dni.');
  if (!recs.length) recs.push('Bez urgentního zásahu. Pokračovat ve sledování návštěvnosti, engagementu a poptávek.');

  return {
    wins: wins.slice(0, 3),
    recommendations: recs.slice(0, 3),
    dbConversion,
    yesterdayConversion,
    trafficChange,
  };
}

function statCard(label: string, value: string, note = '') {
  return `<td width="25%" valign="top" style="padding:7px"><div style="border:1px solid #dbe5e7;border-radius:16px;padding:16px;background:#fff"><div style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#71868b">${esc(label)}</div><div style="margin-top:8px;font-size:24px;font-weight:800;color:#0d2d38">${esc(value)}</div>${note ? `<div style="margin-top:5px;font-size:11px;color:#7a8d92">${esc(note)}</div>` : ''}</div></td>`;
}

function listHtml(items: string[], accent = '#0e7584') {
  if (!items.length) return '<p style="color:#7a8d92;font-size:13px">Zatím bez dostatečných dat.</p>';
  return `<ul style="margin:0;padding-left:20px">${items.map((item) => `<li style="margin:0 0 10px;color:#40575d;font-size:13px;line-height:1.6"><span style="color:${accent}">${esc(item)}</span></li>`).join('')}</ul>`;
}

function reportHtml(data: any) {
  const { ga4, leads, instagram, facebook, metaAds, googleAds, intelligence } = data;
  const sourceRows = ga4.yesterdaySources.slice(0, 5).map((s: any) => `<tr><td style="padding:6px 0;color:#40575d">${esc(s.sourceMedium)}</td><td align="right" style="padding:6px 0;font-weight:700;color:#17343d">${Math.round(s.sessions)}</td></tr>`).join('');
  const pageRows = ga4.yesterdayPages.slice(0, 5).map((p: any) => `<tr><td style="padding:6px 0;color:#40575d">${esc(p.pagePath)}</td><td align="right" style="padding:6px 0;font-weight:700;color:#17343d">${Math.round(p.views)}</td></tr>`).join('');
  const eventMap = ga4.yesterdayEventMap || {};
  const trafficNote = ga4.dayBefore.sessions ? `${intelligence.trafficChange >= 0 ? '+' : ''}${Math.round(intelligence.trafficChange)} % vs. den předtím` : 'bez srovnání';
  const socialStatus = `Instagram ${instagram.available && instagram.insightsEnabled ? '✓' : '—'} · Facebook ${facebook.available ? '✓' : '—'} · Meta Ads ${metaAds.available ? '✓' : '—'}`;
  const adsStatus = `GA4→Ads ${googleAds?.googleAdsLinked ? '✓' : '—'} · generate_lead Key event ${googleAds?.generateLeadKeyEvent ? '✓' : '—'}`;

  return `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#eef3f4;font-family:Arial,'Helvetica Neue',sans-serif;color:#10242b"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:18px 10px"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:860px;background:#f7f9f9;border:1px solid #dbe5e7;border-radius:20px;overflow:hidden"><tr><td style="background:#0d2d38;padding:24px 28px"><div style="font-size:21px;font-weight:900;color:#61d5e5">MLŽIDLA® <span style="font-size:11px;color:#ffffff88">by HolmTec</span></div><div style="margin-top:7px;font-size:12px;color:#fff">Denní Analytics · ${esc(reportDateLabel())}</div><div style="margin-top:4px;font-size:10px;color:#ffffff88">Výsledky za celý předchozí kalendářní den</div></td></tr><tr><td style="padding:18px 18px 22px"><table width="100%" cellpadding="0" cellspacing="0"><tr>${statCard('Návštěvy', Math.round(ga4.yesterday.sessions).toLocaleString('cs-CZ'), trafficNote)}${statCard('Uživatelé', Math.round(ga4.yesterday.users).toLocaleString('cs-CZ'), `${Math.round(ga4.yesterday.newUsers)} nových`)}${statCard('Zobrazení', Math.round(ga4.yesterday.views).toLocaleString('cs-CZ'), `${ga4.yesterday.users ? (ga4.yesterday.views / ga4.yesterday.users).toFixed(1).replace('.', ',') : '0'} / uživatele`)}${statCard('Poptávky', String(leads.yesterday), `konverze ${pct(intelligence.yesterdayConversion)}`)}</tr></table>
<table width="100%" cellpadding="0" cellspacing="0"><tr>${statCard('Engagement', pct(ga4.yesterday.engagementRate * 100), 'GA4 engagement rate')}${statCard('Prům. návštěva', `${Math.round(ga4.yesterday.avgSessionDuration)} s`, 'average session duration')}${statCard('Form start', String(Math.round(eventMap.form_start?.eventCount || 0)), `GA4 lead ${Math.round(eventMap.generate_lead?.eventCount || 0)}`)}${statCard('CTA kliky', String(Math.round(eventMap.cta_click?.eventCount || 0)), `telefon ${Math.round(eventMap.phone_click?.eventCount || 0)} · e-mail ${Math.round(eventMap.email_click?.eventCount || 0)}`)}</tr></table>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px"><tr><td width="50%" valign="top" style="padding:6px"><div style="background:#fff;border:1px solid #dbe5e7;border-radius:14px;padding:16px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#71868b">Top zdroje · včera</div><table width="100%" style="margin-top:8px;font-size:12px">${sourceRows || '<tr><td style="color:#7a8d92">Bez dat</td></tr>'}</table></div></td><td width="50%" valign="top" style="padding:6px"><div style="background:#fff;border:1px solid #dbe5e7;border-radius:14px;padding:16px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#71868b">Top stránky · včera</div><table width="100%" style="margin-top:8px;font-size:12px">${pageRows || '<tr><td style="color:#7a8d92">Bez dat</td></tr>'}</table></div></td></tr></table>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px"><tr><td width="50%" valign="top" style="padding:6px"><div style="background:#fff;border:1px solid #dbe5e7;border-radius:14px;padding:16px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#0e7584;font-weight:700">Co se povedlo</div><div style="margin-top:10px">${listHtml(intelligence.wins, '#0e7584')}</div></div></td><td width="50%" valign="top" style="padding:6px"><div style="background:#fff;border:1px solid #dbe5e7;border-radius:14px;padding:16px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#b36a00;font-weight:700">Priorita</div><div style="margin-top:10px">${listHtml(intelligence.recommendations, '#40575d')}</div></div></td></tr></table>

<div style="margin:12px 6px 0;padding:13px 15px;border-radius:14px;background:#0d2d38;color:#d5e5e8;font-size:11px;line-height:1.6"><strong style="color:#61d5e5">Měsíc k dnešku:</strong> ${Math.round(ga4.month.sessions).toLocaleString('cs-CZ')} návštěv · ${Math.round(ga4.month.users).toLocaleString('cs-CZ')} uživatelů · ${leads.month} poptávek · konverze ${pct(intelligence.dbConversion)}.</div>
<div style="margin:10px 6px 0;font-size:10px;line-height:1.5;color:#71868b">Stav dat: ${esc(adsStatus)} · ${esc(socialStatus)}. Nedostupný zdroj se pouze označí a nezahlcuje hlavní report.</div></td></tr><tr><td align="center" style="padding:14px;background:#eef3f4;color:#7a8d92;font-size:10px">MLŽIDLA® / HolmTec · denní analytický report</td></tr></table></td></tr></table></body></html>`;
}

function encodeMessage(to: string, subject: string, html: string) {
  const encodeUtf8 = (value: string) => {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  };
  const subjectEncoded = `=?UTF-8?B?${encodeUtf8(subject)}?=`;
  const raw = `To: ${to}\r\nSubject: ${subjectEncoded}\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${html}`;
  const bytes = new TextEncoder().encode(raw);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function sendReportEmail(base44: any, html: string) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const subject = `MLŽIDLA® — Analytics za ${reportDateLabel()}`;
  const results = [];
  for (const to of REPORT_RECIPIENTS) {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: encodeMessage(to, subject, html) }),
    });
    const payload = await response.json().catch(() => ({}));
    results.push({ to, ok: response.ok, id: payload.id || null, error: response.ok ? null : payload?.error?.message || `HTTP ${response.status}` });
  }
  return results;
}

export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json().catch(() => ({}));

    if (body.action === 'listGa4Properties') {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');
      const response = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200', {
        headers: { Authorization: 'Bearer ' + accessToken },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) return Response.json({ error: payload?.error?.message || `HTTP ${response.status}` }, { status: response.status });
      return Response.json({
        ok: true,
        accounts: (payload.accountSummaries || []).map((account: any) => ({
          account: account.account,
          displayName: account.displayName,
          properties: (account.propertySummaries || []).map((property: any) => ({ property: property.property, displayName: property.displayName })),
        })),
      });
    }

    const sendEmail = Boolean(body.sendEmail);

    const [ga4, leads, search, instagram, facebook, metaAds, googleAds] = await Promise.all([
      getGa4(base44),
      getDatabaseLeads(base44),
      getSearchConsole(base44),
      getInstagram(base44),
      getFacebook(base44),
      getMetaAds(base44),
      getGoogleAdsSetup(base44),
    ]);
    const data: any = { ga4, leads, search, instagram, facebook, metaAds, googleAds };
    data.intelligence = buildRecommendations(data);
    const html = reportHtml(data);
    let emailResults: any[] = [];
    if (sendEmail) emailResults = await sendReportEmail(base44, html);

    return Response.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      ...data,
      emailResults,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
