import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// AUTO-SEND SAFETY GUARD
// Tato starší notifikační cesta nesmí odesílat automatické odpovědi.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    return Response.json({
      ok: true,
      mode: 'auto_send_disabled',
      message: 'Automatické odesílání bylo deaktivováno. Příchozí komunikace se pouze vyhodnocuje a odpovědi se připravují jako koncepty.',
      received: Boolean(body),
    });
  } catch (error) {
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
});
