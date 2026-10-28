import { useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function useDocumentRequest(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };
  const submit = async (event) => {
    event.preventDefault();
    if (pending.current || sent) return;
    if (!values.name.trim() || !values.email.trim() || !values.document.trim() || !values.consent) {
      setError('Vyplňte jméno, e-mail a požadované podklady a potvrďte souhlas.');
      return;
    }
    pending.current = true;
    setSending(true);
    setError('');
    try {
      const record = await base44.entities.ContactInquiry.create({
        name: values.name.trim(), email: values.email.trim().toLowerCase(),
        service_type: 'technical_documents', status: 'new',
        message: ['ŽÁDOST O TECHNICKÉ PODKLADY', `Podklady: ${values.document.trim()}`,
          values.product.trim() && `Produkt: ${values.product.trim()}`,
          values.company.trim() && `Firma / organizace: ${values.company.trim()}`,
          values.details.trim() && `Účel / projekt: ${values.details.trim()}`,
          `Souhlas se zpracováním kontaktních údajů pro vyřízení žádosti: ${new Date().toISOString()}`,
        ].filter(Boolean).join('\n\n'),
      });
      if (!record?.id) throw new Error('Žádost nebyla potvrzena.');
      setSent(true);
    } catch {
      setError('Žádost se nepodařilo uložit. Zkuste ji prosím odeslat znovu.');
      return;
    } finally {
      pending.current = false;
      setSending(false);
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { send_to: 'AW-18399688870/HiIQCMXhxuQcEKbx08VE' });
    }
  };
  return { values, change, submit, sending, sent, error };
}