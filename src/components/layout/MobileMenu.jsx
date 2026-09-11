import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, X, Layers, Compass, Landmark, Info } from 'lucide-react';
import Logo from '@/components/layout/Logo';

const TABS = [
  { id: 'produkty', label: 'Produkty', icon: Layers },
  { id: 'zony', label: 'Mlžné zóny', icon: Compass },
  { id: 'mesta', label: 'Pro města', icon: Landmark },
  { id: 'info', label: 'Info', icon: Info }
];

export default function MobileMenu({ open, onClose, productLinks, usageGroups, b2gLinks, infoLinks, customLink }) {
  const [tab, setTab] = useState('produkty');

  return (
    <AnimatePresence>
      {open &&
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 flex h-[100dvh] flex-col bg-background lg:hidden">

          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-gradient-to-r from-primary via-slate-800 to-hydro px-5">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5"><Logo size="sm" /></Link>
            <button onClick={onClose} aria-label="Zavřít menu" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
              <X size={20} />
            </button>
          </div>

          <div className="grid shrink-0 grid-cols-4 gap-1.5 border-b border-border px-3 py-2.5">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-2 text-[11px] font-semibold leading-tight transition-all ${tab === t.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted text-muted-foreground'}`}>
                <t.icon size={18} />{t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
            <AnimatePresence mode="wait">
              {tab === 'produkty' &&
                <motion.div key="produkty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <p className="font-mono text-[11px] uppercase tracking-[.16em] text-secondary">Produkty MLŽIDLA®</p>
                  <h2 className="mt-1 font-heading text-xl text-foreground">Mlžítka, brány a mlžné zóny</h2>
                  <div className="mt-4 space-y-2.5">
                    {productLinks.filter((p) => !p.textOnly).map((p) => (
                      <Link key={p.path} to={p.path} onClick={onClose} className="flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card active:scale-[0.99]">
                        <img src={p.image} alt={p.label} className="h-20 w-24 shrink-0 object-cover" loading="lazy" />
                        <div className="min-w-0 py-3 pr-3">
                          <p className="text-sm font-semibold leading-tight text-foreground">{p.label}</p>
                          <p className="mt-0.5 text-xs leading-tight text-muted-foreground">{p.sub}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {productLinks.filter((p) => p.textOnly).map((p) => (
                    <Link key={p.path} to={p.path} onClick={onClose} className="mt-3 flex min-h-14 items-center justify-between rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground">
                      {p.label} <ArrowRight size={15} />
                    </Link>
                  ))}
                  <Link to={customLink.path} onClick={onClose} className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-muted p-4">
                    <Sparkles size={18} className="shrink-0 text-secondary" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{customLink.label}</p>
                      <p className="text-xs text-muted-foreground">{customLink.sub}</p>
                    </div>
                  </Link>
                </motion.div>
              }

              {tab === 'zony' &&
                <motion.div key="zony" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <p className="font-mono text-[11px] uppercase tracking-[.16em] text-secondary">Podle typu místa</p>
                  <h2 className="mt-1 font-heading text-xl text-foreground">Mlžné zóny</h2>
                  <div className="mt-4 space-y-5">
                    {usageGroups.map((group) => (
                      <div key={group.title}>
                        <p className="text-xs font-bold uppercase tracking-[.08em] text-muted-foreground">{group.title}</p>
                        <div className="mt-2 grid gap-2">
                          {group.links.map((l) => (
                            <Link key={l.label + l.path} to={l.path} onClick={onClose} className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-card px-4">
                              <l.icon size={18} className="shrink-0 text-secondary" />
                              <span className="text-sm font-medium leading-tight text-foreground">{l.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              }

              {tab === 'mesta' &&
                <motion.div key="mesta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <p className="font-mono text-[11px] uppercase tracking-[.16em] text-secondary">Podklady pro projekt</p>
                  <h2 className="mt-1 font-heading text-xl text-foreground">Pro města a architekty</h2>
                  <div className="mt-4 grid gap-2">
                    {b2gLinks.map((l) => (
                      <Link key={l.label} to={l.path} onClick={onClose} className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-card px-4">
                        <l.icon size={18} className="shrink-0 text-accent" />
                        <span className="text-sm font-medium leading-tight text-foreground">{l.label}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              }

              {tab === 'info' &&
                <motion.div key="info" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <p className="font-mono text-[11px] uppercase tracking-[.16em] text-secondary">Poznejte firmu</p>
                  <h2 className="mt-1 font-heading text-xl text-foreground">Informace a podpora</h2>
                  <div className="mt-4 grid gap-2">
                    {infoLinks.map((l) => (
                      <Link key={l.path} to={l.path} onClick={onClose} className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-card px-4">
                        <l.icon size={18} className="shrink-0 text-secondary" />
                        <span className="text-sm font-medium leading-tight text-foreground">{l.label}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              }
            </AnimatePresence>

            <div className="mt-5 flex flex-col gap-1 border-t border-border pt-4">
              {[{ label: 'Reference', path: '/reference' }, { label: 'Blog & novinky', path: '/blog' }, { label: 'O společnosti', path: '/o-nas' }, { label: 'Kontakt', path: '/kontakt' }].map((l) => (
                <Link key={l.path} to={l.path} onClick={onClose} className="rounded-xl px-4 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-muted">{l.label}</Link>
              ))}
            </div>
          </div>

          <div className="shrink-0 border-t border-border bg-background px-5 py-4">
            <Link to="/poptavka" onClick={onClose}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-accent text-sm font-bold text-accent-foreground transition-transform active:scale-[0.98]">
              <Sparkles size={16} /> Popsat projekt <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
}