import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me().catch(() => null);

    // Bezpečnostní pojistka: historický bootstrap už nesmí povyšovat běžný účet.
    // Funkce zůstává kvůli kompatibilitě starší administrace, ale je pouze
    // diagnostická pro již existující administrátory.
    if (!me || me.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    return Response.json({ ok: true, already_admin: true, user: me }, {
      headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
