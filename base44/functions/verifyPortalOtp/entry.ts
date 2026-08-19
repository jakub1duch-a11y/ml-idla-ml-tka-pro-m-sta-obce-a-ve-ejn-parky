import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const normalizeQuote = (value: unknown) => String(value || '').trim().toUpperCase();
const normalizeEmail = (value: unknown) => String(value || '').trim().toLowerCase();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const quoteNumber = normalizeQuote(body.quote_number);
    let email = normalizeEmail(body.email);
    const otp = String(body.otp || '').trim();

    if ((!email && !quoteNumber) || !otp) {
      return Response.json({ error: 'Email/quote number and code are required' }, { status: 400 });
    }

    let requestedProject = null;
    if (quoteNumber) {
      const matches = await base44.asServiceRole.entities.ProjectOrder.filter({ quote_number: quoteNumber });
      requestedProject = matches?.[0] || null;
      if (!requestedProject?.client_email) return Response.json({ error: 'invalid_or_expired' }, { status: 401 });
      email = normalizeEmail(requestedProject.client_email);
    }

    const records = await base44.asServiceRole.entities.PortalOtp.filter({ email }, '-created_date', 1);
    const record = records[0];

    if (!record || new Date(record.expires_at).getTime() < Date.now()) {
      if (record) await base44.asServiceRole.entities.PortalOtp.delete(record.id);
      return Response.json({ error: 'invalid_or_expired' }, { status: 401 });
    }

    if ((record.attempts || 0) >= 5) {
      await base44.asServiceRole.entities.PortalOtp.delete(record.id);
      return Response.json({ error: 'invalid_or_expired' }, { status: 401 });
    }

    if (record.otp_code !== otp) {
      await base44.asServiceRole.entities.PortalOtp.update(record.id, { attempts: (record.attempts || 0) + 1 });
      return Response.json({ error: 'invalid_or_expired' }, { status: 401 });
    }

    await base44.asServiceRole.entities.PortalOtp.delete(record.id);

    const contactInquiries = await base44.asServiceRole.entities.ContactInquiry.filter({ email });
    const poptavky = await base44.asServiceRole.entities.Poptavka.filter({ email }).catch(() => []);
    const rawProjects = await base44.asServiceRole.entities.ProjectOrder.filter({ client_email: email });

    const projects = await Promise.all((rawProjects || []).map(async (project) => {
      const assets = await base44.asServiceRole.entities.OfferAsset.filter({ project_order_id: project.id }).catch(() => []);
      const selectedAssets = (assets || [])
        .filter((asset) => asset.selected_for_offer || ['generated_visualization', 'quote_pdf', 'presentation_pdf', 'presentation'].includes(asset.asset_type))
        .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
      const visualizations = selectedAssets.filter((asset) => asset.asset_type === 'generated_visualization');
      const documents = selectedAssets.filter((asset) => asset.asset_type !== 'generated_visualization');
      const offerMessages = await base44.asServiceRole.entities.OfferMessage.filter({ project_order_id: project.id }, 'created_date', 100).catch(() => []);
      return {
        ...project,
        offer_assets: selectedAssets,
        visualizations,
        documents,
        offer_messages: offerMessages || [],
        primary_visualization_url: visualizations[0]?.file_url || '',
      };
    }));

    const existingSessions = await base44.asServiceRole.entities.PortalSession.filter({ email });
    for (const session of existingSessions) {
      await base44.asServiceRole.entities.PortalSession.delete(session.id);
    }
    const sessionToken = crypto.randomUUID();
    const sessionExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    await base44.asServiceRole.entities.PortalSession.create({ email, token: sessionToken, expires_at: sessionExpiresAt });

    return Response.json({
      verified: true,
      email,
      access_mode: quoteNumber ? 'quote' : 'email',
      requested_quote: quoteNumber,
      inquiries: [...(contactInquiries || []), ...(poptavky || [])],
      projects,
      session_token: sessionToken,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});