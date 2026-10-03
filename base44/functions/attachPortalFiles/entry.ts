import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { clientAssetView, normalizePortalEmail } from '../../shared/clientPortal.ts';

const MAX_FILES = 8;
const MAX_NAME = 240;
const MAX_URL = 2000;
const ALLOWED_SCHEMES = ['https://'];

const isPhoto = (name: string, type: string) =>
  type.startsWith('image/') || /\.(avif|gif|heic|jpeg|jpg|png|webp)$/i.test(name);

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const sessionToken = String(body.session_token || '');
    const projectId = String(body.project_id || '');
    let inquiryId = String(body.inquiry_id || '');
    const files = Array.isArray(body.files) ? body.files.slice(0, MAX_FILES) : [];

    if (!sessionToken || (!projectId && !inquiryId) || files.length === 0) {
      return Response.json({ error: 'invalid_request' }, { status: 400 });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionToken)) {
      return Response.json({ error: 'invalid_or_expired_session' }, { status: 401 });
    }

    const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
    const session = sessions.find((item) => item.token === sessionToken);
    if (!session || new Date(session.expires_at).getTime() < Date.now()) {
      return Response.json({ error: 'invalid_or_expired_session' }, { status: 401 });
    }
    const sessionEmail = normalizePortalEmail(session.email);

    let project = null;
    let inquiry = null;
    let inquiryType = '';

    if (projectId) {
      project = await base44.asServiceRole.entities.ProjectOrder.get(projectId).catch(() => null);
      if (!project) return Response.json({ error: 'not_found' }, { status: 404 });
      if (normalizePortalEmail(project.client_email) !== sessionEmail) {
        return Response.json({ error: 'forbidden' }, { status: 403 });
      }
      inquiryId = String(project.inquiry_id || inquiryId || project.id);
      inquiryType = String(project.inquiry_type || 'poptavka');
    } else {
      inquiry = await base44.asServiceRole.entities.Poptavka.get(inquiryId).catch(() => null);
      if (inquiry) {
        inquiryType = 'poptavka';
        if (normalizePortalEmail(inquiry.email) !== sessionEmail) return Response.json({ error: 'forbidden' }, { status: 403 });
      } else {
        inquiry = await base44.asServiceRole.entities.ContactInquiry.get(inquiryId).catch(() => null);
        inquiryType = 'contact';
        if (!inquiry) return Response.json({ error: 'not_found' }, { status: 404 });
        if (normalizePortalEmail(inquiry.email) !== sessionEmail) return Response.json({ error: 'forbidden' }, { status: 403 });
      }
    }

    const safeFiles = files.map((file: any) => {
      const fileName = String(file?.name || '').trim().slice(0, MAX_NAME);
      const fileUrl = String(file?.url || '').trim().slice(0, MAX_URL);
      const fileType = String(file?.type || '').trim().slice(0, 120);
      if (!fileName || !fileUrl || !ALLOWED_SCHEMES.some((scheme) => fileUrl.startsWith(scheme))) return null;
      return { fileName, fileUrl, fileType };
    }).filter(Boolean);

    if (!safeFiles.length) return Response.json({ error: 'invalid_files' }, { status: 400 });

    const created = [];
    for (const file of safeFiles) {
      const asset = await base44.asServiceRole.entities.OfferAsset.create({
        inquiry_id: inquiryId,
        inquiry_type: inquiryType === 'contact' ? 'contact' : 'poptavka',
        project_order_id: project?.id || '',
        file_url: file.fileUrl,
        file_name: file.fileName,
        file_type: file.fileType,
        asset_type: isPhoto(file.fileName, file.fileType) ? 'source_photo' : 'source_document',
        title: file.fileName,
        description: 'Podklad nahraný klientem v klientské sekci.',
        selected_for_offer: false,
        generated_by_ai: false,
        sort_order: 0,
      });
      created.push(clientAssetView(asset));
    }

    return Response.json({ ok: true, assets: created }, {
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      },
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'attach_failed' }, { status: 500 });
  }
}
