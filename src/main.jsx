import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (import.meta.env.DEV) {
      // Dev: never register the SW; unregister any stale worker and clear caches
      // to avoid serving outdated Vite/React chunks that cause React/ReactDOM mismatches.
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister().catch(() => {}));
      }).catch(() => {});
      if (window.caches && caches.keys) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k).catch(() => {}))).catch(() => {});
      }
    } else {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  });
}