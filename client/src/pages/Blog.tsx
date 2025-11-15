import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { buildSeo, formatDate } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/structuredData";
import { siteConfig } from "@/lib/siteConfig";
import { Link } from "wouter";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const seo = buildSeo({
    title: "Blog – tipy na sťahovanie v Bratislave",
    description: "Praktické rady a tipy na sťahovanie bytov, domov a firiem v Bratislave. Návody, checklisty a odporúčania od profesionálov.",
    path: "/blog",
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Domov", url: siteConfig.baseUrl },
    { name: "Blog", url: `${siteConfig.baseUrl}/blog` }
  ]);

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  return (
    <>
      <SEOHead seo={seo} structuredData={breadcrumbs} />
      
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-16">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Blog – tipy na sťahovanie
            </h1>
            <p className="text-lg text-muted-foreground">
              Praktické rady, ako zvládnuť sťahovanie, vypratávanie aj upratovanie bez chaosu.
            </p>
          </div>

          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-6 bg-muted rounded w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div>
                    <Card className="h-full hover-elevate transition-all cursor-pointer group" data-testid={`blog-post-${post.slug}`}>
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={post.featuredImage} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    
                    <CardHeader className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(new Date(post.publishedAt))}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readingTime} min
                          </span>
                        </div>
                      </div>
                      
                      <h2 className="font-serif text-xl font-bold leading-tight line-clamp-2">
                        {post.title}
                      </h2>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </CardContent>
                    
                    <CardFooter>
                      <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Čítať článok <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardFooter>
                  </Card>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Momentálne nemáme žiadne publikované články. Vráťte sa čoskoro!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
