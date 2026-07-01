import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { isStandalone, pushSupported, subscribeToPush } from '@/lib/pushNotifications';

export default function NotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('mz_notif_dismissed');
    if (
      isStandalone() &&
      pushSupported() &&
      Notification.permission === 'default' &&
      !dismissed
    ) {
      const t = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAllow = async () => {
    setLoading(true);
    await subscribeToPush();
    setLoading(false);
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('mz_notif_dismissed', '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[200] w-[92%] max-w-sm bg-slate-900 text-white rounded-2xl shadow-xl p-5 flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <Bell size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Zůstaňte v obraze</p>
            <p className="text-xs text-white/60 mb-3">Povolte upozornění na nové produkty, reference a články z blogu.</p>
            <div className="flex gap-2">
              <button
                onClick={handleAllow}
                disabled={loading}
                className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-full hover:bg-slate-100 transition-all disabled:opacity-60"
              >
                {loading ? 'Povoluji…' : 'Povolit'}
              </button>
              <button onClick={handleDismiss} className="px-4 py-2 text-xs text-white/60 hover:text-white transition-colors">
                Ne, díky
              </button>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-white/40 hover:text-white transition-colors shrink-0">
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}