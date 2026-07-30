import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Mlzitko from '@/pages/Mlzitko';
import Mlzidla from '@/pages/Mlzidla';
import MlzidlaProdukt from '@/pages/MlzidlaProdukt';


import SiteLayout from '@/components/layout/SiteLayout';
import Home from '@/pages/Home';
import Kolekce from '@/pages/Kolekce';
import CollectionDetail from '@/pages/CollectionDetail';
import BrandIdentity from '@/pages/BrandIdentity';
import Kontakt from '@/pages/Kontakt';
import ProduktDetail from '@/pages/ProduktDetail';
import ProduktDetail2 from '@/pages/ProduktDetail2';
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
import OchranaZdravi from '@/pages/OchranaZdravi';
import ServisUdrzba from '@/pages/ServisUdrzba';
import VraceniZbozi from '@/pages/VraceniZbozi';
import ChytraMlzidla from '@/pages/ChytraMlzidla';
import Katalog from '@/pages/Katalog';
import SmartOvladani from '@/pages/SmartOvladani';
import Udrzitelnost from '@/pages/Udrzitelnost';
import Partnerstvi from '@/pages/Partnerstvi';
import ObchodniPodminky from '@/pages/ObchodniPodminky';
import ObchodniNabidky from '@/pages/ObchodniNabidky';

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
        <Route path="/" element={<Home />} />
        <Route path="/mlzidla-mlzitka" element={<Kolekce />} />
        <Route path="/kolekce/:collection" element={<CollectionDetail />} />
        <Route path="/brand-identity" element={<BrandIdentity />} />
        <Route path="/jak-to-funguje" element={<Technologie />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/produkt/:slug" element={<ProduktDetail />} />
        <Route path="/produkt2/:slug" element={<ProduktDetail2 />} />
        <Route path="/search-analytics" element={<SearchAnalytics />} />
        <Route path="/muj-projekt" element={<CustomerPortal />} />
        <Route path="/poradce" element={<Poradce />} />
        <Route path="/kalkulacka" element={<Kalkulacka />} />
        <Route path="/o-nas" element={<ONas />} />
        <Route path="/reference" element={<Reference />} />
        <Route path="/reference/:id" element={<ReferenceDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/poptavka" element={<Poptavka />} />
        <Route path="/dekujeme" element={<Dekujeme />} />
        <Route path="/p/:slug" element={<CustomPageView />} />
        <Route path="/podpora" element={<Podpora />} />
        <Route path="/kategorie/mesta-obce" element={<MestaObce />} />
        <Route path="/kategorie/parky-hriste" element={<ParkyHriste />} />
        <Route path="/kategorie/koupaliste" element={<Koupaliste />} />
        <Route path="/kategorie/architekti" element={<Architekti />} />
        <Route path="/kategorie/komercni" element={<Komercni />} />
        <Route path="/kategorie/eventy" element={<Eventy />} />
        <Route path="/kategorie/outdoor-zahrady" element={<Outdoor />} />
        <Route path="/kategorie/art-instalace" element={<Art />} />
        <Route path="/kategorie/skoly-skolky-deti" element={<Deti />} />
        <Route path="/gdpr" element={<Gdpr />} />
        <Route path="/gate70" element={<Gate70 />} />
        <Route path="/faq" element={<Podpora />} />
        <Route path="/technologie" element={<Technologie />} />
        <Route path="/vyhody" element={<Vyhody />} />
        <Route path="/ke-stazeni" element={<KeStazeni />} />
        <Route path="/ochrana-zdravi" element={<OchranaZdravi />} />
        <Route path="/servis-udrzba" element={<ServisUdrzba />} />
        <Route path="/vraceni-zbozi" element={<VraceniZbozi />} />
        <Route path="/chytra-mlzidla" element={<ChytraMlzidla />} />
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/smart-ovladani" element={<SmartOvladani />} />
        <Route path="/udrzitelnost" element={<Udrzitelnost />} />
        <Route path="/partnerstvi" element={<Partnerstvi />} />
        <Route path="/manualy" element={<KeStazeni />} />
        <Route path="/obchodni-podminky" element={<ObchodniPodminky />} />
        <Route path="/obchodni-nabidky" element={<ObchodniNabidky />} />
        <Route path="/mlzitko" element={<Mlzitko />} />
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
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App