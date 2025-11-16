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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <div key={service.title} className="group">
              <Link 
                href={service.href}
                onClick={() => trackServiceView(service.title)}
              >
                <Card className="h-full relative overflow-visible border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer" data-testid={`card-service-${service.title.split(' ')[0].toLowerCase()}`}>
                  {/* Gradient border glow on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-primary via-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-sm -z-10"></div>
                  
                  <CardHeader className="space-y-4">
                    {/* Icon with gradient background */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {service.desc}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <span className="text-primary font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
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
