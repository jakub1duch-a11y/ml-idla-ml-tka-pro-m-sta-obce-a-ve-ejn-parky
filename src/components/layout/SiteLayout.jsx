import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import NotificationPrompt from '@/components/common/NotificationPrompt';
import CookieConsent from '@/components/common/CookieConsent';
import ContextualFooterLinks from '@/components/common/ContextualFooterLinks';
import FloatingAdvisor from '@/components/advisor/FloatingAdvisor';

export default function SiteLayout() {
  return (
    <div className="site-shell min-h-screen flex flex-col bg-slate-50 text-slate-950">
      <Header />
      <main className="flex-2">
        <Outlet />
      </main>
      <ContextualFooterLinks />
      <Footer />
      <NotificationPrompt />
      <FloatingAdvisor />
      <CookieConsent />
    </div>);

}