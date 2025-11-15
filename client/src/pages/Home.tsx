import { HeroSection } from "@/components/home/HeroSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { MiniPricing } from "@/components/home/MiniPricing";
import { MiniBlog } from "@/components/home/MiniBlog";
import { QuoteForm } from "@/components/shared/QuoteForm";
import { SEOHead } from "@/components/SEOHead";
import { buildSeo } from "@/lib/seo";
import { getLocalBusinessSchema, getBreadcrumbSchema } from "@/lib/structuredData";
import { siteConfig } from "@/lib/siteConfig";

export default function Home() {
  const seo = buildSeo({
    title: "Sťahovanie Bratislava – byty, domy, firmy",
    description: "Bezstarostné sťahovanie bytov, domov a firiem v Bratislave. VI&MO – balenie, demontáž, prevoz, vypratávanie. Poistenie zodpovednosti, skúsený tím, férové ceny.",
    path: "/",
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Domov", url: siteConfig.baseUrl }
  ]);

  const structuredData = [
    getLocalBusinessSchema(),
    breadcrumbs
  ];

  return (
    <>
      <SEOHead seo={seo} structuredData={structuredData} />
      
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <HeroSection />
        <ServicesPreview />
        <MiniPricing />
        <MiniBlog />
        <div className="py-12 md:py-16">
          <QuoteForm />
        </div>
      </div>
    </>
  );
}
