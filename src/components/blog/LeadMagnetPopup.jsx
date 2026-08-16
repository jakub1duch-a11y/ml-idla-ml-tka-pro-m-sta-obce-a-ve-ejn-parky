import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

const STORAGE_KEY = 'lead_magnet_dismissed';

export default function LeadMagnetPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), 12000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.entities.NewsletterLead.create({ email, source: 'blog_popup' });
    setSending(false);
    setDone(true);
    localStorage.setItem(STORAGE_KEY, '1');
    setTimeout(() => setVisible(false), 2500);
  };

  return (
    <AnimatePresence>
      





































      
    </AnimatePresence>);

}