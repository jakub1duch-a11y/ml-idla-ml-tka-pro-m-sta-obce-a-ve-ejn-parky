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
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState('');

  useEffect(() => { if (!isLoadingAuth && !isAuthenticated) navigateToLogin(); }, [isAuthenticated, isLoadingAuth, navigateToLogin]);
  const loadInquiries = async () => {
    const [poptavky, contacts] = await Promise.all([base44.entities.Poptavka.list(), base44.entities.ContactInquiry.list()]);
    setInquiries([
      ...poptavky.map((item) => ({ ...item, key: `p-${item.id}`, type: 'poptavka', name: item.jmeno, message: item.zprava, product: item.produkt })),
      ...contacts.map((item) => ({ ...item, key: `c-${item.id}`, type: 'contact', name: item.name, message: item.message, product: item.product_id }))
    ].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
  };
  const loadProjectOrders = async () => {
    const orders = await base44.entities.ProjectOrder.list('-created_date', 500);
    setProjectOrders(orders);
  };
  const refreshSalesData = async () => {
    await Promise.all([loadInquiries(), loadProjectOrders()]);
  };
  useEffect(() => { if (isAuthenticated) Promise.all([base44.entities.Product.list(), base44.entities.MediaFile.list(), refreshSalesData()]).then(([productData, fileData]) => { setProducts(productData); setMediaFiles(fileData); }).finally(() => setLoading(false)); }, [isAuthenticated]);

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

  if (isLoadingAuth || !isAuthenticated) return <div className="min-h-screen bg-primary"/>;

  return <main className="min-h-screen bg-background pt-16">
    <section className="bg-primary text-white"><div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20"><p className="flex items-center gap-2 font-mono text-[11px] tracking-[.18em] uppercase text-accent"><LockKeyhole size={14}/> Klientská zóna</p><h1 className="mt-4 font-heading text-4xl lg:text-6xl">Obchodní nabídky</h1><p className="mt-5 max-w-2xl text-lg text-white/70">Aktuální produktové nabídky MLŽIDLA® s cenami, fotografiemi a technickým přehledem.</p></div></section>
    {!loading && <InquiryManager inquiries={inquiries} products={products} mediaFiles={mediaFiles} projectOrders={projectOrders} onSent={refreshSalesData}/>} 
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">{loading ? <p className="text-muted-foreground">Načítáme nabídky…</p> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article key={product.id} className="overflow-hidden border border-border bg-card"><div className="aspect-[4/3] bg-muted">{product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover"/>}</div><div className="p-6"><p className="font-mono text-[10px] tracking-[.16em] uppercase text-secondary">MLŽIDLA® / obchodní nabídka</p><h2 className="mt-3 font-heading text-2xl text-foreground">{product.name}</h2><p className="mt-2 min-h-10 text-sm text-muted-foreground">{product.short_description}</p><div className="mt-6 border-t border-border pt-5"><p className="text-xs text-muted-foreground">Cena od</p><p className="font-heading text-xl text-secondary">{product.price_from ? formatPrice(product.price_from) : 'Na vyžádání'}</p><div className="mt-5 grid grid-cols-2 gap-2"><button onClick={() => downloadOffer(product)} disabled={downloading === product.id} className="inline-flex items-center justify-center gap-2 bg-primary px-3 py-2.5 text-sm font-bold text-white hover:bg-secondary disabled:opacity-60"><FileText size={15}/>{downloading === product.id ? 'Připravujeme…' : 'Stáhnout PDF'}</button><button onClick={() => orderByMessage(product)} className="inline-flex items-center justify-center gap-2 border border-secondary px-3 py-2.5 text-sm font-bold text-secondary hover:bg-secondary hover:text-white"><MessageCircle size={15}/>Objednat zprávou</button></div></div></div></article>)}</div>}</section>
  </main>;
}