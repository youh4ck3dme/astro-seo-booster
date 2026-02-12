import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
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
    title: "Sťahovanie Bratislava | Profesionálne sťahovacie služby VI&MO",
    description: "Hľadáte spoľahlivé sťahovanie v Bratislave? Sťahujeme byty, domy a firmy rýchlo, bezpečne a s poistením. Získajte nezáväznú cenovú ponuku u VI&MO ešte dnes!",
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
      </div>

      <TrustBar />

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
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
