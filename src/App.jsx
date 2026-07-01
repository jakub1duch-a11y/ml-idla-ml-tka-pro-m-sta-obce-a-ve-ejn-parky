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
import Kolekce from '@/pages/Kolekce';
import Mlhoviste from '@/pages/Mlhoviste';
import JakToFunguje from '@/pages/JakToFunguje';
import Kontakt from '@/pages/Kontakt';
import ProduktDetail from '@/pages/ProduktDetail';
import SearchAnalytics from '@/pages/SearchAnalytics';
import ProjectStatus from '@/pages/ProjectStatus';
import CustomerPortal from '@/pages/CustomerPortal';
import Poradce from '@/pages/Poradce';
import ONas from '@/pages/ONas';
import Reference from '@/pages/Reference';
import ReferenceDetail from '@/pages/ReferenceDetail';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import Poptavka from '@/pages/Poptavka';
import Podpora from '@/pages/Podpora';
import MestaObce from '@/pages/kategorie/MestaObce';
import ParkyHriste from '@/pages/kategorie/ParkyHriste';
import Koupaliste from '@/pages/kategorie/Koupaliste';
import Architekti from '@/pages/kategorie/Architekti';
import Komercni from '@/pages/kategorie/Komercni';
import Eventy from '@/pages/kategorie/Eventy';
import Gdpr from '@/pages/Gdpr';
import Admin from '@/pages/admin/Admin';
import Gate70 from '@/pages/Gate70';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-fog">
        <div className="w-6 h-6 border border-steel border-t-ink rounded-full animate-spin" />
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
        <Route path="/kolekce" element={<Kolekce />} />
        <Route path="/mlhoviste" element={<Mlhoviste />} />
        <Route path="/jak-to-funguje" element={<JakToFunguje />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/produkt/:slug" element={<ProduktDetail />} />
        <Route path="/search-analytics" element={<SearchAnalytics />} />
        <Route path="/project/:token" element={<ProjectStatus />} />
        <Route path="/muj-projekt" element={<CustomerPortal />} />
        <Route path="/poradce" element={<Poradce />} />
        <Route path="/o-nas" element={<ONas />} />
        <Route path="/reference" element={<Reference />} />
        <Route path="/reference/:id" element={<ReferenceDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/poptavka" element={<Poptavka />} />
        <Route path="/podpora" element={<Podpora />} />
        <Route path="/kategorie/mesta-obce" element={<MestaObce />} />
        <Route path="/kategorie/parky-hriste" element={<ParkyHriste />} />
        <Route path="/kategorie/koupaliste" element={<Koupaliste />} />
        <Route path="/kategorie/architekti" element={<Architekti />} />
        <Route path="/kategorie/komercni" element={<Komercni />} />
        <Route path="/kategorie/eventy" element={<Eventy />} />
        <Route path="/gdpr" element={<Gdpr />} />
        <Route path="/gate70" element={<Gate70 />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
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