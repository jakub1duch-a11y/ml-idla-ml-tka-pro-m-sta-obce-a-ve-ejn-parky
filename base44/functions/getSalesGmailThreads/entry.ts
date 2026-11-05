import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const MAILBOX = 'meduna@holmtec.cz';
const GMAIL = 'https://gmail.googleapis.com/gmail/v1/users/me';
const QUERY = '-in:trash -in:spam {label:"00 · MLŽIDLA.cz" label:"1_HT/MLŽIDLA.cz" label:Mlžítka mlzidla.cz mlžidla mlžítka mlžítko mlžení "mlžné brány" "mlžné sochy" "misting gates"}';
const ALLOWED_LABELS = new Set([
  'Label_131', // 00 · MLŽIDLA.cz
  'Label_7352671006992589160', // Mlžítka
  'Label_966051600634028946', // 1_HT/MLŽIDLA.cz
]);
const HEADERS = ['From', 'To', 'Subject', 'Date', 'Reply-To'];

const noCache = { 'Cache-Control': 'private, no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' };
function json(data, status = 200) {
  return Response.json(data, { status, headers: noCache });
}
function header(message, name) {
  const fields = message?.payload?.headers || [];
  return String(fields.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || '');
}
function emailAddress(value) {
  const text = String(value || '');
  const match = text.match(/<([^<> ]+@[^<> ]+)>/);
  return (match?.[1] || text.match(/[\w.+%-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] || '').toLowerCase();
}
async function getGoogle(url, accessToken) {
  const res = await fetch(url, {
    headers: { Authorization: 'Bearer ' + accessToken, Accept: 'application/json' },
    signal: AbortSignal.timeout(12500),
  });
  if (!res.ok) {
    const status = res.status;
    const error = new Error(status === 403
      ? 'Gmail konektor nemá oprávnění číst zprávy. Je potřeba povolit čtení Gmailu v Base44.'
      : status === 401
        ? 'Gmail připojení v Base44 vyžaduje nové přihlášení.'
        : 'Gmail API vrátilo chybu ' + status + '.');
    error.httpStatus = status;
    throw error;
  }
  return res.json();
}
function normalizeThread(thread) {
  const messages = (thread?.messages || []).slice().sort((a, b) =>
    Number(a.internalDate || 0) - Number(b.internalDate || 0));
  if (!messages.length) return null;
  const last = messages[messages.length - 1];
  const labels = new Set(messages.flatMap((m) => m.labelIds || []));
  const hasDraft = labels.has('DRAFT');
  const unread = labels.has('UNREAD');
  const lastIsDraft = (last.labelIds || []).includes('DRAFT');
  const from = header(last, 'From');
  const senderIsOurs = emailAddress(from) === MAILBOX || (last.labelIds || []).includes('SENT');
  const lastDirection = lastIsDraft ? 'draft' : senderIsOurs ? 'outgoing' : 'incoming';
  const contactMessage = messages.slice().reverse().find((msg) => {
    const address = emailAddress(header(msg, 'From'));
    return address && address !== MAILBOX;
  });
  const contact = contactMessage ? header(contactMessage, 'From') : header(last, 'To');
  const subject = header(last, 'Subject') || header(messages[0], 'Subject') || '(bez předmětu)';
  const lastMillis = Number(last.internalDate || 0);
  return {
    id: String(thread.id || ''),
    subject: subject.slice(0, 280),
    contact: String(contact || '').slice(0, 220),
    snippet: String(last.snippet || thread.snippet || '').slice(0, 310),
    updated_at: lastMillis ? new Date(lastMillis).toISOString() : null,
    message_count: messages.length,
    unread,
    has_draft: hasDraft,
    last_direction: lastDirection,
    label_match: [...labels].some((label) => ALLOWED_LABELS.has(label)),
    in_inbox: labels.has('INBOX'),
    url: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/' + encodeURIComponent(String(thread.id || '')),
  };
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return json({ error: 'Přihlášení je vyžadováno.' }, 401);
    if (user.role !== 'admin') return json({ error: 'Přístup je povolen jen administrátorům.' }, 403);
    if (req.method !== 'POST') return json({ error: 'Nepodporovaná metoda.' }, 405);
    const input = await req.json().catch(() => ({}));
    const pageToken = String(input.page_token || '');
    if (pageToken.length > 1200 || (pageToken && !/^[A-Za-z0-9._~+\/=-]+$/.test(pageToken))) {
      return json({ error: 'Neplatný stránkovací token.' }, 400);
    }
    let accessToken = '';
    try {
      const connection = await base44.asServiceRole.connectors.getConnection('gmail');
      accessToken = connection?.accessToken || '';
    } catch {
      return json({ connected: false, mailbox: MAILBOX, error: 'Gmail není připojený k Base44.' }, 503);
    }
    if (!accessToken) return json({ connected: false, mailbox: MAILBOX, error: 'Gmail připojení nevrátilo platnou autorizaci.' }, 503);

    const profile = await getGoogle(GMAIL + '/profile', accessToken);
    if (String(profile?.emailAddress || '').toLowerCase() !== MAILBOX) {
      return json({ connected: false, mailbox: MAILBOX,
        error: 'V Base44 je připojen jiný účet Gmail než meduna@holmtec.cz. Žádné jeho zprávy nebudou zpřístupněny.' }, 409);
    }
    const url = new URL(GMAIL + '/threads');
    url.searchParams.set('maxResults', '45');
    url.searchParams.set('q', QUERY);
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const list = await getGoogle(url.href, accessToken);
    const ids = (list.threads || []).map((item) => String(item.id || '')).filter((id) => /^[0-9a-f]+$/i.test(id));
    const threads = [];
    // Omezit paralelní požadavky kvůli limitům Gmail API.
    let offset = 0;
    const workers = Array.from({ length: 6 }, async () => {
      while (offset < ids.length) {
        const index = offset++;
        const id = ids[index];
        const detail = new URL(GMAIL + '/threads/' + id);
        detail.searchParams.set('format', 'metadata');
        for (const h of HEADERS) detail.searchParams.append('metadataHeaders', h);
        try {
          const result = await getGoogle(detail.href, accessToken);
          const row = normalizeThread(result);
          if (row) threads.push(row);
        } catch (error) {
          // Jeden smazaný/změněný thread nesmí znepřístupnit celý přehled.
          if (error.httpStatus === 403 || error.httpStatus === 401) throw error;
        }
      }
    });
    await Promise.all(workers);
    threads.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')));
    return json({
      connected: true, mailbox: MAILBOX,
      threads,
      next_page_token: list.nextPageToken || '',
      result_size_estimate: Number(list.resultSizeEstimate || 0),
      checked_at: new Date().toISOString(),
      status_note: 'Stav čekající odpovědi je odvozen z poslední zprávy; Gmail nemá samostatný stav uzavřené obchodní konverzace.',
    });
  } catch (error) {
    return json({ connected: false, mailbox: MAILBOX,
      error: error?.message || 'E-mailové konverzace se nepodařilo načíst.' }, 503);
  }
};
