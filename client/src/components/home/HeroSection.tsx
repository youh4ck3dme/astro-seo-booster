import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Shield, Star, Calendar, Truck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-accent/5 -z-10"></div>

      {/* Floating animated blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob -z-10"></div>
      <div className="absolute top-40 left-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 -z-10"></div>
      <div className="absolute -bottom-20 left-40 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 -z-10"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left Column: Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-in-fade">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                VI&MO Sťahovanie
              </span>
              <br />
              <span className="text-foreground">
                Bratislava
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl animate-in-slide-up [animation-delay:200ms]">
              Presťahujeme vás rýchlo, bezpečne a férovo – byty, domy, kancelárie, sklady.
              Zabezpečíme balenie, demontáž, prevoz aj vypratávanie.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-in-slide-up [animation-delay:400ms]">
            <Link href="/kontakt">
              <div>
                <Button
                  size="lg"
                  className="text-lg h-14 px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                  data-testid="button-hero-quote"
                >
                  Nezáväzná ponuka
                </Button>
              </div>
            </Link>
            <Link href="/cennik">
              <div>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg h-14 px-8 border-2"
                  data-testid="button-hero-pricing"
                >
                  Pozrieť cenník
                </Button>
              </div>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Badge variant="secondary" className="px-3 py-2 text-sm font-medium">
              <Shield className="h-4 w-4 mr-1.5" />
              Poistenie zodpovednosti
            </Badge>
            <Badge variant="secondary" className="px-3 py-2 text-sm font-medium">
              <Star className="h-4 w-4 mr-1.5 fill-primary text-primary" />
              4.9/5 Hodnotenie
            </Badge>
            <Badge variant="secondary" className="px-3 py-2 text-sm font-medium">
              <Calendar className="h-4 w-4 mr-1.5" />
              15+ rokov skúseností
            </Badge>
          </div>
        </div>

        {/* Right Column: Visual Element */}
        <div className="hidden lg:block animate-in-fade [animation-delay:600ms]">
          <Card className="relative overflow-hidden glass-card border-0 min-h-[420px] flex items-center justify-center p-12 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 -z-10" />
            <Truck className="h-40 w-40 text-primary opacity-95 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse [animation-duration:3s]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-8 left-8 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
          </Card>
        </div>
      </div>
    </section>
  );
}
