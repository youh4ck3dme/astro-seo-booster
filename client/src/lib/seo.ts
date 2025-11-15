import { siteConfig } from "./siteConfig";
import type { SEOData } from "@shared/schema";

type SEOInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
};

export function buildSeo({ 
  title, 
  description, 
  path = "/",
  image,
  type = "website"
}: SEOInput): SEOData {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} - Bezstarostné sťahovanie v Bratislave`;

  const url = path.startsWith('http') 
    ? path 
    : new URL(path, siteConfig.baseUrl).toString();

  const defaultDescription = "Profesionálne sťahovanie bytov, domov a firiem v Bratislave. Skúsený tím, poistenie zodpovednosti, férové ceny. Kontaktujte nás pre nezáväznú ponuku.";

  return {
    title: fullTitle,
    description: description ?? defaultDescription,
    url,
    canonicalUrl: url,
    image: image ?? `${siteConfig.baseUrl}/og-image.jpg`,
    type,
  };
}

// Calculate reading time from content
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Format date for Slovak locale
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('sk-SK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
