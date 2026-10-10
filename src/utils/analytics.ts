/**
 * Google Analytics gtag helper for Math Time Lab
 * Measurement ID: G-F63R3HSRKQ (Shared with parent website itsmathtime.co.in)
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-F63R3HSRKQ';

/**
 * Tracks virtual SPA pageviews for Google Analytics
 */
export const trackPageView = (pageTitle: string, pagePath: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    const pageLocation = `${window.location.origin}${pagePath}`;

    // Update config with the active page details
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: pageTitle,
      page_path: pagePath,
      page_location: pageLocation,
    });

    // Explicitly send page_view event for SPA transitions
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_path: pagePath,
      page_location: pageLocation,
      send_to: GA_MEASUREMENT_ID,
    });
  }
};

/**
 * Tracks custom interaction events
 */
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...params,
      send_to: GA_MEASUREMENT_ID,
    });
  }
};
