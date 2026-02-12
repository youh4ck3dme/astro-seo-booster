import { Helmet } from "react-helmet-async";
import type { SEOData } from "@shared/schema";

interface SEOHeadProps {
  seo: SEOData;
  structuredData?: object | object[];
}

export function SEOHead({ seo, structuredData }: SEOHeadProps) {
  return (
    <Helmet>
      {/* LCP performance patch */}
      <link
        rel="preload"
        as="image"
        href="/images/hero.png"
        fetchPriority="high"
      />

      {/* Font preload */}
      <link rel="preload" href="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      
      {/* Canonical URL */}
      {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seo.type || "website"} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      {seo.image && <meta property="og:image" content={seo.image} />}
      <meta property="og:locale" content="sk_SK" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seo.url} />
      <meta property="twitter:title" content={seo.title} />
      <meta property="twitter:description" content={seo.description} />
      {seo.image && <meta property="twitter:image" content={seo.image} />}
      
      {/* Robots */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData])}
        </script>
      )}
    </Helmet>
  );
}
