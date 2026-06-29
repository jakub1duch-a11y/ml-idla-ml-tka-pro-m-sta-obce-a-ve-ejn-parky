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
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminAnalytika from '@/pages/admin/AdminAnalytika';
import AdminProdukty from '@/pages/admin/AdminProdukty';
import AdminRealizace from '@/pages/admin/AdminRealizace';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminPoptavky from '@/pages/admin/AdminPoptavky';
import AdminContentful from '@/pages/admin/AdminContentful';
import AdminDriveSync from '@/pages/admin/AdminDriveSync';
import AdminProjects from '@/pages/admin/AdminProjects';
import ProjectStatus from '@/pages/ProjectStatus';
import CustomerPortal from '@/pages/CustomerPortal';
import AdminCityCoolingAnalytics from '@/pages/admin/AdminCityCoolingAnalytics';
import AdminFeedback from '@/pages/admin/AdminFeedback';
import Poradce from '@/pages/Poradce';
import ONas from '@/pages/ONas';

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
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminAnalytika />} />
          <Route path="produkty" element={<AdminProdukty />} />
          <Route path="realizace" element={<AdminRealizace />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="poptavky" element={<AdminPoptavky />} />
          <Route path="projekty" element={<AdminProjects />} />
          <Route path="city-cooling" element={<AdminCityCoolingAnalytics />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="contentful" element={<AdminContentful />} />
          <Route path="drive-sync" element={<AdminDriveSync />} />
        </Route>
      </Route>
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