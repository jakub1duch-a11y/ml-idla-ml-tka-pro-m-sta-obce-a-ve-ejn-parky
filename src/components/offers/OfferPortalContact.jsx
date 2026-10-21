import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CONTACT } from '@/components/offers/OfferPageParts';
const URL = 'https://mlzidla.cz/muj-projekt';
export default function OfferPortalContact() {
  const [qr, setQr] = useState('');
  useEffect(() => { let active = true; QRCode.toString(URL, { type: 'svg', margin: 4, errorCorrectionLevel: 'M' }).then(svg => { if (active) setQr(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`); }); return () => { active = false; }; }, []);
  return <footer className="op-final-contact"><div className="op-portal-panel"><div><h3 className="op-h2 op-green">Můj projekt</h3><p className="op-txt">Správa nabídky online a potvrzení objednávky.</p><a className="op-portal-link" href={URL} target="_blank" rel="noreferrer">mlzidla.cz/muj-projekt →</a><p className="op-cap">Přihlaste se účtem spojeného klienta. Otevření QR kódu není objednávkou.</p></div>{qr && <img src={qr} alt="QR kód pro Můj projekt"/>}</div><div className="op-txt"><b>{CONTACT.name} · HolmTec s.r.o.</b><br/>{CONTACT.email} · {CONTACT.phone} · {CONTACT.site}</div></footer>;
}