import { Link } from "wouter";
import { siteConfig } from "@/lib/siteConfig";
import { Phone, Mail, MapPin, Truck } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Logo & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              <span className="font-serif text-lg font-bold">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bezstarostné sťahovanie bytov, domov a firiem v Bratislave.
              Profesionálny prístup, férové ceny.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Rýchle odkazy</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/stahovanie">
                  <div className="text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded px-1 -ml-1 cursor-pointer" data-testid="link-footer-services">
                    Sťahovanie
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/cennik">
                  <div className="text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded px-1 -ml-1 cursor-pointer" data-testid="link-footer-pricing">
                    Cenník
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <div className="text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded px-1 -ml-1 cursor-pointer" data-testid="link-footer-blog">
                    Blog
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/kontakt">
                  <div className="text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded px-1 -ml-1 cursor-pointer" data-testid="link-footer-contact">
                    Kontakt
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Kontakt</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <a 
                  href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-phone"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <a 
                  href={`mailto:${siteConfig.email}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-email"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  {siteConfig.addressLine}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Údaje o firme</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>IČO: {siteConfig.ico}</li>
              <li>DIČ: {siteConfig.dic}</li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs bg-accent/50 px-2 py-1 rounded">
                  ✓ Poistenie zodpovednosti
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} {siteConfig.name} – Sťahovanie Bratislava. Všetky práva vyhradené.
          </p>
        </div>
      </div>
    </footer>
  );
}
