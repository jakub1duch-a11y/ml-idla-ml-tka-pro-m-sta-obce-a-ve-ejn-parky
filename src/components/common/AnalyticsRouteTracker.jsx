import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGoogleAnalytics, trackPageView } from '@/lib/ga4';

export default function AnalyticsRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    void initGoogleAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`, document.title);
  }, [location.pathname, location.search]);

  return null;
}
