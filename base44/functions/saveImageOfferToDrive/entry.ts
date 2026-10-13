import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { ensureOfferCaseFolders, uploadBytes } from '../../shared/offerDrive.ts';

// Uloží hotové PNG strany obrazové nabídky do složky případu na Mlžném disku a zaindexuje je jako OfferAsset.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { project_order_id, images } = await req.json();
    if (!project_order_id || !Array.isArray(images) || !images.length) return Response.json({ error: 'Chybí data' }, { status: 400 });
    const sr = base44.asServiceRole.entities;
    const order = await sr.ProjectOrder.get(project_order_id);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const folders = await ensureOfferCaseFolders(accessToken, { quoteNumber: order.quote_number, clientName: order.client_company || order.client_name, issuedAt: order.issued_at });
    const readBytes = async (img) => {
      if (!img.file_uri) return Uint8Array.from(atob(String(img.base64).replace(/^data:image\/png;base64,/, '')), c => c.charCodeAt(0));
      const { signed_url } = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({ file_uri: img.file_uri, expires_in: 600 });
      const res = await fetch(signed_url, { signal: AbortSignal.timeout(60000) });
      if (!res.ok) throw new Error('Stranu nabídky nelze načíst z úložiště.');
      return new Uint8Array(await res.arrayBuffer());
    };
    const saved = [];
    for (const img of images) {
      const bytes = await readBytes(img);
      const filename = `${order.quote_number}-${img.key}-obrazova-nabidka.png`;
      const up = await uploadBytes(accessToken, folders.offerFolderId, bytes, filename, 'image/png');
      const description = img.ai
        ? 'Strana obrazové nabídky s ilustrační AI vizualizací prostředí, schválenou po kontrole konstrukce. Neodesláno klientovi.'
        : 'Obrazová grafická nabídka (PNG) z originálních produktových podkladů bez AI překreslení konstrukce. Neodesláno klientovi.';
      await sr.OfferAsset.create({ inquiry_id: order.inquiry_id, inquiry_type: order.inquiry_type, project_order_id: order.id, file_url: up.url, file_name: filename, file_type: 'image/png', asset_type: 'presentation', title: `Obrazová nabídka / ${img.title}`, description, selected_for_offer: true, generated_by_ai: !!img.ai });
      saved.push({ key: img.key, title: img.title, url: up.url });
    }
    return Response.json({ ok: true, saved, folder_url: `https://drive.google.com/drive/folders/${folders.offerFolderId}` });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}