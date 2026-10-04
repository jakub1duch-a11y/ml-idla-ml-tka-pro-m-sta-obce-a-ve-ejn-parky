import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// AUTO-SEND SAFETY GUARD
// Příchozí poptávky se již automaticky neodesílají e-mailem zákazníkovi ani týmu.
// Zpracování pokračuje přes workflow autoDraftOfferFromInquiry, které připraví obchodní návrh a Gmail koncept.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const inquiryId = body?.event?.entity_id || body?.data?.id || body?.inquiry_id || '';

    return Response.json({
      ok: true,
      mode: 'auto_send_disabled',
      inquiry_id: inquiryId,
      message: 'Automatické Gmail odpovědi jsou deaktivované. Poptávka se pouze vyhodnotí a nabídka se připraví jako koncept.',
    });
  } catch (error) {
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
});
