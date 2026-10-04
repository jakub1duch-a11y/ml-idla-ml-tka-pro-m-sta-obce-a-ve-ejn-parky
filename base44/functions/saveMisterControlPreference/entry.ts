import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const sessionToken = String(body.session_token || '');
    const deviceId = String(body.device_id || '');
    const prompt = String(body.prompt || '').trim().slice(0, 3000);
    if (!sessionToken || !deviceId || !prompt) return Response.json({ error: 'missing_fields' }, { status: 400 });

    const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
    const session = sessions?.find((item:any) => item.token === sessionToken);
    if (!session || new Date(session.expires_at).getTime() < Date.now()) return Response.json({ error: 'session_expired' }, { status: 401 });

    const device = await base44.asServiceRole.entities.MisterDevice.get(deviceId).catch(() => null);
    if (!device || String(device.client_email || '').toLowerCase() !== String(session.email || '').toLowerCase()) {
      return Response.json({ error: 'forbidden' }, { status: 403 });
    }

    // AI zde pouze převádí přání klienta do bezpečného návrhu. Bez samostatně
    // autorizovaného SUPLA napojení se žádná změna na fyzickém zařízení neprovede.
    let recommendation:any = null;
    try {
      const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Jsi technický asistent pro řízení venkovního mlžítka. Uživatel napsal: "${prompt}". Vrať stručný bezpečný návrh v češtině: kdy spouštět, kdy nespouštět, doporučené časové okno, teplotní práh a maximální denní dobu. Neuváděj neověřené technické limity zařízení. Výslovně napiš, že návrh je nutné potvrdit před synchronizací do SUPLA.`,
        response_json_schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            time_from: { type: 'string' },
            time_to: { type: 'string' },
            temperature_from_c: { type: 'number' },
            max_daily_minutes: { type: 'number' },
            safety_note: { type: 'string' }
          },
          required: ['summary','safety_note']
        }
      });
      recommendation = llm;
    } catch (_) {
      recommendation = { summary: 'Požadavek byl uložen. Návrh nastavení připraví technik před propojením se SUPLA.', safety_note: 'Bez potvrzení se na zařízení nic nemění.' };
    }

    const record = await base44.asServiceRole.entities.MisterControlPreference.create({
      device_id: device.id,
      project_order_id: device.project_order_id,
      client_email: session.email,
      mode: 'recommend_only',
      prompt,
      temperature_from_c: Number.isFinite(Number(recommendation?.temperature_from_c)) ? Number(recommendation.temperature_from_c) : undefined,
      time_from: recommendation?.time_from || '',
      time_to: recommendation?.time_to || '',
      max_daily_minutes: Number.isFinite(Number(recommendation?.max_daily_minutes)) ? Number(recommendation.max_daily_minutes) : undefined,
      status: device.supla_connection_status === 'connected' ? 'pending_device_sync' : 'saved',
      notes: `${recommendation?.summary || ''}\n${recommendation?.safety_note || ''}`.trim(),
    });

    return Response.json({ ok: true, preference: record, recommendation, device_sync_performed: false }, {
      headers: { 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' },
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'preference_failed' }, { status: 500 });
  }
});