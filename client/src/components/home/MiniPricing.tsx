import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const pricingData = [
  { type: "Garsónka", price: "od 65 €" },
  { type: "1-izbový byt", price: "od 70 €" },
  { type: "2-izbový byt", price: "od 140 €" },
  { type: "3-izbový byt", price: "od 240 €" },
  { type: "4-izbový byt", price: "od 350 €" },
  { type: "Rodinný dom", price: "podľa obhliadky" },
];

export function MiniPricing() {
  return (
    <section className="py-12 md:py-16">
      <Card data-testid="card-pricing-preview">
        <CardHeader>
          <CardTitle className="font-serif text-2xl md:text-3xl">
            Orientačný cenník sťahovania
          </CardTitle>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed pt-2">
            Ceny sú orientačné – presnú ponuku pripravíme podľa množstva vecí,
            poschodia a vzdialenosti.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {pricingData.map((item) => (
            <div
              key={item.type}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
              data-testid={`pricing-item-${item.type.toLowerCase()}`}
            >
              <span className="text-sm md:text-base">{item.type}</span>
              <span className="text-sm md:text-base font-semibold">
                {item.price}
              </span>
            </div>
          ))}
        </CardContent>
        
        <CardFooter className="justify-end">
          <Link href="/cennik">
            <div className="text-sm text-primary font-medium flex items-center gap-1 hover-elevate rounded px-2 py-1 cursor-pointer" data-testid="link-full-pricing">
              Zobraziť celý cenník <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
