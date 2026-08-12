import { useEffect, Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';

import SiteLayout from '@/components/layout/SiteLayout';
import Home from '@/pages/Home';

// All other routes are code-split (React.lazy) so a visit to "/" only
// downloads Home + its dependencies instead of every page in the site
// (admin panel, blog editor, all category pages, etc.) in one bundle.
const Mlzitko = lazy(() => import('@/pages/Mlzitko'));
const Mlzidla = lazy(() => import('@/pages/Mlzidla'));
const MlzidlaProdukt = lazy(() => import('@/pages/MlzidlaProdukt'));
const Kolekce = lazy(() => import('@/pages/Kolekce'));
const CollectionDetail = lazy(() => import('@/pages/CollectionDetail'));
const BrandIdentity = lazy(() => import('@/pages/BrandIdentity'));
const Kontakt = lazy(() => import('@/pages/Kontakt'));
const ProduktDetail = lazy(() => import('@/pages/ProduktDetail'));
const ProduktDetail2 = lazy(() => import('@/pages/ProduktDetail2'));
const SearchAnalytics = lazy(() => import('@/pages/SearchAnalytics'));
const CustomerPortal = lazy(() => import('@/pages/CustomerPortal'));
const Poradce = lazy(() => import('@/pages/Poradce'));
const Kalkulacka = lazy(() => import('@/pages/Kalkulacka'));
const ONas = lazy(() => import('@/pages/ONas'));
const Reference = lazy(() => import('@/pages/Reference'));
const ReferenceDetail = lazy(() => import('@/pages/ReferenceDetail'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogDetail = lazy(() => import('@/pages/BlogDetail'));
const Poptavka = lazy(() => import('@/pages/Poptavka'));
const Dekujeme = lazy(() => import('@/pages/Dekujeme'));
const CustomPageView = lazy(() => import('@/pages/CustomPageView'));
const Podpora = lazy(() => import('@/pages/Podpora'));
const MestaObce = lazy(() => import('@/pages/kategorie/MestaObce'));
const ParkyHriste = lazy(() => import('@/pages/kategorie/ParkyHriste'));
const Koupaliste = lazy(() => import('@/pages/kategorie/Koupaliste'));
const Architekti = lazy(() => import('@/pages/kategorie/Architekti'));
const Komercni = lazy(() => import('@/pages/kategorie/Komercni'));
const Eventy = lazy(() => import('@/pages/kategorie/Eventy'));
const Outdoor = lazy(() => import('@/pages/kategorie/Outdoor'));
const Art = lazy(() => import('@/pages/kategorie/Art'));
const Deti = lazy(() => import('@/pages/kategorie/Deti'));
const Gdpr = lazy(() => import('@/pages/Gdpr'));
const Admin = lazy(() => import('@/pages/admin/Admin'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminLogout = lazy(() => import('@/pages/admin/AdminLogout'));
const AdminForgotPassword = lazy(() => import('@/pages/admin/AdminForgotPassword'));
const Gate70 = lazy(() => import('@/pages/Gate70'));
const Technologie = lazy(() => import('@/pages/Technologie'));
const Vyhody = lazy(() => import('@/pages/Vyhody'));
const KeStazeni = lazy(() => import('@/pages/KeStazeni'));
const OchranaZdravi = lazy(() => import('@/pages/OchranaZdravi'));
const ServisUdrzba = lazy(() => import('@/pages/ServisUdrzba'));
const VraceniZbozi = lazy(() => import('@/pages/VraceniZbozi'));
const ChytraMlzidla = lazy(() => import('@/pages/ChytraMlzidla'));
const Katalog = lazy(() => import('@/pages/Katalog'));
const SmartOvladani = lazy(() => import('@/pages/SmartOvladani'));
const Udrzitelnost = lazy(() => import('@/pages/Udrzitelnost'));
const Partnerstvi = lazy(() => import('@/pages/Partnerstvi'));
const ObchodniPodminky = lazy(() => import('@/pages/ObchodniPodminky'));
const ObchodniNabidky = lazy(() => import('@/pages/ObchodniNabidky'));
const Pronajem = lazy(() => import('@/pages/Pronajem'));

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center py-24">
      <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
    </div>
  );
}

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
        <Route path="/pronajem" element={<Pronajem />} />
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