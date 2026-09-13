import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// AUTO-SEND SAFETY GUARD
// Kontakt/poptávka se po přijetí pouze eviduje a vyhodnotí.
// Zákaznická odpověď se nikdy neposílá automaticky; případná reakce vzniká pouze jako Gmail koncept.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    return Response.json({
      ok: true,
      mode: 'auto_send_disabled',
      inquiry_id: body?.inquiry_id || body?.event?.entity_id || '',
      message: 'Automatické odpovědi z kontaktního formuláře jsou deaktivované. Komunikace se připravuje pouze jako koncept.',
    });
  } catch (error) {
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
});
