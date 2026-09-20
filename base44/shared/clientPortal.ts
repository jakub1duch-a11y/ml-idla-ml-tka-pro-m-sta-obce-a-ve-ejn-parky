export const normalizePortalEmail = (value: unknown) => String(value || '').trim().toLowerCase();

export function clientProjectView(project: any) {
  if (!project) return null;
  const {
    id,
    created_date,
    updated_date,
    project_name,
    client_name,
    client_email,
    client_phone,
    client_company,
    description,
    product_id,
    product_slug,
    product_name,
    quote_number,
    quote_pdf_url,
    inquiry_pdf_url,
    order_confirmation_pdf_url,
    presentation_url,
    presentation_pdf_url,
    presentation_variant,
    issued_at,
    valid_until,
    ar_url,
    smart_control_included,
    status,
    approved_at,
    validity_extension_requested_at,
    validity_extension_note,
    estimated_order_date,
    estimated_order_window,
    customer_message,
    last_customer_action_at,
    production_start_date,
    completion_date,
    delivery_method,
    delivery_location,
    total_price,
    special_requirements,
    shared_token,
  } = project;

  return {
    id,
    created_date,
    updated_date,
    project_name,
    client_name,
    client_email,
    client_phone,
    client_company,
    description,
    product_id,
    product_slug,
    product_name,
    quote_number,
    quote_pdf_url,
    inquiry_pdf_url,
    order_confirmation_pdf_url,
    presentation_url,
    presentation_pdf_url,
    presentation_variant,
    issued_at,
    valid_until,
    ar_url,
    smart_control_included,
    status,
    approved_at,
    validity_extension_requested_at,
    validity_extension_note,
    estimated_order_date,
    estimated_order_window,
    customer_message,
    last_customer_action_at,
    production_start_date,
    completion_date,
    delivery_method,
    delivery_location,
    total_price,
    special_requirements,
    shared_token,
  };
}

export function clientAssetView(asset: any) {
  if (!asset) return null;
  const { id, created_date, file_url, file_name, file_type, asset_type, title, sort_order } = asset;
  return { id, created_date, file_url, file_name, file_type, asset_type, title, sort_order };
}

export function clientMessageView(message: any) {
  if (!message || message.channel === 'admin') return null;
  const { id, created_date, quote_number, sender_type, sender_name, message: text, category, channel } = message;
  return { id, created_date, quote_number, sender_type, sender_name, message: text, category, channel };
}

export function clientChargeView(charge: any) {
  if (!charge || ['draft', 'cancelled'].includes(charge.status)) return null;
  const {
    id,
    created_date,
    quote_number,
    title,
    description,
    quantity,
    unit,
    unit_price_ex_vat,
    total_price_ex_vat,
    vat_rate,
    status,
    requires_customer_approval,
    customer_note,
    customer_approved_at,
    customer_declined_at,
    billed_at,
  } = charge;
  return {
    id,
    created_date,
    quote_number,
    title,
    description,
    quantity,
    unit,
    unit_price_ex_vat,
    total_price_ex_vat,
    vat_rate,
    status,
    requires_customer_approval,
    customer_note,
    customer_approved_at,
    customer_declined_at,
    billed_at,
  };
}

export function clientInquiryView(inquiry: any) {
  if (!inquiry) return null;
  const {
    id,
    created_date,
    updated_date,
    status,
    email,
    jmeno,
    name,
    firma,
    telefon,
    phone,
    produkt,
    product_id,
    project_scope,
    zprava,
    message,
    description,
    request_type,
    custom_shape,
    installation_location,
    installation_option,
    needs_installation_quote,
    requested_visualization,
    service_type,
    attachment_names,
    attachment_urls,
    quantity,
    surface_type,
    water_connection_state,
  } = inquiry;
  return {
    id,
    created_date,
    updated_date,
    status,
    email,
    jmeno,
    name,
    firma,
    telefon,
    phone,
    produkt,
    product_id,
    project_scope,
    zprava,
    message,
    description,
    request_type,
    custom_shape,
    installation_location,
    installation_option,
    needs_installation_quote,
    requested_visualization,
    service_type,
    attachment_names,
    attachment_urls,
    quantity,
    surface_type,
    water_connection_state,
  };
}

export async function loadClientPortalData(base44: any, emailInput: string) {
  const email = normalizePortalEmail(emailInput);
  const [contactInquiries, poptavky, rawProjects] = await Promise.all([
    base44.asServiceRole.entities.ContactInquiry.filter({ email }).catch(() => []),
    base44.asServiceRole.entities.Poptavka.filter({ email }).catch(() => []),
    base44.asServiceRole.entities.ProjectOrder.filter({ client_email: email }).catch(() => []),
  ]);

  const projects = await Promise.all((rawProjects || []).map(async (project: any) => {
    const [assets, rawMessages, rawCharges] = await Promise.all([
      base44.asServiceRole.entities.OfferAsset.filter({ project_order_id: project.id }).catch(() => []),
      base44.asServiceRole.entities.OfferMessage.filter({ project_order_id: project.id }, 'created_date', 100).catch(() => []),
      base44.asServiceRole.entities.ProjectExtraCharge.filter({ project_order_id: project.id }, 'created_date', 100).catch(() => []),
    ]);

    const selectedAssets = (assets || [])
      .filter((asset: any) => asset.selected_for_offer === true)
      .sort((a: any, b: any) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
      .map(clientAssetView)
      .filter(Boolean);

    const visualizations = selectedAssets.filter((asset: any) => asset.asset_type === 'generated_visualization');
    const documents = selectedAssets.filter((asset: any) => asset.asset_type !== 'generated_visualization');
    const offerMessages = (rawMessages || []).map(clientMessageView).filter(Boolean);
    const extraCharges = (rawCharges || []).map(clientChargeView).filter(Boolean);

    return {
      ...clientProjectView(project),
      offer_assets: selectedAssets,
      visualizations,
      documents,
      offer_messages: offerMessages,
      extra_charges: extraCharges,
      primary_visualization_url: visualizations[0]?.file_url || '',
    };
  }));

  return {
    inquiries: [...(contactInquiries || []), ...(poptavky || [])].map(clientInquiryView).filter(Boolean),
    projects,
  };
}
