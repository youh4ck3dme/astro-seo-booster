import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const blogPreviews = [
  "Ako sa pripraviť na sťahovanie bytu v Bratislave",
  "5 tipov, ako znížiť stres pri sťahovaní",
  "Vypratávanie bytu – praktický checklist",
];

export function MiniBlog() {
  return (
    <section className="py-12 md:py-16">
      <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
        Z nášho blogu
      </h2>
      
      <div className="space-y-4">
        {blogPreviews.map((title, index) => (
          <Link key={index} href="/blog">
            <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-border hover-elevate transition-all group bg-card cursor-pointer" data-testid={`blog-preview-${index}`}>
              <span className="text-sm md:text-base font-medium flex-1">
                {title}
              </span>
              <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all whitespace-nowrap ml-4">
                Čítať viac <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Link href="/blog">
          <div className="text-primary font-medium inline-flex items-center gap-1 hover-elevate rounded px-3 py-2 cursor-pointer" data-testid="link-all-blog-posts">
            Všetky články blogu <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </section>
  );
}
