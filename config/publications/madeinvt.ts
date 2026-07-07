import type { PublicationConfig } from "@/config/publication";

export const madeInVTConfig: PublicationConfig = {
  siteName: "MadeInVT",
  tagline: "Made by Vermonters. Shared with the World.",
  theme: {
    palette: ["Warm Linen", "Walnut", "Copper", "Charcoal", "Cream"],
    background: "var(--color-cream)",
    foreground: "var(--color-charcoal)",
  },
  primaryEntity: "Maker",
  secondaryEntity: "Studio",
  navigation: [
    {
      label: "Explore",
      href: "/collections",
      items: [
        { label: "Collections", href: "/collections" },
        { label: "Gift Guides", href: "/collections" },
        { label: "Events", href: "/events" },
        { label: "New Makers", href: "/updates" },
      ],
    },
    {
      label: "Makers",
      href: "/makers",
      items: [
        { label: "All Makers", href: "/makers" },
        { label: "Studios", href: "/businesses" },
        { label: "Visit the Workshop", href: "/events" },
      ],
    },
    {
      label: "Stories",
      href: "/guides",
      items: [
        { label: "Maker Stories", href: "/guides" },
        { label: "Behind the Bench", href: "/guides" },
      ],
    },
    {
      label: "Shop",
      href: "/collections",
      items: [
        { label: "Browse Handmade Products", href: "/collections" },
        { label: "Support Vermont Makers", href: "/collections" },
      ],
    },
  ],
  homepage: {
    heroTitle: "Discover Vermont's Makers",
    heroSubtitle: "Explore handcrafted goods, artisan workshops, local creators, and the stories behind Vermont craftsmanship.",
    sections: [
      "Featured Maker",
      "Maker Stories",
      "Behind the Bench",
      "Workshop Visits",
      "New Collections",
      "Seasonal Gift Guide",
      "Featured Studios",
      "Customer Experiences",
    ],
  },
  brand: {
    voice: "Maker-first editorial storytelling",
    typography: {
      sans: "Inter",
      serif: "Playfair Display",
    },
  },
  emails: {
    hello: "hello@madeinvt.com",
    partners: "partners@madeinvt.com",
    press: "press@madeinvt.com",
  },
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
  seo: {
    title: "MadeInVT | Vermont Makers, Artisans & Handcrafted Goods",
    description: "Explore handcrafted goods, artisan workshops, local creators, and the stories behind Vermont craftsmanship.",
  },
  betaBanner: {
    message: "MadeInVT is currently in Public Beta. We're adding new makers every week. Know an artisan we should feature?",
    ctaLabel: "Let us know.",
    ctaHref: "/feedback",
  },
};
