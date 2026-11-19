import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { assertBusinessAccount, getVerifiedGoogleAccount } from '../../shared/businessWorkflowGuard.mjs';

// Propojovací vrstva přebírá ověřené kontakty pouze z hlavní evidence.
// Nepracuje s duplicitními segmentovými záložkami.
const SPREADSHEET_ID = '1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE';
const MAIN_SHEET = 'KONTAKTY – VŠE';
const OPPORTUNITY_SHEET = 'CRM – Příležitosti';
const OFFERS_SHEET = 'CRM – Cenové nabídky';
const HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const clean = (v: unknown, len = 160) => String(v ?? '').trim().slice(0, len);
const emailKey = (v: unknown) => clean(v, 254).toLowerCase();
const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

async function sheetRows(token: string, tab: string, range: string): Promise<unknown[][]> {
  const a1 = `'${tab.replace(/'/g, "''")}'!${range}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(a1)}`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`sheets_http_${response.status}`);
  const payload = await response.json();
  return Array.isArray(payload.values) ? payload.values : [];
}

function statusFromSheet(value: unknown): string {
  const text = clean(value, 150).toLowerCase();
  if (/neosloven|nový|nova/.test(text)) return 'new';
  if (/odpově|odpoved|reag|jednání|jednani/.test(text)) return 'replied';
  if (/oslov|odeslán|odeslan/.test(text)) return 'contacted';
  if (/odmítn|odmitn|neoslovovat/.test(text)) return 'declined';
  return 'new';
}

export default async function(req: Request): Promise<Response> {
  const base44 = createClientFromRequest(req);
  const caller = await base44.auth.me().catch(() => null);
  if (!caller) return Response.json({ error: 'unauthorized' }, { status: 401, headers: HEADERS });
  if (caller.role !== 'admin') return Response.json({ error: 'forbidden' }, { status: 403, headers: HEADERS });
  if (req.method !== 'POST') return Response.json({ error: 'method_not_allowed' }, { status: 405, headers: HEADERS });

  const input = await req.json().catch(() => ({}));
  const apply = input?.apply === true;
  const limit = Math.max(1, Math.min(100, Math.floor(Number(input?.limit) || 50)));

  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const account = await getVerifiedGoogleAccount(accessToken, 'googlesheets');
    assertBusinessAccount(account, 'googlesheets');
    const [contactRows, opportunityRows, offerRows] = await Promise.all([
      sheetRows(accessToken, MAIN_SHEET, 'A1:J2000'),
      sheetRows(accessToken, OPPORTUNITY_SHEET, 'A1:R1000'),
      sheetRows(accessToken, OFFERS_SHEET, 'A1:S1000'),
    ]);
    if (!contactRows.length || String(contactRows[0]?.[5] || '').toLowerCase().indexOf('mail') < 0) {
      return Response.json({ error: 'unexpected_sheet_columns' }, { status: 409, headers: HEADERS });
    }

    const candidates = new Map<string, any>();
    const duplicateEmails = new Set<string>();
    let rawRows = 0;
    let badEmailRows = 0;
    for (let index = 1; index < contactRows.length; index += 1) {
      const row = contactRows[index] || [];
      if (!(row as unknown[]).some((v) => clean(v, 1))) continue;
      rawRows += 1;
      const email = emailKey(row[5]);
      if (!validEmail(email)) { badEmailRows += 1; continue; }
      if (candidates.has(email)) { duplicateEmails.add(email); continue; }
      candidates.set(email, {
        email,
        name: clean(row[1]),
        organization: clean(row[0]),
        role: clean(row[2]),
        sheet_name: MAIN_SHEET,
        sheet_row: index + 1,
        status: statusFromSheet(row[8]),
      });
    }

    const sr = base44.asServiceRole.entities;
    const [current, inquiries] = await Promise.all([
      sr.CrmContact.list('-updated_date', 5000),
      sr.Poptavka.list('-created_date', 500),
    ]);
    const crmEmails = new Set((Array.isArray(current) ? current : []).map((c: any) => emailKey(c.email)).filter(validEmail));
    const safeNew = [...candidates.values()].filter((row) => !duplicateEmails.has(row.email) && !crmEmails.has(row.email));
    const inquiriesList = (Array.isArray(inquiries) ? inquiries : []);
    let imported = 0;
    const failures: number[] = [];
    if (apply) {
      for (const contact of safeNew.slice(0, limit)) {
        try {
          await sr.CrmContact.create({ ...contact, source: 'google_sheet', action_required: false });
          imported += 1;
        } catch {
          failures.push(Number(contact.sheet_row));
        }
      }
    }

    // Never write to the source Google Sheet or send emails from reconciliation.
    // Sheet contacts and inquiry cases are distinct records; a repeated email can have multiple inquiries.
    const inquiryMissing = inquiriesList.filter((i: any) =>
      validEmail(emailKey(i.email)) && !candidates.has(emailKey(i.email))
    );
    const output = {
      ok: true,
      applied: apply,
      sheet_id: SPREADSHEET_ID,
      account_verified: true,
      contacts: {
        rows: rawRows,
        unique_emails: candidates.size,
        duplicate_emails: duplicateEmails.size,
        invalid_or_blank_email_rows: badEmailRows,
        base44_existing: (Array.isArray(current) ? current : []).length,
        matched_existing: [...candidates.keys()].filter(e => crmEmails.has(e)).length,
        new_unambiguous: safeNew.length,
        imported,
        import_failed: failures.length,
        remaining_to_import: Math.max(0, safeNew.length - imported),
      },
      opportunities: Math.max(0, opportunityRows.length - 1),
      offers: Math.max(0, offerRows.length - 1),
      inquiries: {
        total: inquiriesList.length,
        missing_from_contact_sheet: inquiryMissing.length,
        // Only a compact administrative summary. No customer messages or attachment URLs.
        latest: inquiriesList.slice(0, 12).map((i: any) => ({
          id: clean(i.id, 50),
          name: clean(i.jmeno, 120),
          email: emailKey(i.email),
          product: clean(i.produkt, 140),
          status: clean(i.status, 30),
          offer_status: clean(i.offer_status, 40),
          in_sheet: candidates.has(emailKey(i.email)),
          created_date: clean(i.created_date, 40),
        })),
      },
      duplicate_email_rows: [...duplicateEmails].slice(0, 12).map((email) => ({
        email, source: MAIN_SHEET
      })),
      no_customer_emails_sent: true,
      at: new Date().toISOString(),
    };
    return Response.json(output, { headers: HEADERS });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const safeError = /Nesprávný účet|Není ověřena identita|Chybí autorizace|OAuth API: HTTP|sheets_http_|unexpected_sheet_columns/.test(message)
      ? message.slice(0, 220) : 'business_sync_unavailable';
    return Response.json({ error: safeError }, { status: 502, headers: HEADERS });
  }
}
