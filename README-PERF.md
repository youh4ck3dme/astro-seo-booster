# 🚀 Astro SEO Booster - Performance & PWA Architecture

This project has been optimized for **Maximum Performance (95-100 Lighthouse)** and **Core Web Vitals**.

## 🏗️ Architecture Overhaul
- **Framework**: Astro (SSG/SSR Hybrid)
- **Styling**: TailwindCSS (Critical CSS inline, rest deferred)
- **Images**: `astro:assets` with `avif/webp` + `fetchpriority="high"` for LCP
- **Fonts**: Self-hosted/Google Fonts with `swap` & `preconnect`
- **PWA**: Robust offline support via Service Worker (Network-First HTML, Stale-While-Revalidate Assets)

## ⚡ Performance Features
1.  **LCP Optimization**: Hero image is eager-loaded with correct `sizes` and priority.
2.  **Zero-Hydration default**: JS is only loaded for interactive islands (`client:visible` for forms).
3.  **Speculation Rules**: Instant navigation to key pages (`/kontakt`, `/cennik`) via browser native prefetching.
4.  **bfcache**: No legacy `unload` listeners to break back/forward cache.

## 🛠️ Benchmarking

### Run Lighthouse Sweep (5 runs)
```powershell
# Windows
./tools/perf/lh-sweep.ps1
```
```bash
# Mac/Linux
./tools/perf/lh-sweep.sh
```

### CrUX Field Data
```bash
export CRUX_API_KEY="YOUR_KEY"
node tools/crux/crux-fetch.js
```

## 📦 Deployment
- **Netlify**: `public/_headers` handles caching.
- **Vercel**: `public/vercel.json` handles headers.
- **Node/Custom**: Use `dist/` and configure your Nginx/Apache with the headers from `_headers`.

## 📱 PWA
- **Manifest**: `public/manifest.json` (Maskable icons included)
- **Service Worker**: `public/sw.js` (Manual robust implementation)
- **Offline**: Falls back to cached content or offline page.
