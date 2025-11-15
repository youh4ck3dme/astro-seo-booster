import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteForm } from "@/components/shared/QuoteForm";
import { SEOHead } from "@/components/SEOHead";
import { buildSeo } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/structuredData";
import { siteConfig } from "@/lib/siteConfig";

export default function Pricing() {
  const seo = buildSeo({
    title: "Cenník sťahovania Bratislava",
    description: "Orientačný cenník sťahovania bytov, domov a firiem v Bratislave. Kontaktujte nás pre presnú kalkuláciu podľa vašich potrieb.",
    path: "/cennik",
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Domov", url: siteConfig.baseUrl },
    { name: "Cenník", url: `${siteConfig.baseUrl}/cennik` }
  ]);

  const apartmentPricing = [
    { type: "Garsónka", price: "od 65 €" },
    { type: "1-izbový byt", price: "od 70 €" },
    { type: "2-izbový byt", price: "od 140 €" },
    { type: "3-izbový byt", price: "od 240 €" },
    { type: "4-izbový byt", price: "od 350 €" },
    { type: "Rodinný dom", price: "podľa obhliadky" },
  ];

  const workersPricing = [
    { type: "1 pracovník (šofér + sťahovák)", price: "40 € / hod." },
    { type: "2 pracovníci", price: "od 50 € / hod." },
    { type: "3+ pracovníkov", price: "dohodou" },
  ];

  const transportPricing = [
    { type: "V rámci Bratislavy", price: "do 30 €" },
    { type: "Mimo mesta", price: "0,80 €/km" },
    { type: "Minimálny výjazd", price: "70 €" },
  ];

  const PricingTable = ({ items, testIdPrefix }: { items: typeof apartmentPricing, testIdPrefix: string }) => (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-3 border-b border-border last:border-0"
          data-testid={`${testIdPrefix}-${index}`}
        >
          <span className="text-sm md:text-base">{item.type}</span>
          <span className="text-sm md:text-base font-semibold">
            {item.price}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <SEOHead seo={seo} structuredData={breadcrumbs} />
      
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-16">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Cenník služieb
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              Ceny sú orientačné. Presnú ponuku pripravíme podľa vašich potrieb,
              množstva nábytku, poschodia a vzdialenosti.
            </p>
          </div>

          {/* Apartment Moving Prices */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">
                Sťahovanie bytov
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PricingTable items={apartmentPricing} testIdPrefix="apartment-pricing" />
            </CardContent>
          </Card>

          {/* Workers Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">
                Pracovníci
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PricingTable items={workersPricing} testIdPrefix="workers-pricing" />
            </CardContent>
          </Card>

          {/* Transport Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">
                Doprava
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PricingTable items={transportPricing} testIdPrefix="transport-pricing" />
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="bg-muted/50">
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Poznámka:</strong> Finálna cena závisí od konkrétnych podmienok sťahovania.
                Pre presnú kalkuláciu nás prosím kontaktujte alebo vyplňte formulár nižšie.
              </p>
            </CardContent>
          </Card>

          {/* Quote Form */}
          <QuoteForm />
        </div>
      </div>
    </>
  );
}
