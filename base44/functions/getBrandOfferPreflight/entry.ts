import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';
import { loadVerifiedBrandOfferPacket } from '../../shared/brandOfferWorkflow.mjs';

// Read-only admin preflight. Never creates, sends, uploads or publishes anything.
export default async function (req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { product_id: productId, variant } = await req.json().catch(() => ({}));
    if (!productId || !variant) return Response.json({ error: 'Vyberte produkt a přesnou variantu.' }, { status: 400 });
    const packet = await loadVerifiedBrandOfferPacket(base44, { productId, variant });
    return Response.json({ ok: true, ...packet });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const safeMessage = /Nesprávný účet|Chybí autorizace|Není ověřena identita|Google Sheets API HTTP|Chybí produkt|Produkt neexistuje|Neplatná odpověď/.test(message)
      ? message.slice(0, 250) : 'Podklady nabídky nebylo možné bezpečně ověřit.';
    return Response.json({ ok: false, error: safeMessage, ready_for_canva: false }, { status: 503 });
  }
}