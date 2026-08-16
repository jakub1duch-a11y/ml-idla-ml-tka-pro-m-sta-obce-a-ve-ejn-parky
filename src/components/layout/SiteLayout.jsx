import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LocalizedFooter from './LocalizedFooter';
import { getLocaleFromPath } from '@/lib/i18n';
import NotificationPrompt from '@/components/common/NotificationPrompt';
import CookieConsent from '@/components/common/CookieConsent';

export default function SiteLayout() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {locale === 'cs' ? <Footer /> : <LocalizedFooter locale={locale} />}
      <NotificationPrompt />
      <CookieConsent />
    </div>
  );
}