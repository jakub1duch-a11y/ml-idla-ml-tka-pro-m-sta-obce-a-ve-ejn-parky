import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import Mlzitko from '@/pages/Mlzitko';
import Mlzidla from '@/pages/Mlzidla';
import MlzidlaProdukt from '@/pages/MlzidlaProdukt';


import SiteLayout from '@/components/layout/SiteLayout';
import Home2 from '@/pages/Home2';
import Kolekce from '@/pages/Kolekce';
import Kontakt from '@/pages/Kontakt';
import ProduktDetail from '@/pages/ProduktDetail';
import SearchAnalytics from '@/pages/SearchAnalytics';
import CustomerPortal from '@/pages/CustomerPortal';
import Poradce from '@/pages/Poradce';
import Kalkulacka from '@/pages/Kalkulacka';
import ONas from '@/pages/ONas';
import Reference from '@/pages/Reference';
import ReferenceDetail from '@/pages/ReferenceDetail';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import Poptavka from '@/pages/Poptavka';
import Dekujeme from '@/pages/Dekujeme';
import CustomPageView from '@/pages/CustomPageView';
import Podpora from '@/pages/Podpora';
import MestaObce from '@/pages/kategorie/MestaObce';
import ParkyHriste from '@/pages/kategorie/ParkyHriste';
import Koupaliste from '@/pages/kategorie/Koupaliste';
import Architekti from '@/pages/kategorie/Architekti';
import Komercni from '@/pages/kategorie/Komercni';
import Eventy from '@/pages/kategorie/Eventy';
import Outdoor from '@/pages/kategorie/Outdoor';
import Art from '@/pages/kategorie/Art';
import Deti from '@/pages/kategorie/Deti';
import Gdpr from '@/pages/Gdpr';
import Admin from '@/pages/admin/Admin';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLogout from '@/pages/admin/AdminLogout';
import AdminForgotPassword from '@/pages/admin/AdminForgotPassword';
import Gate70 from '@/pages/Gate70';
import Technologie from '@/pages/Technologie';
import Vyhody from '@/pages/Vyhody';
import KeStazeni from '@/pages/KeStazeni';
import ServisUdrzba from '@/pages/ServisUdrzba';
import VraceniZbozi from '@/pages/VraceniZbozi';
import ChytraMlzidla from '@/pages/ChytraMlzidla';
import Katalog from '@/pages/Katalog';
import SolutionCategory from '@/pages/SolutionCategory';
import SmartOvladani from '@/pages/SmartOvladani';
import Udrzitelnost from '@/pages/Udrzitelnost';
import Partnerstvi from '@/pages/Partnerstvi';
import ObchodniPodminky from '@/pages/ObchodniPodminky';
import VideoUkazky from '@/pages/VideoUkazky';
import PrislusenstviSmartModuly from '@/pages/PrislusenstviSmartModuly';
import PrinosMlzitek from '@/pages/PrinosMlzitek';
import Vyuziti from '@/pages/Vyuziti';
import UsageSector from '@/pages/UsageSector';
import UsageCategory from '@/pages/UsageCategory';
import Prinosy from '@/pages/Prinosy';
import Certifikace from '@/pages/Certifikace';
import Galerie from '@/pages/Galerie';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home2 />} />
        <Route path="/mlzidla-mlzitka" element={<Kolekce />} />
        <Route path="/jak-to-funguje" element={<Technologie />} />
        <Route path="/jak-funguje-mlzeni" element={<Technologie />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/produkt/:slug" element={<ProduktDetail />} />
        <Route path="/search-analytics" element={<SearchAnalytics />} />
        <Route path="/muj-projekt" element={<CustomerPortal />} />
        <Route path="/poradce" element={<Poradce />} />
        <Route path="/kalkulacka" element={<Kalkulacka />} />
        <Route path="/o-nas" element={<ONas />} />
        <Route path="/reference" element={<Reference />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/reference/:slug" element={<ReferenceDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/poptavka" element={<Poptavka />} />
        <Route path="/dekujeme" element={<Dekujeme />} />
        <Route path="/p/:slug" element={<CustomPageView />} />
        <Route path="/podpora" element={<Podpora />} />
        <Route path="/vyuziti" element={<Vyuziti />} />
        <Route path="/vyuziti/:sector" element={<UsageCategory />} />
        <Route path="/kategorie/:sector" element={<UsageCategory />} />
        <Route path="/gdpr" element={<Gdpr />} />
        <Route path="/gate70" element={<Gate70 />} />
        <Route path="/faq" element={<Podpora />} />
        <Route path="/technologie" element={<Technologie />} />
        <Route path="/vyhody" element={<Vyhody />} />
        <Route path="/ke-stazeni" element={<KeStazeni />} />
        <Route path="/servis-udrzba" element={<ServisUdrzba />} />
        <Route path="/vraceni-zbozi" element={<VraceniZbozi />} />
        <Route path="/chytra-mlzidla" element={<ChytraMlzidla />} />
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/reseni/:solution" element={<SolutionCategory />} />
        <Route path="/smart-ovladani" element={<SmartOvladani />} />
        <Route path="/udrzitelnost" element={<Udrzitelnost />} />
        <Route path="/partnerstvi" element={<Partnerstvi />} />
        <Route path="/manualy" element={<KeStazeni />} />
        <Route path="/obchodni-podminky" element={<ObchodniPodminky />} />
        <Route path="/mlzitko" element={<Mlzitko />} />
        <Route path="/videosekce-mlzitka" element={<VideoUkazky />} />
        <Route path="/prinosy-mlzitek" element={<Prinosy />} />
        <Route path="/prinosy-mlzitek/:slug" element={<PrinosMlzitek />} />
        <Route path="/prislusenstvi" element={<PrislusenstviSmartModuly />} />
        <Route path="/certifikace" element={<Certifikace />} />
      </Route>
      <Route path="/mlzidla" element={<Mlzidla />} />
      <Route path="/mlzidla/produkt/:id" element={<MlzidlaProdukt />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-logout" element={<AdminLogout />} />
      <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AnalyticsTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App