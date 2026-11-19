// HubSpot → MLŽIDLA Obchodní centrum: bezpečné mapování, návrh pro integrační vrstvu.
// Neodesílá žádná data; před použitím vyžaduje ověřené DTO cílové aplikace.
export const PORTAL_ID = "149778217";
export const PIPELINES = Object.freeze({ mlzidla: "4351532258", holmtec: "4351897791" });
const FIELDS = Object.freeze({
  obchodni_znacka: "brand",
  obchodni_zdroj_poptavky: "inquiry_source",
  obchodni_cislo_nabidky: "offer_number",
  obchodni_stav_podkladu: "documents_status",
  obchodni_pdf_nabidky: "offer_pdf_url",
  obchodni_gmail_vlakno: "gmail_thread_url",
  hs_next_step: "next_step",
});
export function mapHubSpotDeal(deal) {
  if (!deal || !/^\d+$/.test(String(deal.id || ""))) throw new Error("Missing HubSpot deal ID");
  const p = deal.properties || {};
  const pipeline = String(p.pipeline || "");
  const brand = pipeline === PIPELINES.mlzidla ? "mlzidla" : pipeline === PIPELINES.holmtec ? "holmtec" : null;
  if (!brand) throw new Error("Deal outside approved pipelines");
  const result = {
    external_key: PORTAL_ID + ":" + deal.id,
    hubspot_portal_id: PORTAL_ID,
    hubspot_deal_id: String(deal.id),
    name: String(p.dealname || ""),
    pipeline_id: pipeline,
    stage_id: String(p.dealstage || ""),
    brand,
    hubspot_updated_at: p.hs_lastmodifieddate || null,
  };
  for (const [source, target] of Object.entries(FIELDS)) {
    if (p[source] != null && p[source] !== "") result[target] = String(p[source]);
  }
  // Zabránit přepisu značky nekonzistentní hodnotou z HubSpotu.
  result.brand = brand;
  return result;
}
export function validateForTarget(mapped, targetSchema) {
  if (!targetSchema || !Array.isArray(targetSchema.allowedFields)) {
    throw new Error("Target record schema not verified; write blocked");
  }
  const unknown = Object.keys(mapped).filter(k => !targetSchema.allowedFields.includes(k));
  if (unknown.length) throw new Error("Unsupported target fields: " + unknown.join(", "));
  for (const key of targetSchema.requiredFields || []) {
    if (mapped[key] == null || mapped[key] === "") throw new Error("Missing required field: " + key);
  }
  return true;
}
