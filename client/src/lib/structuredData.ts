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
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "09:00",
        "closes": "14:00"
      }
    ],
    "priceRange": "€€",
    "areaServed": {
      "@type": "City",
      "name": "Bratislava"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteConfig.phone,
      "contactType": "customer service",
      "areaServed": "SK",
      "availableLanguage": ["Slovak", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/viamo_stahovanie",
      "https://www.instagram.com/viamo_stahovanie"
    ]
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
    "areaServed": [
      {
        "@type": "City",
        "name": "Bratislava"
      },
      {
        "@type": "City",
        "name": "Trnava"
      },
      {
        "@type": "City",
        "name": "Pezinok"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Sťahovacie služby",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sťahovanie bytov"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Vypratávanie"
          }
        }
      ]
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
