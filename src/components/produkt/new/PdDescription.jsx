import React from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';

import detailPhotos from '../../../../data/product-detail-photos.json';
import './PdDescription.css';

const IMAGE_RE = /\.(avif|gif|jpe?g|png|svg|webp)(\?|#|$)/i;
const isImage = (url) => typeof url === 'string' && IMAGE_RE.test(url);

export default function PdDescription({ product }) {
  const photo = detailPhotos[product.slug];
  const studio = isImage(product.image_url) ? product.image_url : isImage(photo?.url) ? photo.url : '';
  const body = product.description || product.short_description || '';
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(body);

  return (
    <section id="popis" className="pd-desc scroll-mt-36">
      <div className="pd-desc-grid">
        <div className="min-w-0">
          <p className="pd-desc-eyebrow">Popis produktu</p>
          <h2 className="pd-desc-title">{product.name}</h2>
          <p className="pd-desc-sub">Provedení, princip a technické souvislosti pro výběr řešení.</p>

          {studio && (
            <figure className="pd-desc-studio">
              <span className="pd-desc-studio-badge">Studiový náhled</span>
              <img
                src={studio}
                alt={product.image_alt || `${product.name} — studiový náhled produktu`}
                width={1200}
                height={900}
                loading="eager"
                decoding="async"
              />
            </figure>
          )}
        </div>

        <div className="pd-desc-body min-w-0 text-base text-card-foreground [&_p+p]:mt-4 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-2 [&_a]:text-primary [&_a]:underline [&_table]:block [&_table]:overflow-x-auto [&_td]:border [&_td]:border-border [&_td]:p-3 [&_th]:border [&_th]:border-border [&_th]:p-3">
          {body ? hasHtml ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body, { ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td'], ALLOWED_ATTR: ['href', 'title'] }) }} /> : <ReactMarkdown>{body}</ReactMarkdown> : <p>Podrobný popis připravujeme. Dostupné technické údaje najdete níže.</p>}
        </div>
      </div>
    </section>
  );
}