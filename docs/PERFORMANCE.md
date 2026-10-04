# Performance, SEO & A11y Guide

## 📊 Performance Optimizations

### 1. Image Optimization
Use the new `ImageOptimized` component for all images:

```jsx
import { ImageOptimized } from '@/components/ImageOptimized';

<ImageOptimized
  src="/images/hero.jpg"
  alt="Heroický obrázek mlžítek"
  width={1200}
  height={600}
  srcSet="/images/hero-sm.jpg 640w, /images/hero-md.jpg 1024w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
  loading="lazy"
/>
```

### 2. Code Splitting
The enhanced Vite config automatically splits code into chunks:
- `vendor` - React & core libraries
- `ui` - Radix UI components
- `utils` - Helper libraries

This improves initial load and leverages browser caching.

### 3. Font Optimization
- Using `font-display: swap` for non-blocking font loading
- Preload critical fonts in `index.html`
- Only load necessary font weights (400, 500, 600, 700)

### 4. Core Web Vitals
- **LCP** (Largest Contentful Paint): Optimize images & critical CSS
- **FID** (First Input Delay): Minimize JavaScript blocking
- **CLS** (Cumulative Layout Shift): Reserve space for dynamic content

## 🔍 SEO Improvements

### 1. Dynamic Meta Tags
Use the `useHeadMetaTags` hook on every page:

```jsx
import { useHeadMetaTags } from '@/hooks/useHeadMetaTags';

function ProductPage() {
  useHeadMetaTags({
    title: 'Mlžítka Standard | Mlžidla.cz',
    description: 'Profesionální mlžítka se zvýšenou kapacitou',
    keywords: 'mlžítka, mlžné brány, ochlazení',
    ogImage: 'https://mlzidla.cz/images/product.jpg',
    canonical: 'https://mlzidla.cz/produkty/standard',
    structuredData: getProductSchema(product),
  });

  return <div>{/* ... */}</div>;
}
```

### 2. Structured Data
Import schema generators from `@/lib/seo-helpers`:

```jsx
import { getProductSchema, getBreadcrumbSchema } from '@/lib/seo-helpers';

const productSchema = getProductSchema({
  name: 'Mlžítko Standard',
  description: 'Profesionální mlžítko',
  price: '45000',
  image: 'https://mlzidla.cz/images/product.jpg',
  url: 'https://mlzidla.cz/produkt/standard',
});
```

### 3. Open Graph & Twitter Cards
Automatically handled by `useHeadMetaTags` hook.

### 4. Sitemap & Robots.txt
Add these files to `public/`:
- `sitemap.xml` - List of all pages
- `robots.txt` - SEO crawling instructions

## ♿ Accessibility (A11y)

### 1. Skip to Content
The `SkipToContent` component is auto-included in enhanced main.jsx.

### 2. ARIA Live Regions
Use the `A11yAnnouncer` for screen reader announcements:

```jsx
// In your component
window.announce('Obsah byl úspěšně načten');
```

### 3. Color Contrast
Ensure WCAG AA compliance (4.5:1 for text):
- Primary: `#1A567F` on white = 8.4:1 ✓
- Secondary: `#2D9DB5` on white = 4.6:1 ✓

### 4. Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus visible with clear outline
- Tab order is logical

### 5. Form Labels
Always use explicit labels:

```jsx
<label htmlFor="email">Email:</label>
<input id="email" type="email" />
```

## 📈 Monitoring

### Google Lighthouse
1. Open DevTools → Lighthouse
2. Run audit (Desktop & Mobile)
3. Target: 90+ on all metrics

### Web Vitals
Monitored automatically in production.

### SEO Checklist
- [ ] Title tags (50-60 chars)
- [ ] Meta descriptions (150-160 chars)
- [ ] H1 tags (one per page)
- [ ] Alt text on images
- [ ] Mobile-friendly design
- [ ] HTTPS enabled
- [ ] Sitemap submitted to GSC
- [ ] Schema markup validated

## 🚀 Deployment

1. **Build optimized bundle:**
   ```bash
   npm run build
   ```

2. **Enable caching headers** on CDN:
   - Fonts: 1 year
   - Images: 6 months
   - JS/CSS: 1 month (with hash)

3. **Enable Gzip/Brotli compression** on server

4. **Test:**
   ```bash
   npm run preview
   ```
