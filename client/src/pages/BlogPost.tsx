import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { buildSeo, formatDate } from "@/lib/seo";
import { getBlogPostingSchema, getBreadcrumbSchema } from "@/lib/structuredData";
import { siteConfig } from "@/lib/siteConfig";
import { Clock, Calendar, ArrowLeft, ArrowRight, User } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog/posts", slug],
  });

  const { data: allPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="animate-pulse">
            <CardHeader className="space-y-4">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="py-12 text-center">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Článok sa nenašiel
            </h2>
            <p className="text-muted-foreground mb-6">
              Ospravedlňujeme sa, ale požadovaný článok neexistuje.
            </p>
            <Link href="/blog">
              <Button data-testid="button-back-to-blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Späť na blog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const seo = buildSeo({
    title: post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
  });

  const blogPostingSchema = getBlogPostingSchema(post);
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Domov", url: siteConfig.baseUrl },
    { name: "Blog", url: `${siteConfig.baseUrl}/blog` },
    { name: post.title, url: `${siteConfig.baseUrl}/blog/${post.slug}` },
  ]);

  // Find related posts (same category, exclude current post, max 3)
  const relatedPosts = allPosts
    ?.filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3) || [];

  return (
    <>
      <SEOHead seo={seo} structuredData={[blogPostingSchema, breadcrumbs]} />
      
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
        {/* Back to Blog */}
        <div className="max-w-3xl mx-auto mb-8">
          <Link href="/blog">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded px-2 py-1 -ml-2 cursor-pointer" data-testid="link-back-to-blog">
              <ArrowLeft className="h-4 w-4" />
              Späť na blog
            </div>
          </Link>
        </div>

        {/* Article */}
        <article className="max-w-3xl mx-auto">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary" data-testid="badge-category">
                {post.category}
              </Badge>
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight" data-testid="text-post-title">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(new Date(post.publishedAt))}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime} min čítania
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Article Content */}
          <Card>
            <CardContent className="pt-8 prose prose-slate max-w-none
              prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:leading-relaxed prose-p:mb-4
              prose-ul:my-6 prose-ul:space-y-2
              prose-li:leading-relaxed
              prose-strong:font-semibold prose-strong:text-foreground
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              data-testid="content-blog-post"
            >
              {/* Render markdown content as HTML - in production you'd use a markdown parser */}
              <div dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/^# /gm, '## ').replace(/\n/g, '<br />') 
              }} />
            </CardContent>
          </Card>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-sm font-semibold mb-3">Tagy:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6">
              Súvisiace články
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <Card className="h-full hover-elevate transition-all cursor-pointer group" data-testid={`related-post-${relatedPost.slug}`}>
                    <CardHeader className="space-y-3">
                      <Badge variant="secondary" className="text-xs w-fit">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="font-serif text-base font-bold leading-tight line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="mt-4 text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Čítať viac <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-16">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-8 text-center">
              <h3 className="font-serif text-2xl font-bold mb-2">
                Potrebujete pomoc so sťahovaním?
              </h3>
              <p className="text-muted-foreground mb-6">
                Kontaktujte nás pre nezáväznú cenovú ponuku
              </p>
              <Link href="/kontakt">
                <Button size="lg" data-testid="button-contact-cta">
                  Získať cenovú ponuku
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
