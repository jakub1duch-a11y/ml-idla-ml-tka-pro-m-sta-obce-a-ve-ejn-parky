import React, { useEffect, useState } from 'react';

const SECTIONS = [
{ id: 'uvod', label: 'Úvod' }, { id: 'benefity', label: 'Výhody' }, { id: 'pribeh', label: 'Příběh mlhy' }, { id: 'produkty', label: 'Produkty' }, { id: 'realizace', label: 'Realizace' }, { id: 'poznatky', label: 'Inspirace' }];


export default function HomeSectionNav() {
  const [activeId, setActiveId] = useState('uvod');
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > Math.max(280, window.innerHeight - 160));
    const observer = new IntersectionObserver((entries) => {const current = entries.find((entry) => entry.isIntersecting);if (current) setActiveId(current.target.id);}, { rootMargin: '-42% 0px -48% 0px', threshold: 0 });
    SECTIONS.forEach(({ id }) => {const section = document.getElementById(id);if (section) observer.observe(section);});
    updateVisibility();window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => {observer.disconnect();window.removeEventListener('scroll', updateVisibility);};
  }, []);
  const scrollTo = (event, id) => {event.preventDefault();document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });};
  return <nav aria-label="Navigace hlavní stránkou" className={`fixed inset-x-0 top-[72px] z-30 border-y border-slate-200 bg-white/95 backdrop-blur-xl transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-4 pointer-events-none opacity-0'}`}></nav>;
}