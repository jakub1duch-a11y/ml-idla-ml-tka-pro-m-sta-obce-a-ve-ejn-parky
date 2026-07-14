import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ZoomIn, ChevronLeft, ChevronRight, X, Loader, ArrowRight } from 'lucide-react';

function slugify(str) {
  return (str || '').toLowerCase().
  replace(/á/g, 'a').replace(/č/g, 'c').replace(/ď/g, 'd').replace(/é|ě/g, 'e').
  replace(/í/g, 'i').replace(/ň/g, 'n').replace(/ó/g, 'o').replace(/ř/g, 'r').
  replace(/š/g, 's').replace(/ť/g, 't').replace(/ú|ů/g, 'u').replace(/ý/g, 'y').replace(/ž/g, 'z').
  replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import ReferenceHero from '@/components/reference/ReferenceHero';
import GateLiveDemoCard from '@/components/reference/GateLiveDemoCard';
import Collection2026Section from '@/components/reference/Collection2026Section';
import FeaturesSection from '@/components/reference/FeaturesSection';
import RealizaceCategoryGrid from '@/components/reference/RealizaceCategoryGrid';

const CATEGORY_LABELS = {
  mestsky: 'Městský prostor',
  event: 'Event',
  soukromy: 'Soukromý',
  prumyslovy: 'Průmyslový'
};

const FALLBACK = [
{
  id: 'f1',
  name: 'Přírodní amfiteátr s mlžnou oázou',
  location: 'Praha 6 — Divoká Šárka',
  year: 2025,
  category: 'mestsky',
  description: 'V nejnavštěvovanějším pražském přírodním parku jsme instalovali 3 mlžné sochy GATE 60 podél hlavní promenády. V horkých dnech teplota v bezprostřední blízkosti klesla o 7 °C.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg',
  gallery_urls: [],
  product_used: 'GATE 60'
},
{
  id: 'f2',
  name: 'Klimatický komfort ZOO',
  location: 'Dvůr Králové — ZOO',
  year: 2025,
  category: 'mestsky',
  description: 'Instalace 6 mlžných trysek ARENA v exponátu afrických zvířat. Systém zajišťuje optimální mikroklima pro citlivá zvířata při letních teplotách.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60a14cfc6_43d83e0c0_unnamed-9.png',
  gallery_urls: [],
  product_used: 'ARENA'
},
{
  id: 'f3',
  name: 'Designová mlžná socha AURA',
  location: 'Praha 1 — Náměstí Republiky',
  year: 2026,
  category: 'mestsky',
  description: 'Pro Prahu 1 jsme navrhli custom mlžnou sochu AURA jako dominantu náměstí. Průměr 160 cm, 8 trysek, ovládání přes Smart systém napojený na meteorologická data.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
  gallery_urls: [],
  product_used: 'AURA'
}];


function Lightbox({ images, initialIndex, onClose }) {
  const [idx, setIdx] = useState(initialIndex);

  useEffect(() => {
    const handler = (e) => {if (e.key === 'Escape') onClose();};
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
        <X size={18} />
      </button>
      <div className="relative max-w-5xl w-full mx-6" onClick={(e) => e.stopPropagation()}>
        <img src={images[idx]} alt="" className="w-full max-h-[80vh] object-contain rounded-2xl" />
        {images.length > 1 &&
        <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all">
              <ChevronRight size={18} />
            </button>
            <p className="text-center text-xs font-mono text-white/60 mt-3 tracking-widest">{idx + 1} / {images.length}</p>
          </>
        }
      </div>
    </div>);

}

function ProjectCard({ project, onOpen }) {
  const allImages = [project.image_url, ...(project.gallery_urls || [])].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white">
      
      {/* Thumbnail */}
      <div
        className="relative aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => allImages.length > 0 && onOpen(allImages, 0)}>
        
        {project.image_url ?
        <img src={project.image_url} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> :

        <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">📷</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          {project.category &&
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700">
              {CATEGORY_LABELS[project.category] || project.category}
            </span>
          }
          {project.year &&
          <span className="px-3 py-1 bg-slate-900/85 backdrop-blur-sm rounded-full text-xs font-medium text-white">
              {project.year}
            </span>
          }
        </div>

        {/* Gallery indicator */}
        {allImages.length > 1 &&
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white/80">
            <ZoomIn size={10} /> {allImages.length} fotek
          </div>
        }
      </div>

      {/* Content */}
      <div className="p-6">
        {project.location &&
        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
            <MapPin size={11} /> {project.location}
          </div>
        }
        <h3 className="font-heading font-light text-xl text-slate-900 tracking-tight mb-2 leading-snug group-hover:text-slate-600 transition-colors">
          {project.name}
        </h3>
        {project.description &&
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-light">{project.description}</p>
        }
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          {project.product_used &&
          <span className="text-xs text-slate-400">Produkt: {project.product_used}</span>
          }
          <Link to={`/reference/${project.id}-${slugify(project.name)}`} className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-600 transition-colors ml-auto border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-50">
            Detail <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.div>);

}

const FILTERS = [
{ value: 'all', label: 'Vše' },
{ value: 'mestsky', label: 'Městský' },
{ value: 'event', label: 'Event' },
{ value: 'soukromy', label: 'Soukromý' },
{ value: 'prumyslovy', label: 'Průmyslový' }];


export default function Reference() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setSEO(SEO_PAGES.reference);
    base44.entities.Realizace.list().
    then((items) => {
      const published = (items || []).filter((i) => i.published);
      setProjects(published.length > 0 ? published : FALLBACK);
    }).
    catch(() => setProjects(FALLBACK)).
    finally(() => setLoading(false));
  }, []);

  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <ReferenceHero />

      <GateLiveDemoCard />

      {/* Filters */}
      <div id="realizace" className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) =>
          <button key={f.value} onClick={() => setFilter(f.value)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${filter === f.value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {f.label}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        {loading ?
        <div className="flex justify-center py-20">
            <Loader size={24} className="animate-spin text-slate-300" />
          </div> :
        visible.length === 0 ?
        <div className="py-20 text-center text-slate-400 text-sm">Žádné projekty v této kategorii.</div> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((project) =>
          <ProjectCard key={project.id} project={project} onOpen={(imgs, i) => setLightbox({ images: imgs, idx: i })} />
          )}
          </div>
        }
      </div>

      <RealizaceCategoryGrid />
      <Collection2026Section />
      <FeaturesSection />

      {/* CTA */}
      <div className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-heading font-light text-3xl text-slate-900 tracking-tight mb-4">Chcete váš projekt zde?</h2>
          <p className="text-slate-500 mb-8">Konzultace zdarma, 3D vizualizace do 48 h, montáž za jeden den.</p>
          <Link to="/kontakt" className="btn-metallic-mist px-8 py-4 text-sm font-bold">
            Nezávazná poptávka <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {lightbox &&
      <Lightbox images={lightbox.images} initialIndex={lightbox.idx} onClose={() => setLightbox(null)} />
      }
    </div>);

}