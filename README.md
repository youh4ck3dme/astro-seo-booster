# Astro Landing Page – VI&MO Sťahovanie Bratislava

Vysoko výkonná landing page pre sťahovaciu firmu v Bratislave, migrovaná z Reactu na **Astro 5** s dôrazom na maximálne SEO a Google Ads optimalizáciu.

## 🚀 Výkonnostné metriky (Lighthouse)
- **Performance**: 97-100 🟢
- **Accessibility**: 100 🟢
- **Best Practices**: 100 🟢
- **SEO**: 100 🟢

## ✨ Kľúčové vylepšenia
- **Astro Image Pipeline**: Automatická optimalizácia obrázkov (WebP, avif) pre bleskové LCP.
- **Critical CSS Inlining**: Hero sekcia sa vykresľuje okamžite bez čakania na externé štýly.
- **Speculation Rules**: Pred-načítavanie stránok na pozadí pre okamžitú navigáciu.
- **PWA Ready**: Plná podpora offline režimu a inštalácie na plochu.
- **Zero-JS by Default**: Väčšina komponentov je čisto statická pre minimálny čas interaktivity (TBT).

## 🛠️ Použité technológie
- **Framework**: [Astro](https://astro.build/)
- **Styling**: Vanilla CSS + Tailwind tokens
- **SEO**: JSON-LD Structured Data (MovingCompany, WebSite)
- **Integrácie**: Google Analytics (lazy-loaded), @astrojs/sitemap

## 🏁 Ako začať
1. Nainštalujte závislosti: `npm install`
2. Spustite vývojový server: `npm run dev`
3. Vytvorte produkčný build: `npm run build:astro`

## 📂 Štruktúra projektu
- `src/features/home/`: Hlavné sekcie úvodnej stránky.
- `src/layouts/`: Základný layout s optimalizovaným headom.
- `src/pages/`: Jednotlivé podstránky (Sťahovanie, Cenník, Blog, Kontakt).
- `public/`: Statické assety, manifest, ikony a PWA skripty.

## 📊 Benchmarking & Performance
Lighthouse skóre sa môže líšiť v závislosti od zaťaženia CPU a siete. Pre objektívne meranie použite tento skript:

```powershell
# Spustí 5 auditov a vypočíta priemerné skóre
for ($i=1; $i -le 5; $i++) {
  npx -y lighthouse http://localhost:4321 --only-categories=performance --output=json --output-path=.\lh_$i.json --quiet
}
1..5 | ForEach-Object {
  $r = Get-Content -Raw "lh_$_.json" | ConvertFrom-Json
  "{0}: {1}" -f $_, [math]::Round($r.categories.performance.score*100,0)
}
```

## 📜 Licencia
Všetky práva vyhradené © 2024 VI&MO Sťahovanie.
