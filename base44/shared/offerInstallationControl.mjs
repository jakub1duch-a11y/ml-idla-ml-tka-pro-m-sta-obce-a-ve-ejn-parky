/**
 * Public-facing editorial copy for MLŽIDLA product sheets, priced offers and Canva briefs.
 * This is a presentation contract, not a controller configuration or an internal price list.
 */
const validMoney = (value) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;

export function buildOfferInstallationControlSummary({ product = null, supla = null } = {}) {
  const useCases = Array.isArray(product?.use_cases)
    ? product.use_cases.filter((value) => typeof value === 'string' && value.trim()).slice(0, 3).map((value) => value.trim())
    : [];
  const suplaPrice = validMoney(supla?.standard_price_ex_vat);
  return {
    installation: {
      title: 'Přehledná instalace podle připravenosti místa',
      description: 'Montáž lze naplánovat po ověření přívodu vody, filtrace, kotvení, přístupu k servisu a případného elektrického připojení. Rozsah stavebních prací a montáže se potvrzuje individuálně.',
      included_in_base_price: null,
      cost_ex_vat: null,
      status: 'requires_project_confirmation',
    },
    placement: {
      title: 'Umístění mlžítka podle prostředí',
      description: 'Nízkotlaká mlžítka nedoporučujeme umisťovat přímo mezi stoly nebo lavičky. Jemná mlha se v horkém a suchém počasí může rychle odpařovat, ale vítr ji může unášet několik metrů a za nevhodných podmínek mohou povrchy zvlhnout.',
      recommended_distance_m: null,
      dry_ground_guaranteed: false,
      use_cases: useCases,
    },
    control_modes: [
      {
        id: 'without_app',
        title: 'Intervalové mlžení bez mobilní aplikace',
        description: 'Opakování intervalů mlžení a pauzy prostřednictvím vhodného místního časovače nebo řídicí jednotky; dostupnost a parametry vyžadují potvrzení technické sestavy.',
        required_equipment: 'Kompatibilní lokální časovač a ovládaný ventil',
        included_in_base_price: false,
        price_ex_vat: null,
        price_status: 'requires_current_quote',
      },
      {
        id: 'supla_app',
        title: 'Chytré řízení SUPLA s mobilní aplikací',
        description: 'Vzdálené zapínání a časové plány podle kompatibilních modulů a dostupné konektivity; čidla a měření vody jsou volitelné podle schválené konfigurace.',
        required_equipment: 'Kompatibilní modul SUPLA, ventil, napájení a konektivita dle návrhu',
        included_in_base_price: false,
        price_ex_vat: suplaPrice,
        price_status: suplaPrice === null ? 'requires_current_quote' : 'verified_current_supla_sheet',
      },
    ],
    visual_policy: {
      master_required: true,
      recommended_scenes: ['Původní katalogová fotografie správné varianty', 'Ověřená fotografie místa nebo výslovně označená koncepční vizualizace'],
      no_geometry_changes: true,
      must_label_visualization: true,
      approval_required: true,
    },
  };
}
