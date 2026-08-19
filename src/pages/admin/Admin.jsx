import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ImageIcon, MessageSquare, BarChart3, LogOut, ChevronRight, Newspaper, Instagram, FileStack, FolderOpen, Megaphone, TrendingUp, LayoutDashboard, ScanLine, BriefcaseBusiness, Database, Download, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminReferences from './AdminReferences';
import AdminPoptavky from './AdminPoptavky';
import AdminAnalytics from './AdminAnalytics';
import AdminBlog from './AdminBlog';
import AdminInstagram from './AdminInstagram';
import AdminPages from './AdminPages';
import AdminMedia from './AdminMedia';
import AdminMarketing from './AdminMarketing';
import AdminProductAnalytics from './AdminProductAnalytics';
import AdminAR from './AdminAR';
import AdminDatabricks from './AdminDatabricks';
import AdminOffers from './AdminOffers';

const TABS = [
  { id: 'dashboard', label: 'Přehled', icon: LayoutDashboard },
  { id: 'products', label: 'Produkty', icon: Package },
  { id: 'product-analytics', label: 'Produktová analýza', icon: TrendingUp },
  { id: 'references', label: 'Reference', icon: ImageIcon },
  { id: 'blog', label: 'Blog', icon: Newspaper },
  { id: 'pages', label: 'Stránky', icon: FileStack },
  { id: 'media', label: 'Media', icon: FolderOpen },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'poptavky', label: 'Poptávky', icon: MessageSquare },
  { id: 'offers', label: 'Nabídky', icon: BriefcaseBusiness },
  { id: 'ar', label: 'AR návrhy', icon: ScanLine },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'databricks', label: 'Databricks', icon: Database },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
];

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallCard, setShowInstallCard] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      const dismissed = localStorage.getItem('mlzidla-admin-install-dismissed');
      const installed = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      if (!dismissed && !installed) setShowInstallCard(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    const resolveAdmin = async () => {
      try {
        let u = await base44.auth.me();
        if (['jakub1duch@gmail.com', 'jakubjednaduch@gmail.com'].includes(u?.email?.toLowerCase()) && u.role !== 'admin') {
          try {
            await base44.functions.invoke('bootstrapJakubAdmin', {});
            u = await base44.auth.me();
          } catch (promotionError) {
            console.warn('Admin bootstrap failed', promotionError);
          }
        }
        setUser(u);
        if (!u) navigate('/admin-login', { replace: true });
      } catch (_error) {
        navigate('/admin-login', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    resolveAdmin();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <div className="w-6 h-6 border border-white/20 border-t-cyan rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  const installAdminApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice?.outcome === 'accepted') {
        localStorage.setItem('mlzidla-admin-installed', '1');
        setShowInstallCard(false);
      }
      setInstallPrompt(null);
      return;
    }
    setShowInstallCard(true);
  };

  const dismissInstall = () => {
    localStorage.setItem('mlzidla-admin-install-dismissed', '1');
    setShowInstallCard(false);
  };

  const ADMIN_EMAIL_EXCEPTIONS = ['meduna@holmtec.cz', 'kjuvideo@email.cz', 'jakub1duch@gmail.com', 'jakubjednaduch@gmail.com'];
  const emailAllowed = !!user.email && (
    user.email.toLowerCase().endsWith('@mlzidla.cz') ||
    ADMIN_EMAIL_EXCEPTIONS.includes(user.email.toLowerCase())
  );

  if (user.role !== 'admin' || !emailAllowed) return (
    <div className="min-h-screen bg-ink flex items-center justify-center text-center px-6">
      <div>
        <p className="text-4xl mb-4">🔒</p>
        <h1 className="text-white text-xl font-light mb-2">Přístup odepřen</h1>
        <p className="text-white/40 text-sm">Tato stránka je dostupná pouze pro administrátory.</p>
        <a href="/" className="mt-6 inline-block text-cyan text-sm hover:underline">← Zpět na web</a>
      </div>
    </div>
  );

  const ActiveComponent = {
    dashboard: AdminDashboard,
    products: AdminProducts,
    'product-analytics': AdminProductAnalytics,
    references: AdminReferences,
    blog: AdminBlog,
    pages: AdminPages,
    media: AdminMedia,
    marketing: AdminMarketing,
    poptavky: AdminPoptavky,
    offers: AdminOffers,
    ar: AdminAR,
    analytics: AdminAnalytics,
    databricks: AdminDatabricks,
    instagram: AdminInstagram,
  }[activeTab];

  return (
    <div className="min-h-screen bg-ink flex">
      {showInstallCard && (
        <div className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-md rounded-2xl border border-cyan/20 bg-[#0d1117]/95 p-4 shadow-2xl backdrop-blur-xl md:bottom-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-cyan/10 p-2 text-cyan"><Download size={18} /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Nainstalovat MLŽIDLA Admin</p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">Soukromá administrační aplikace pro správu poptávek, nabídek, upozornění a webu. Dostupná pouze administrátorům.</p>
              <button onClick={installAdminApp} className="mt-3 rounded-xl bg-cyan px-3.5 py-2 text-xs font-bold text-[#071017] hover:opacity-90">Nainstalovat aplikaci</button>
            </div>
            <button onClick={dismissInstall} className="rounded-lg p-1.5 text-white/30 hover:bg-white/5 hover:text-white" aria-label="Zavřít nabídku instalace"><X size={16} /></button>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <div className="w-56 bg-[#0d1117] border-r border-white/8 flex flex-col shrink-0">
        <div className="px-5 py-6 border-b border-white/8">
          <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-1">Admin</p>
          <p className="text-white text-sm font-medium truncate">{user.full_name || user.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === tab.id ? 'bg-cyan/10 text-cyan border border-cyan/20' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                <Icon size={16} />
                {tab.label}
                {activeTab === tab.id && <ChevronRight size={12} className="ml-auto" />}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/8 space-y-1">
          <button onClick={() => navigate('/obchodni-nabidky')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cyan/80 hover:text-cyan hover:bg-cyan/10 transition-all">
            <BriefcaseBusiness size={16} /> Sales Hub
          </button>
          <button onClick={() => navigate('/admin-logout')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <LogOut size={16} /> Odhlásit
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <ActiveComponent />
        </motion.div>
      </div>
    </div>
  );
}