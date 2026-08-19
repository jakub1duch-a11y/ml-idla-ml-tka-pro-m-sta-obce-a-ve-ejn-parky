import { createClientFromRequest } from 'npm:@base44/sdk@0.8.43';

const GA4_PROPERTY_ID = 'properties/496002660';
const SEARCH_CONSOLE_SITE = 'sc-domain:mlzidla.cz';
const TZ = 'Europe/Prague';
const GRAPH_VERSION = 'v23.0';

function num(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function localDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function yesterdayDateString() {
  return localDateString(new Date(Date.now() - 86400000));
}

function validDate(value: unknown) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizePeriod(inputFrom: unknown, inputTo: unknown) {
  const fallback = yesterdayDateString();
  const from = validDate(inputFrom) ? String(inputFrom) : fallback;
  const to = validDate(inputTo) ? String(inputTo) : from;
  if (from > to) return { from: to, to: from };
  const days = Math.floor((new Date(`${to}T12:00:00Z`).getTime() - new Date(`${from}T12:00:00Z`).getTime()) / 86400000) + 1;
  if (days > 92) throw new Error('Briefing podporuje období maximálně 92 dní.');
  return { from, to };
}

function formatPeriodLabel(from: string, to: string) {
  const format = (value: string) => new Intl.DateTimeFormat('cs-CZ', {
    timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(`${value}T12:00:00Z`));
  return from === to ? format(from) : `${format(from)} – ${format(to)}`;
}

async function fetchJson(url: string, init: RequestInit = {}) {
  const response = await fetch(url, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.message || data?.message || `HTTP ${response.status}`);
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

function mapRows(data: any, dimensions: string[], metrics: string[]) {
  return (data?.rows || []).map((row: any) => {
    const result: Record<string, any> = {};
    dimensions.forEach((name, index) => { result[name] = row.dimensionValues?.[index]?.value || ''; });
    metrics.forEach((name, index) => { result[name] = num(row.metricValues?.[index]?.value); });
    return result;
  });
}

async function getGa4(base44: any, from: string, to: string) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');
    const metrics = [
      { name: 'sessions' }, { name: 'activeUsers' }, { name: 'screenPageViews' },
      { name: 'newUsers' }, { name: 'averageSessionDuration' }, { name: 'engagementRate' },
    ];
    const eventNames = [
      'generate_lead','phone_click','email_click','cta_click','form_start','quick_inquiry_click',
      'view_item','select_item','visualization_complete','file_download',
      'funnel_cities_landing_view','funnel_cities_consultation_click','funnel_cities_visualizer_click','funnel_cities_reference_open','funnel_cities_lead_submit',
      'funnel_architects_landing_view','funnel_architects_consultation_click','funnel_architects_visualizer_click','funnel_architects_downloads_click','funnel_architects_reference_open','funnel_architects_lead_submit',
      'funnel_residential_landing_view','funnel_residential_consultation_click','funnel_residential_visualizer_click','funnel_residential_catalog_click','funnel_residential_reference_open','funnel_residential_lead_submit',
    ];

    const [summaryRaw, sourcesRaw, pagesRaw, eventsRaw, trendRaw] = await Promise.all([
      gaRun(accessToken, { dateRanges: [{ startDate: from, endDate: to }], metrics }),
      gaRun(accessToken, {
        dateRanges: [{ startDate: from, endDate: to }],
        dimensions: [{ name: 'sessionSourceMedium' }],
        metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 10,
      }),
      gaRun(accessToken, {
        dateRanges: [{ startDate: from, endDate: to }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }, { name: 'averageSessionDuration' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 10,
      }),
      gaRun(accessToken, {
        dateRanges: [{ startDate: from, endDate: to }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
        dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: eventNames } } },
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      }),
      gaRun(accessToken, {
        dateRanges: [{ startDate: from, endDate: to }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
    ]);

    const events = mapRows(eventsRaw, ['eventName'], ['eventCount', 'totalUsers']);
    return {
      available: true,
      summary: {
        sessions: metric(summaryRaw, 0), users: metric(summaryRaw, 1), views: metric(summaryRaw, 2),
        newUsers: metric(summaryRaw, 3), avgSessionDuration: metric(summaryRaw, 4), engagementRate: metric(summaryRaw, 5),
      },
      sources: mapRows(sourcesRaw, ['sourceMedium'], ['sessions', 'engagedSessions', 'activeUsers']),
      pages: mapRows(pagesRaw, ['pagePath'], ['views', 'activeUsers', 'avgSessionDuration']),
      events,
      eventMap: Object.fromEntries(events.map((row: any) => [row.eventName, row])),
      trend: mapRows(trendRaw, ['date'], ['sessions', 'activeUsers', 'views']),
    };
  } catch (error: any) {
    return { available: false, error: error.message, summary: {}, sources: [], pages: [], events: [], eventMap: {}, trend: [] };
  }
}

function recordDate(record: any, field: 'created_date' | 'updated_date') {
  const value = record?.[field];
  if (!value) return '';
  try { return localDateString(new Date(value)); } catch (_) { return ''; }
}

function inRange(date: string, from: string, to: string) {
  return Boolean(date && date >= from && date <= to);
}

function workLabel(record: any) {
  return record?.name || record?.title || record?.project_name || record?.file_name || record?.label || record?.product_name || record?.slug || record?.id || 'Položka';
}

async function getWorkSummary(base44: any, from: string, to: string) {
  const definitions = [
    ['Product', 'Produkty'],
    ['Realizace', 'Reference a realizace'],
    ['MarketingPost', 'Marketingový obsah'],
    ['BlogPost', 'Blog a SEO obsah'],
    ['MediaFile', 'Média'],
    ['ProjectOrder', 'Nabídky a obchodní případy'],
    ['OfferVariant', 'Varianty nabídek'],
    ['VisualizationAsset', 'AI vizualizace'],
    ['WorkLog', 'Pracovní log'],
  ];

  const results = await Promise.all(definitions.map(async ([entity]) => {
    try {
      const rows = await base44.asServiceRole.entities[entity].filter({});
      return { entity, rows: Array.isArray(rows) ? rows : [] };
    } catch (error: any) {
      return { entity, rows: [], error: error.message };
    }
  }));

  const sections = definitions.map(([entity, label]) => {
    const source = results.find((result) => result.entity === entity);
    const rows = source?.rows || [];
    const isWorkLog = entity === 'WorkLog';
    const created = isWorkLog
      ? rows.filter((row: any) => inRange(String(row.work_date || ''), from, to))
      : rows.filter((row: any) => inRange(recordDate(row, 'created_date'), from, to));
    const updated = isWorkLog ? [] : rows.filter((row: any) => {
      const updatedDate = recordDate(row, 'updated_date');
      const createdDate = recordDate(row, 'created_date');
      return inRange(updatedDate, from, to) && !inRange(createdDate, from, to);
    });
    const touched = [...created, ...updated]
      .sort((a: any, b: any) => String(b.updated_date || b.created_date || '').localeCompare(String(a.updated_date || a.created_date || '')))
      .slice(0, 8)
      .map((row: any) => ({
        id: row.id,
        label: workLabel(row),
        action: isWorkLog ? 'created' : (inRange(recordDate(row, 'created_date'), from, to) ? 'created' : 'updated'),
        status: row.status || (row.published === true ? 'published' : row.published === false ? 'draft' : ''),
        description: isWorkLog ? row.description || '' : '',
        expectedResult: isWorkLog ? row.expected_result || '' : '',
        area: isWorkLog ? row.area || '' : '',
        evidence: isWorkLog ? row.evidence || '' : '',
      }));
    return { entity, label, created: created.length, updated: updated.length, total: created.length + updated.length, items: touched, error: source?.error || '' };
  });

  const active = sections.filter((section) => section.total > 0);
  const taskLog = sections.find((section) => section.entity === 'WorkLog')?.items || [];
  return {
    totalChanges: active.reduce((sum, section) => sum + section.total, 0),
    sections,
    activeSections: active,
    taskLog,
  };
}

async function getLeads(base44: any, from: string, to: string) {
  const [contact, inquiries] = await Promise.all([
    base44.asServiceRole.entities.ContactInquiry.filter({}).catch(() => []),
    base44.asServiceRole.entities.Poptavka.filter({}).catch(() => []),
  ]);
  const rows = [
    ...(Array.isArray(contact) ? contact.map((row: any) => ({ ...row, kind: 'ContactInquiry' })) : []),
    ...(Array.isArray(inquiries) ? inquiries.map((row: any) => ({ ...row, kind: 'Poptavka' })) : []),
  ].filter((row: any) => inRange(recordDate(row, 'created_date'), from, to));
  return {
    total: rows.length,
    rows: rows.slice(0, 20).map((row: any) => ({
      name: row.name || row.jmeno || '', company: row.firma || '', product: row.produkt || row.service_type || row.project_scope || '', created: row.created_date,
    })),
  };
}

async function getSearchConsole(base44: any, from: string, to: string) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');
    const call = async (dimensions: string[]) => fetchJson(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SEARCH_CONSOLE_SITE)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: from, endDate: to, dimensions, rowLimit: 10, dataState: 'all' }),
      }
    );
    const [queryData, pageData] = await Promise.all([call(['query']), call(['page'])]);
    const rows = (data: any) => (data.rows || []).map((row: any) => ({
      key: row.keys?.[0] || '', clicks: num(row.clicks), impressions: num(row.impressions), ctr: num(row.ctr), position: num(row.position),
    }));
    return { available: true, queries: rows(queryData), pages: rows(pageData) };
  } catch (error: any) {
    return { available: false, error: error.message, queries: [], pages: [] };
  }
}

async function getInstagram(base44: any, from: string, to: string) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    const profile = await fetchJson(`https://graph.instagram.com/me?fields=id,username,followers_count,media_count&access_token=${encodeURIComponent(accessToken)}`);
    const media = await fetchJson(`https://graph.instagram.com/me/media?fields=id,caption,media_type,permalink,timestamp,like_count,comments_count&limit=50&access_token=${encodeURIComponent(accessToken)}`);
    const periodMedia = (media.data || []).filter((item: any) => {
      const date = item.timestamp ? localDateString(new Date(item.timestamp)) : '';
      return inRange(date, from, to);
    });
    const posts = [];
    let insightsEnabled = false;
    for (const item of periodMedia.slice(0, 20)) {
      let insightMap: Record<string, number> = {};
      for (const metricSet of ['reach,total_interactions,views,likes,comments,saved,shares', 'reach,total_interactions,saved,shares']) {
        try {
          const insightData = await fetchJson(`https://graph.instagram.com/${item.id}/insights?metric=${encodeURIComponent(metricSet)}&access_token=${encodeURIComponent(accessToken)}`);
          insightMap = Object.fromEntries((insightData.data || []).map((metric: any) => [metric.name, num(metric.values?.[0]?.value ?? metric.value)]));
          if (Object.keys(insightMap).length) insightsEnabled = true;
          break;
        } catch (_) {}
      }
      const likes = num(insightMap.likes) || num(item.like_count);
      const comments = num(insightMap.comments) || num(item.comments_count);
      const interactions = num(insightMap.total_interactions) || likes + comments + num(insightMap.saved) + num(insightMap.shares);
      posts.push({
        id: item.id,
        caption: String(item.caption || '').slice(0, 220),
        mediaType: item.media_type || '',
        permalink: item.permalink || '',
        timestamp: item.timestamp || '',
        likes,
        comments,
        saved: num(insightMap.saved),
        shares: num(insightMap.shares),
        reach: num(insightMap.reach),
        views: num(insightMap.views),
        interactions,
      });
    }
    posts.sort((a: any, b: any) => b.interactions - a.interactions);
    return {
      available: true,
      username: profile.username || '',
      followers: num(profile.followers_count),
      mediaCount: num(profile.media_count),
      periodPosts: posts.length,
      periodInteractions: posts.reduce((sum: number, post: any) => sum + post.interactions, 0),
      periodReach: posts.reduce((sum: number, post: any) => sum + num(post.reach), 0),
      topPosts: posts.slice(0, 5),
      insightsScope: insightsEnabled,
      note: insightsEnabled ? 'Rozšířené Instagram insights jsou aktivní.' : 'Základní Instagram data jsou dostupná; reach a další insights čekají na rozšířené oprávnění.',
    };
  } catch (error: any) {
    return { available: false, error: error.message, followers: 0, periodPosts: 0, periodInteractions: 0, topPosts: [] };
  }
}

async function getFacebook(base44: any, from: string, to: string) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');
    const accounts = await fetchJson(`https://graph.facebook.com/${GRAPH_VERSION}/me/accounts?fields=id,name,access_token,fan_count,followers_count&limit=50&access_token=${encodeURIComponent(accessToken)}`);
    const pages = accounts.data || [];
    const page = pages.find((item: any) => /ml[žz]|holm/i.test(item.name || '')) || pages[0];
    if (!page) throw new Error('Nenalezena spravovaná Facebook stránka.');
    const pageToken = page.access_token || accessToken;
    const postsRaw = await fetchJson(`https://graph.facebook.com/${GRAPH_VERSION}/${page.id}/posts?fields=id,message,created_time,permalink_url,shares,reactions.limit(0).summary(true),comments.limit(0).summary(true)&limit=50&access_token=${encodeURIComponent(pageToken)}`);
    const posts = (postsRaw.data || [])
      .filter((item: any) => inRange(item.created_time ? localDateString(new Date(item.created_time)) : '', from, to))
      .map((item: any) => ({
        id: item.id,
        message: String(item.message || '').slice(0, 220),
        createdTime: item.created_time || '',
        permalink: item.permalink_url || '',
        reactions: num(item.reactions?.summary?.total_count),
        comments: num(item.comments?.summary?.total_count),
        shares: num(item.shares?.count),
        interactions: num(item.reactions?.summary?.total_count) + num(item.comments?.summary?.total_count) + num(item.shares?.count),
      }))
      .sort((a: any, b: any) => b.interactions - a.interactions);
    return {
      available: true,
      name: page.name || '',
      followers: num(page.followers_count || page.fan_count),
      periodPosts: posts.length,
      periodInteractions: posts.reduce((sum: number, post: any) => sum + post.interactions, 0),
      topPosts: posts.slice(0, 5),
    };
  } catch (error: any) {
    return { available: false, error: error.message, followers: 0, periodPosts: 0, periodInteractions: 0, topPosts: [] };
  }
}

function actionCount(actions: any[] = [], names: string[]) {
  return actions.filter((action: any) => names.some((name) => String(action.action_type || '').includes(name)))
    .reduce((sum: number, action: any) => sum + num(action.value), 0);
}

async function getMetaAds(base44: any, from: string, to: string) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('meta_ads');
    const accounts = await fetchJson(`https://graph.facebook.com/${GRAPH_VERSION}/me/adaccounts?fields=id,name,currency,account_status&limit=25&access_token=${encodeURIComponent(accessToken)}`);
    const account = accounts.data?.[0];
    if (!account) throw new Error('Nenalezen Meta Ads účet.');
    const report = await fetchJson(`https://graph.facebook.com/${GRAPH_VERSION}/${account.id}/insights?level=campaign&time_range=${encodeURIComponent(JSON.stringify({ since: from, until: to }))}&fields=campaign_name,spend,impressions,reach,clicks,ctr,cpc,actions&limit=100&access_token=${encodeURIComponent(accessToken)}`);
    const campaigns = (report.data || []).map((row: any) => {
      const leads = actionCount(row.actions || [], ['lead', 'contact', 'complete_registration']);
      return {
        campaign: row.campaign_name || '',
        spend: num(row.spend), impressions: num(row.impressions), reach: num(row.reach), clicks: num(row.clicks),
        ctr: num(row.ctr), cpc: num(row.cpc), leads, cpl: leads ? num(row.spend) / leads : 0,
      };
    }).sort((a: any, b: any) => b.spend - a.spend);
    const total = campaigns.reduce((acc: any, campaign: any) => ({
      spend: acc.spend + campaign.spend,
      impressions: acc.impressions + campaign.impressions,
      clicks: acc.clicks + campaign.clicks,
      leads: acc.leads + campaign.leads,
    }), { spend: 0, impressions: 0, clicks: 0, leads: 0 });
    return {
      available: true,
      account: { name: account.name || '', currency: account.currency || 'CZK' },
      total: {
        ...total,
        ctr: total.impressions ? total.clicks / total.impressions * 100 : 0,
        cpc: total.clicks ? total.spend / total.clicks : 0,
        cpl: total.leads ? total.spend / total.leads : 0,
      },
      campaigns: campaigns.slice(0, 10),
    };
  } catch (error: any) {
    return { available: false, error: error.message, account: null, total: {}, campaigns: [] };
  }
}

async function getDriveActivity(base44: any, from: string, to: string) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const startProbe = new Date(`${from}T12:00:00Z`);
    startProbe.setUTCDate(startProbe.getUTCDate() - 1);
    const endProbe = new Date(`${to}T12:00:00Z`);
    endProbe.setUTCDate(endProbe.getUTCDate() + 1);
    const q = `trashed = false and modifiedTime >= '${startProbe.toISOString()}' and modifiedTime <= '${endProbe.toISOString()}'`;
    const data = await fetchJson(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&orderBy=modifiedTime%20desc&pageSize=100&fields=${encodeURIComponent('files(id,name,mimeType,createdTime,modifiedTime,webViewLink)')}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const files = (data.files || [])
      .filter((file: any) => inRange(file.modifiedTime ? localDateString(new Date(file.modifiedTime)) : '', from, to))
      .map((file: any) => ({
        id: file.id,
        name: file.name || '',
        mimeType: file.mimeType || '',
        createdTime: file.createdTime || '',
        modifiedTime: file.modifiedTime || '',
        url: file.webViewLink || '',
        createdInPeriod: inRange(file.createdTime ? localDateString(new Date(file.createdTime)) : '', from, to),
      }));
    return {
      available: true,
      totalModified: files.length,
      totalCreated: files.filter((file: any) => file.createdInPeriod).length,
      files: files.slice(0, 20),
    };
  } catch (error: any) {
    return { available: false, error: error.message, totalModified: 0, totalCreated: 0, files: [] };
  }
}

async function getGoogleAdsStatus(base44: any) {
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
      generateLeadKeyEvent: keyEvents.some((event: any) => event.eventName === 'generate_lead'),
      googleAdsLinked: googleAdsLinks.length > 0,
      customerIds: googleAdsLinks.map((link: any) => link.customerId).filter(Boolean),
    };
  } catch (error: any) {
    return { available: false, generateLeadKeyEvent: false, googleAdsLinked: false, customerIds: [], error: error.message };
  }
}

function fallbackNarrative(input: any) {
  const sessions = num(input.ga4?.summary?.sessions);
  const leads = num(input.leads?.total);
  const conversion = sessions ? leads / sessions * 100 : 0;
  const topSource = input.ga4?.sources?.[0];
  const topPage = input.ga4?.pages?.[0];
  const work = input.work?.activeSections || [];
  return {
    executive_summary: `Za období ${input.period.label} bylo evidováno ${Math.round(sessions)} návštěv webu, ${leads} nových poptávek a ${input.work?.totalChanges || 0} zaznamenaných změn v obsahu, produktech nebo obchodních podkladech.`,
    delivered_work: work.slice(0, 6).map((section: any) => `${section.label}: ${section.created} nových a ${section.updated} upravených položek.`),
    performance_readout: [
      `Konverzní poměr databázových leadů vůči sessions: ${conversion.toFixed(1).replace('.', ',')} %.`,
      topSource?.sourceMedium ? `Nejsilnější zdroj návštěvnosti: ${topSource.sourceMedium} (${Math.round(topSource.sessions)} sessions).` : 'Nejsilnější zdroj návštěvnosti není pro zvolené období dostupný.',
      topPage?.pagePath ? `Nejnavštěvovanější stránka: ${topPage.pagePath} (${Math.round(topPage.views)} zobrazení).` : 'Top stránka není pro zvolené období dostupná.',
    ],
    risks: input.ga4?.available ? [] : ['GA4 data nejsou dostupná; výkon nelze vyhodnotit bez odhadů.'],
    next_actions: ['Prioritizovat kanály a stránky, které přivádějí návštěvnost s obchodním záměrem.', 'Pravidelně kontrolovat generate_lead a návaznost na reálné poptávky v Base44.'],
    expected_outcomes: (input.work?.taskLog || []).map((task: any) => task.expectedResult).filter(Boolean).slice(0, 6),
    completion_summary: (input.work?.taskLog || []).map((task: any) => `${task.label}: ${task.status === 'completed' ? 'dokončeno' : task.status === 'blocked' ? 'blokováno' : 'rozpracováno'}.`).slice(0, 8),
    conclusion: 'Briefing je postaven pouze na dostupných měřených datech a zaznamenaných změnách v systému.',
  };
}

async function buildSeniorNarrative(base44: any, input: any) {
  try {
    const compact = {
      period: input.period,
      ga4: input.ga4?.available ? {
        summary: input.ga4.summary,
        topSources: input.ga4.sources?.slice(0, 5),
        topPages: input.ga4.pages?.slice(0, 5),
        importantEvents: input.ga4.events?.slice(0, 12),
      } : { available: false, error: input.ga4?.error },
      leads: { total: input.leads?.total || 0 },
      search: input.search?.available ? { topQueries: input.search.queries?.slice(0, 5) } : { available: false },
      googleAds: input.googleAds,
      instagram: input.instagram?.available ? { username: input.instagram.username, followers: input.instagram.followers, periodPosts: input.instagram.periodPosts, periodInteractions: input.instagram.periodInteractions, topPosts: input.instagram.topPosts?.slice(0, 3) } : { available: false, error: input.instagram?.error },
      facebook: input.facebook?.available ? { name: input.facebook.name, followers: input.facebook.followers, periodPosts: input.facebook.periodPosts, periodInteractions: input.facebook.periodInteractions, topPosts: input.facebook.topPosts?.slice(0, 3) } : { available: false, error: input.facebook?.error },
      metaAds: input.metaAds?.available ? { account: input.metaAds.account, total: input.metaAds.total, campaigns: input.metaAds.campaigns?.slice(0, 5) } : { available: false, error: input.metaAds?.error },
      drive: input.drive?.available ? { totalModified: input.drive.totalModified, totalCreated: input.drive.totalCreated, files: input.drive.files?.slice(0, 8) } : { available: false, error: input.drive?.error },
      work: {
        totalChanges: input.work?.totalChanges || 0,
        taskLog: input.work?.taskLog || [],
        sections: (input.work?.activeSections || []).map((section: any) => ({
          label: section.label, created: section.created, updated: section.updated, items: section.items?.slice(0, 5),
        })),
      },
    };

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Jsi seniorní digitální marketingový ředitel a webový konzultant pro MLŽIDLA.cz / HolmTec. Zpracuj manažerský briefing za přesně zadané období. Piš profesionálně, konkrétně a věcně v češtině. Priorita je obchodní dopad, webový funnel, kvalita leadů, obsah, SEO, sociální sítě, reklamy a měření.\n\nPŘÍSNÁ PRAVIDLA:\n- Používej jen fakta z DATA. Nic nevymýšlej a žádné chybějící metriky nedopočítávej.\n- Odvedenou práci popisuj pouze podle zaznamenaných změn a taskLog.\n- Rozlišuj výkon webu od odvedené práce.\n- Pokud není Ads, Facebook nebo Search zdroj dostupný, stručně to označ, ale nedělej z toho falešný závěr o výkonu.\n- Očekávané výsledky popisuj jako očekávání, nikoli jako již dosažený efekt.\n- completion_summary uveď podle stavů completed / in_progress / blocked z taskLog.\n- Doporučení musí být konkrétní a realizovatelná pro následující pracovní období.\n- executive_summary maximálně 3 věty.\n- delivered_work 3 až 8 bodů, performance_readout 2 až 6 bodů, risks maximálně 4 body, next_actions 3 až 5 bodů, expected_outcomes 2 až 6 bodů.\n\nDATA:\n${JSON.stringify(compact)}`,
      response_json_schema: {
        type: 'object',
        properties: {
          executive_summary: { type: 'string' },
          delivered_work: { type: 'array', items: { type: 'string' } },
          performance_readout: { type: 'array', items: { type: 'string' } },
          risks: { type: 'array', items: { type: 'string' } },
          next_actions: { type: 'array', items: { type: 'string' } },
          expected_outcomes: { type: 'array', items: { type: 'string' } },
          completion_summary: { type: 'array', items: { type: 'string' } },
          conclusion: { type: 'string' },
        },
        required: ['executive_summary','delivered_work','performance_readout','risks','next_actions','expected_outcomes','completion_summary','conclusion'],
      },
    });
    return response;
  } catch (_) {
    return fallbackNarrative(input);
  }
}

export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { from, to } = normalizePeriod(body.dateFrom, body.dateTo);
    const period = { from, to, label: formatPeriodLabel(from, to) };

    const [ga4, leads, search, googleAds, instagram, facebook, metaAds, drive, work] = await Promise.all([
      getGa4(base44, from, to),
      getLeads(base44, from, to),
      getSearchConsole(base44, from, to),
      getGoogleAdsStatus(base44),
      getInstagram(base44, from, to),
      getFacebook(base44, from, to),
      getMetaAds(base44, from, to),
      getDriveActivity(base44, from, to),
      getWorkSummary(base44, from, to),
    ]);

    const source = { period, ga4, leads, search, googleAds, instagram, facebook, metaAds, drive, work };
    const narrative = await buildSeniorNarrative(base44, source);

    return Response.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      ...source,
      narrative,
    });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Briefing se nepodařilo vytvořit.' }, { status: 500 });
  }
}
