import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavDropdown({ label, links, width = 'w-72' }) {
  const [open, setOpen] = useState(false);
  const timeout = useRef(null);
  const show = () => { clearTimeout(timeout.current); setOpen(true); };
  const hide = () => { timeout.current = setTimeout(() => setOpen(false), 150); };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open}
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2.5 text-sm xl:px-5 font-medium transition-all ${open ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
        {label} <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open &&
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
            className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 ${width} rounded-2xl border border-white/15 bg-primary/95 p-3 text-white shadow-xl shadow-primary/30 backdrop-blur-2xl`}>
            {links.map((link) => (
              <Link key={link.label} to={link.path} onClick={() => setOpen(false)}
                className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/10">
                <link.icon size={16} className="shrink-0 text-accent transition-colors group-hover:text-white" />
                <p className="text-sm text-white/80 transition-colors group-hover:text-white">{link.label}</p>
              </Link>
            ))}
          </motion.div>
        }
      </AnimatePresence>
    </div>
  );
}