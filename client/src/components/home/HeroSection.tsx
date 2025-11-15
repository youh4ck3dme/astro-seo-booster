import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Shield, Users, Truck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 md:gap-12 items-center">
        {/* Left Column: Content */}
        <div className="space-y-6">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Bezstarostné sťahovanie v Bratislave
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Presťahujeme vás rýchlo, bezpečne a férovo – byty, domy, kancelárie, sklady.
            Zabezpečíme balenie, demontáž, prevoz aj vypratávanie nepotrebných vecí.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/kontakt">
              <div>
                <Button 
                  size="lg" 
                  className="text-base"
                  data-testid="button-hero-quote"
                >
                  Nezáväzná cenová ponuka
                </Button>
              </div>
            </Link>
            <Link href="/cennik">
              <div>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base"
                  data-testid="button-hero-pricing"
                >
                  Pozrieť cenník
                </Button>
              </div>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-4 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Poistenie zodpovednosti</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Skúsený tím</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Férové ceny</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Element */}
        <div className="hidden lg:block">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 border-0 min-h-[320px] flex items-center justify-center p-12">
            <Truck className="h-32 w-32 text-primary-foreground opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </Card>
        </div>
      </div>
    </section>
  );
}
