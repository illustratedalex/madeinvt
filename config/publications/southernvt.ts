import type { PublicationConfig } from "@/config/publication";

export const southernVTConfig: PublicationConfig = {
  siteName: "SouthernVT",
  tagline: "Regional travel stories and practical guides.",
  theme: {
    palette: ["Forest Green", "Maple Gold", "Cream", "Slate"],
    background: "var(--color-cream)",
    foreground: "var(--color-slate)",
  },
  primaryEntity: "Place",
  secondaryEntity: "Business",
  navigation: [
    {
      label: "Explore",
      href: "/places",
      items: [
        { label: "Places", href: "/places" },
        { label: "Collections", href: "/collections" },
        { label: "Events", href: "/events" },
      ],
    },
    {
      label: "Guides",
      href: "/guides",
      items: [
        { label: "Guides", href: "/guides" },
        { label: "Trip Planner", href: "/trip-planner" },
      ],
    },
    {
      label: "Directory",
      href: "/businesses",
      items: [
        { label: "Businesses", href: "/businesses" },
        { label: "Deals", href: "/deals" },
      ],
    },
  ],
  homepage: {
    heroTitle: "Discover Southern Vermont",
    heroSubtitle: "Find trusted places, guides, events, and local stories across Southern Vermont.",
    sections: [
      "Featured Destination",
      "Travel Guides",
      "Collections",
      "Plan Your Trip",
      "Events",
      "Directory Highlights",
    ],
  },
  brand: {
    voice: "Regional travel publication",
    typography: {
      sans: "Inter",
      serif: "Playfair Display",
    },
  },
  emails: {
    hello: "hello@southernvt.com",
    partners: "partners@southernvt.com",
    press: "press@southernvt.com",
  },
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
  seo: {
    title: "SouthernVT | Regional Travel Publication",
    description: "Editorial travel coverage across Southern Vermont with places, collections, and planning guides.",
  },
};
