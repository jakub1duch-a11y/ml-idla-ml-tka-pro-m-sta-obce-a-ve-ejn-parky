import React, { useEffect, useState } from 'react';
import { FileText, LockKeyhole, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import InquiryManager from '@/components/offers/InquiryManager';

const formatPrice = (value) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(value);

export default function ObchodniNabidky() {
  const { isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [projectOrders, setProjectOrders] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState('');

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!isAuthenticated) { navigateToLogin(); return; }
    const checkAccess = async () => {
      try {
        let user = await base44.auth.me();
        if (user?.email?.toLowerCase() === 'jakub1duch@gmail.com' && user.role !== 'admin') {
          try { await base44.functions.invoke('bootstrapJakubAdmin', {}); user = await base44.auth.me(); } catch (_error) {}
        }
        const allowedEmails = ['jakub1duch@gmail.com', 'meduna@holmtec.cz', 'kjuvideo@email.cz'];
        const emailAllowed = user?.email && (user.email.toLowerCase().endsWith('@mlzidla.cz') || allowedEmails.includes(user.email.toLowerCase()));
        if (user?.role === 'admin' && emailAllowed) setAuthorized(true);
        else window.location.href = '/admin-login';
      } catch (_error) { window.location.href = '/admin-login'; }
    };
    checkAccess();
  }, [isAuthenticated, isLoadingAuth, navigateToLogin]);
  const loadInquiries = async () => {
    const [poptavky, contacts] = await Promise.all([base44.entities.Poptavka.list(), base44.entities.ContactInquiry.list()]);
    setInquiries([
      ...poptavky.map((item) => ({ ...item, key: `p-${item.id}`, type: 'poptavka', name: item.jmeno, message: item.zprava, product: item.produkt, created_date: item.created_date })),
      ...contacts.map((item) => ({ ...item, key: `c-${item.id}`, type: 'contact', name: item.name, message: item.message, product: item.product_id, created_date: item.created_date }))
    ].sort((a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime()));
  };
  const loadProjectOrders = async () => {
    const orders = await base44.entities.ProjectOrder.list('-created_date', 500);
    setProjectOrders(orders);
  };
  const refreshSalesData = async () => {
    await Promise.all([loadInquiries(), loadProjectOrders()]);
  };
  useEffect(() => { if (authorized) Promise.all([base44.entities.Product.list(), base44.entities.MediaFile.list(), refreshSalesData()]).then(([productData, fileData]) => { setProducts(productData); setMediaFiles(fileData); }).finally(() => setLoading(false)); }, [authorized]);

  const downloadOffer = async (product) => {
    setDownloading(product.id);
    const response = await base44.functions.invoke('generateProductDatasheet', { product, document_type: 'offer' });
    const result = response.data;
    const bytes = Uint8Array.from(atob(result.pdf_base64), (character) => character.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = result.filename;
    link.click();
    URL.revokeObjectURL(url);
    setDownloading('');
  };
  const orderByMessage = (product) => {
    const subject = encodeURIComponent(`Objednávka / dotaz – ${product.name}`);
    const body = encodeURIComponent(`Dobrý den, mám zájem o produkt ${product.name}. Prosím o kontaktování a upřesnění nabídky.`);
    window.location.href = `mailto:obchod1@holmtec.cz?subject=${subject}&body=${body}`;
  };

  if (isLoadingAuth || !authorized) return <div className="min-h-screen bg-primary"/>;

  const openOffers = projectOrders.filter((order) => ['sent','viewed','extension_requested'].includes(order.status)).length;
  const approvedOrders = projectOrders.filter((order) => ['approved','in_production','ready','delivered'].includes(order.status)).length;
  const pipelineValue = projectOrders.filter((order) => !['rejected','expired'].includes(order.status)).reduce((sum, order) => sum + Number(order.total_price || 0), 0);

  return <main className="min-h-screen bg-background pt-16">
    <section className="bg-primary text-white"><div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="flex items-center gap-2 font-mono text-[11px] tracking-[.18em] uppercase text-accent"><LockKeyhole size={14}/> Interní obchodní centrum</p><h1 className="mt-4 font-heading text-4xl lg:text-6xl">MLŽIDLA Sales Hub</h1><p className="mt-5 max-w-2xl text-lg text-white/70">Poptávky, cenové nabídky, follow-up, dokumentace a elektronické objednávky na jednom místě.</p></div><a href="/admin" className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/75 hover:bg-white/10">← Administrace</a></div><div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-[10px] uppercase tracking-widest text-white/45">Poptávky</div><div className="mt-2 text-2xl font-semibold">{inquiries.length}</div></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-[10px] uppercase tracking-widest text-white/45">Aktivní nabídky</div><div className="mt-2 text-2xl font-semibold">{openOffers}</div></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-[10px] uppercase tracking-widest text-white/45">Objednáno</div><div className="mt-2 text-2xl font-semibold">{approvedOrders}</div></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-[10px] uppercase tracking-widest text-white/45">Hodnota pipeline</div><div className="mt-2 text-2xl font-semibold">{formatPrice(pipelineValue)}</div></div></div></div></section>
    {!loading && <InquiryManager inquiries={inquiries} products={products} mediaFiles={mediaFiles} projectOrders={projectOrders} onSent={refreshSalesData}/>} 
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">{loading ? <p className="text-muted-foreground">Načítáme nabídky…</p> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article key={product.id} className="overflow-hidden border border-border bg-card"><div className="aspect-[4/3] bg-muted">{product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover"/>}</div><div className="p-6"><p className="font-mono text-[10px] tracking-[.16em] uppercase text-secondary">MLŽIDLA® / obchodní nabídka</p><h2 className="mt-3 font-heading text-2xl text-foreground">{product.name}</h2><p className="mt-2 min-h-10 text-sm text-muted-foreground">{product.short_description}</p><div className="mt-6 border-t border-border pt-5"><p className="text-xs text-muted-foreground">Cena od</p><p className="font-heading text-xl text-secondary">{product.price_from ? formatPrice(product.price_from) : 'Na vyžádání'}</p><div className="mt-5 grid grid-cols-2 gap-2"><button onClick={() => downloadOffer(product)} disabled={downloading === product.id} className="inline-flex items-center justify-center gap-2 bg-primary px-3 py-2.5 text-sm font-bold text-white hover:bg-secondary disabled:opacity-60"><FileText size={15}/>{downloading === product.id ? 'Připravujeme…' : 'Stáhnout PDF'}</button><button onClick={() => orderByMessage(product)} className="inline-flex items-center justify-center gap-2 border border-secondary px-3 py-2.5 text-sm font-bold text-secondary hover:bg-secondary hover:text-white"><MessageCircle size={15}/>Objednat zprávou</button></div></div></div></article>)}</div>}</section>
  </main>;
}