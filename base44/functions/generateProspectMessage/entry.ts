import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';

const REFERENCES = {
  zoo_praha: {
    label: 'ZOO Praha',
    url: 'https://mlzidla.cz/reference/mlzitka-pro-zoo-praha',
    desc: 'mlžítka pro zoologickou zahradu Praha'
  },
  polna: {
    label: 'Město Polná',
    url: 'https://mlzidla.cz/reference/mesto-polna-mlzitko-mrkev',
    desc: 'mlžítko MRAK pro město Polná'
  },
  jicin: {
    label: 'Město Jičín',
    url: 'https://mlzidla.cz/reference/bendy-jicinske-namesti',
    desc: 'mlžítka BENDY pro Jičínské náměstí'
  }
};

const SEGMENT_LABELS: Record<string, string> = {
  architekt: 'architekt / krajinářský architekt',
  starosta: 'starosta',
  mistostarosta: 'místostarosta',
  manazer: 'manažer veřejných zakázek / provozu',
  projektant: 'projektant / inženýr',
  rozvojove_odbory: 'odbor rozvoje města / úřad',
  jiny: 'rozhodující osoba'
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { prospect_id, reference_key, custom_context } = await req.json();

    if (!prospect_id) return Response.json({ error: 'prospect_id je povinný' }, { status: 400 });

    const prospect = await base44.entities.LinkedInProspect.get(prospect_id);
    if (!prospect) return Response.json({ error: 'Kontakt nebyl nalezen' }, { status: 404 });

    const refKey = reference_key || prospect.reference_used || 'zoo_praha';
    const reference = REFERENCES[refKey as keyof typeof REFERENCES] || REFERENCES.zoo_praha;
    const segmentLabel = SEGMENT_LABELS[prospect.segment] || 'rozhodující osoba';

    const contextLine = custom_context ? `\n\nKontext z profilu / aktuální aktuality: ${custom_context}` : '';

    const prompt = `Jsi obchodní asistent značky MLŽIDLA® (HolmTec s.r.o.) — český výrobce zakázkových nerezových mlžítek a mlžných systémů pro veřejný prostor.

Napiš KRÁTKOU personalizovanou LinkedIn zprávu (max 600 znaků, ideálně 3–4 věty) pro oslovení tohoto kontaktu:

Jméno: ${prospect.name}
Pozice: ${prospect.role || segmentLabel}
Organizace: ${prospect.organization || 'neuvedeno'}
Segment: ${segmentLabel}${contextLine}

Pravidla:
- Tón: profesionální, důvěryhodný, stručný — žádný agresivní prodej.
- Přirozeně uveď, že jsme realizovali ${reference.desc} a odkaz na reference: ${reference.url}
- Nabídněte nezávaznou konzultaci nebo prohlídku lokality.
- Neuváděj cenu ani technické parametry.
- Piš česky, přirozenou a lidskou formou.
- Nepoužívej oslovení „Vážený pane/paní" — použij přirozené „Dobrý den, [jméno]".
- Vrať pouze text zprávy bez předmětu, bez podpisu (podpis přidáme automaticky).

Podpis, který se připojí:
Ing. Radek Meduna · MLŽIDLA® / HolmTec · mlzidla.cz · +420 774 700 390`;

    const llmResponse = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    });

    const message = (llmResponse as any)?.message || '';

    await base44.entities.LinkedInProspect.update(prospect_id, {
      outreach_message: message,
      reference_used: refKey,
      status: 'ke_kontaktu'
    });

    return Response.json({
      ok: true,
      message,
      reference: { label: reference.label, url: reference.url }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}