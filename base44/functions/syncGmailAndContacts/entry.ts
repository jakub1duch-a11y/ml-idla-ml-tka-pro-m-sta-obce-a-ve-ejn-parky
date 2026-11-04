import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const SPREADSHEET_ID = '1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE';
const CONTACT_SHEETS = ['Eventy', 'ZOO a botanické zahrady', 'Domovy seniorů', 'Školy a školky', 'Koupaliště', 'Developeři', 'Architekti a projektanti'];
const ACCOUNT_EMAIL = 'meduna@holmtec.cz';

function headerValue(headers, name) {
  return String((headers || []).find((h) => String(h.name || '').toLowerCase() === name.toLowerCase())?.value || '');
}
function decodeBase64Url(value) {
  if (!value) return '';
  const normalized = String(value).replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  try {
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch { return ''; }
}
function flattenBody(payload) {
  if (!payload) return '';
  if (payload.body?.data) return decodeBase64Url(payload.body.data);
  return (payload.parts || []).map(flattenBody).filter(Boolean).join('\n');
}
function htmlToText(value) {
  return String(value || '').replace(/<style[\\s\\S]*?<\\/style>/gi, ' ').replace(/<script[\\s\\S]*?<\\/script>/gi, ' ').replace(/<br\\s*\\/?>(?=.)/gi, '\\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\\s{2,}/g, ' ').trim();
}
function parseAddress(value) {
  const text = String(value || '');
  const email = text.match(/<([^>]+)>/)?.[1] || text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/i)?.[0] || '';
  const name = text.replace(/<[^>]+>/g, '').replace(email, '').replace(/["']/g, '').trim();
  return { email: email.toLowerCase(), name };
}
function isActionRequired(subject, body) {
  const text = [subject, body].join(' ').toLowerCase();
  if (/mailer-daemon|delivery status|undeliverable|recipientnotfound|automatická odpověď|out of office/.test(text)) return false;
  return /(prosím|můžete|mohu|cena|cen|nabíd|zajímá|schůz|setkání|termín|informac|pošlete|zašlete|doporuč|navrhn|poptáv|kdy|jaký|jaké|tešíme se na vaši odpověď)/i.test(text);
}
async function googleGet(url, accessToken) {
  const response = await fetch(url, { headers: { Authorization: 'Bearer ' + accessToken } });
  if (!response.ok) throw new Error('Google API ' + response.status + ': ' + await response.text());
  return response.json();
}
async function readSheet(accessToken, sheetName) {
  const range = sheetName + '!A1:W2000';
  const data = await googleGet('https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_ID + '/values/' + encodeURIComponent(range), accessToken);
  return data.values || [];
}
function findHeader(headers, patterns) {
  return headers.findIndex((value) => patterns.some((pattern) => pattern.test(String(value || ''))));
}
async function syncContacts(base44, sheetsToken) {
  const rowsByEmail = new Map();
  const sheetResults = [];
  for (const sheetName of CONTACT_SHEETS) {
    let rows = [];
    try { rows = await readSheet(sheetsToken, sheetName); } catch { continue; }
    if (!rows.length) continue;
    const headers = rows[0];
    const emailIndex = findHeader(headers, [/e-?mail/i, /email/i]);
    if (emailIndex < 0) continue;
    const nameIndex = findHeader(headers, [/^jméno/i, /^jmeno/i, /lead/i, /kontakt/i]);
    const orgIndex = findHeader(headers, [/organiz/i, /firma/i, /společnost/i, /mesto|město/i]);
    const roleIndex = findHeader(headers, [/pozic/i, /role/i, /funkc/i]);
    const statusIndex = findHeader(headers, [/stav osloven/i, /^stav$/i, /status/i]);
    const responseIndex = findHeader(headers, [/poslední odpověď/i, /posledni odpoved/i, /odpověď/i]);
    const nextIndex = findHeader(headers, [/další krok/i, /dalsi krok/i, /follow/i]);
    for (let rowNumber = 1; rowNumber < rows.length; rowNumber += 1) {
      const row = rows[rowNumber] || [];
      const email = String(row[emailIndex] || '').trim().toLowerCase();
      if (!email || !email.includes('@')) continue;
      const current = rowsByEmail.get(email) || {};
      rowsByEmail.set(email, { email, name: current.name || String(row[nameIndex] || '').trim(), organization: current.organization || String(row[orgIndex] || '').trim(), role: current.role || String(row[roleIndex] || '').trim(), status: current.status || String(row[statusIndex] || '').trim(), next_step: current.next_step || String(row[nextIndex] || '').trim(), last_subject: current.last_subject || String(row[responseIndex] || '').trim(), source: 'google_sheet', sheet_name: sheetName, sheet_row: rowNumber + 1 });
    }
    sheetResults.push({ sheet: sheetName, rows: rows.length - 1 });
  }
  const existing = await base44.asServiceRole.entities.CrmContact.list('-updated_date', 5000);
  const existingByEmail = new Map((existing || []).map((item) => [String(item.email || '').toLowerCase(), item]));
  let imported = 0; let updated = 0;
  for (const contact of rowsByEmail.values()) {
    const previous = existingByEmail.get(contact.email);
    const data = { ...contact, status: contact.status || previous?.status || 'new', action_required: previous?.action_required || false, next_step: contact.next_step || previous?.next_step || '', thread_url: previous?.thread_url || '', last_inbound_at: previous?.last_inbound_at || '', last_outbound_at: previous?.last_outbound_at || '' };
    if (previous) { await base44.asServiceRole.entities.CrmContact.update(previous.id, data); updated += 1; }
    else { await base44.asServiceRole.entities.CrmContact.create(data); imported += 1; }
  }
  return { imported, updated, total: rowsByEmail.size, sheets: sheetResults };
}
async function syncGmail(base44, gmailToken) {
  const q = encodeURIComponent('after:2026/01/01 {mlžidla mlžení mlžítka MLŽIDLA.cz}');
  const list = await googleGet('https://gmail.googleapis.com/gmail/v1/users/me/messages?q=' + q + '&maxResults=100', gmailToken);
  const ids = (list.messages || []).map((item) => item.id).filter(Boolean);
  const existing = await base44.asServiceRole.entities.EmailMessage.list('-updated_date', 5000);
  const existingById = new Map((existing || []).map((item) => [String(item.gmail_message_id || ''), item]));
  const existingContacts = await base44.asServiceRole.entities.CrmContact.list('-updated_date', 5000);
  const contactsByEmail = new Map((existingContacts || []).map((item) => [String(item.email || '').toLowerCase(), item]));
  let imported = 0; let updatedContacts = 0;
  for (const id of ids) {
    if (existingById.has(id)) continue;
    const message = await googleGet('https://gmail.googleapis.com/gmail/v1/users/me/messages/' + id + '?format=full', gmailToken);
    const headers = message.payload?.headers || [];
    const from = parseAddress(headerValue(headers, 'From'));
    const to = parseAddress(headerValue(headers, 'To'));
    const cc = headerValue(headers, 'Cc');
    const subject = headerValue(headers, 'Subject');
    const internalDate = message.internalDate ? new Date(Number(message.internalDate)).toISOString() : new Date().toISOString();
    const inbound = from.email !== ACCOUNT_EMAIL;
    const contact = inbound ? from : to;
    const body = htmlToText(flattenBody(message.payload)).slice(0, 12000);
    const actionRequired = inbound && isActionRequired(subject, body);
    const threadUrl = 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/' + (message.threadId || id);
    const organization = contactsByEmail.get(contact.email)?.organization || '';
    await base44.asServiceRole.entities.EmailMessage.create({ gmail_message_id: id, gmail_thread_id: message.threadId || id, direction: inbound ? 'inbound' : 'outbound', from_email: from.email, to_email: to.email, cc, subject, snippet: message.snippet || body.slice(0, 500), body_text: body, received_at: internalDate, gmail_url: threadUrl, contact_email: contact.email, contact_name: contact.name, organization, action_required: actionRequired, action_summary: actionRequired ? 'Vyžaduje ruční reakci nebo další obchodní krok.' : '', synced_at: new Date().toISOString() });
    imported += 1;
    const current = contactsByEmail.get(contact.email);
    if (current) {
      const update = inbound ? { last_inbound_at: internalDate, last_subject: subject, action_required: actionRequired || current.action_required, status: actionRequired ? 'needs_action' : (current.status || 'replied'), thread_url: threadUrl } : { last_outbound_at: internalDate, last_contacted_at: internalDate, last_subject: subject, thread_url: threadUrl };
      await base44.asServiceRole.entities.CrmContact.update(current.id, update);
      updatedContacts += 1;
    }
  }
  return { imported, updatedContacts, scanned: ids.length };
}
Deno.serve(async (req) => {
  const started = new Date();
  let run;
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { accessToken: sheetsToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const { accessToken: gmailToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    run = await base44.asServiceRole.entities.SyncRun.create({ source: 'combined', status: 'running', started_at: started.toISOString() });
    const contactsResult = await syncContacts(base44, sheetsToken);
    const gmailResult = await syncGmail(base44, gmailToken);
    const summary = { contacts: contactsResult, gmail: gmailResult };
    await base44.asServiceRole.entities.SyncRun.update(run.id, { status: 'completed', finished_at: new Date().toISOString(), imported_contacts: contactsResult.imported, updated_contacts: contactsResult.updated + gmailResult.updatedContacts, imported_messages: gmailResult.imported, summary: JSON.stringify(summary) });
    return Response.json({ ok: true, ...summary, finished_at: new Date().toISOString() });
  } catch (error) {
    if (run?.id) { try { await base44.asServiceRole.entities.SyncRun.update(run.id, { status: 'failed', finished_at: new Date().toISOString(), error_message: error.message }); } catch {} }
    return Response.json({ error: error.message }, { status: 500 });
  }
});