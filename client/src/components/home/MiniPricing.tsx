import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";

const pricingData = [
  { type: "Garsónka", price: "65", size: "do 25m²" },
  { type: "1-izbový byt", price: "70", size: "25-35m²", popular: false },
  { type: "2-izbový byt", price: "140", size: "40-60m²", popular: true },
  { type: "3-izbový byt", price: "240", size: "60-80m²" },
  { type: "4-izbový byt", price: "350", size: "80-100m²" },
  { type: "Rodinný dom", price: "Ponuka", size: "podľa obhliadky" },
];

export function MiniPricing() {
  return (
    <section className="py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
          Transparentný cenník
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Férové ceny bez skrytých poplatkov. Presnú ponuku pripravíme po obhliadke.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="card-pricing-preview">
        {pricingData.map((item) => (
          <Card
            key={item.type}
            className={`relative transition-all duration-300 ${
              item.popular 
                ? 'border-primary shadow-lg hover:shadow-xl scale-105' 
                : 'hover:shadow-lg hover:scale-105'
            }`}
            data-testid={`pricing-item-${item.type.toLowerCase()}`}
          >
            {item.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-accent px-4 py-1.5 shadow-md">
                  ⭐ Najpopulárnejšie
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                {item.type}
              </div>
              <div className="mt-2">
                {item.price !== "Ponuka" ? (
                  <>
                    <span className="text-4xl font-bold">od {item.price}€</span>
                    <span className="text-muted-foreground text-sm block mt-1">{item.size}</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold">Individuálna ponuka</span>
                    <span className="text-muted-foreground text-sm block mt-1">{item.size}</span>
                  </>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 pb-4">
              <div className="flex items-start gap-2 text-sm">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Balenie a ochrana nábytku</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Demontáž a montáž</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Preprava a vykladka</span>
              </div>
            </CardContent>
            
            <CardFooter>
              <Link href="/cennik" className="w-full">
                <Button 
                  variant={item.popular ? "default" : "outline"}
                  className={`w-full ${item.popular ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90' : ''}`}
                >
                  Zistiť viac
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link href="/cennik">
          <Button 
            variant="outline" 
            size="lg"
            className="text-base"
            data-testid="link-full-pricing"
          >
            Zobraziť kompletný cenník
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
