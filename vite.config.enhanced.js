import base44 from '@base44/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Enhanced Vite configuration with performance optimizations
export default defineConfig({
  plugins: [
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true,
    }),
    react(),
  ],
  build: {
    // Enable sourcemap for debugging (disable in production)
    sourcemap: process.env.NODE_ENV === 'development',
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'utils': ['clsx', 'date-fns', 'lodash'],
        },
      },
    },
    // Minify CSS
    minify: 'terser',
    // Optimize for smaller bundle size
    target: 'esnext',
    cssCodeSplit: true,
    reportCompressedSize: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@radix-ui/react-dialog',
      'framer-motion',
    ],
  },
  server: {
    // Development server improvements
    middlewareMode: false,
    hmr: true,
  },
});
