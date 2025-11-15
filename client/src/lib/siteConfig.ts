export const siteConfig = {
  name: "VI&MO Sťahovanie",
  baseUrl: "https://stahovanie.website",
  phone: "+421 911 275 755",
  email: "info@viandmo.com",
  addressLine: "Karpatské námestie 7770/10A, 831 06 Bratislava - Rača",
  ico: "56 811 322",
  dic: "2122461176",
} as const;

export type SiteConfig = typeof siteConfig;
