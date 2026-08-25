import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsRouteTracker from '@/components/common/AnalyticsRouteTracker';
import GlobalPhotoWatermark from '@/components/GlobalPhotoWatermark';
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
import AIVizualizace from '@/pages/AIVizualizace';
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
import Katalog from '@/pages/Katalog';
import SmartOvladani from '@/pages/SmartOvladani';
import PpcLanding from '@/pages/PpcLanding';
import Udrzitelnost from '@/pages/Udrzitelnost';
import Partnerstvi from '@/pages/Partnerstvi';
import ObchodniPodminky from '@/pages/ObchodniPodminky';
import ObchodniNabidky from '@/pages/ObchodniNabidky';
import Pronajem from '@/pages/Pronajem';
import Mlhoviste from '@/pages/Mlhoviste';
import VodniMlha from '@/pages/VodniMlha';
import MlzneBrany from '@/pages/MlzneBrany';
import BendyARPrototype from '@/pages/BendyARPrototype';
import GateARPrototype from '@/pages/GateARPrototype';
import LocalizedLanding from '@/pages/LocalizedLanding';
import { ROUTE_MAP, SUPPORTED_LOCALES } from '@/lib/i18n';

const LOCALIZED_ROUTES = Object.entries(ROUTE_MAP).flatMap(([routeKey, paths]) =>
  SUPPORTED_LOCALES.filter((locale) => locale !== 'cs').map((locale) => ({ routeKey, locale, path: paths[locale] }))
);

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
        {LOCALIZED_ROUTES.map(({ routeKey, locale, path }) => (
          <Route key={`${locale}-${routeKey}`} path={path} element={<LocalizedLanding routeKey={routeKey} />} />
        ))}
        <Route path="/" element={<Home />} />
        <Route path="/mlzidla-mlzitka" element={<Kolekce />} />
        <Route path="/mestske-mlzitka" element={<CollectionDetail forcedCollection="city" canonicalPath="/mestske-mlzitka" />} />
        <Route path="/kolekce/city" element={<Navigate to="/mestske-mlzitka" replace />} />
        <Route path="/zahradni-mlzitka" element={<CollectionDetail forcedCollection="garden" canonicalPath="/zahradni-mlzitka" />} />
        <Route path="/kolekce/garden" element={<Navigate to="/zahradni-mlzitka" replace />} />
        <Route path="/zakazkova-mlzitka" element={<CollectionDetail forcedCollection="art" canonicalPath="/zakazkova-mlzitka" />} />
        <Route path="/kolekce/art" element={<Navigate to="/zakazkova-mlzitka" replace />} />
        <Route path="/kolekce/:collection" element={<CollectionDetail />} />
        <Route path="/brand-identity" element={<BrandIdentity />} />
        <Route path="/jak-to-funguje" element={<Technologie />} />
        <Route path="/mlhoviste" element={<Mlhoviste />} />
        <Route path="/vodni-mlha" element={<VodniMlha />} />
        <Route path="/mlzne-brany" element={<MlzneBrany />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/vyvoj-systemu" element={<Navigate to="/admin?tab=development" replace />} />
        <Route path="/produkt/:slug" element={<ProduktDetail />} />
        <Route path="/produkt2/:slug" element={<Navigate to="/mlzidla-mlzitka" replace />} />
        <Route path="/search-analytics" element={<SearchAnalytics />} />
        <Route path="/muj-projekt" element={<CustomerPortal />} />
        <Route path="/poradce" element={<Poradce />} />
        <Route path="/ai-vizualizace" element={<AIVizualizace />} />
        <Route path="/ar/bendy-single" element={<BendyARPrototype />} />
        <Route path="/ar/gate" element={<GateARPrototype />} />
        <Route path="/kalkulacka" element={<Kalkulacka />} />
        <Route path="/o-nas" element={<ONas />} />
        <Route path="/reference" element={<Reference />} />
        <Route path="/reference/mlzitka-pro-zoo-praha" element={<ReferenceDetail fixedId="6a42491409abbf575447aaeb" />} />
        <Route path="/reference/mlzitko-mrak-materska-skola-siskova" element={<ReferenceDetail fixedId="6a480e05664f948152611f5f" />} />
        <Route path="/reference/mlzitko-aura-domov-palata-praha-5" element={<ReferenceDetail fixedId="6a480c0da87022c6c9559115" />} />
        <Route path="/reference/mlzitko-mrak-soukroma-zahrada" element={<ReferenceDetail fixedId="6a72947ef1579cba611a2f6b" />} />
        <Route path="/reference/bendy-jicinske-namesti" element={<ReferenceDetail fixedId="6a71d1ff57598752eed27bfb" />} />
        <Route path="/reference/mestska-mlzna-brana-gate" element={<ReferenceDetail fixedId="6a6b8d1d553d8991f46cd6a3" />} />
        <Route path="/reference/mesto-polna-mlzitko-mrkev" element={<ReferenceDetail fixedId="6a450e035aef0b45b2a8728f" />} />
        <Route path="/reference/:id" element={<ReferenceDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/poptavka" element={<Poptavka />} />
        <Route path="/ppc/mlzitka-pro-mesta-obce" element={<PpcLanding variant="mesta" />} />
        <Route path="/ppc/mlzitka-namesti-parky" element={<PpcLanding variant="parky" />} />
        <Route path="/ppc/chytra-mlzitka" element={<PpcLanding variant="smart" />} />
        <Route path="/ppc/chytry-ventil-automatizace" element={<PpcLanding variant="ventil" />} />
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
        <Route path="/faq" element={<Navigate to="/podpora" replace />} />
        <Route path="/technologie" element={<Navigate to="/jak-to-funguje" replace />} />
        <Route path="/vyhody" element={<Vyhody />} />
        <Route path="/ke-stazeni" element={<KeStazeni />} />
        <Route path="/ochrana-zdravi" element={<OchranaZdravi />} />
        <Route path="/servis-udrzba" element={<ServisUdrzba />} />
        <Route path="/vraceni-zbozi" element={<VraceniZbozi />} />
        <Route path="/chytra-mlzidla" element={<Navigate to="/smart-ovladani" replace />} />
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/smart-ovladani" element={<SmartOvladani />} />
        <Route path="/ppc/mlzitka-pro-mesta-obce" element={<PpcLanding variant="mesta" />} />
        <Route path="/ppc/mlzitka-namesti-parky" element={<PpcLanding variant="parky" />} />
        <Route path="/ppc/chytra-mlzitka" element={<PpcLanding variant="smart" />} />
        <Route path="/ppc/chytry-ventil-automatizace" element={<PpcLanding variant="ventil" />} />
        <Route path="/udrzitelnost" element={<Udrzitelnost />} />
        <Route path="/partnerstvi" element={<Partnerstvi />} />
        <Route path="/manualy" element={<Navigate to="/ke-stazeni" replace />} />
        <Route path="/obchodni-podminky" element={<ObchodniPodminky />} />
        <Route path="/obchodni-nabidky" element={<ObchodniNabidky />} />
        <Route path="/pronajem" element={<Pronajem />} />
        <Route path="/mlzitko" element={<Mlzitko />} />
        <Route path="/domu" element={<Navigate to="/" replace />} />
        <Route path="/hello-world" element={<Navigate to="/" replace />} />
        <Route path="/category/uncategorized" element={<Navigate to="/blog" replace />} />
        <Route path="/product-category/vodni-mlzitka" element={<Navigate to="/mlzidla-mlzitka" replace />} />
        <Route path="/mlzici-brany" element={<Navigate to="/mlzne-brany" replace />} />
        <Route path="/terms-privacy" element={<Navigate to="/gdpr" replace />} />
      </Route>
      <Route path="/mlzidla" element={<Navigate to="/mlzidla-mlzitka" replace />} />
      <Route path="/mlzidla/produkt/:id" element={<Navigate to="/mlzidla-mlzitka" replace />} />
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
          <AnalyticsRouteTracker />
          <GlobalPhotoWatermark />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App