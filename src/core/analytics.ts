// src/core/analytics.ts
export const GA_MEASUREMENT_ID = "G-YYBL6G3GLJ";

export const trackEvent = (action: string, params?: object) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, params);
    }
};

export const trackPhoneClick = () => trackEvent('phone_click', { event_category: 'conversion', event_label: 'contact_phone' });
export const trackEmailClick = () => trackEvent('email_click', { event_category: 'conversion', event_label: 'contact_email' });
export const trackQuoteRequest = (apartmentSize?: string) => trackEvent('quote_request', { event_category: 'conversion', event_label: apartmentSize || 'unknown_size', currency: 'EUR' });
export const trackServiceView = (serviceName: string) => trackEvent('service_view', { event_category: 'engagement', event_label: serviceName });
