import { siteConfig } from "./siteConfig";
import type { BlogPost } from "@shared/schema";

// LocalBusiness structured data
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "name": siteConfig.name,
    "image": `${siteConfig.baseUrl}/logo.png`,
    "url": siteConfig.baseUrl,
    "telephone": siteConfig.phone,
    "email": siteConfig.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Karpatské námestie 7770/10A",
      "addressLocality": "Bratislava - Rača",
      "postalCode": "831 06",
      "addressCountry": "SK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "48.1858",
      "longitude": "17.1067"
    },
    "priceRange": "€€",
    "areaServed": {
      "@type": "City",
      "name": "Bratislava"
    },
    "sameAs": []
  };
}

// Service structured data
export function getServiceSchema(serviceName: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceName,
    "description": description,
    "provider": {
      "@type": "MovingCompany",
      "name": siteConfig.name,
      "telephone": siteConfig.phone,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bratislava",
        "addressCountry": "SK"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": "Bratislava"
    }
  };
}

// BlogPosting structured data
export function getBlogPostingSchema(post: BlogPost) {
  const publishedDate = typeof post.publishedAt === 'string' 
    ? new Date(post.publishedAt) 
    : post.publishedAt;
    
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage || `${siteConfig.baseUrl}/blog-default.jpg`,
    "datePublished": publishedDate.toISOString(),
    "dateModified": publishedDate.toISOString(),
    "author": {
      "@type": "Organization",
      "name": post.authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.baseUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.baseUrl}/blog/${post.slug}`
    }
  };
}

// BreadcrumbList structured data
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}
