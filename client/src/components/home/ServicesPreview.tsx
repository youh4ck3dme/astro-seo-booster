import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Home, Building2, Trash2, Sparkles, ArrowRight } from "lucide-react";
import { trackServiceView } from "@/lib/analytics";

const services = [
  {
    title: "Sťahovanie bytov a domov",
    desc: "Kompletné sťahovanie v Bratislave – balenie, demontáž, prevoz, montáž.",
    icon: Home,
    href: "/stahovanie",
  },
  {
    title: "Sťahovanie firiem a kancelárií",
    desc: "Firemné sťahovanie s minimálnym výpadkom prevádzky.",
    icon: Building2,
    href: "/stahovanie",
  },
  {
    title: "Vypratávanie a odvoz odpadu",
    desc: "Vypratávanie bytov, pivníc, garáží a odvoz do zberného dvora.",
    icon: Trash2,
    href: "/stahovanie",
  },
  {
    title: "Upratovanie a čistenie",
    desc: "Jednorazové aj pravidelné upratovanie domácností a firiem.",
    icon: Sparkles,
    href: "/stahovanie",
  },
];

export function ServicesPreview() {
  return (
    <section className="py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
          Naše služby
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Profesionálne riešenia pre každú situáciu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in-slide-up [animation-delay:200ms]">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <div key={service.title} className="group" style={{ animationDelay: `${index * 100}ms` }}>
              <Link
                href={service.href}
                onClick={() => trackServiceView(service.title)}
              >
                <Card className="h-full relative overflow-hidden border-0 glass-card hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group" data-testid={`card-service-${service.title.split(' ')[0].toLowerCase()}`}>
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="space-y-4 relative z-10">
                    {/* Icon with refined gradient shadow */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_8px_16px_rgba(46,204,113,0.3)] group-hover:shadow-[0_12px_24px_rgba(46,204,113,0.4)] group-hover:scale-110 transition-all duration-500">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {service.desc}
                    </p>
                  </CardContent>
                  <CardFooter className="relative z-10">
                    <span className="text-primary font-semibold flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                      Zistiť viac
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
