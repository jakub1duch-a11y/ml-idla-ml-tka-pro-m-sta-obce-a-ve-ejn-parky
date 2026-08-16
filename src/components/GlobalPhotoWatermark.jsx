import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const WATERMARK_CLASS = 'mlz-photo-watermark';
const HOST_CLASS = 'mlz-photo-watermark-host';

const shouldSkipImage = (img) => {
  if (!img || img.closest('[data-no-watermark="true"]')) return true;

  const src = (img.currentSrc || img.src || '').toLowerCase();
  const alt = (img.alt || '').toLowerCase();

  if (!src || src.startsWith('data:image/svg') || src.endsWith('.svg')) return true;
  if (/(logo|logotyp|qr kód|qr kod|ikona|icon|favicon)/i.test(`${src} ${alt}`)) return true;

  const rect = img.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0 && (rect.width < 120 || rect.height < 90)) return true;

  return false;
};

const ensureWatermark = (host) => {
  if (!host || host.closest('[data-no-watermark="true"]')) return;
  if (host.querySelector(`:scope > .${WATERMARK_CLASS}`)) return;

  const computed = window.getComputedStyle(host);
  if (computed.position === 'static') host.classList.add(HOST_CLASS);

  const mark = document.createElement('span');
  mark.className = WATERMARK_CLASS;
  mark.setAttribute('aria-hidden', 'true');
  mark.textContent = 'MLŽIDLA® · by HolmTec';
  host.appendChild(mark);
};

export default function GlobalPhotoWatermark() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return undefined;

    let raf = 0;

    const process = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.querySelectorAll('img').forEach((img) => {
          if (shouldSkipImage(img)) return;
          const host = img.parentElement;
          if (host) ensureWatermark(host);
        });

        document.querySelectorAll('[style*="background-image"], [style*="backgroundImage"]').forEach((el) => {
          const bg = window.getComputedStyle(el).backgroundImage;
          if (bg && bg !== 'none') ensureWatermark(el);
        });
      });
    };

    process();

    const observer = new MutationObserver(process);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'style'],
    });

    window.addEventListener('resize', process, { passive: true });
    window.addEventListener('load', process, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', process);
    };
  }, [location.pathname]);

  return null;
}
