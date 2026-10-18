import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { dispatchNotification, buildDedupKey } from '../../shared/notificationQueue.ts';

const clean = (v: unknown, max = 2000) => String(v || '').trim().slice(0, max);
const escapeSlack = (v: unknown, max = 2000) =>
  clean(v, max).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string));

// Existující ověřený Slack kanál (z notifySlackNewInquiry)
const DEFAULT_SLACK_CHANNEL = 'C0BG53VBBV1'; // #all-mlidlacz

const EVENT_LABELS: Record<string, string> = {
  registration: 'Nová registrace klienta',
  inquiry_created: 'Nová poptávka',
  inquiry_status_change: 'Změna stavu poptávky',
  quote_sent: 'Cenová nabídka odeslána',
  offer_approved: 'Nabídka potvrzena klientem',
  offer_rejected: 'Nabídka odmítnuta',
  client_message: 'Zpráva od klienta',
  offer_viewed: 'Nabídka zobrazena klientem',
  extra_charge_response: 'Reakce na příplatek',
  extension_requested: 'Žádost o prodloužení platnosti',
  document_published: 'Dokument publikován klientovi',
};

const RECOMMENDED_STEPS: Record<string, string> = {
  registration: 'Ověřit profil klienta a zjistit, zda má konkrétní zájem o produkt. Poslat uvítací informace nebo nabídnout konzultaci.',
  inquiry_created: 'Zkontrolovat poptávku, ověřit technickou proveditelnost a připravit koncept nabídky.',
  quote_sent: 'Sledovat reakci klienta. Pokud nedojde k potvrzení do 3 dnů, navázat připomínkovým e-mailem.',
  offer_approved: 'Zahájit výrobní přípravu, potvrdit harmonogram a technické detaily s klientem.',
  offer_rejected: 'Zjistit důvod odmítnutí a nabídnout alternativní řešení nebo úpravu nabídky.',
  client_message: 'Odpovědět na dotaz klienta v portálu. Zkontrolovat, zda nevyžaduje technické posouzení.',
  offer_viewed: 'Klient si prohlédl nabídku. Zvážit proaktivní kontakt pro zjištění dotazů.',
  extra_charge_response: 'Zpracovat schválený příplatek do objednávky nebo reagovat na odmítnutí.',
  extension_requested: 'Aktualizovat platnost nabídky a informovat klienta o novém termínu.',
  inquiry_status_change: 'Zkontrolovat změnu stavu a případně navázat na klienta.',
  document_published: 'Zkontrolovat publikovaný dokument v detailu zakázky.',
};

const ADMIN_URLS: Record<string, string> = {
  document_published: 'https://mlzidla.cz/admin?tab=orders',
  offer_approved: 'https://mlzidla.cz/admin?tab=orders',
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
    }

    const body = await req.json().catch(() => ({}));
    const eventType = clean(body.event_type, 80);
    if (!eventType || !Object.prototype.hasOwnProperty.call(EVENT_LABELS, eventType)) {
      return Response.json({ error: 'invalid_event_type' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const clientName = escapeSlack(body.client_name, 120);
    const clientEmail = escapeSlack(body.client_email, 200);
    const quoteNumber = escapeSlack(body.quote_number, 60);
    const projectName = escapeSlack(body.project_name, 200);
    const totalPrice = Number(body.total_price) || 0;
    const adminUrl = ADMIN_URLS[eventType] || 'https://mlzidla.cz/admin?tab=poptavky';
    const message = escapeSlack(body.message, 1000);
    const reactionDeadline = escapeSlack(body.reaction_deadline, 60);
    const dryRun = Boolean(body.dry_run);

    const eventLabel = EVENT_LABELS[eventType];
    const recommendedStep = RECOMMENDED_STEPS[eventType] || 'Zkontrolovat událost v administraci.';

    // Čas v Europe/Prague
    const now = new Date();
    const pragueTime = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: 'Europe/Prague',
      day: 'numeric', month: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(now);

    // AI koncept doporučené odpovědi (pokud je dostupný)
    let aiDraft = '';
    try {
      const aiResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Jsi obchodní asistent MLŽIDLA.cz. Na základě této události navrhni krátký KONCEPT odpovědi klientovi (max 2 věty, česky, profesionálně). Nevymýšlej ceny, termíny ani smluvní závazky.\n\nUdálost: ${eventLabel}\nKlient: ${clientName} (${clientEmail})\nProjekt: ${projectName}\nNabídka: ${quoteNumber}\nZpráva: ${message}\n\nVrať pouze text konceptu, bez vysvětlení.`,
        response_json_schema: { type: 'object', properties: { draft: { type: 'string' } }, required: ['draft'] },
      });
      aiDraft = clean((aiResponse as any)?.draft, 500);
    } catch (_) {
      aiDraft = ''; // AI nedostupné — použijeme jen doporučený krok
    }

    // Sestav zprávu pro Slack
    const text = `:cloud: *${eventLabel}*\n` +
      `*Klient:* ${clientName || '—'}${clientEmail ? ` (${clientEmail})` : ''}\n` +
      `*Čas:* ${pragueTime} (Europe/Prague)\n` +
      (reactionDeadline ? `*Termín reakce:* ${reactionDeadline}\n` : '') +
      (projectName ? `*Projekt:* ${projectName}\n` : '') +
      (quoteNumber ? `*Nabídka:* ${quoteNumber}\n` : '') +
      (totalPrice > 0 ? `*Cena:* ${new Intl.NumberFormat('cs-CZ').format(totalPrice)} Kč bez DPH\n` : '') +
      (message ? `*Zpráva:* ${message.slice(0, 300)}\n` : '') +
      `*Admin:* <${adminUrl}|Otevřít administraci>\n` +
      (aiDraft ? `\n*CONCEPT odpovědi:* ${aiDraft}\n` : '') +
      `\n*Další krok:* ${recommendedStep}`;

    if (dryRun) {
      return Response.json({
        ok: true,
        dry_run: true,
        would_send: true,
        channel: DEFAULT_SLACK_CHANNEL,
        text,
        ai_draft: aiDraft,
        recommended_step: recommendedStep,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const dedupKey = buildDedupKey('admin_chat', `${eventType}:${clientEmail}`, clean(body.dedup_version || now.toISOString().slice(0, 13)), 'slack');

    const result = await dispatchNotification(base44, {
      dedupKey,
      eventType: 'admin_chat',
      channelType: 'slack',
      recipient: DEFAULT_SLACK_CHANNEL,
      entityId: quoteNumber || clientEmail,
      entityType: 'AdminNotification',
      subject: eventLabel,
      contentSummary: `${eventLabel} · ${clientName || clientEmail}`,
      sendFn: async () => {
        try {
          const { accessToken } = await base44.asServiceRole.connectors.getConnection('slackbot');
          const res = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              channel: DEFAULT_SLACK_CHANNEL,
              text,
              username: 'MLŽIDLA.cz Notifikace',
              icon_emoji: ':cloud:',
            }),
          });
          const result = await res.json();
          return { ok: Boolean(result.ok), error: result.ok ? undefined : result.error };
        } catch (error) {
          return { ok: false, error: error?.message || String(error) };
        }
      },
      metadata: JSON.stringify({ ai_draft: aiDraft, recommended_step: recommendedStep }),
    });

    return Response.json({ ok: true, ...result, ai_draft: aiDraft, recommended_step: recommendedStep }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error?.message || 'admin_notify_failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}