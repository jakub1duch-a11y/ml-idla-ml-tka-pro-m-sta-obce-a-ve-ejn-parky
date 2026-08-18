import React, { useMemo, useState } from 'react';
import { CheckCircle2, ExternalLink, Eye, FileText, Search, Send, Sparkles, Upload, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { withSignature } from '@/components/offers/messageSignature';
import OfferAICopilot from '@/components/offers/OfferAICopilot';

const money = (value) => new Intl.NumberFormat('cs-CZ').format(Number(value || 0));
const errorMessage = (error) => error?.response?.data?.error || error?.message || 'Akci se nepodařilo dokončit.';
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

export default function InquiryManager({ inquiries, products, mediaFiles, projectOrders = [], onSent }) {
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
  const [approvedToSend, setApprovedToSend] = useState(false);
  const [prepared, setPrepared] = useState(null);
  const [followUpType, setFollowUpType] = useState('');
  const [followUpDiscount, setFollowUpDiscount] = useState(5);
  const [latestOffer, setLatestOffer] = useState(null);
  const [followUpApproved, setFollowUpApproved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

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

  const resetPrepared = () => { setPrepared(null); setApprovedToSend(false); };
  const resetFollowUp = () => { setFollowUpType(''); setLatestOffer(null); setFollowUpApproved(false); };
  const chooseProduct = (id) => { const product = products.find((item) => item.id === id); setProductId(id); setBasePrice(product?.price_from || 0); resetPrepared(); };

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
    const clientContentOverride = options.clientContent || null;
    const projectOrderOverride = options.projectOrder || null;
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
      const arUrl = productForOffer.slug === 'mlzitko-bendy'
        ? 'https://mlzidla.cz/ar/bendy-single'
        : productForOffer.slug === 'mlzna-brana-gate'
          ? 'https://mlzidla.cz/ar/gate'
          : `https://mlzidla.cz/produkt/${productForOffer.slug}`;
      const visualizationUrl = visualizationOverride || attachments.find((item) => item.asset_type === 'generated_visualization' && item.file_url)?.file_url || '';

      let clientContent = clientContentOverride || {
        project_goal: `Návrh řešení ${productForOffer.name} pro ${selected.firma || selected.company || selected.name}.`,
        solution_summary: productForOffer.short_description || 'Minimalistické nerezové mlžení navržené pro konkrétní prostor.',
        benefits: [],
        next_step: 'Po odsouhlasení konceptu upřesníme technické návaznosti a finální rozsah realizace.',
        presentation_title: `${productForOffer.name} — návrh řešení`,
      };
      try {
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
        quote: { final_total: finalTotalForOffer, base_price: basePriceForOffer, installation: installationForOffer, discount_percent: discountForOffer },
        quote_number: quoteNumber,
        valid_until: validUntil.toISOString(),
        portal_url: 'https://mlzidla.cz/muj-projekt',
        ar_url: arUrl,
        audience_variant: audienceForOffer,
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
          quote: { quote_number: quoteNumber, final_total: finalTotalForOffer, issued_at: issuedAt.toISOString(), valid_until: validUntil.toISOString() },
          ar_url: arUrl,
          ar_capture_url: visualizationUrl,
          ai_content: clientContent,
          audience_variant: audienceForOffer,
        });
        presentation = presentationResponse.data;
      } catch (presentationError) {
        presentationWarning = errorMessage(presentationError);
        console.warn('Offer presentation unavailable', presentationError);
      }

      let notebookSourceUrl = '';
      try {
        const sourcePackResponse = await base44.functions.invoke('generateOfferSourcePack', {
          inquiry: { name: selected.name, email: selected.email, phone: selected.telefon || selected.phone || '', company: selected.firma || selected.company || '', message: clientContent.project_goal },
          product: productForOffer,
          quote: { quote_number: quoteNumber, final_total: finalTotalForOffer, base_price: basePriceForOffer, installation: installationForOffer, discount_percent: discountForOffer, issued_at: issuedAt.toISOString(), valid_until: validUntil.toISOString() },
          presentation_url: presentation?.presentation_url || '', quote_pdf_url: quoteDriveUrl, ar_url: arUrl, audience_variant: audienceForOffer,
        });
        notebookSourceUrl = sourcePackResponse.data?.source_url || '';
      } catch (sourcePackError) { console.warn('NotebookLM source pack unavailable', sourcePackError); }

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

      setPrepared({ projectOrder, quote, quoteDriveUrl, presentation, presentationWarning, notebookSourceUrl, inquiryArchive, quoteNumber, validUntil, arUrl, visualizationUrl, clientContent });
      if (!subject.trim()) setSubject(`Cenová nabídka ${quoteNumber} | ${productForOffer.name} | MLŽIDLA®`);
      if (!message.trim()) setMessage(`Dobrý den,\n\nděkujeme za vaši poptávku. Na základě zaslaného zadání jsme připravili cenovou nabídku pro projekt „${productForOffer.name}“.\n\nV e-mailu najdete shrnutí vašeho zadání, cenovou nabídku a podle dostupných podkladů také projektovou prezentaci. Nabídku si můžete prohlédnout online, stáhnout jako PDF a v zákaznickém portálu ji také elektronicky potvrdit.\n\nPokud chcete před objednáním upravit rozsah, termín, způsob instalace nebo jiné části řešení, odpovězte prosím na tento e-mail. Rádi nabídku upravíme podle finálního zadání.\n\nV případě dotazů je vám k dispozici Ing. Radek Meduna, +420 774 700 390, meduna@holmtec.cz.`);
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
            return <button key={item.key} onClick={() => { setSelectedId(item.key); setError(''); setPrepared(null); setApprovedToSend(false); setFollowUpType(''); setLatestOffer(null); setFollowUpApproved(false); setSubject(''); setMessage(''); }} className={`w-full border p-4 text-left transition ${item.key === selectedId ? 'border-secondary bg-secondary/10' : 'border-border hover:border-secondary/40'}`}>
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

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-muted-foreground">Typ prezentace<select value={audienceVariant} onChange={(e) => { setAudienceVariant(e.target.value); resetPrepared(); }} className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm">{AUDIENCES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label className="text-xs text-muted-foreground">Odesílat z<select value={senderEmail} onChange={(e) => { setSenderEmail(e.target.value); resetPrepared(); }} className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm"><option value="meduna@holmtec.cz">meduna@holmtec.cz</option><option value="info@mlzidla.cz">info@mlzidla.cz</option></select></label>
            <select value={productId} onChange={(event) => chooseProduct(event.target.value)} className="border border-border bg-background px-3 py-2.5 text-sm"><option value="">Vybrat produkt pro nabídku</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select>
            <input type="number" value={basePrice} onChange={(event) => { setBasePrice(Number(event.target.value) || 0); resetPrepared(); }} placeholder="Cena produktu bez DPH" className="border border-border bg-background px-3 py-2.5 text-sm"/>
            <label className="text-xs text-muted-foreground">Cena instalace bez DPH<input type="number" value={installation} onChange={(event) => { setInstallation(Number(event.target.value) || 0); resetPrepared(); }} placeholder="Např. 25 000 Kč" className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm"/></label>
            <label className="text-xs text-muted-foreground">Sleva z celkové nabídky<input type="number" min="0" max="100" value={discount} onChange={(event) => { setDiscount(Number(event.target.value) || 0); resetPrepared(); }} placeholder="Např. 10 %" className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm"/></label>
          </div>
          <p className="mt-3 text-sm font-bold text-secondary">Cena projektu po slevě: {money(finalTotal)} Kč bez DPH</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Skrytá kopie bude vždy odeslána na: {BCC.join(', ')}</p>

          <OfferAICopilot
            inquiry={selected}
            product={selectedProduct}
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            quoteContext={`${money(finalTotal)} Kč bez DPH · produkt ${money(basePrice)} Kč · instalace ${money(installation)} Kč · sleva ${Number(discount || 0)} %`}
            onPrepareOffer={prepareOffer}
            prepareBusy={busy === 'prepare'}
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

          {prepared && (
            <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-mono uppercase tracking-widest text-cyan-800">Náhled před odesláním</p><p className="mt-1 text-sm font-semibold text-slate-950">{prepared.quoteNumber} · platnost do {prepared.validUntil.toLocaleDateString('cs-CZ')}</p></div><CheckCircle2 size={20} className="text-cyan-700"/></div>
              <div className="mt-4 flex flex-wrap gap-2">
                {prepared.quoteDriveUrl ? <a href={prepared.quoteDriveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>PDF nabídka <ExternalLink size={12}/></a> : prepared.quote?.pdf_base64 && <button type="button" onClick={downloadPreparedPdf} className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>Stáhnout PDF nabídku</button>}
                {prepared.presentation?.presentation_url && <a href={prepared.presentation.presentation_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>Google prezentace <ExternalLink size={12}/></a>}
                {prepared.presentation?.presentation_pdf_url && <a href={prepared.presentation.presentation_pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>PDF prezentace <ExternalLink size={12}/></a>}
                {prepared.notebookSourceUrl && <a href={prepared.notebookSourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/>Podklady / Notebook <ExternalLink size={12}/></a>}
              </div>
              {prepared.visualizationUrl && <div className="mt-4 overflow-hidden rounded-xl border border-cyan-100 bg-white"><img src={prepared.visualizationUrl} alt="Vizualizace projektu vložená do nabídky" className="max-h-72 w-full object-cover"/><p className="px-3 py-2 text-[11px] text-slate-500">Tato vizualizace je vybraná pro klientskou prezentaci.</p></div>}
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

          {(subject || message) && <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-[#eef3f4]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3"><div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><Eye size={14}/> Náhled e-mailu zákazníkovi</div><span className="text-[10px] text-slate-400">Před odesláním lze vše upravit výše</span></div>
            <div className="p-4 sm:p-6">
              <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-[#0d2d38] px-6 py-5"><div className="text-xl font-extrabold tracking-wide text-[#61d5e5]">MLŽIDLA® <span className="text-xs font-semibold text-white/50">by HolmTec</span></div><div className="mt-1 text-[10px] uppercase tracking-[.14em] text-white/55">Cenová nabídka projektu</div></div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[.14em] text-cyan-700">Předmět</p><p className="mt-1 text-sm font-semibold text-slate-900">{subject || '—'}</p>
                  <div className="mt-5 whitespace-pre-line text-sm leading-6 text-slate-600">{message || '—'}</div>
                  {selected?.message && <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-[10px] uppercase tracking-[.12em] text-slate-500">Shrnutí vaší poptávky k nacenění</p><p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-600">{selected.message}</p></div>}
                  {prepared && <div className="mt-5 rounded-xl border border-cyan-200 bg-cyan-50/60 p-4"><div className="text-xs font-semibold text-slate-900">Nabídka {prepared.quoteNumber}</div><div className="mt-1 text-xs text-slate-600">Cena projektu: <strong>{money(finalTotal)} Kč bez DPH</strong> · platnost do {prepared.validUntil.toLocaleDateString('cs-CZ')}</div><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-[#0e5b67] px-4 py-2 text-[11px] font-bold text-white">Souhlasím a objednávám</span><span className="rounded-full border border-slate-300 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700">Otevřít PDF nabídku</span>{prepared.presentation?.presentation_url && <span className="rounded-full bg-[#dff7fa] px-4 py-2 text-[11px] font-semibold text-[#0d2d38]">Prezentace projektu</span>}</div></div>}
                  <div className="mt-5 rounded-xl bg-[#0d2d38] p-4 text-white"><p className="text-[10px] uppercase tracking-[.12em] text-[#61d5e5]">Technický kontakt</p><p className="mt-1 text-sm font-bold">Ing. Radek Meduna</p><p className="mt-1 text-xs leading-5 text-white/70">+420 774 700 390 · meduna@holmtec.cz · info@mlzidla.cz</p></div>
                </div>
              </div>
            </div>
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
