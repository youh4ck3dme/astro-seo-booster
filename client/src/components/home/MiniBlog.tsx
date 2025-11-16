import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPreviews = [
  {
    title: "Ako sa pripraviť na sťahovanie bytu v Bratislave",
    excerpt: "Komplexný sprievodca prípravou na sťahovanie - od plánovania až po vybalenie na novom mieste.",
    category: "Tipy",
    date: "15. 11. 2024",
    readingTime: "5 min"
  },
  {
    title: "5 tipov, ako znížiť stres pri sťahovaní",
    excerpt: "Overené rady, ktoré vám pomôžu prežiť sťahovanie bez zbytočného stresu a komplikácií.",
    category: "Rady",
    date: "10. 11. 2024",
    readingTime: "4 min"
  },
  {
    title: "Vypratávanie bytu – praktický checklist",
    excerpt: "Krok za krokom sprievodca vypratávaním bytu s kontrolným zoznamom pre efektívnu prácu.",
    category: "Návody",
    date: "5. 11. 2024",
    readingTime: "6 min"
  },
];

export function MiniBlog() {
  return (
    <section className="py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
          Užitočné články
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Tipy a rady pre bezproblémové sťahovanie
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogPreviews.map((post, index) => (
          <Link key={index} href="/blog">
            <Card className="h-full group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105" data-testid={`blog-preview-${index}`}>
              {/* Gradient top bar */}
              <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary"></div>
              
              <CardHeader className="space-y-3">
                <Badge variant="secondary" className="w-fit">
                  {post.category}
                </Badge>
                <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readingTime} čítania</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <span className="text-primary font-semibold flex items-center gap-2 group-hover:gap-4 transition-all text-sm">
                  Čítať článok
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <Link href="/blog">
          <Button 
            variant="outline" 
            size="lg"
            className="text-base"
            data-testid="link-all-blog-posts"
          >
            Všetky články blogu
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
