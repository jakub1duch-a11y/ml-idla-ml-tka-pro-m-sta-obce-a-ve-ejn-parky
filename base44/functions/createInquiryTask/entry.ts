import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const TASK_LIST_TITLE = 'HolmTec — Poptávky';

async function getOrCreateTaskList(accessToken) {
  const res = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  const existing = (data.items || []).find(l => l.title === TASK_LIST_TITLE);
  if (existing) return existing.id;

  const created = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: TASK_LIST_TITLE }),
  });
  const list = await created.json();
  return list.id;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { data } = body;

    if (!data) return Response.json({ error: 'No data provided' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googletasks');

    const taskListId = await getOrCreateTaskList(accessToken);

    // Due date: 2 working days from now
    const due = new Date();
    due.setDate(due.getDate() + 2);
    due.setHours(9, 0, 0, 0);

    const scopeLabels = {
      urban: 'Městský projekt',
      event: 'Event / festival',
      private: 'Soukromá zahrada',
      industrial: 'Průmyslový provoz',
    };

    const scopeLabel = scopeLabels[data.project_scope] || data.project_scope || 'Nezadáno';

    const taskTitle = `📩 Follow-up: ${data.name} — ${scopeLabel}`;
    const taskNotes = [
      `Kontakt: ${data.email || '—'}`,
      `Typ projektu: ${scopeLabel}`,
      `Zpráva: ${(data.message || '').slice(0, 300)}`,
      '',
      `Vytvořeno: ${new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' })}`,
    ].join('\n');

    const taskRes = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: taskTitle,
        notes: taskNotes,
        due: due.toISOString(),
      }),
    });

    if (!taskRes.ok) {
      const err = await taskRes.json();
      return Response.json({ error: err }, { status: 500 });
    }

    const task = await taskRes.json();
    return Response.json({ ok: true, taskId: task.id, taskTitle });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});