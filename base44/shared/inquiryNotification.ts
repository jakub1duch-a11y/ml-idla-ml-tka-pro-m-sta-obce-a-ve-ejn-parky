// Interní upozornění na novou poptávku. Odkazy vedou pouze do admin-only Base44 stránky.
// Nikdy neposílá žádnou odpověď zákazníkovi.
const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;',
}[c] as string));
const clean = (value: unknown, max = 5000) => String(value ?? '').trim().slice(0, max);
export function createInquiryNotification(input: {
  inquiryId: string;
  entity?: 'poptavka'|'contact';
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  product?: string;
  place?: string;
  message?: string;
}) {
  const base = 'https://mlzidla.cz/admin?tab=poptavky&inquiry='+encodeURIComponent(input.inquiryId)
    +'&entity='+encodeURIComponent(input.entity || 'poptavka');
  const actions = [
    { label: 'Zobrazit / tisknout', url: base+'&action=print' },
    { label: 'Stáhnout PDF', url: base+'&action=download' },
    { label: 'Připravit nabídku', url: base+'&action=prepare' },
  ];
  const value = (v: unknown) => clean(v, 500);
  const rows: [string,string][] = [
    ['Zákazník',value(input.name)],
    ['Firma',value(input.company)],
    ['E-mail',value(input.email)],
    ['Telefon',value(input.phone)],
    ['Produkt',value(input.product)],
    ['Místo',value(input.place)],
    ['ID poptávky',input.inquiryId],
  ].filter(([,v]) => Boolean(v)) as [string,string][];
  const table = rows.map(([label,v]) => '<tr><th align="left" style="padding:9px 12px;border-bottom:1px solid #e3e9e8;color:#536e74;font-weight:500;width:145px">'+escape(label)+'</th><td style="padding:9px 12px;border-bottom:1px solid #e3e9e8;color:#183640">'+escape(v)+'</td></tr>').join('');
  const links = actions.map(({label,url}) => '<a href="'+escape(url)+'" style="display:inline-block;margin:5px 8px 5px 0;padding:12px 15px;border-radius:10px;background:#d9f4f6;color:#113a45;text-decoration:none;font-size:13px;font-weight:700">'+escape(label)+'</a>').join('');
  const html = '<!doctype html><html lang="cs"><head><meta charset="utf-8"></head><body style="background:#f2f6f6;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;color:#16343d"><div style="max-width:700px;margin:0 auto;background:white;border:1px solid #dbe7e7">'
    +'<div style="padding:23px 28px;background:#0d303d;color:white"><div style="font-size:11px;letter-spacing:.14em;color:#8ee3e8">MLŽIDLA.cz / OBCHODNÍ ADMINISTRACE</div><h1 style="margin:10px 0 0;font-size:24px">Nová poptávka · '+escape(value(input.name))+'</h1></div>'
    +'<div style="padding:26px 28px"><p style="font-size:14px;line-height:1.6">Na webu byla vytvořena nová zákaznická poptávka. Údaje jsou uložené v Base44.</p>'
    +'<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:13px">'+table+'</table>'
    +'<h2 style="font-size:14px;color:#0d303d;margin:22px 0 8px">Původní zpráva</h2><div style="white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f7f7;padding:18px;font-size:14px;line-height:1.6">'+escape(clean(input.message, 6000))+'</div>'
    +'<h2 style="font-size:14px;color:#0d303d;margin:24px 0 6px">Akce v administraci</h2>'+links
    +'<p style="color:#67818a;font-size:12px;line-height:1.6">Odkazy vedou do zabezpečené administrace konkrétní poptávky. Po přihlášení jsou dostupné akce Tisk, Stáhnout PDF a Připravit nabídku. Žádná odpověď zákazníkovi se automaticky neposílá.</p>'
    +'</div></div></body></html>';
  const plain = [
    'Nová poptávka na MLŽIDLA.cz',
    ...rows.map(([key,v]) => key+': '+v),
    '',
    clean(input.message, 6000),
    '',
    ...actions.map(({label,url})=>label+': '+url),
  ].join('\n');
  return { html, plain, links: actions };
}
