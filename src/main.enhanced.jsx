import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import '@/index.css';
import '@/styles/typography-enhanced.css'; // Enhanced typography
import { SkipToContent } from '@/components/SkipToContent';
import { A11yAnnouncer } from '@/components/A11yAnnouncer';

// Core Web Vitals monitoring (optional)
if ('web-vital' in window && process.env.NODE_ENV === 'production') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Accessibility: Skip to content and ARIA announcer */}
    <SkipToContent />
    <A11yAnnouncer />
    <App />
  </React.StrictMode>
);

// Service Worker Registration with better error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✓ Service Worker registered:', registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Every hour
      })
      .catch((error) => {
        console.warn('✗ Service Worker registration failed:', error);
      });
  });
}

// Prefetch critical resources
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', prefetchResources);
} else {
  prefetchResources();
}

function prefetchResources() {
  // Prefetch key pages and assets
  const links = [
    { rel: 'prefetch', href: '/api/products' },
    { rel: 'prefetch', href: '/api/categories' },
  ];

  links.forEach((link) => {
    const linkElement = document.createElement('link');
    linkElement.rel = link.rel;
    linkElement.href = link.href;
    document.head.appendChild(linkElement);
  });
}
