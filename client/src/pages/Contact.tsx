import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteForm } from "@/components/shared/QuoteForm";
import { SEOHead } from "@/components/SEOHead";
import { buildSeo } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/structuredData";
import { siteConfig } from "@/lib/siteConfig";
import { Phone, Mail, MapPin, FileText } from "lucide-react";

export default function Contact() {
  const seo = buildSeo({
    title: "Kontakt – VI&MO Sťahovanie Bratislava",
    description: "Kontaktujte VI&MO sťahovanie pre nezáväznú cenovú ponuku sťahovania v Bratislave. Telefón, email, adresa.",
    path: "/kontakt",
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Domov", url: siteConfig.baseUrl },
    { name: "Kontakt", url: `${siteConfig.baseUrl}/kontakt` }
  ]);

  return (
    <>
      <SEOHead seo={seo} structuredData={breadcrumbs} />
      
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-16">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Kontakt
            </h1>
            <p className="text-lg text-muted-foreground">
              Sme tu pre vás. Kontaktujte nás telefonicky, emailom alebo vyplňte formulár.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">
                    Kontaktné údaje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Telefón</div>
                      <a 
                        href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                        className="text-primary hover:underline"
                        data-testid="link-contact-phone"
                      >
                        {siteConfig.phone}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        Po-Pia 8:00 - 18:00
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Email</div>
                      <a 
                        href={`mailto:${siteConfig.email}`}
                        className="text-primary hover:underline"
                        data-testid="link-contact-email"
                      >
                        {siteConfig.email}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        Odpovedáme do 24 hodín
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Adresa</div>
                      <p className="text-muted-foreground">
                        {siteConfig.addressLine}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Firemné údaje</div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>IČO: {siteConfig.ico}</p>
                        <p>DIČ: {siteConfig.dic}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-6">
                  <p className="text-sm text-center">
                    <strong>Pracujeme v celej Bratislave a okolí.</strong><br />
                    Na želanie zabezpečíme sťahovanie aj do iných miest na Slovensku.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quote Form */}
            <div>
              <QuoteForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
