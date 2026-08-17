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

  const [todayRaw, yesterdayRaw, monthRaw, sourcesRaw, pagesRaw, devicesRaw, eventsRaw, trendRaw] = await Promise.all([
    gaRun(accessToken, { dateRanges: [{ startDate: 'today', endDate: 'today' }], metrics: commonMetrics }),
    gaRun(accessToken, { dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }], metrics: commonMetrics }),
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
          inListFilter: { values: ['generate_lead','phone_click','email_click','cta_click','form_start','quick_inquiry_click','view_item','select_item','scroll_depth','section_view','video_start','video_complete','sign_up','visualization_complete','file_download'] },
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
  ]);

  const toSummary = (data: any) => ({
    sessions: metric(data, 0), users: metric(data, 1), views: metric(data, 2), newUsers: metric(data, 3),
    avgSessionDuration: metric(data, 4), engagementRate: metric(data, 5),
  });

  const eventRows = rows(eventsRaw, ['eventName'], ['eventCount', 'totalUsers']);
  const eventMap = Object.fromEntries(eventRows.map((r: any) => [r.eventName, r]));

  return {
    today: toSummary(todayRaw),
    yesterday: toSummary(yesterdayRaw),
    month: toSummary(monthRaw),
    sources: rows(sourcesRaw, ['sourceMedium'], ['sessions', 'engagedSessions', 'activeUsers']),
    pages: rows(pagesRaw, ['pagePath'], ['views', 'activeUsers', 'avgSessionDuration']),
    devices: rows(devicesRaw, ['deviceCategory'], ['sessions', 'activeUsers', 'engagementRate']),
    events: eventRows,
    eventMap,
    trend: rows(trendRaw, ['date'], ['sessions', 'activeUsers', 'views']),
  };
}

async function getDatabaseLeads(base44: any) {
  const [contact, poptavky] = await Promise.all([
    base44.asServiceRole.entities.ContactInquiry.filter({}),
    base44.asServiceRole.entities.Poptavka.filter({}),
  ]);
  const today = localDateString();
  const month = monthStart();
  const normalizeDate = (record: any) => localDateString(new Date(record.created_date));
  const all = [
    ...(Array.isArray(contact) ? contact.map((r: any) => ({ ...r, _kind: 'ContactInquiry' })) : []),
    ...(Array.isArray(poptavky) ? poptavky.map((r: any) => ({ ...r, _kind: 'Poptavka' })) : []),
  ];
  const todayRows = all.filter((r: any) => normalizeDate(r) === today);
  const monthRows = all.filter((r: any) => normalizeDate(r) >= month && normalizeDate(r) <= today);
  return {
    today: todayRows.length,
    month: monthRows.length,
    recent: todayRows.slice(-10).map((r: any) => ({
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
  const { ga4, leads, search, instagram, facebook, metaAds, googleAds } = data;

  const dbConversion = ga4.month.sessions ? (leads.month / ga4.month.sessions) * 100 : 0;
  const todayChange = ga4.yesterday.sessions ? ((ga4.today.sessions - ga4.yesterday.sessions) / ga4.yesterday.sessions) * 100 : 0;
  if (todayChange >= 15) wins.push(`Dnešní návštěvnost je o ${Math.round(todayChange)} % vyšší než včera.`);
  if (dbConversion >= 2) wins.push(`Poptávkový poměr za měsíc je ${pct(dbConversion)} — pro B2B projektový web je to silný signál.`);
  if (ga4.eventMap?.generate_lead?.eventCount > 0) wins.push(`GA4 registruje ${ga4.eventMap.generate_lead.eventCount} událostí generate_lead za 28 dní.`);

  const topSource = ga4.sources?.[0];
  if (topSource?.sourceMedium) wins.push(`Nejsilnější zdroj návštěvnosti: ${topSource.sourceMedium} (${Math.round(topSource.sessions)} sessions / 28 dní).`);
  const topPage = ga4.pages?.find((p: any) => p.pagePath !== '/');
  if (topPage?.pagePath) wins.push(`Nejsilnější obsahová/produktová stránka: ${topPage.pagePath} (${Math.round(topPage.views)} zobrazení).`);

  if (search.available && search.queries?.length) {
    const best = [...search.queries].sort((a: any, b: any) => b.clicks - a.clicks)[0];
    if (best?.clicks > 0) wins.push(`SEO tahoun: „${best.key}“ — ${best.clicks} kliknutí, pozice ${best.position.toFixed(1)}.`);
  }
  if (instagram.available && instagram.topPosts?.[0]) {
    const post = instagram.topPosts[0];
    wins.push(`Instagram: nejlepší poslední příspěvek má ${Math.round(post.interactions)} měřených interakcí.`);
  }
  if (facebook.available && facebook.topPosts?.[0]) {
    wins.push(`Facebook: nejlepší recentní příspěvek má ${Math.round(facebook.topPosts[0].interactions)} interakcí.`);
  }
  if (metaAds.available && metaAds.total?.leads > 0) {
    wins.push(`Meta Ads za 7 dní: ${Math.round(metaAds.total.leads)} leadů při CPL ${money(metaAds.total.cpl, metaAds.account?.currency || 'CZK')}.`);
  }
  if (googleAds?.generateLeadKeyEvent) wins.push('GA4 generate_lead je nastavený jako Key event.');
  if (googleAds?.googleAdsLinked) wins.push(`GA4 je propojeno s Google Ads${googleAds.googleAdsLinks?.[0]?.customerId ? ` (Customer ID ${googleAds.googleAdsLinks[0].customerId})` : ''}.`);

  if (!ga4.eventMap?.generate_lead?.eventCount && leads.month > 0) recs.push('GA4 lead eventy zatím neodpovídají databázovým poptávkám. Priorita: ověřit nový generate_lead v DebugView a označit jej jako Key event.');
  if (dbConversion > 0 && dbConversion < 1) recs.push('Měsíční poměr poptávek k návštěvám je pod 1 %. Zkraťte cestu z produktových stránek k poptávce a testujte konkrétnější CTA „Nechat nacenit tento model“.');
  if (ga4.eventMap?.form_start?.eventCount > 0 && ga4.eventMap?.generate_lead?.eventCount > 0) {
    const abandon = 1 - ga4.eventMap.generate_lead.eventCount / ga4.eventMap.form_start.eventCount;
    if (abandon > 0.55) recs.push(`Formuláře mají přibližně ${Math.round(abandon * 100)} % rozpracovanost bez odeslání. Zvažte kratší první krok a doplňující informace až po získání kontaktu.`);
  }
  const mobile = ga4.devices?.find((d: any) => d.deviceCategory === 'mobile');
  if (mobile && mobile.sessions > 0 && mobile.engagementRate < 0.45) recs.push('Mobilní engagement je slabší než 45 %. Priorita: hero CTA, rychlost LCP, velikost formulářových polí a viditelnost hlavní poptávky bez scrollování.');
  if (search.available) {
    const opportunities = search.queries.filter((q: any) => q.impressions >= 20 && q.position >= 4 && q.position <= 15).slice(0, 5);
    if (opportunities.length) recs.push(`SEO quick wins: rozšířit obsah pro dotazy ${opportunities.map((q: any) => `„${q.key}“`).join(', ')} — už mají impresní potenciál na pozicích 4–15.`);
  }
  if (!instagram.available) recs.push('Instagram analytika není dostupná. Dokončete oprávnění Insights v Base44, jinak report uvidí pouze web a Search Console.');
  else if (!instagram.insightsEnabled) recs.push('Instagram účet je připojen, ale media Insights nejsou autorizované. Přidejte oprávnění instagram_business_manage_insights.');
  if (!facebook.available) recs.push('Připojte Facebook Pages; report pak automaticky přidá organický výkon a nejlepší příspěvky.');
  if (!metaAds.available) recs.push('Připojte Meta Ads; bez něj nelze porovnávat spend, CTR, CPC, leady a CPL s webovými konverzemi.');
  else {
    if (metaAds.total.spend > 0 && metaAds.total.ctr < 1) recs.push(`Meta Ads CTR je ${pct(metaAds.total.ctr)}. Obměňte první frame/kreativu a rozdělte veřejný prostor vs. zahrady do oddělených reklamních sestav.`);
    if (metaAds.total.spend > 0 && metaAds.total.leads === 0) recs.push('Meta Ads utrácí, ale API nevrací leady. Zkontrolujte Pixel/CAPI event Lead a doménové přiřazení ještě před navyšováním rozpočtu.');
  }
  if (!googleAds?.generateLeadKeyEvent) recs.push('Google Ads: dokončete GA4 edit oprávnění a nastavte generate_lead jako hlavní Key event. Micro-events ponechte sekundární pro diagnostiku.');
  else if (!googleAds?.googleAdsLinked) recs.push('Google Ads: Key event generate_lead je připravený, ale GA4 zatím nemá zjištěný Google Ads link. Propojte účet a zapněte auto-tagging.');
  else recs.push('Google Ads: importujte GA4 generate_lead jako webovou konverzi a nastavte ji jako primární pro bidding; telefon, e-mail, CTA a form_start ponechte sekundární.');
  recs.push('Pro kampaně držte jednotné UTM: utm_source, utm_medium, utm_campaign a utm_content. V reportu pak lze přesně porovnat města/segmenty/kreativy bez ručního třídění.');

  return { wins: wins.slice(0, 8), recommendations: recs.slice(0, 10), dbConversion };
}

function statCard(label: string, value: string, note = '') {
  return `<td width="25%" valign="top" style="padding:7px"><div style="border:1px solid #dbe5e7;border-radius:16px;padding:16px;background:#fff"><div style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#71868b">${esc(label)}</div><div style="margin-top:8px;font-size:24px;font-weight:800;color:#0d2d38">${esc(value)}</div>${note ? `<div style="margin-top:5px;font-size:11px;color:#7a8d92">${esc(note)}</div>` : ''}</div></td>`;
}

function listHtml(items: string[], accent = '#0e7584') {
  if (!items.length) return '<p style="color:#7a8d92;font-size:13px">Zatím bez dostatečných dat.</p>';
  return `<ul style="margin:0;padding-left:20px">${items.map((item) => `<li style="margin:0 0 10px;color:#40575d;font-size:13px;line-height:1.6"><span style="color:${accent}">${esc(item)}</span></li>`).join('')}</ul>`;
}

function reportHtml(data: any) {
  const { ga4, leads, search, instagram, facebook, metaAds, googleAds, intelligence } = data;
  const sourceRows = ga4.sources.slice(0, 6).map((s: any) => `<tr><td style="padding:7px 0;color:#40575d">${esc(s.sourceMedium)}</td><td align="right" style="padding:7px 0;font-weight:700;color:#17343d">${Math.round(s.sessions)}</td></tr>`).join('');
  const pageRows = ga4.pages.slice(0, 6).map((p: any) => `<tr><td style="padding:7px 0;color:#40575d">${esc(p.pagePath)}</td><td align="right" style="padding:7px 0;font-weight:700;color:#17343d">${Math.round(p.views)}</td></tr>`).join('');
  const igRows = instagram.available ? instagram.topPosts.slice(0, 3).map((p: any) => `<tr><td style="padding:7px 0;color:#40575d">${esc((p.caption || 'Příspěvek').slice(0, 80))}</td><td align="right" style="padding:7px 0;font-weight:700;color:#17343d">${Math.round(p.interactions)}</td></tr>`).join('') : '';
  const fbRows = facebook.available ? facebook.topPosts.slice(0, 3).map((p: any) => `<tr><td style="padding:7px 0;color:#40575d">${esc((p.message || 'Příspěvek').slice(0, 80))}</td><td align="right" style="padding:7px 0;font-weight:700;color:#17343d">${Math.round(p.interactions)}</td></tr>`).join('') : '';
  const adsCurrency = metaAds.account?.currency || 'CZK';

  return `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#eef3f4;font-family:Arial,'Helvetica Neue',sans-serif;color:#10242b"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:920px;background:#f7f9f9;border:1px solid #dbe5e7;border-radius:22px;overflow:hidden"><tr><td style="background:#0d2d38;padding:28px 32px"><div style="font-size:22px;font-weight:900;color:#61d5e5">MLŽIDLA® <span style="font-size:11px;color:#ffffff88">by HolmTec</span></div><div style="margin-top:8px;font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:#ffffff99">Marketing Intelligence · ${esc(localDateString())}</div></td></tr><tr><td style="padding:24px 25px"><table width="100%" cellpadding="0" cellspacing="0"><tr>${statCard('Návštěvy dnes', Math.round(ga4.today.sessions).toLocaleString('cs-CZ'), `včera ${Math.round(ga4.yesterday.sessions)}`)}${statCard('Poptávky dnes', String(leads.today), `měsíc ${leads.month}`)}${statCard('Návštěvy měsíc', Math.round(ga4.month.sessions).toLocaleString('cs-CZ'), `${Math.round(ga4.month.users)} uživatelů`)}${statCard('Konverzní poměr', pct(intelligence.dbConversion), 'DB lead / session')}</tr></table>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px"><tr><td width="50%" valign="top" style="padding:7px"><div style="background:#fff;border:1px solid #dbe5e7;border-radius:16px;padding:18px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#0e7584;font-weight:700">Úspěchy</div><div style="margin-top:14px">${listHtml(intelligence.wins, '#0e7584')}</div></div></td><td width="50%" valign="top" style="padding:7px"><div style="background:#fff;border:1px solid #dbe5e7;border-radius:16px;padding:18px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#b36a00;font-weight:700">Doporučené kroky</div><div style="margin-top:14px">${listHtml(intelligence.recommendations, '#40575d')}</div></div></td></tr></table>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px"><tr><td width="50%" valign="top" style="padding:7px"><div style="background:#fff;border:1px solid #dbe5e7;border-radius:16px;padding:18px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#71868b">Top zdroje · 28 dní</div><table width="100%" style="margin-top:10px;font-size:12px">${sourceRows || '<tr><td>Bez dat</td></tr>'}</table></div></td><td width="50%" valign="top" style="padding:7px"><div style="background:#fff;border:1px solid #dbe5e7;border-radius:16px;padding:18px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#71868b">Top stránky · 28 dní</div><table width="100%" style="margin-top:10px;font-size:12px">${pageRows || '<tr><td>Bez dat</td></tr>'}</table></div></td></tr></table>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px"><tr><td width="33%" valign="top" style="padding:7px"><div style="background:#fff;border:1px solid #dbe5e7;border-radius:16px;padding:18px;min-height:160px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#a73a78">Instagram</div>${instagram.available ? `<div style="margin-top:9px;font-size:22px;font-weight:800;color:#17343d">${Math.round(instagram.followers).toLocaleString('cs-CZ')}</div><div style="font-size:11px;color:#7a8d92">followers · engagement ${pct(instagram.avgEngagement)}</div><table width="100%" style="margin-top:10px;font-size:11px">${igRows}</table>` : `<p style="font-size:12px;color:#7a8d92;line-height:1.5">Čeká na Insights oprávnění.</p>`}</div></td><td width="33%" valign="top" style="padding:7px"><div style="background:#fff;border:1px solid #dbe5e7;border-radius:16px;padding:18px;min-height:160px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#315fa8">Facebook</div>${facebook.available ? `<div style="margin-top:9px;font-size:22px;font-weight:800;color:#17343d">${Math.round(facebook.followers).toLocaleString('cs-CZ')}</div><div style="font-size:11px;color:#7a8d92">followers</div><table width="100%" style="margin-top:10px;font-size:11px">${fbRows}</table>` : `<p style="font-size:12px;color:#7a8d92;line-height:1.5">Facebook Pages zatím není autorizovaný.</p>`}</div></td><td width="33%" valign="top" style="padding:7px"><div style="background:#fff;border:1px solid #dbe5e7;border-radius:16px;padding:18px;min-height:160px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#6945a8">Meta Ads · 7 dní</div>${metaAds.available ? `<div style="margin-top:9px;font-size:22px;font-weight:800;color:#17343d">${money(metaAds.total.spend, adsCurrency)}</div><div style="font-size:11px;color:#7a8d92">CTR ${pct(metaAds.total.ctr)} · CPC ${money(metaAds.total.cpc, adsCurrency)} · leady ${Math.round(metaAds.total.leads)} · CPL ${metaAds.total.leads ? money(metaAds.total.cpl, adsCurrency) : '—'}</div>` : `<p style="font-size:12px;color:#7a8d92;line-height:1.5">Meta Ads zatím není autorizovaný.</p>`}</div></td></tr></table>

<div style="margin:18px 7px 0;background:#0d2d38;border-radius:16px;padding:20px;color:#fff"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#61d5e5">SEO / Search Console</div>${search.available && search.queries.length ? `<p style="font-size:13px;line-height:1.7;color:#d5e5e8">Nejvyšší počet kliků: <strong style="color:#fff">${esc(search.queries[0].key)}</strong> · ${search.queries[0].clicks} kliknutí · ${search.queries[0].impressions} zobrazení · pozice ${search.queries[0].position.toFixed(1)}.</p>` : `<p style="font-size:13px;color:#d5e5e8">Search Console data nejsou dostupná.</p>`}</div>

<div style="margin:18px 7px 0;padding:16px 18px;border:1px solid #dbe5e7;border-radius:16px;background:#fff;font-size:11px;line-height:1.65;color:#71868b"><strong style="color:#17343d">Google Ads readiness:</strong> generate_lead Key event ${googleAds?.generateLeadKeyEvent ? '✓' : '—'} · GA4↔Google Ads link ${googleAds?.googleAdsLinked ? '✓' : '—'}.<br>Měření: GA4 property 496002660 · page_view, section_view, generate_lead, form_start, CTA, telefon/e-mail, video, produktové interakce, AI vizualizace, newsletter a scroll depth. Poptávky jsou pro kontrolu porovnávány také přímo s Base44 databází. Sociální a reklamní data se doplní automaticky po autorizaci příslušných konektorů.</div></td></tr><tr><td align="center" style="padding:18px;background:#eef3f4;color:#7a8d92;font-size:10px">MLŽIDLA® / HolmTec · automatický marketingový report</td></tr></table></td></tr></table></body></html>`;
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
  const subject = `MLŽIDLA® — analytický report ${new Intl.DateTimeFormat('cs-CZ', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date())}`;
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
