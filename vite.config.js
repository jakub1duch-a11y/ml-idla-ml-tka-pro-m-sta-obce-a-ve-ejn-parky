import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    base44({
      // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ],
  resolve: {
    // Force a single React copy across the app and all dependencies.
    // Fixes "Cannot read properties of null (reading 'useState')" / invalid hook call
    // caused by Vite optimizing react and react-dom in split passes (mismatched
    // dispatcher instance). Keeping them in one dep bundle avoids the null dispatcher.
    dedupe: ['react', 'react-dom', 'scheduler'],
  },
  optimizeDeps: {
    // Bundle react, react-dom and scheduler together in a single optimization pass
    // so they share one ReactSharedInternals instance.
    include: ['react', 'react-dom', 'scheduler'],
  },
  build: {
    sourcemap: true,
  },
});