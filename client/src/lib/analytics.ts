// Google Analytics integration based on blueprint: javascript_google_analytics

// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

// Track events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// GA4 Conversion Tracking Functions
export const trackPhoneClick = () => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'phone_click', {
    event_category: 'conversion',
    event_label: 'contact_phone',
  });
};

export const trackEmailClick = () => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'email_click', {
    event_category: 'conversion',
    event_label: 'contact_email',
  });
};

export const trackServiceView = (serviceName: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'service_view', {
    event_category: 'engagement',
    event_label: serviceName,
  });
};

export const trackBlogRead = (postTitle: string, readingTime: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'blog_read', {
    event_category: 'engagement',
    event_label: postTitle,
    value: readingTime,
  });
};

export const trackQuoteRequest = (apartmentSize?: string, value?: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'quote_request', {
    event_category: 'conversion',
    event_label: apartmentSize || 'unknown_size',
    value: value,
    currency: 'EUR',
  });
};

// Core Web Vitals Tracking
export const initWebVitals = async () => {
  if (typeof window === 'undefined') {
    console.warn('initWebVitals called in non-browser environment');
    return;
  }
  
  if (!window.gtag) {
    console.warn('gtag not available, skipping Web Vitals initialization');
    return;
  }
  
  try {
    const webVitalsModule = await import('web-vitals');
    console.log('✅ web-vitals module loaded successfully');
    
    // Note: onFID removed in web-vitals v5 (March 2024) - INP replaced FID as Core Web Vital
    const { onCLS, onFCP, onLCP, onTTFB, onINP } = webVitalsModule;
    
    const sendToAnalytics = ({ name, value, id, rating }: { name: string; value: number; id: string; rating?: string }) => {
      if (window.gtag) {
        window.gtag('event', name, {
          event_category: 'Web Vitals',
          event_label: id,
          value: Math.round(name === 'CLS' ? value * 1000 : value),
          metric_rating: rating,
          non_interaction: true,
        });
      }
    };
    
    // Track all Core Web Vitals (v5: INP replaced FID)
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
    
    console.log('✅ Core Web Vitals tracking initialized');
  } catch (error) {
    console.error('Failed to initialize Web Vitals - detailed error:', error);
    console.error('Error name:', (error as Error)?.name);
    console.error('Error message:', (error as Error)?.message);
    console.error('Error stack:', (error as Error)?.stack);
  }
};
