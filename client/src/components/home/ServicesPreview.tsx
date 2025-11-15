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
    <section className="py-12 md:py-16">
      <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8">
        Naše služby
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <div key={service.title}>
              <Link 
                href={service.href}
                onClick={() => trackServiceView(service.title)}
              >
                <Card className="h-full hover-elevate transition-all cursor-pointer group" data-testid={`card-service-${service.title.split(' ')[0].toLowerCase()}`}>
                  <CardHeader className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg leading-tight">
                      {service.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.desc}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Zistiť viac <ArrowRight className="h-4 w-4" />
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
