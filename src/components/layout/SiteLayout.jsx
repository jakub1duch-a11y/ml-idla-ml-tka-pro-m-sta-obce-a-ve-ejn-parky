import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import NotificationPrompt from '@/components/common/NotificationPrompt';
import CookieConsent from '@/components/common/CookieConsent';

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <NotificationPrompt />
      <CookieConsent />
    </div>
  );
}