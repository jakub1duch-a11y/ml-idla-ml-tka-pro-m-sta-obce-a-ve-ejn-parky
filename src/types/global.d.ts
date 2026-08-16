import type * as React from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    trackGateInterest?: (...args: unknown[]) => void;
    trackMistSculptureInterest?: (...args: unknown[]) => void;
    trackCooperationFormSubmit?: (...args: unknown[]) => void;
    trackProductSectionEngagement?: (...args: unknown[]) => void;
    trackProductView?: (...args: unknown[]) => void;
    trackProductClick?: (...args: unknown[]) => void;
    trackQuickInquiryClick?: (...args: unknown[]) => void;
    trackBlogPostView?: (...args: unknown[]) => void;
    trackReferenceView?: (...args: unknown[]) => void;
    trackContactFormSubmit?: (...args: unknown[]) => void;
    trackInquirySubmitted?: (...args: unknown[]) => void;
    trackRentalInquiry?: (...args: unknown[]) => void;
    trackThankYouPageView?: (...args: unknown[]) => void;
  }

  interface ImportMetaEnv {
    readonly VITE_BASE44_APP_ID?: string;
    readonly VITE_BASE44_FUNCTIONS_VERSION?: string;
    readonly VITE_BASE44_APP_BASE_URL?: string;
    readonly [key: string]: string | boolean | undefined;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'camera-controls'?: string;
        'touch-action'?: string;
        'auto-rotate'?: string;
        'rotation-per-second'?: string;
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        exposure?: string;
        'environment-image'?: string;
        ar?: string;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'ar-placement'?: string;
        'xr-environment'?: string;
        'interaction-prompt'?: string;
      };
    }
  }
}

export {};
