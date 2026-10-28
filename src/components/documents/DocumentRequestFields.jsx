import React from 'react';

const fields = [
  { name: 'name', label: 'Jméno a příjmení', required: true, autoComplete: 'name', maxLength: 160 },
  { name: 'email', label: 'E-mail', required: true, type: 'email', autoComplete: 'email', maxLength: 254 },
  { name: 'company', label: 'Firma / organizace', autoComplete: 'organization', maxLength: 200 },
  { name: 'product', label: 'Produkt (pokud jej znáte)', maxLength: 200 },
];
const inputClass = 'mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground focus-visible:ring-2 focus-visible:ring-ring';

export default function DocumentRequestFields({ values, onChange }) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className="text-sm font-medium text-foreground" htmlFor={`document-${field.name}`}>
            {field.label}{field.required ? ' *' : ''}
            <input id={`document-${field.name}`} name={field.name} value={values[field.name]} onChange={onChange} type={field.type || 'text'} required={field.required} autoComplete={field.autoComplete} maxLength={field.maxLength} className={inputClass} />
          </label>
        ))}
      </div>
      <label className="mt-5 block text-sm font-medium text-foreground" htmlFor="document-requested">
        Požadované podklady *
        <textarea id="document-requested" name="document" required maxLength={1000} value={values.document} onChange={onChange} rows={3} placeholder="Například technický list, výkres kotvení nebo montážní návod…" className={inputClass} />
      </label>
      <label className="mt-5 block text-sm font-medium text-foreground" htmlFor="document-details">
        Účel použití / informace o projektu (nepovinné)
        <textarea id="document-details" name="details" maxLength={2000} value={values.details} onChange={onChange} rows={3} placeholder="Místo instalace, fáze projektu nebo upřesnění požadavku…" className={inputClass} />
      </label>
    </>
  );
}