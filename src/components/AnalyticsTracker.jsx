import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function AnalyticsTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: `${pathname}${search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
}