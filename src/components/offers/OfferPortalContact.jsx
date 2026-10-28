import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CONTACT } from '@/components/offers/OfferPageParts';
const URL = 'https://mlzidla.cz/kontakt';
export default function OfferPortalContact() {
  const [qr, setQr] = useState('');
  useEffect(() => { let active = true; QRCode.toString(URL, { type: 'svg', margin: 4, errorCorrectionLevel: 'M' }).then(svg => { if (active) setQr(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`); }); return () => { active = false; }; }, []);
  return <footer className="op-final-contact"><div className="op-portal-panel"><div><h3 className="op-h2 op-green">Kontakt</h3><p className="op-txt">Dotazy k nabídce a domluva dalšího postupu.</p><a className="op-portal-link" href={URL} target="_blank" rel="noreferrer">mlzidla.cz/kontakt →</a><p className="op-cap">Pro potvrzení objednávky kontaktujte našeho obchodníka.</p></div>{qr && <img src={qr} alt="QR kód pro kontakt"/>}</div><div className="op-txt"><b>{CONTACT.name} · HolmTec s.r.o.</b><br/>{CONTACT.email} · {CONTACT.phone} · {CONTACT.site}</div></footer>;
}