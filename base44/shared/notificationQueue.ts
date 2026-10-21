// Sdílený modul pro deduplikaci, frontu a bezpečné odesílání notifikací
// Zajišťuje: dedup klíč na událost/verzi/příjemce, pending/sent/failed, retry, ochranu proti smyčce

interface DispatchOptions {
  dedupKey: string;
  eventType: string;
  channelType: string;
  recipient: string;
  entityId?: string;
  entityType?: string;
  subject: string;
  contentSummary: string;
  sendFn: () => Promise<{ ok: boolean; error?: string }>;
  metadata?: string;
}

export async function dispatchNotification(base44: any, opts: DispatchOptions): Promise<{ status: string; error?: string; logId?: string }> {
  // 1. Dedup check — pokud už bylo úspěšně odesláno, přeskoč
  const existing = await base44.asServiceRole.entities.NotificationLog.filter(
    { dedup_key: opts.dedupKey },
    { limit: 1 }
  ).catch(() => ({ items: [] }));

  const existingLog = existing?.items?.[0];
  if (existingLog && existingLog.status === 'sent') {
    return { status: 'deduplicated', logId: existingLog.id };
  }

  // 2. Vytvoř nebo aktualizuj log jako pending
  let log = existingLog;
  if (!log) {
    log = await base44.asServiceRole.entities.NotificationLog.create({
      dedup_key: opts.dedupKey,
      event_type: opts.eventType,
      channel_type: opts.channelType,
      recipient: opts.recipient,
      entity_id: opts.entityId || '',
      entity_type: opts.entityType || '',
      status: 'pending',
      subject: opts.subject.slice(0, 300),
      content_summary: opts.contentSummary.slice(0, 500),
      attempts: 0,
      metadata: opts.metadata || '',
    });
  }

  // 3. Pokus o odeslání
  const attempts = (log.attempts || 0) + 1;
  try {
    const result = await opts.sendFn();
    if (result.ok) {
      await base44.asServiceRole.entities.NotificationLog.update(log.id, {
        status: 'sent',
        sent_at: new Date().toISOString(),
        attempts,
        error_message: '',
      });
      return { status: 'sent', logId: log.id };
    }
    // Neúspěšné odeslání — uložit chybu, označit jako failed (retry proběhne při další události)
    await base44.asServiceRole.entities.NotificationLog.update(log.id, {
      status: 'failed',
      attempts,
      error_message: String(result.error || 'send_failed').slice(0, 500),
    });
    return { status: 'failed', error: result.error, logId: log.id };
  } catch (error) {
    await base44.asServiceRole.entities.NotificationLog.update(log.id, {
      status: 'failed',
      attempts,
      error_message: String(error?.message || error).slice(0, 500),
    });
    return { status: 'failed', error: error?.message, logId: log.id };
  }
}

// Pomocná funkce pro sestavení dedup klíče
export function buildDedupKey(eventType: string, entityId: string, version: string, recipient: string): string {
  return `${eventType}:${entityId}:${version}:${recipient}`.toLowerCase();
}

// Zjištění, zda už byla pro daný projekt odeslána notifikace pro daný stav
export async function getLastStatusNotification(base44: any, projectId: string, status: string): Promise<any | null> {
  const dedupKey = buildDedupKey('status_change', projectId, status, 'client');
  const existing = await base44.asServiceRole.entities.NotificationLog.filter(
    { dedup_key: dedupKey },
    { limit: 1 }
  ).catch(() => ({ items: [] }));
  return existing?.items?.[0] || null;
}