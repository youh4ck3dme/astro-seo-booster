import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteForm } from "@/components/shared/QuoteForm";
import { SEOHead } from "@/components/SEOHead";
import { buildSeo } from "@/lib/seo";
import { getServiceSchema, getBreadcrumbSchema } from "@/lib/structuredData";
import { siteConfig } from "@/lib/siteConfig";
import { CheckCircle2 } from "lucide-react";

export default function Services() {
  const seo = buildSeo({
    title: "Sťahovanie bytov a domov Bratislava | Bezpečný prevoz VI&MO",
    description: "Profesionálne sťahovanie bytov a rodinných domov v Bratislave. Od balenia nábytku až po jeho montáž na novej adrese. Sme poistení a skúsení. Volajte!",
    path: "/stahovanie",
  });

  const serviceSchema = getServiceSchema(
    "Sťahovanie bytov a domov",
    "Kompletné sťahovacie služby v Bratislave vrátane balenia, demontáže, prevozu a montáže nábytku."
  );

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Domov", url: siteConfig.baseUrl },
    { name: "Sťahovanie", url: `${siteConfig.baseUrl}/stahovanie` }
  ]);

  const includedServices = [
    "Balenie a zabezpečenie vecí",
    "Prenos a prevoz nábytku a spotrebičov",
    "Demontáž a montáž nábytku",
    "Znesenie a vynesenie aj bez výťahu",
    "Poistenie zodpovednosti",
    "Ochrana podláh a stien",
  ];

  return (
    <>
      <SEOHead seo={seo} structuredData={[serviceSchema, breadcrumbs]} />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-16">
        <div className="space-y-12">
          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Sťahovanie bytov a rodinných domov
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Bezstarostné sťahovanie bytov a domov v Bratislave a okolí. Zabezpečíme
              demontáž a montáž nábytku, obalenie krehkých vecí, manipuláciu a prevoz.
              Pracujeme rýchlo, precízne a s dôrazom na ochranu vášho majetku.
            </p>
          </div>

          {/* Included Services Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">
                Zahrnuté služby
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {includedServices.map((service, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3"
                    data-testid={`service-item-${index}`}
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-base">{service}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Process Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">
                Ako to prebieha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Nezáväzná kalkulácia",
                    desc: "Kontaktujte nás a popíšte, čo potrebujete. Pripravíme vám orientačnú cenu."
                  },
                  {
                    step: "2",
                    title: "Obhliadka a presná cena",
                    desc: "Ak chcete, prídeme sa pozrieť na miesto a určíme presnú cenu."
                  },
                  {
                    step: "3",
                    title: "Termín sťahovania",
                    desc: "Dohodneme sa na termíne, ktorý vám vyhovuje."
                  },
                  {
                    step: "4",
                    title: "Realizácia",
                    desc: "Príde náš tím, zabezpečí balenie, demontáž, prevoz a montáž na novom mieste."
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex gap-4"
                    data-testid={`process-step-${item.step}`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quote Form */}
          <QuoteForm />
        </div>
      </div>
    </>
  );
}
