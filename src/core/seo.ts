// src/core/seo.ts
import { siteConfig } from "./siteConfig";

type SEOInput = {
    title?: string;
    description?: string;
    path?: string;
};

export function buildSeo({ title, description, path = "/" }: SEOInput) {
    const fullTitle = title
        ? `${title} | ${siteConfig.name}`
        : siteConfig.name;

    const url = new URL(path, siteConfig.baseUrl).toString();

    return {
        title: fullTitle,
        description:
            description ??
            "Bezstarostné sťahovanie bytov, domov a firiem v Bratislave – VI&MO.",
        url,
    };
}
