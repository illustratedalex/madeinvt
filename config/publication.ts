export interface PublicationConfig {
  siteName: string;
  tagline: string;
  theme: {
    palette: string[];
    background: string;
    foreground: string;
  };
  primaryEntity: string;
  secondaryEntity: string;
  navigation: Array<{
    label: string;
    href: string;
    items?: Array<{ label: string; href: string }>;
  }>;
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    sections: string[];
  };
  brand: {
    voice: string;
    typography: {
      sans: string;
      serif: string;
    };
  };
  emails: {
    hello: string;
    partners: string;
    press: string;
  };
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  seo: {
    title: string;
    description: string;
  };
  betaBanner?: {
    message: string;
    ctaLabel: string;
    ctaHref: string;
  };
}
