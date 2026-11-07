import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { ensureOfferCaseFolders, uploadBytes } from '../../shared/offerDrive.ts';

const MAX_BYTES = 18_500_000;
const KEYS: Record<string,{name:string;ext:string;mimes:string[]}> = {
  offer: { name:'CANVA_OBRAZOVA_NABIDKA', ext:'pdf', mimes:['application/pdf'] },
  supla: { name:'CANVA_SUPLA_PRODUKTOVY_LIST', ext:'pdf', mimes:['application/pdf'] },
  preview: { name:'CANVA_NAHLED', ext:'png', mimes:['image/png','image/jpeg','image/webp'] },
};
const isExpected = (bytes: Uint8Array, mime: string) => {
  if (mime==='application/pdf') return bytes[0]===37&&bytes[1]===80&&bytes[2]===68&&bytes[3]===70;
  if (mime==='image/png') return bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
  if (mime==='image/jpeg') return bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
  if (mime==='image/webp') return String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
  return false;
};

Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const assetKey = String(body.asset_key||'');
    const variant = KEYS[assetKey];
    const projectOrderId = String(body.project_order_id||'');
    if (!variant || !projectOrderId) return Response.json({ error: 'Neplatný typ souboru nebo zakázka.' }, { status: 400 });

    const order = await base44.asServiceRole.entities.ProjectOrder.get(projectOrderId).catch(() => null);
    if (!order?.id || !order.inquiry_id) return Response.json({ error: 'Zakázka neexistuje.' }, { status: 404 });
    const mime = String(body.mime_type||'').toLowerCase().split(';')[0];
    if (!variant.mimes.includes(mime)) return Response.json({ error: 'Nepovolený formát souboru Canva.' }, { status: 415 });

    let url = String(body.file_url||'');
    if (body.file_uri) {
      const signed = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
        file_uri: String(body.file_uri), expires_in: 600,
      });
      url = String(signed?.signed_url||'');
    } else {
      // Nesmí přijmout libovolnou externí URL (ochrana proti SSRF).
      const parsed = new URL(url);
      const expectedPath = '/api/apps/6a3ee88c10959cd3588c4d68/files/';
      if (parsed.protocol!=='https:' || parsed.hostname!=='base44.app' || !parsed.pathname.startsWith(expectedPath)) {
        return Response.json({ error: 'Soubor musí pocházet z úložiště aplikace MLŽIDLA.cz.' }, { status: 400 });
      }
    }

    const downloaded = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!downloaded.ok) throw new Error('Canva export uložený v Base44 nelze stáhnout.');
    const bytes = new Uint8Array(await downloaded.arrayBuffer());
    if (!bytes.length || bytes.length>MAX_BYTES || !isExpected(bytes,mime)) {
      return Response.json({ error: 'Obsah Canva souboru je neplatný nebo přesahuje 18,5 MB.' }, { status: 422 });
    }
    const ext = mime==='image/jpeg'?'jpg':mime==='image/webp'?'webp':variant.ext;
    const quote = String(order.quote_number||('P-'+order.id.slice(0,8))).replace(/[^a-zA-Z0-9_-]/g,'_');
    const fileName = quote+'-'+variant.name+'.'+ext;
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const folders = await ensureOfferCaseFolders(accessToken, {
      quoteNumber: order.quote_number || quote,
      clientName: order.client_company || order.client_name || '',
      issuedAt: order.issued_at || undefined,
    });
    const stored = await uploadBytes(accessToken, folders.offerFolderId, bytes, fileName, mime);
    await base44.asServiceRole.entities.ProjectOrder.update(order.id, {
      drive_case_folder_id: folders.caseFolderId,
      drive_case_folder_url: 'https://drive.google.com/drive/folders/'+folders.caseFolderId,
      canva_sync_status: 'assets_incomplete',
    });
    return Response.json({ ok:true, project_order_id:order.id, inquiry_id:order.inquiry_id, quote_number:quote,
      asset_key:assetKey, file_url:stored.url, file_name:fileName, file_type:mime,
      drive_case_folder_url:'https://drive.google.com/drive/folders/'+folders.caseFolderId,
      note:'Canva export uložen na Mlžném disku, do složky 02_NABIDKA konkrétní zakázky.' },
    {headers:{'Cache-Control':'no-store'}});
  } catch (e) {
    return Response.json({ error:String((e as Error)?.message||e) }, { status:500 });
  }
});
