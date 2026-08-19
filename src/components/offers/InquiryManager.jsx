import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ExternalLink, Eye, FileText, ReceiptText, Search, Send, Sparkles, Upload, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { withSignature } from '@/components/offers/messageSignature';
import OfferAICopilot from '@/components/offers/OfferAICopilot';

const money = (value) => new Intl.NumberFormat('cs-CZ').format(Number(value || 0));
const errorMessage = (error) => error?.response?.data?.error || error?.message || 'Akci se nepodařilo dokončit.';
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
const BCC = ['jakub1duch@gmail.com', 'duch@holmtec.cz', 'meduna@holmtec.cz'];
const AUDIENCES = [
  { value: 'city_public', label: 'Města / obce / náměstí / parky' },
  { value: 'residential', label: 'Rezidenční zahrady / terasy' },
  { value: 'wellness_hospitality', label: 'Wellness / hotel / gastro / resort' },
  { value: 'architecture_design', label: 'Architekt / developer / krajinář' },
  { value: 'custom', label: 'Zakázkový projekt / atypické řešení' },
];
const FOLLOW_UP_TEMPLATES = [
  { value: 'inquiry_reminder', label: 'Připomenout poptávku' },
  { value: 'offer_reminder', label: 'Připomenout cenovou nabídku' },
  { value: 'action_discount', label: 'Akční zvýhodnění · 30 dní' },
];
const FOLLOW_UP_OFFER_STATUSES = ['sent', 'viewed', 'extension_requested', 'approved', 'expired'];
const SMART_SCENARIO_PRESETS = [
  { key: 'temperature', label: 'Scénář A · Teplotní automatika', description: 'Aktivace mlžení pouze při překročení nastavené venkovní teploty.', defaultValue: '> 25 °C' },
  { key: 'schedule', label: 'Scénář B · Časový plán', description: 'Provoz v definovaných intervalech během dne pro úsporný a předvídatelný provoz.', defaultValue: 'např. 10:00–19:00 · cyklus 10/20 min' },
  { key: 'interactive', label: 'Scénář C · Interaktivní sepnutí', description: 'Okamžitý start po aktivaci bezkontaktním senzorem kolemjdoucím.', defaultValue: 'např. 15 min po aktivaci' },
  { key: 'humidity', label: 'Scénář D · Teplota + vlhkost', description: 'Spuštění jen při kombinaci vhodné teploty a relativní vlhkosti.', defaultValue: 'nastavení dle lokality' },
  { key: 'weather_api', label: 'Scénář E · API počasí', description: 'Volitelná integrační logika podle předpovědi nebo aktuálního počasí — déšť, teplota, vítr a další podmínky.', defaultValue: 'individuální integrační logika' },
  { key: 'water_monitoring', label: 'Scénář F · Monitoring vody', description: 'Měření spotřeby vody, historie provozu a vzdálený přehled v SUPLA.', defaultValue: 'ENBRA + LIW‑01' },
];

export default function InquiryManager({ inquiries, products, offerProfiles = [], mediaFiles, projectOrders = [], onSent }) {
  const [selectedId, setSelectedId] = useState(inquiries[0]?.key || '');
  const [productId, setProductId] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [installation, setInstallation] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [audienceVariant, setAudienceVariant] = useState('city_public');
  const [senderEmail, setSenderEmail] = useState('meduna@holmtec.cz');
  const [testEmail, setTestEmail] = useState('');
  const [testSentTo, setTestSentTo] = useState('');
  const [approvedToSend, setApprovedToSend] = useState(false);
  const [prepared, setPrepared] = useState(null);
  const [followUpType, setFollowUpType] = useState('');
  const [followUpDiscount, setFollowUpDiscount] = useState(5);
  const [latestOffer, setLatestOffer] = useState(null);
  const [followUpApproved, setFollowUpApproved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [extraCharges, setExtraCharges] = useState([]);
  const [extraChargeOfferId, setExtraChargeOfferId] = useState('');
  const [extraChargeForm, setExtraChargeForm] = useState({ title: '', description: '', quantity: 1, unit: 'ks', unit_price_ex_vat: 0 });
  const [extraChargeBusy, setExtraChargeBusy] = useState(false);
  const [smartScenarios, setSmartScenarios] = useState(() => Object.fromEntries(SMART_SCENARIO_PRESETS.map((item) => [item.key, ['temperature','schedule','interactive','water_monitoring'].includes(item.key)])));
  const [smartScenarioValues, setSmartScenarioValues] = useState(() => Object.fromEntries(SMART_SCENARIO_PRESETS.map((item) => [item.key, item.defaultValue])));

  const normalizeSearch = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const ordersByInquiry = useMemo(() => projectOrders.reduce((map, order) => {
    if (!order?.inquiry_id) return map;
    if (!map[order.inquiry_id]) map[order.inquiry_id] = [];
    map[order.inquiry_id].push(order);
    return map;
  }, {}), [projectOrders]);
  const filteredInquiries = useMemo(() => {
    const terms = normalizeSearch(searchQuery).split(/\s+/).filter(Boolean);
    if (!terms.length) return inquiries;
    return inquiries.filter((item) => {
      const linkedOffers = ordersByInquiry[item.id] || [];
      const haystack = normalizeSearch([
        item.id, item.key, item.name, item.email, item.telefon, item.phone, item.firma, item.company,
        item.product, item.produkt, item.message, item.zprava, item.status,
        ...linkedOffers.flatMap((offer) => [offer.id, offer.quote_number, offer.project_name, offer.product_name, offer.client_name, offer.client_email, offer.client_phone, offer.client_company, offer.status])
      ].filter(Boolean).join(' '));
      return terms.every((term) => haystack.includes(term));
    });
  }, [inquiries, ordersByInquiry, searchQuery]);
  const selected = useMemo(() => inquiries.find((item) => item.key === selectedId), [inquiries, selectedId]);
  const selectedOffers = useMemo(() => selected ? (ordersByInquiry[selected.id] || []) : [], [ordersByInquiry, selected]);
  const total = Number(basePrice || 0) + Number(installation || 0);
  const finalTotal = Math.round(total * (1 - Number(discount || 0) / 100));
  const selectedProduct = products.find((item) => item.id === productId);

  useEffect(() => {
    let active = true;
    const loadExtraCharges = async () => {
      if (!selectedOffers.length) {
        if (active) { setExtraCharges([]); setExtraChargeOfferId(''); }
        return;
      }
      if (!extraChargeOfferId || !selectedOffers.some((offer) => offer.id === extraChargeOfferId)) setExtraChargeOfferId(selectedOffers[0].id);
      const records = await base44.entities.ProjectExtraCharge.list('-created_date', 200).catch(() => []);
      if (active) setExtraCharges((records || []).filter((charge) => selectedOffers.some((offer) => offer.id === charge.project_order_id)));
    };
    loadExtraCharges();
    return () => { active = false; };
  }, [selectedId, projectOrders]);

  const createExtraCharge = async () => {
    const offer = selectedOffers.find((item) => item.id === extraChargeOfferId);
    const title = String(extraChargeForm.title || '').trim();
    const quantity = Math.max(0, Number(extraChargeForm.quantity || 0));
    const unitPrice = Math.max(0, Number(extraChargeForm.unit_price_ex_vat || 0));
    if (!offer || !title || !(quantity > 0) || !(unitPrice >= 0)) return;
    setExtraChargeBusy(true);
    setError('');
    try {
      const created = await base44.entities.ProjectExtraCharge.create({
        project_order_id: offer.id,
        quote_number: offer.quote_number || '',
        title,
        description: String(extraChargeForm.description || '').trim(),
        quantity,
        unit: String(extraChargeForm.unit || 'ks').trim() || 'ks',
        unit_price_ex_vat: unitPrice,
        total_price_ex_vat: Math.round(quantity * unitPrice),
        vat_rate: 21,
        status: 'pending_customer_approval',
        requires_customer_approval: true,
      });
      setExtraCharges((current) => [created, ...current]);
      setExtraChargeForm({ title: '', description: '', quantity: 1, unit: 'ks', unit_price_ex_vat: 0 });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setExtraChargeBusy(false);
    }
  };

  const resetPrepared = () => { setPrepared(null); setApprovedToSend(false); };
  const resetFollowUp = () => { setFollowUpType(''); setLatestOffer(null); setFollowUpApproved(false); };
  const chooseProduct = (id) => {
    const product = products.find((item) => item.id === id);
    const profile = offerProfiles.find((item) => item.product_id === id || item.product_slug === product?.slug);
    // Centrální profil nabídky má přednost před veřejným price_from, kde historicky
    // existovaly placeholdery 0/1 Kč. Projektové produkty zůstanou na 0 a obchodník
    // doplní kalkulaci podle rozsahu.
    setProductId(id);
    setBasePrice(Number(profile?.unit_price_ex_vat || 0));
    if (profile?.audience_variant) setAudienceVariant(profile.audience_variant);
    resetPrepared();
  };

  const findLatestOffer = async () => {
    if (!selected?.id) return null;
    const orders = await base44.entities.ProjectOrder.list('-created_date', 200);
    return orders.find((order) => order.inquiry_id === selected.id && FOLLOW_UP_OFFER_STATUSES.includes(order.status))
      || orders.find((order) => order.inquiry_id === selected.id)
      || null;
  };

  const applyFollowUpTemplate = async (type) => {
    if (!selected) return;
    setError(''); setBusy('followup-template'); setFollowUpApproved(false); resetPrepared();
    try {
      const needsOffer = type === 'offer_reminder' || type === 'action_discount';
      const offer = needsOffer ? await findLatestOffer() : null;
      if (needsOffer && !offer) throw new Error('K této poptávce zatím není uložená předchozí cenová nabídka.');

      const projectName = offer?.product_name || selected.product || 'váš projekt';
      const quoteNumber = offer?.quote_number || '';
      const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const previousTotal = Number(offer?.total_price || 0);
      const promoTotal = Math.round(previousTotal * (1 - Number(followUpDiscount || 0) / 100));

      if (type === 'inquiry_reminder') {
        setSubject('Navazujeme na vaši poptávku | MLŽIDLA®');
        setMessage(`Dobrý den,\n\nrádi bychom navázali na vaši poptávku k projektu „${projectName}“. Ověřujeme, zda je projekt stále aktuální a zda od nás potřebujete doplnit technické informace, doporučení vhodné konfigurace nebo podklady pro rozhodnutí.\n\nVaše původní zadání máme uložené a můžeme na něj přímo navázat. Pokud se mezitím změnily rozměry prostoru, termín, rozsah realizace nebo jiné požadavky, stačí nám změny odpovědí na tento e-mail doplnit.\n\nPokud je projekt stále aktuální, rádi s vámi projdeme další krok a připravíme podklady k nacenění.`);
      }

      if (type === 'offer_reminder') {
        const validityText = offer.valid_until ? new Date(offer.valid_until).toLocaleDateString('cs-CZ') : 'dle původní nabídky';
        setSubject(`Připomenutí cenové nabídky ${quoteNumber || ''} | MLŽIDLA®`.replace('  ', ' '));
        setMessage(`Dobrý den,\n\nnavazujeme na naši cenovou nabídku${quoteNumber ? ` ${quoteNumber}` : ''} k projektu „${projectName}“. Chtěli bychom ověřit, zda jste měli možnost nabídku projít a zda můžeme doplnit některé technické, cenové nebo realizační informace.\n\nPůvodní platnost nabídky: ${validityText}. Pokud je projekt stále aktuální, můžeme společně ověřit rozsah, termín realizace a případně nabídku aktualizovat podle současného zadání.\n\nStačí odpovědět na tento e-mail nebo nám zavolat. Rádi navážeme tam, kde jsme skončili.`);
      }

      if (type === 'action_discount') {
        if (!(Number(followUpDiscount) > 0 && Number(followUpDiscount) < 100)) throw new Error('Pro akční follow-up nastavte slevu mezi 1 a 99 %.');
        if (!(previousTotal > 0)) throw new Error('Poslední nabídka nemá uloženou cenu, ze které lze akční zvýhodnění vypočítat.');
        setSubject(`Akční zvýhodnění k nabídce ${quoteNumber || ''} | MLŽIDLA®`.replace('  ', ' '));
        setMessage(`Dobrý den,\n\nnavazujeme na dříve zaslanou nabídku${quoteNumber ? ` ${quoteNumber}` : ''} k projektu „${projectName}“. Pokud je projekt stále aktuální, rádi bychom vám jako podnět k dokončení rozhodnutí nabídli jednorázové zvýhodnění ${Number(followUpDiscount).toLocaleString('cs-CZ')} % z poslední nabídkové ceny.\n\nZvýhodnění navrhujeme s platností do ${validUntil.toLocaleDateString('cs-CZ')}. Pokud o něj budete mít zájem, stačí odpovědět na tento e-mail a připravíme aktualizovanou formální cenovou nabídku s novou cenou a platností.\n\nSoučasně rádi doplníme jakékoli technické informace nebo upravíme rozsah projektu, pokud se od posledního kontaktu něco změnilo.`);
      }

      setLatestOffer(offer);
      setFollowUpType(type);
    } catch (requestError) {
      setError(errorMessage(requestError));
      resetFollowUp();
    } finally { setBusy(''); }
  };

  const sendFollowUp = async () => {
    if (!selected || !followUpType || !followUpApproved || !subject || !message) return;
    setError(''); setBusy('followup-send');
    try {
      const actionDiscount = followUpType === 'action_discount';
      const reminderOffer = followUpType === 'offer_reminder' ? latestOffer : null;
      const previousTotal = Number(latestOffer?.total_price || 0);
      const newTotal = actionDiscount ? Math.round(previousTotal * (1 - Number(followUpDiscount || 0) / 100)) : 0;
      const validUntil = actionDiscount
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : reminderOffer?.valid_until ? new Date(reminderOffer.valid_until) : null;

      await base44.functions.invoke('sendInquiryReply', {
        inquiry_type: selected.type,
        inquiry_id: selected.id,
        subject,
        message,
        sender_email: senderEmail,
        project_summary: selected.message || '',
        email_type: followUpType,
        discount_percent: actionDiscount ? Number(followUpDiscount || 0) : 0,
        previous_total: actionDiscount ? previousTotal : 0,
        new_total: actionDiscount ? newTotal : 0,
        quote_number: reminderOffer?.quote_number || '',
        quote_pdf_url: reminderOffer?.quote_pdf_url || '',
        presentation_url: reminderOffer?.presentation_url || '',
        portal_url: reminderOffer ? 'https://mlzidla.cz/muj-projekt' : '',
        valid_until: validUntil?.toISOString() || '',
        attachments: [],
      });

      onSent();
      setMessage(''); setSubject(''); resetFollowUp();
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setBusy(''); }
  };

  const generateText = async () => {
    if (!selected) return;
    const email = selected.email?.trim().toLowerCase();
    const history = inquiries.filter((item) => item.key !== selected.key && item.email?.trim().toLowerCase() === email).reverse()
      .map((item) => `${new Date(item.created_date).toLocaleDateString('cs-CZ')}: ${item.message}`).join('\n') || 'Žádná předchozí komunikace není k dispozici.';
    const audience = AUDIENCES.find((item) => item.value === audienceVariant)?.label || 'Zakázkový projekt';
    setError(''); setBusy('text');
    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt: `Napiš profesionální personalizovanou obchodní odpověď v češtině na aktuální poptávku značky MLŽIDLA.cz by HolmTec. Cílová skupina: ${audience}. Tón musí být důvěryhodný, odborný, klidný a přesvědčivý, nikoli agresivně prodejní. Zaměř se na konkrétní přínosy pro daný typ zákazníka, kvalitu řešení, českou výrobu, servis a možnost vizualizace před realizací. Neuváděj vymyšlené technické parametry. Přirozeně vyzvi k otevření přiložené profesionální nabídky a prezentace. Vrať pouze text odpovědi bez předmětu a bez podpisu.\n\nZákazník: ${selected.name}\nAktuální poptávka: ${selected.message}\nVybraný produkt: ${selectedProduct?.name || selected.product || 'neurčeno'}\nCena projektu: ${money(finalTotal)} Kč bez DPH\n\nHistorie komunikace:\n${history}` });
      setSubject(`Nabídka řešení MLŽIDLA.cz – ${selected.firma || selected.company || selected.name}`);
      setMessage(typeof response === 'string' ? response : JSON.stringify(response, null, 2));
      resetPrepared();
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setBusy(''); }
  };

  const uploadFiles = async (event) => {
    setError('');
    try {
      const files = Array.from(event.target.files || []);
      const uploaded = await Promise.all(files.map(async (file) => {
        const result = await base44.integrations.Core.UploadFile({ file });
        const asset = { file_name: file.name, file_url: result.file_url, file_type: file.type || 'application/octet-stream', asset_type: file.type?.startsWith('image/') ? 'source_photo' : 'source_document' };
        if (selected?.id) {
          try {
            return await base44.entities.OfferAsset.create({
              inquiry_id: selected.id,
              inquiry_type: selected.type,
              ...asset,
              title: file.type?.startsWith('image/') ? 'Fotografie / vizuální podklad' : 'Projektová příloha',
              selected_for_offer: true,
              generated_by_ai: false,
            });
          } catch (_) {}
        }
        return asset;
      }));
      setAttachments((current) => [...current, ...uploaded]);
      event.target.value = '';
    } catch (requestError) { setError(errorMessage(requestError)); }
  };

  const downloadPreparedPdf = () => {
    if (!prepared?.quote?.pdf_base64) return;
    const bytes = Uint8Array.from(atob(prepared.quote.pdf_base64), (character) => character.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = prepared.quote.filename || `${prepared.quoteNumber}-nabidka.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const prepareOffer = async (options = {}) => {
    const productForOffer = options.product || selectedProduct;
    const basePriceForOffer = Number(options.basePrice ?? basePrice ?? 0);
    const installationForOffer = Number(options.installation ?? installation ?? 0);
    const discountForOffer = Number(options.discount ?? discount ?? 0);
    const audienceForOffer = options.audienceVariant || audienceVariant;
    const finalTotalForOffer = Math.round((basePriceForOffer + installationForOffer) * (1 - discountForOffer / 100));
    const visualizationOverride = options.visualizationUrl || '';
    const visualizationOverrides = Array.isArray(options.visualizationUrls) ? options.visualizationUrls.filter(Boolean) : [];
    const offerAttachments = Array.isArray(options.attachments) ? options.attachments : attachments;
    const clientContentOverride = options.clientContent || null;
    const projectOrderOverride = options.projectOrder || null;
    const priceIsEstimate = Boolean(options.priceIsEstimate);
    if (!selected || !productForOffer) { setError('Nejdříve vyberte produkt pro nabídku.'); return; }
    if (options.product) setProductId(productForOffer.id);
    if (options.basePrice !== undefined) setBasePrice(basePriceForOffer);
    if (options.installation !== undefined) setInstallation(installationForOffer);
    if (options.discount !== undefined) setDiscount(discountForOffer);
    if (options.audienceVariant) setAudienceVariant(audienceForOffer);
    setError(''); setBusy(options.auto ? 'auto-offer' : 'prepare'); setApprovedToSend(false);
    try {
      const issuedAt = new Date();
      const validUntil = new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
      const quoteNumber = prepared?.quoteNumber || `MLZ-${issuedAt.getFullYear()}-${String(Date.now()).slice(-6)}`;
      const isCustomOffer = Boolean(options.customProduct);
      const arUrl = isCustomOffer
        ? ''
        : productForOffer.slug === 'mlzitko-bendy'
          ? 'https://mlzidla.cz/ar/bendy-single'
          : productForOffer.slug === 'mlzna-brana-gate'
            ? 'https://mlzidla.cz/ar/gate'
            : `https://mlzidla.cz/produkt/${productForOffer.slug}`;
      let approvedVisualizationAssets = [];
      try {
        approvedVisualizationAssets = (await base44.entities.VisualizationAsset.filter({ source_inquiry_id: selected.id, approved_for_presentation: true })) || [];
      } catch (technicalDataError) { console.warn('Approved visualization data unavailable', technicalDataError); }
      const visualizationUrl = visualizationOverride || visualizationOverrides[0] || approvedVisualizationAssets.find((item) => item.is_primary_for_variant)?.image_url || approvedVisualizationAssets[0]?.image_url || offerAttachments.find((item) => item.asset_type === 'generated_visualization' && item.file_url)?.file_url || '';

      let clientContent = clientContentOverride || {
        project_goal: `Návrh řešení ${productForOffer.name} pro ${selected.firma || selected.company || selected.name}.`,
        solution_summary: productForOffer.short_description || 'Minimalistické nerezové mlžení navržené pro konkrétní prostor.',
        benefits: [],
        next_step: 'Po odsouhlasení konceptu upřesníme technické návaznosti a finální rozsah realizace.',
        presentation_title: `${productForOffer.name} — návrh řešení`,
      };
      if (!clientContentOverride) try {
        const aiContent = await base44.integrations.Core.InvokeLLM({
          prompt: `Připrav čistě klientský obsah obchodní nabídky MLŽIDLA.cz. Z následující poptávky vytěž pouze potvrzený účel projektu, potřeby klienta a přínosy navrženého produktu. Nezobrazuj interní komunikaci, instrukce obchodníkovi, ID, historii e-mailů ani interní nejistoty. Nevymýšlej technické parametry ani ceny. Piš česky, profesionálně a stručně. U produktu BENDY respektuj minimalistický čistý nerezový tvar bez výhonků, hadic a přídavných ramen.\n\nKlient: ${selected.name}\nOrganizace: ${selected.firma || selected.company || ''}\nPoptávka: ${selected.message || ''}\nProdukt: ${productForOffer.name}\nTyp projektu: ${AUDIENCES.find((item) => item.value === audienceForOffer)?.label || audienceForOffer}`,
          response_json_schema: {
            type: 'object',
            properties: {
              project_goal: { type: 'string' },
              solution_summary: { type: 'string' },
              benefits: { type: 'array', items: { type: 'string' } },
              next_step: { type: 'string' },
              presentation_title: { type: 'string' },
            },
          },
        });
        if (aiContent?.project_goal) clientContent = { ...clientContent, ...aiContent };
      } catch (aiError) { console.warn('Client-facing AI content unavailable', aiError); }

      const quoteResponse = await base44.functions.invoke('generateProductDatasheet', {
        product: productForOffer,
        document_type: 'offer',
        inquiry: { name: selected.name, email: selected.email, phone: selected.telefon || selected.phone || '', company: selected.firma || selected.company || '', project_goal: clientContent.project_goal },
        quote: { final_total: finalTotalForOffer, base_price: basePriceForOffer, installation: installationForOffer, discount_percent: discountForOffer, price_is_estimate: priceIsEstimate },
        quote_number: quoteNumber,
        valid_until: validUntil.toISOString(),
        portal_url: 'https://mlzidla.cz/muj-projekt',
        ar_url: arUrl,
        audience_variant: audienceForOffer,
        visualization_urls: [
          visualizationUrl,
          ...visualizationOverrides,
          ...approvedVisualizationAssets.map((item) => item.image_url).filter(Boolean),
          ...offerAttachments.filter((item) => item.asset_type === 'generated_visualization' && item.file_url).map((item) => item.file_url),
        ].filter((url, index, all) => url && all.indexOf(url) === index).slice(0, 4),
        ai_content: clientContent,
        smart_scenarios: SMART_SCENARIO_PRESETS.filter((item) => smartScenarios[item.key]).map((item) => ({ ...item, value: smartScenarioValues[item.key] || item.defaultValue })),
      });
      const quote = quoteResponse.data;

      let quoteDriveUrl = '';
      try {
        const savedQuote = await base44.functions.invoke('saveQuoteToDriveAuto', { pdf_base64: quote?.pdf_base64, filename: quote?.filename, quoteNumber, inquiryEmail: selected.email, inquiryName: selected.firma || selected.company || selected.name, issued_at: issuedAt.toISOString() });
        quoteDriveUrl = savedQuote.data?.drive_url || '';
      } catch (driveError) { console.warn('Quote Drive archive unavailable', driveError); }

      let presentation = null;
      let presentationWarning = '';
      try {
        const presentationResponse = await base44.functions.invoke('generateOfferPresentation', {
          inquiry: { id: selected.id, name: selected.name, email: selected.email, phone: selected.telefon || selected.phone || '', company: selected.firma || selected.company || '', message: clientContent.project_goal },
          product: productForOffer,
          quote: { quote_number: quoteNumber, final_total: finalTotalForOffer, issued_at: issuedAt.toISOString(), valid_until: validUntil.toISOString(), price_is_estimate: priceIsEstimate },
          ar_url: arUrl,
          ar_capture_url: visualizationUrl,
          approved_visualizations: approvedVisualizationAssets,
          ai_content: clientContent,
          audience_variant: audienceForOffer,
          smart_scenarios: SMART_SCENARIO_PRESETS.filter((item) => smartScenarios[item.key]).map((item) => ({ ...item, value: smartScenarioValues[item.key] || item.defaultValue })),
        });
        presentation = presentationResponse.data;
      } catch (presentationError) {
        presentationWarning = errorMessage(presentationError);
        console.warn('Offer presentation unavailable', presentationError);
      }

      // NotebookLM is intentionally not part of the critical offer path.
      // The customer-facing web portal + PDF are the primary presentation outputs;
      // an external presentation is optional and must never block offer creation.
      const notebookSourceUrl = '';

      const orderData = {
        inquiry_id: selected.id, inquiry_type: selected.type,
        project_name: `${productForOffer.name} — ${selected.firma || selected.company || selected.name}`,
        client_name: selected.name, client_email: selected.email, client_phone: selected.telefon || selected.phone || '', client_company: selected.firma || selected.company || '',
        description: String(clientContent.project_goal || selected.message || '').slice(0, 2000), product_id: productForOffer.id, product_slug: productForOffer.slug, product_name: productForOffer.name,
        quote_number: quoteNumber, quote_pdf_url: quoteDriveUrl, presentation_url: presentation?.presentation_url || '', presentation_pdf_url: presentation?.presentation_pdf_url || '', notebook_source_url: notebookSourceUrl,
        drive_case_folder_id: presentation?.drive_case_folder_id || '', drive_case_folder_url: presentation?.drive_case_folder_url || '',
        presentation_variant: audienceForOffer, issued_at: issuedAt.toISOString(), valid_until: validUntil.toISOString(), ar_url: arUrl, smart_control_included: true,
        status: 'draft', total_price: finalTotalForOffer, sender_email: senderEmail, bcc_recipients: BCC,
        supplier_name: 'HolmTec s.r.o. — MLŽIDLA.cz', supplier_contact_name: 'Ing. Radek Meduna', supplier_email: senderEmail, supplier_phone: '+420 774 700 390',
        production_notes: options.customProduct ? [`CUSTOM KONCEPT — ${options.customProduct.name || productForOffer.name}`, options.customProduct.primary_profile && `Profil: ${options.customProduct.primary_profile}`, options.customProduct.dimensions_summary && `Rozměry: ${options.customProduct.dimensions_summary}`, options.customProduct.bend_strategy && `Ohýbání: ${options.customProduct.bend_strategy}`, options.customProduct.weld_strategy && `Svařování: ${options.customProduct.weld_strategy}`, options.customProduct.nozzle_strategy && `Trysky: ${options.customProduct.nozzle_strategy}`, Array.isArray(options.customProduct.manufacture_steps) && options.customProduct.manufacture_steps.length ? `Postup: ${options.customProduct.manufacture_steps.join(' → ')}` : ''].filter(Boolean).join('\n').slice(0, 3000) : (projectOrderOverride?.production_notes || ''),
        special_requirements: options.customPricing?.warnings?.length ? options.customPricing.warnings.join(' ').slice(0, 2000) : (projectOrderOverride?.special_requirements || ''),
        shared_token: projectOrderOverride?.shared_token || prepared?.projectOrder?.shared_token || crypto.randomUUID(),
      };
      const orderToUpdate = projectOrderOverride?.id ? projectOrderOverride : prepared?.projectOrder;
      let projectOrder = orderToUpdate?.id
        ? await base44.entities.ProjectOrder.update(orderToUpdate.id, orderData)
        : await base44.entities.ProjectOrder.create(orderData);

      let inquiryArchive = null;
      try {
        const archiveResponse = await base44.functions.invoke('archiveInquiryPdf', {
          inquiry: { ...selected, name: selected.name, email: selected.email, phone: selected.telefon || selected.phone || '', company: selected.firma || selected.company || '', message: selected.message },
          quote_number: quoteNumber,
          issued_at: issuedAt.toISOString(),
          project_order_id: projectOrder.id,
        });
        inquiryArchive = archiveResponse.data;
        projectOrder = { ...projectOrder, inquiry_pdf_url: inquiryArchive?.inquiry_pdf_url || '', drive_case_folder_id: inquiryArchive?.drive_case_folder_id || projectOrder.drive_case_folder_id, drive_case_folder_url: inquiryArchive?.drive_case_folder_url || projectOrder.drive_case_folder_url };
      } catch (archiveError) { console.warn('Inquiry PDF archive unavailable', archiveError); }

      try {
        const generatedAssets = [
          quoteDriveUrl && { inquiry_id: selected.id, inquiry_type: selected.type, project_order_id: projectOrder.id, file_url: quoteDriveUrl, file_name: quote?.filename || `${quoteNumber}-nabidka.pdf`, file_type: 'application/pdf', asset_type: 'quote_pdf', title: 'Cenová nabídka PDF', selected_for_offer: true, generated_by_ai: false },
          presentation?.presentation_url && { inquiry_id: selected.id, inquiry_type: selected.type, project_order_id: projectOrder.id, file_url: presentation.presentation_url, file_name: `${quoteNumber}-prezentace`, file_type: 'application/vnd.google-apps.presentation', asset_type: 'presentation', title: 'Projektová prezentace', selected_for_offer: true, generated_by_ai: true },
          presentation?.presentation_pdf_url && { inquiry_id: selected.id, inquiry_type: selected.type, project_order_id: projectOrder.id, file_url: presentation.presentation_pdf_url, file_name: presentation.presentation_filename || `${quoteNumber}-prezentace.pdf`, file_type: 'application/pdf', asset_type: 'presentation_pdf', title: 'Projektová prezentace PDF', selected_for_offer: true, generated_by_ai: true },
        ].filter(Boolean);
        if (generatedAssets.length) await Promise.all(generatedAssets.map((asset) => base44.entities.OfferAsset.create(asset)));
      } catch (assetError) { console.warn('Offer assets could not be indexed', assetError); }

      const generatedVisualizationUrls = [
        visualizationUrl,
        ...visualizationOverrides,
        ...offerAttachments.filter((item) => item.asset_type === 'generated_visualization' && item.file_url).map((item) => item.file_url),
      ].filter((url, index, all) => url && all.indexOf(url) === index);
      setPrepared({ projectOrder, quote, quoteDriveUrl, presentation, presentationWarning, notebookSourceUrl, inquiryArchive, quoteNumber, validUntil, arUrl, visualizationUrl, visualizationUrls: generatedVisualizationUrls, visualizationWarning: generatedVisualizationUrls.length === 0 ? 'Automatická nabídka je hotová, ale AI vizualizaci se tentokrát nepodařilo vytvořit. Nabídku lze dál zkontrolovat a odeslat; vizualizaci můžete přegenerovat samostatně v pokročilých nástrojích.' : '', approvedVisualizationAssets, clientContent, variantPricing: options.variantPricing || [], pricing: options.pricing || null, customProduct: options.customProduct || null, customPricing: options.customPricing || null });
      if (!subject.trim()) setSubject(`Projektový návrh + cenová nabídka ${quoteNumber} | ${selected.firma || selected.company || productForOffer.name} | MLŽIDLA®`);
      if (!message.trim()) setMessage(visualizationUrl
        ? `Dobrý den,\n\nna základě vašeho zadání jsme připravili návrh řešení pro daný prostor včetně orientační projektové vizualizace a cenové nabídky. Návrh vychází z charakteru místa, způsobu jeho užívání a zvoleného produktu ${productForOffer.name}.\n\nSoučástí podkladů je AI koncept osazení, cenová rekapitulace a projektová prezentace. Vizualizace slouží jako návrhový podklad; přesné technické řešení potvrzujeme před realizací. V zákaznickém portálu Můj projekt můžete vše projít na jednom místě, stáhnout dokumentaci a navázat dalším krokem.\n\nPokud budete chtít upravit umístění, počet prvků, variantu řešení nebo rozsah realizace, zapracujeme změny do další verze návrhu.\n\nIng. Radek Meduna\nMLŽIDLA® / HolmTec`
        : `Dobrý den,\n\nna základě vašeho zadání jsme připravili návrh řešení a cenovou nabídku pro daný prostor. Návrh vychází z charakteru místa, způsobu jeho užívání a zvoleného produktu ${productForOffer.name}.\n\nSoučástí podkladů je cenová rekapitulace a projektová prezentace. V zákaznickém portálu Můj projekt můžete vše projít na jednom místě, stáhnout dokumentaci a navázat dalším krokem.\n\nPokud budete chtít doplnit vizualizaci, upravit umístění, počet prvků, variantu řešení nebo rozsah realizace, zapracujeme změny do další verze návrhu.\n\nIng. Radek Meduna\nMLŽIDLA® / HolmTec`);
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setBusy(''); }
  };

  const autoPrepareFromText = async () => {
    if (!selected?.id || busy) return;
    setError('');
    setBusy('auto-offer');
    try {
      const response = await base44.functions.invoke('autoDraftOfferFromInquiry', {
        inquiry_id: selected.id,
        inquiry_type: selected.type,
        force: true,
      });
      const result = response.data || {};
      const catalogAutoProduct = products.find((item) => item.id === result.product_id)
        || products.find((item) => item.slug === result.product_slug);
      const autoProduct = catalogAutoProduct || (result.product_mode === 'custom' && result.custom_product ? {
        id: '',
        slug: result.product_slug || `custom-${selected.id}`,
        name: result.product_name || result.custom_product.name || 'Mlžítko na míru',
        short_description: result.custom_product.design_description || 'Zakázkový minimalistický návrh mlžítka.',
        description: result.custom_product.production_notes || result.custom_product.design_description || '',
        material: result.custom_product.material || result.custom_product.pricing_basis || 'Nerez',
        image_url: result.custom_product.master_image_url || result.custom_master_asset?.file_url || '',
        gallery_urls: [result.custom_product.master_image_url || result.custom_master_asset?.file_url].filter(Boolean),
        price_from: Number(result.product_price_from || 0),
      } : null);
      if (!autoProduct) throw new Error('Nepodařilo se určit katalogový ani zakázkový produkt pro nabídku.');

      const requestedQuantity = Math.max(1, Number(result.requested_quantity || 1));
      const rawVariants = Array.isArray(result.requested_variants) && result.requested_variants.length
        ? result.requested_variants
        : [{ label: `${requestedQuantity} ks ${autoProduct.name}`, quantity: requestedQuantity }];
      const pricingUnitPrice = Number(result.pricing?.unit_price ?? result.product_price_from ?? 0);
      const pricingSource = result.pricing?.source || (pricingUnitPrice > 0 ? 'catalog' : 'manual_required');
      const pricingLabel = result.pricing?.source_label || (pricingSource === 'catalog' ? 'Katalog produktu' : 'Ruční nacenění');
      const autoVariants = rawVariants.map((variant, index) => {
        const quantity = Math.max(1, Number(variant.quantity || requestedQuantity || 1));
        const variantUnitPrice = Number(variant.unit_price || pricingUnitPrice || 0);
        const variantPrice = Number(variant.price || 0) || (variantUnitPrice > 0 ? variantUnitPrice * quantity : 0);
        return {
          ...variant,
          label: variant.label || `${quantity} ks ${autoProduct.name}`,
          quantity,
          unit_price: variantUnitPrice,
          price: variantPrice,
          price_status: variantPrice > 0 ? 'catalog' : 'manual_required',
          pricing_label: variant.pricing_label || pricingLabel,
          visualization_url: result.visualization_assets?.[index]?.file_url || result.visualization_assets?.[index]?.url || '',
        };
      });
      const primaryVariant = autoVariants[0];
      const autoPrice = Number(primaryVariant?.price || 0);
      const autoAudience = result.audience_variant || 'custom';
      setProductId(autoProduct.id || '');
      setBasePrice(autoPrice);
      setInstallation(0);
      setDiscount(0);
      setAudienceVariant(autoAudience);

      const returnedVisualAssets = Array.isArray(result.visualization_assets) && result.visualization_assets.length
        ? result.visualization_assets.map((asset, index) => ({
            ...asset,
            title: asset.title || `Vizualizace varianty — ${autoVariants[index]?.label || autoProduct.name}`,
            description: asset.description || `Fotorealistická vizualizace odpovídající variantě ${autoVariants[index]?.label || autoProduct.name}. Počet výrobků musí odpovídat variantě nabídky.`,
          }))
        : result.visualization_asset ? [result.visualization_asset] : (result.visualization_url ? [{
          inquiry_id: selected.id,
          inquiry_type: selected.type,
          file_url: result.visualization_url,
          file_name: `${autoProduct.slug || 'mlzitko'}-auto-vizualizace.webp`,
          file_type: 'image/webp',
          asset_type: 'generated_visualization',
          title: `AI koncept — ${autoProduct.name}`,
          selected_for_offer: true,
          generated_by_ai: true,
        }] : []);
      const returnedUrls = new Set(returnedVisualAssets.map((item) => item.file_url));
      const nextAttachments = [...attachments.filter((item) => !returnedUrls.has(item.file_url)), ...returnedVisualAssets];
      setAttachments(nextAttachments);

      // Persist quantity/price/visual mapping separately so every offer variant has
      // an auditable price source and its own matching visualization.
      try {
        const existingVariants = await base44.entities.OfferVariant.filter({ inquiry_id: selected.id });
        await Promise.all(autoVariants.map(async (variant, index) => {
          const payload = {
            inquiry_id: selected.id,
            inquiry_type: selected.type,
            label: variant.label,
            product_id: autoProduct.id,
            product_slug: autoProduct.slug,
            product_name: autoProduct.name,
            quantity: variant.quantity,
            unit_price: variant.unit_price,
            total_price: variant.price,
            price_status: variant.price_status,
            visualization_url: variant.visualization_url || returnedVisualAssets[index]?.file_url || '',
            visualization_prompt: `Ultrarealistická realizace podle textu poptávky. Přesně ${variant.quantity} ks produktu ${autoProduct.name}; konstrukci produktu neměnit.`,
            recommended: index === 0,
            sort_order: index,
          };
          const existing = (existingVariants || []).find((row) => Number(row.sort_order || 0) === index);
          return existing?.id ? base44.entities.OfferVariant.update(existing.id, payload) : base44.entities.OfferVariant.create(payload);
        }));
      } catch (variantSaveError) { console.warn('Offer variants could not be persisted', variantSaveError); }

      await prepareOffer({
        product: autoProduct,
        basePrice: autoPrice,
        installation: 0,
        discount: 0,
        audienceVariant: autoAudience,
        visualizationUrl: result.visualization_url || '',
        visualizationUrls: Array.isArray(result.visualization_urls) ? result.visualization_urls : returnedVisualAssets.map((item) => item.file_url).filter(Boolean),
        attachments: nextAttachments,
        clientContent: result.ai_content ? {
          ...result.ai_content,
          solution_summary: `${result.ai_content.solution_summary || ''}${autoVariants.length > 1 ? `\n\nCenové varianty: ${autoVariants.map((variant) => `${variant.label}: ${Number(variant.price || 0).toLocaleString('cs-CZ')} Kč bez DPH`).join(' · ')}` : ''}`,
        } : null,
        projectOrder: result.project_order || null,
        priceIsEstimate: pricingSource === 'manual_required' || pricingSource === 'custom_sheet_estimate',
        variantPricing: autoVariants,
        pricing: result.pricing || null,
        customProduct: result.custom_product || null,
        customPricing: result.custom_pricing || null,
        auto: true,
      });
      await onSent?.();
      window.setTimeout(() => document.getElementById('offer-review')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy('');
    }
  };

  const sendTestEmail = async () => {
    const recipient = testEmail.trim().toLowerCase();
    if (!selected || !subject.trim() || !message.trim()) { setError('Nejdříve připravte předmět a text e-mailu.'); return; }
    if (!isValidEmail(recipient)) { setError('Zadejte platnou testovací e-mailovou adresu.'); return; }
    setError(''); setTestSentTo(''); setBusy('test-send');
    try {
      const actionDiscount = followUpType === 'action_discount';
      const previousTotal = Number(latestOffer?.total_price || 0);
      const newTotal = actionDiscount ? Math.round(previousTotal * (1 - Number(followUpDiscount || 0) / 100)) : 0;
      const followUpValidUntil = actionDiscount
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : latestOffer?.valid_until ? new Date(latestOffer.valid_until) : null;
      const validityLine = prepared ? `Cenová nabídka ${prepared.quoteNumber} je platná do ${prepared.validUntil.toLocaleDateString('cs-CZ')}.` : '';
      const portalLine = prepared ? 'Interaktivní nabídku, prezentaci a elektronické potvrzení objednávky najdete v portálu: https://mlzidla.cz/muj-projekt' : '';
      const testMessage = prepared
        ? withSignature([message.trim(), validityLine, portalLine].filter(Boolean).join('\n\n'))
        : message.trim();

      await base44.functions.invoke('sendInquiryReply', {
        inquiry_type: selected.type,
        inquiry_id: selected.id,
        subject,
        message: testMessage,
        sender_email: senderEmail,
        quote_pdf_base64: prepared?.quote?.pdf_base64,
        quote_filename: prepared?.quote?.filename,
        presentation_pdf_base64: prepared?.presentation?.presentation_pdf_base64,
        presentation_filename: prepared?.presentation?.presentation_filename,
        presentation_url: prepared?.presentation?.presentation_url || latestOffer?.presentation_url || '',
        quote_pdf_url: prepared?.quoteDriveUrl || latestOffer?.quote_pdf_url || '',
        portal_url: prepared || latestOffer ? 'https://mlzidla.cz/muj-projekt' : '',
        valid_until: prepared?.validUntil?.toISOString() || followUpValidUntil?.toISOString() || '',
        quote_number: prepared?.quoteNumber || latestOffer?.quote_number || '',
        project_summary: selected.message || '',
        email_type: followUpType || 'offer',
        discount_percent: actionDiscount ? Number(followUpDiscount || 0) : 0,
        previous_total: actionDiscount ? previousTotal : 0,
        new_total: actionDiscount ? newTotal : 0,
        attachments: prepared ? attachments : [],
        test_email: recipient,
        is_test: true,
      });
      setTestSentTo(recipient);
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setBusy(''); }
  };

  const sendReply = async () => {
    if (!selected || !prepared || !approvedToSend || !subject || !message) return;
    setError(''); setBusy('send');
    try {
      const validityLine = `Cenová nabídka ${prepared.quoteNumber} je platná do ${prepared.validUntil.toLocaleDateString('cs-CZ')}.`;
      const portalLine = 'Interaktivní nabídku, prezentaci a elektronické potvrzení objednávky najdete v portálu: https://mlzidla.cz/muj-projekt';
      const signedMessage = withSignature([message.trim(), validityLine, portalLine].filter(Boolean).join('\n\n'));
      await base44.functions.invoke('sendInquiryReply', {
        inquiry_type: selected.type, inquiry_id: selected.id, subject, message: signedMessage, sender_email: senderEmail,
        quote_pdf_base64: prepared.quote?.pdf_base64, quote_filename: prepared.quote?.filename,
        presentation_pdf_base64: prepared.presentation?.presentation_pdf_base64, presentation_filename: prepared.presentation?.presentation_filename,
        presentation_url: prepared.presentation?.presentation_url || '', quote_pdf_url: prepared.quoteDriveUrl || '', portal_url: 'https://mlzidla.cz/muj-projekt',
        valid_until: prepared.validUntil.toISOString(), quote_number: prepared.quoteNumber, attachments,
        project_summary: selected.message || '', email_type: 'offer',
      });
      if (prepared.projectOrder?.id) await base44.entities.ProjectOrder.update(prepared.projectOrder.id, { status: 'sent', sender_email: senderEmail, bcc_recipients: BCC });
      onSent(); setMessage(''); setSubject(''); setAttachments([]); setPrepared(null); setApprovedToSend(false);
    } catch (requestError) { setError(errorMessage(requestError)); } finally { setBusy(''); }
  };

  if (!selected) return <section className="border-t border-border py-14"><p className="text-muted-foreground">Zatím nejsou k dispozici žádné poptávky.</p></section>;

  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[.78fr_1.22fr] lg:px-10">
        <aside>
          <p className="font-mono text-[10px] tracking-[.16em] uppercase text-secondary">Poptávky</p>
          <h2 className="mt-2 font-heading text-3xl text-foreground">Tvorba nabídky</h2>
          <div className="relative mt-5">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Číslo nabídky, ID poptávky, klient, firma, e-mail…"
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-10 text-sm text-foreground outline-none transition focus:border-secondary"
              aria-label="Vyhledat poptávku nebo nabídku"
            />
            {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Vymazat hledání"><X size={15}/></button>}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground"><span>{filteredInquiries.length} z {inquiries.length} poptávek</span>{searchQuery && <span>Hledá i v číslech nabídek</span>}</div>
          <div className="mt-4 space-y-2">{filteredInquiries.map((item) => {
            const linkedOffers = ordersByInquiry[item.id] || [];
            return <button key={item.key} onClick={() => { setSelectedId(item.key); setError(''); setTestSentTo(''); setPrepared(null); setApprovedToSend(false); setFollowUpType(''); setLatestOffer(null); setFollowUpApproved(false); setSubject(''); setMessage(''); }} className={`w-full border p-4 text-left transition ${item.key === selectedId ? 'border-secondary bg-secondary/10' : 'border-border hover:border-secondary/40'}`}>
              <strong className="block text-sm text-foreground">{item.name}</strong>
              <span className="mt-1 block text-xs text-muted-foreground">{item.email}</span>
              <span className="mt-2 block font-mono text-[10px] text-muted-foreground">ID: {item.id}</span>
              {linkedOffers.length > 0 && <span className="mt-2 flex flex-wrap gap-1">{linkedOffers.slice(0, 3).map((offer) => <span key={offer.id} className="rounded-full border border-secondary/20 bg-secondary/5 px-2 py-1 font-mono text-[9px] text-secondary">{offer.quote_number || `Nabídka ${offer.id.slice(-6)}`}</span>)}</span>}
            </button>;
          })}
          {filteredInquiries.length === 0 && <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">Nenalezena žádná poptávka ani nabídka odpovídající hledání.</div>}</div>
        </aside>

        <div className="border border-border p-5 lg:p-7">
          <p className="text-sm font-semibold text-foreground">{selected.name} · {selected.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">Poptávka ID: {selected.id}</span>{selectedOffers.map((offer) => <span key={offer.id} className="rounded-full border border-secondary/20 bg-secondary/5 px-2.5 py-1 font-mono text-[10px] text-secondary">Nabídka: {offer.quote_number || offer.id}</span>)}</div>
          <p className="mt-3 text-sm text-muted-foreground">{selected.message}</p>

          {selectedOffers.length > 0 && <details className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-amber-950"><span className="flex items-center gap-2"><ReceiptText size={16}/> Příplatkové účtování projektu</span><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-amber-800 ring-1 ring-amber-200">{extraCharges.length} položek</span></summary>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">Nabídka / projekt<select value={extraChargeOfferId} onChange={(e) => setExtraChargeOfferId(e.target.value)} className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-3 text-sm text-slate-900">{selectedOffers.map((offer) => <option key={offer.id} value={offer.id}>{offer.quote_number || offer.project_name || offer.id}</option>)}</select></label>
              <label className="text-xs font-semibold text-slate-600">Název příplatkové položky<input value={extraChargeForm.title} onChange={(e) => setExtraChargeForm((current) => ({ ...current, title: e.target.value }))} placeholder="např. Dodatečné kotvení / prodloužení rozvodu" className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-3 text-sm text-slate-900"/></label>
              <label className="text-xs font-semibold text-slate-600 lg:col-span-2">Důvod a rozsah<textarea value={extraChargeForm.description} onChange={(e) => setExtraChargeForm((current) => ({ ...current, description: e.target.value }))} rows={3} placeholder="Popište, co je mimo původní rozsah nabídky a proč je položka účtována samostatně." className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-3 text-sm text-slate-900"/></label>
              <div className="grid grid-cols-[1fr_.8fr_1.4fr] gap-2 lg:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Množství<input type="number" min="0.01" step="0.01" value={extraChargeForm.quantity} onChange={(e) => setExtraChargeForm((current) => ({ ...current, quantity: Number(e.target.value) || 0 }))} className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-3 text-sm"/></label>
                <label className="text-xs font-semibold text-slate-600">Jednotka<input value={extraChargeForm.unit} onChange={(e) => setExtraChargeForm((current) => ({ ...current, unit: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-3 text-sm"/></label>
                <label className="text-xs font-semibold text-slate-600">Cena / jednotka bez DPH<input type="number" min="0" step="1" value={extraChargeForm.unit_price_ex_vat} onChange={(e) => setExtraChargeForm((current) => ({ ...current, unit_price_ex_vat: Number(e.target.value) || 0 }))} className="mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-3 text-sm"/></label>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 border-t border-amber-100 pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-amber-900">Celkem: <strong>{money(Math.round(Number(extraChargeForm.quantity || 0) * Number(extraChargeForm.unit_price_ex_vat || 0)))} Kč bez DPH</strong>. Klient položku uvidí v „Můj projekt“ a může ji schválit nebo odmítnout.</p><button type="button" onClick={createExtraCharge} disabled={extraChargeBusy || !extraChargeOfferId || !String(extraChargeForm.title || '').trim()} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-700 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-40">{extraChargeBusy ? 'Ukládám…' : 'Přidat ke schválení klientovi'}</button></div>
            {extraCharges.length > 0 && <div className="mt-5 space-y-2">{extraCharges.map((charge) => <div key={charge.id} className="flex flex-col gap-2 rounded-xl border border-amber-100 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><strong className="text-xs text-slate-900">{charge.title}</strong><span className={`rounded-full px-2 py-1 text-[9px] font-bold ${charge.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : charge.status === 'declined' ? 'bg-rose-100 text-rose-700' : charge.status === 'billed' ? 'bg-slate-900 text-white' : 'bg-amber-100 text-amber-800'}`}>{charge.status === 'approved' ? 'schváleno' : charge.status === 'declined' ? 'odmítnuto' : charge.status === 'billed' ? 'vyúčtováno' : 'čeká na klienta'}</span></div><p className="mt-1 text-[10px] text-slate-500">{charge.quote_number || 'bez čísla nabídky'}{charge.description ? ` · ${charge.description}` : ''}</p></div><strong className="whitespace-nowrap text-sm text-amber-800">{money(charge.total_price_ex_vat)} Kč bez DPH</strong></div>)}</div>}
          </details>}

          <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-800">Nejrychlejší postup</p>
                <h3 className="mt-1 font-heading text-2xl text-slate-950">Připravit nabídku automaticky</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">AI přečte poptávku, zvolí vhodný katalogový produkt nebo zakázkový směr, připraví cenové varianty, vygeneruje odpovídající vizualizace a sestaví PDF nabídku i klientskou prezentaci. Pokud je u poptávky uložená fotografie prostoru, použije ji jako scénu; jinak vytvoří zřetelně koncepční vizualizaci podle textu zadání.</p>
                <div className="mt-4 grid gap-2 text-[11px] text-slate-600 sm:grid-cols-4">
                  {['1. Poptávka', '2. Produkt + cena', '3. AI vizualizace', '4. PDF + kontrola'].map((step) => <span key={step} className="rounded-lg border border-cyan-100 bg-white px-3 py-2 font-semibold">{step}</span>)}
                </div>
              </div>
              <button type="button" onClick={autoPrepareFromText} disabled={busy === 'auto-offer' || !selected?.message} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0e5b67] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0b4b56] disabled:opacity-50"><Sparkles size={17}/>{busy === 'auto-offer' ? 'Připravuji nabídku a vizualizace…' : 'Připravit nabídku'}</button>
            </div>
            {busy === 'auto-offer' && <div className="mt-5 rounded-xl border border-cyan-200 bg-white px-4 py-3 text-xs leading-relaxed text-cyan-900"><strong>Probíhá automatická příprava.</strong> Kontroluji zadání, cenu a varianty, vytvářím vizualizace a následně PDF. Po dokončení se otevře kontrola nabídky před odesláním.</div>}
          </div>

          <details className="mt-5 rounded-2xl border border-border bg-background p-4">
            <summary className="cursor-pointer text-sm font-semibold text-foreground">Ruční doladění nabídky</summary>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-muted-foreground">Typ prezentace<select value={audienceVariant} onChange={(e) => { setAudienceVariant(e.target.value); resetPrepared(); }} className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm">{AUDIENCES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label className="text-xs text-muted-foreground">Odesílat z<select value={senderEmail} onChange={(e) => { setSenderEmail(e.target.value); resetPrepared(); }} className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm"><option value="meduna@holmtec.cz">meduna@holmtec.cz</option><option value="info@mlzidla.cz">info@mlzidla.cz</option></select></label>
            <select value={productId} onChange={(event) => chooseProduct(event.target.value)} className="border border-border bg-background px-3 py-2.5 text-sm"><option value="">Vybrat produkt pro nabídku</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select>
            <input type="number" value={basePrice} onChange={(event) => { setBasePrice(Number(event.target.value) || 0); resetPrepared(); }} placeholder="Cena produktu bez DPH" className="border border-border bg-background px-3 py-2.5 text-sm"/>
            <label className="text-xs text-muted-foreground">Cena instalace bez DPH<input type="number" value={installation} onChange={(event) => { setInstallation(Number(event.target.value) || 0); resetPrepared(); }} placeholder="Např. 25 000 Kč" className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm"/></label>
            <label className="text-xs text-muted-foreground">Sleva z celkové nabídky<input type="number" min="0" max="100" value={discount} onChange={(event) => { setDiscount(Number(event.target.value) || 0); resetPrepared(); }} placeholder="Např. 10 %" className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm"/></label>
          </div>
          <p className="mt-3 text-sm font-bold text-secondary">Cena projektu po slevě: {money(finalTotal)} Kč bez DPH</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Skrytá kopie bude vždy odeslána na: {BCC.join(', ')}</p>
          </details>

          <details className="mt-5 rounded-2xl border border-border bg-background p-4">
            <summary className="cursor-pointer text-sm font-semibold text-foreground">Pokročilé nástroje · Smart řízení, AI studio, follow-up a vlastní přílohy</summary>
            <div className="mt-5">
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-700">Smart řízení nabídky</p><h3 className="mt-1 font-heading text-xl text-slate-950">Provozní scénáře a přidané moduly</h3><p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-600">Vyberte scénáře, které mají být součástí profesionální nabídky. Nastavení se propíše do PDF a prezentace jako doporučená provozní logika pro daný projekt.</p></div></div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">{SMART_SCENARIO_PRESETS.map((scenario) => <div key={scenario.key} className={`rounded-xl border p-4 ${smartScenarios[scenario.key] ? 'border-cyan-300 bg-white' : 'border-slate-200 bg-white/60'}`}><label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={Boolean(smartScenarios[scenario.key])} onChange={(e) => { setSmartScenarios((current) => ({ ...current, [scenario.key]: e.target.checked })); resetPrepared(); }} className="mt-1 h-4 w-4"/><span><strong className="text-sm text-slate-900">{scenario.label}</strong><span className="mt-1 block text-xs leading-relaxed text-slate-500">{scenario.description}</span></span></label>{smartScenarios[scenario.key] && <input value={smartScenarioValues[scenario.key] || ''} onChange={(e) => { setSmartScenarioValues((current) => ({ ...current, [scenario.key]: e.target.value })); resetPrepared(); }} className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"/>}</div>)}</div>
          </div>

          <OfferAICopilot
            inquiry={selected}
            product={selectedProduct}
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            quoteContext={`${money(finalTotal)} Kč bez DPH · produkt ${money(basePrice)} Kč · instalace ${money(installation)} Kč · sleva ${Number(discount || 0)} %`}
            onPrepareOffer={prepareOffer}
            prepareBusy={busy === 'prepare'}
            onAutoPrepareFromText={autoPrepareFromText}
            autoPrepareBusy={busy === 'auto-offer'}
          />


          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-secondary">Follow-up klienta</p><h3 className="mt-1 font-heading text-xl text-foreground">Předdefinované profesionální šablony</h3><p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">Připomenutí poptávky, připomenutí poslední odeslané cenové nabídky nebo návrh jednorázového akčního zvýhodnění. Text můžete před odesláním vždy upravit.</p></div>
              <label className="w-full text-xs text-muted-foreground lg:w-40">Akční sleva %<input type="number" min="1" max="99" value={followUpDiscount} onChange={(e) => setFollowUpDiscount(Number(e.target.value) || 0)} className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground"/></label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">{FOLLOW_UP_TEMPLATES.map((template) => <button key={template.value} type="button" onClick={() => applyFollowUpTemplate(template.value)} disabled={busy === 'followup-template'} className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition ${followUpType === template.value ? 'border-secondary bg-secondary text-secondary-foreground' : 'border-border bg-white text-foreground hover:border-secondary/50'}`}>{busy === 'followup-template' ? 'Načítám…' : template.label}</button>)}</div>
            {latestOffer && <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600"><strong className="text-slate-900">Poslední nabídka:</strong> {latestOffer.quote_number || 'bez čísla'} · {latestOffer.product_name || selected.product || 'projekt'}{latestOffer.total_price ? ` · ${money(latestOffer.total_price)} Kč bez DPH` : ''}{latestOffer.valid_until ? ` · původní platnost do ${new Date(latestOffer.valid_until).toLocaleDateString('cs-CZ')}` : ''}</div>}
            {followUpType === 'action_discount' && latestOffer?.total_price > 0 && <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs leading-relaxed text-slate-700">Akční návrh: <strong>{money(latestOffer.total_price)} Kč</strong> → <strong className="text-cyan-800">{money(Math.round(Number(latestOffer.total_price) * (1 - Number(followUpDiscount || 0) / 100)))} Kč bez DPH</strong>. Platnost zvýhodnění bude 30 dní od odeslání. Původní PDF se nemění; po potvrzení zájmu se vystaví aktualizovaná formální nabídka.</div>}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={generateText} disabled={busy === 'text'} className="inline-flex items-center gap-2 border border-secondary px-4 py-2.5 text-sm font-bold text-secondary"><Sparkles size={15}/>{busy === 'text' ? 'Připravuji…' : 'Navrhnout text'}</button>
            <button onClick={prepareOffer} disabled={busy === 'prepare' || !selectedProduct} className="inline-flex items-center gap-2 bg-[#0b4860] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><FileText size={15}/>{busy === 'prepare' ? 'Generuji nabídku…' : prepared ? 'Přegenerovat nabídku' : 'Připravit PDF + prezentaci'}</button>
            <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-4 py-2.5 text-sm font-bold text-foreground"><Upload size={15}/>Přidat vlastní soubor<input type="file" multiple className="hidden" onChange={uploadFiles}/></label>
          </div>

          {mediaFiles.length > 0 && <div className="mt-3"><p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Knihovna příloh · kliknutím přidat do nabídky</p><div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">{mediaFiles.map((file) => {
            const chosen = attachments.some((item) => item.file_url === file.file_url);
            const imageFile = String(file.file_type || '').startsWith('image/') || /\.(png|jpe?g|webp|gif)(\?|$)/i.test(String(file.file_url || ''));
            return <button key={file.id} type="button" onClick={() => setAttachments((current) => chosen ? current.filter((item) => item.file_url !== file.file_url) : [...current, file])} className={`overflow-hidden rounded-xl border text-left transition ${chosen ? 'border-secondary ring-2 ring-secondary/10' : 'border-border hover:border-secondary/40'}`}>
              <div className="flex aspect-[4/3] items-center justify-center bg-muted">{imageFile ? <img src={file.file_url} alt={file.file_name || 'Příloha'} className="h-full w-full object-cover"/> : <FileText size={24} className="text-muted-foreground"/>}</div>
              <div className="flex items-center justify-between gap-2 px-2.5 py-2"><span className="min-w-0 truncate text-[10px] font-medium text-foreground">{file.file_name}</span>{chosen && <CheckCircle2 size={13} className="shrink-0 text-secondary"/>}</div>
            </button>;
          })}</div></div>}

            </div>
          </details>

          {prepared && (
            <div id="offer-review" className="mt-6 scroll-mt-24 rounded-2xl border border-cyan-300 bg-cyan-50/50 p-5 sm:p-6">
              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"><strong>Nabídka je připravená ke kontrole.</strong> {prepared.visualizationUrls?.length ? `Připojeno ${prepared.visualizationUrls.length} AI vizualizací.` : 'Vizualizaci lze případně doplnit před odesláním.'}</div>
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-mono uppercase tracking-widest text-cyan-800">Zkontrolovat a odeslat</p><p className="mt-1 text-sm font-semibold text-slate-950">{prepared.quoteNumber} · platnost do {prepared.validUntil.toLocaleDateString('cs-CZ')}</p></div><CheckCircle2 size={20} className="text-cyan-700"/></div>
              <div className="mt-4 flex flex-wrap gap-2">
                {prepared.quoteDriveUrl ? <a href={prepared.quoteDriveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>PDF nabídka <ExternalLink size={12}/></a> : prepared.quote?.pdf_base64 && <button type="button" onClick={downloadPreparedPdf} className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>Stáhnout PDF nabídku</button>}
                {prepared.presentation?.presentation_url && <a href={prepared.presentation.presentation_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>Google prezentace <ExternalLink size={12}/></a>}
                {prepared.presentation?.presentation_pdf_url && <a href={prepared.presentation.presentation_pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>PDF prezentace <ExternalLink size={12}/></a>}
                {prepared.notebookSourceUrl && <a href={prepared.notebookSourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>Podklady / Notebook <ExternalLink size={12}/></a>}
              </div>
              {prepared.customProduct && <div className="mt-4 rounded-2xl border border-amber-200 bg-white p-5"><div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-amber-700">Zakázkový výrobní koncept</p><h3 className="mt-2 font-heading text-2xl text-slate-950">{prepared.customProduct.name || 'Mlžítko na míru'}</h3><p className="mt-2 text-xs leading-relaxed text-slate-600">{prepared.customProduct.design_description || 'Minimalistický návrh připravený jako technicky dopracovatelný koncept.'}</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{[["Profil", prepared.customProduct.primary_profile],["Rozměry", prepared.customProduct.dimensions_summary],["Ohýbání", prepared.customProduct.bend_strategy],["Svařování", prepared.customProduct.weld_strategy],["Trysky", prepared.customProduct.nozzle_strategy],["Přívod vody", prepared.customProduct.water_connection_strategy]].filter(([, value]) => value).map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-xs leading-relaxed text-slate-700">{value}</p></div>)}</div>{Array.isArray(prepared.customProduct.manufacture_steps) && prepared.customProduct.manufacture_steps.length > 0 && <div className="mt-4"><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Výrobní postup</p><p className="mt-2 text-xs leading-5 text-slate-600">{prepared.customProduct.manufacture_steps.join(' → ')}</p></div>}</div>{prepared.customProduct.master_image_url && <div><img src={prepared.customProduct.master_image_url} alt={`MASTER koncept ${prepared.customProduct.name || 'zakázkového mlžítka'}`} className="aspect-[4/5] w-full rounded-xl border border-slate-200 object-cover"/><p className="mt-2 text-[10px] leading-relaxed text-slate-400">MASTER vizuál slouží jako geometrická reference pro další rendery. Před výrobou se potvrdí rozměry, rádiusy a kotvení.</p></div>}</div>{prepared.customPricing && <div className="mt-5 border-t border-slate-200 pt-4"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Pracovní výrobní kalkulace</p><p className="mt-1 text-xs text-slate-500">{prepared.customPricing.source}</p></div><div className="text-left sm:text-right"><p className="text-[10px] text-slate-500">Odhad pro 1 ks bez DPH</p><p className="text-xl font-bold text-[#0e5b67]">{money(prepared.customPricing.offer_price_ex_vat)} Kč</p></div></div>{prepared.customPricing.line_items?.length > 0 && <div className="mt-3 divide-y divide-slate-100 text-[11px]">{prepared.customPricing.line_items.slice(0, 12).map((line) => <div key={line.rate_key} className="flex items-start justify-between gap-4 py-2"><div><span className="text-slate-700">{line.label}</span><span className="ml-2 text-slate-400">{line.quantity} {line.unit}</span></div><strong className="whitespace-nowrap text-slate-700">{money(line.total)} Kč</strong></div>)}</div>}<div className="mt-3 grid gap-2 text-[11px] sm:grid-cols-3"><div className="rounded-lg bg-slate-50 p-2.5"><span className="block text-slate-400">Výrobní základ</span><strong className="text-slate-800">{money(prepared.customPricing.base_cost_ex_vat)} Kč</strong></div><div className="rounded-lg bg-slate-50 p-2.5"><span className="block text-slate-400">HZM / režie</span><strong className="text-slate-800">{prepared.customPricing.hzm_percent}% · {money(prepared.customPricing.hzm_amount)} Kč</strong></div><div className="rounded-lg bg-cyan-50 p-2.5"><span className="block text-cyan-700">Nabídkový odhad</span><strong className="text-cyan-900">{money(prepared.customPricing.offer_price_ex_vat)} Kč</strong></div></div>{prepared.customPricing.warnings?.length > 0 && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-800">{prepared.customPricing.warnings.join(' ')}</div>}<p className="mt-3 text-[10px] leading-relaxed text-slate-400">Jde o pracovní odhad z reálných výrobních sazeb. Finální obchodní cena se potvrdí po technické kontrole rozměrů, materiálu, rádiusů ohybu, kotvení a rozsahu instalace.</p></div>}</div>}
              {prepared.variantPricing?.length > 0 && <div className="mt-4 rounded-xl border border-cyan-100 bg-white p-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Varianty nacenění podle poptávky</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{prepared.variantPricing.map((variant, index) => <div key={`${variant.label}-${index}`} className="rounded-xl border border-slate-200 p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-slate-800">{variant.label}</p><p className="mt-1 text-[10px] text-slate-500">{variant.quantity} ks · {variant.unit_price > 0 ? `${money(variant.unit_price)} Kč / ks` : 'jednotková cena k doplnění'}</p></div><span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${index === 0 ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-500'}`}>{index === 0 ? 'Doporučená' : `Varianta ${index + 1}`}</span></div><p className="mt-3 text-sm font-bold text-[#0e5b67]">{variant.price_status === 'manual_required' || !Number(variant.price) ? 'K individuálnímu nacenění' : `${money(variant.price)} Kč bez DPH`}</p>{variant.pricing_label && <p className="mt-1 text-[9px] leading-relaxed text-slate-400">Zdroj ceny: {variant.pricing_label}</p>}{variant.visualization_url && <img src={variant.visualization_url} alt={`Vizualizace ${variant.label}`} className="mt-3 h-36 w-full rounded-lg object-cover"/>}</div>)}</div></div>}
              {attachments.filter((item) => item.asset_type === 'generated_visualization').length > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-2">{attachments.filter((item) => item.asset_type === 'generated_visualization').slice(0, 4).map((asset) => <div key={asset.id || asset.file_url} className="overflow-hidden rounded-xl border border-cyan-100 bg-white"><img src={asset.file_url} alt={asset.title || 'Vizualizace projektu'} className="h-48 w-full object-cover"/><p className="px-3 py-2 text-[11px] font-medium text-slate-600">{asset.title || 'Vizualizace varianty'}</p></div>)}</div>}
              {prepared.visualizationWarning && <div className="mt-3 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-900 sm:flex-row sm:items-center sm:justify-between"><span>{prepared.visualizationWarning}</span><button type="button" onClick={autoPrepareFromText} disabled={busy === 'auto-offer'} className="shrink-0 rounded-full border border-amber-300 bg-white px-3 py-2 text-[11px] font-bold text-amber-900 disabled:opacity-50">Zkusit vizualizace znovu</button></div>}
              {prepared.presentationWarning && <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">PDF nabídka byla připravena, ale prezentaci se nepodařilo dokončit: {prepared.presentationWarning}</p>}
              <p className="mt-3 text-xs leading-relaxed text-slate-600">Výstupy jsou klientské: bez interních poznámek, s projektovým shrnutím, vybranou vizualizací a cenou bez DPH. Před odesláním je můžete zkontrolovat a přegenerovat.</p>
            </div>
          )}

          <div className="mt-6 grid gap-3">
            <label className="text-xs font-semibold text-muted-foreground">Předmět e-mailu
              <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Předmět zprávy" className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground"/>
            </label>
            <label className="text-xs font-semibold text-muted-foreground">Text e-mailu
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Napište odpověď nebo si ji nechte navrhnout." rows={9} className="mt-1 w-full border border-border bg-background px-3 py-3 text-sm text-foreground"/>
            </label>
          </div>

          {(subject || message) && <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-[#f2f5f4]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3"><div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><Eye size={14}/> Náhled e-mailu zákazníkovi</div><span className="text-[10px] text-slate-400">Před odesláním lze vše upravit výše</span></div>
            <div className="p-4 sm:p-6">
              <div className="mx-auto max-w-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                <div className="h-1.5 bg-cyan-400"/>
                <div className="flex items-end justify-between gap-4 border-b border-slate-100 px-6 py-6"><div><div className="text-xl font-extrabold tracking-wide text-[#0d2d38]">MLŽIDLA® <span className="text-xs font-semibold text-slate-400">by HolmTec</span></div><div className="mt-1 text-[10px] uppercase tracking-[.16em] text-cyan-700">Projektový návrh · cenová nabídka</div></div><div className="text-right text-[10px] uppercase tracking-[.12em] text-slate-400">Architektonické mlžení</div></div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[.14em] text-cyan-700">Předmět</p><p className="mt-1 text-sm font-semibold text-slate-900">{subject || '—'}</p>
                  <div className="mt-5 whitespace-pre-line text-sm leading-6 text-slate-600">{message || '—'}</div>
                  {selected?.message && <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-[10px] uppercase tracking-[.12em] text-slate-500">Shrnutí vaší poptávky k nacenění</p><p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-600">{selected.message}</p></div>}
                  {attachments.some((item) => item.asset_type === 'generated_visualization') && <div className="mt-6"><p className="text-[10px] uppercase tracking-[.16em] text-cyan-700">Projektová vizualizace</p><div className="mt-3 grid gap-3">{attachments.filter((item) => item.asset_type === 'generated_visualization').slice(0, 3).map((item, index) => <div key={item.id || item.file_url} className="overflow-hidden border border-slate-200 bg-white"><img src={item.file_url} alt={item.title || 'Vizualizace projektu'} className={`${index === 0 ? 'aspect-[16/9]' : 'aspect-[16/10]'} w-full object-cover`}/><p className="truncate px-3 py-2 text-[10px] font-semibold text-slate-700">{item.title || 'Vizualizace projektu'}</p></div>)}</div></div>}
                  {prepared?.quote?.smart_pricing && <div className="mt-6 border border-slate-200 bg-slate-50 p-5"><p className="text-[10px] uppercase tracking-[.16em] text-cyan-700">Smart řízení projektu</p><h4 className="mt-2 font-heading text-xl text-slate-900">SUPLA jako provozní vrstva mlžítek.</h4><p className="mt-2 text-xs leading-5 text-slate-600">Wi‑Fi ovládání, libovolné harmonogramy, cykly, automatika podle teploty a vlhkosti, správa zón, měření spotřeby a volitelná logika podle externího API počasí.</p><div className="mt-4 divide-y divide-slate-200 text-xs">{[["PEVEKO SMART SUPLA Wi‑Fi ventil", prepared.quote.smart_pricing.component_wifi_valve_ex_vat],["Měření + správa spotřeby vody", Number(prepared.quote.smart_pricing.component_water_meter_ex_vat || 0) + Number(prepared.quote.smart_pricing.component_liw01_ex_vat || 0)],["Teplota + vlhkost THW‑01", prepared.quote.smart_pricing.component_thw01_ex_vat],["Kompletní projektové SUPLA řízení", prepared.quote.smart_pricing.complete_supla_ex_vat]].filter(([, price]) => Number(price) > 0).map(([label, price]) => <div key={label} className="flex items-center justify-between gap-4 py-2.5"><span className="text-slate-600">{label}</span><strong className="whitespace-nowrap text-[#0e5b67]">{money(price)} Kč bez DPH</strong></div>)}</div></div>}
                  {prepared && <div className="mt-5 rounded-xl border border-cyan-200 bg-cyan-50/60 p-4"><div className="text-xs font-semibold text-slate-900">Nabídka {prepared.quoteNumber}</div><div className="mt-1 text-xs text-slate-600">Cena projektu: <strong>{money(finalTotal)} Kč bez DPH</strong> · platnost do {prepared.validUntil.toLocaleDateString('cs-CZ')}</div><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-[#0e5b67] px-4 py-2 text-[11px] font-bold text-white">Souhlasím a objednávám</span><span className="rounded-full border border-slate-300 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700">Otevřít PDF nabídku</span>{prepared.presentation?.presentation_url && <span className="rounded-full bg-[#dff7fa] px-4 py-2 text-[11px] font-semibold text-[#0d2d38]">Prezentace projektu</span>}</div></div>}
                  <div className="mt-6 border-t border-slate-200 pt-5"><p className="text-[10px] uppercase tracking-[.14em] text-cyan-700">Projektový kontakt</p><p className="mt-1 text-sm font-bold text-slate-900">Ing. Radek Meduna</p><p className="mt-1 text-xs leading-5 text-slate-500">+420 774 700 390 · meduna@holmtec.cz · mlzidla.cz</p></div>
                </div>
              </div>
            </div>
          </div>}

          {(subject || message) && <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <label className="min-w-0 flex-1 text-xs font-semibold text-muted-foreground">Testovací e-mailová adresa
                <input
                  type="email"
                  value={testEmail}
                  onChange={(event) => { setTestEmail(event.target.value); setTestSentTo(''); }}
                  placeholder="např. jakub@firma.cz"
                  autoComplete="email"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition focus:border-secondary"
                />
              </label>
              <button type="button" onClick={sendTestEmail} disabled={busy === 'test-send' || !testEmail.trim() || !subject.trim() || !message.trim()} className="inline-flex items-center justify-center gap-2 rounded-full border border-secondary bg-white px-5 py-3 text-sm font-bold text-secondary transition hover:bg-secondary/5 disabled:opacity-40"><Send size={15}/>{busy === 'test-send' ? 'Odesílám test…' : 'Odeslat test'}</button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">Test odešle aktuální verzi e-mailu na zadanou adresu. Pokud je připravená nabídka, připojí i stejné PDF, prezentaci a vybrané přílohy. Klientovi se nic neodešle a stav poptávky ani nabídky se nezmění.</p>
            {testSentTo && <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">Testovací e-mail byl odeslán na {testSentTo}.</p>}
          </div>}

          {followUpType && <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-slate-700"><input type="checkbox" checked={followUpApproved} onChange={(e) => setFollowUpApproved(e.target.checked)} className="mt-0.5 h-4 w-4"/><span><strong>Schvaluji follow-up zprávu k odeslání.</strong><br/><span className="text-xs text-slate-500">E-mail použije jednotnou profesionální šablonu MLŽIDLA®, shrnutí projektu, kontaktní kartu a firemní patičku.</span></span></label>}
          {prepared && <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700"><input type="checkbox" checked={approvedToSend} onChange={(e) => setApprovedToSend(e.target.checked)} className="mt-0.5 h-4 w-4"/><span><strong>Schvaluji tuto verzi nabídky k odeslání.</strong><br/><span className="text-xs text-slate-500">Bez tohoto potvrzení systém nabídku zákazníkovi neodešle.</span></span></label>}

          {error && <p role="alert" className="mt-3 border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          <div className="mt-4 flex flex-wrap gap-3">
            {followUpType && <button onClick={sendFollowUp} disabled={busy === 'followup-send' || !followUpApproved || !subject || !message} className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-bold text-secondary-foreground disabled:opacity-40"><Send size={15}/>{busy === 'followup-send' ? 'Odesílám…' : 'Schválit a odeslat follow-up'}</button>}
            <button onClick={sendReply} disabled={busy === 'send' || !prepared || !approvedToSend || !subject || !message} className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-40"><Send size={15}/>{busy === 'send' ? 'Odesílám…' : 'Schválit a odeslat nabídku'}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
