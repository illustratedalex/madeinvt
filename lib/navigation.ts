type NavigationGroup = {
  label: string;
  href: string;
  items: { label: string; href: string }[];
};

export const publicNavigationGroups: NavigationGroup[] = [
  {
    label: "Explore",
    href: "/places",
    items: [
      { label: "Explore", href: "/places" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    label: "Makers",
    href: "/makers",
    items: [
      { label: "Makers", href: "/makers" },
      { label: "Featured Makers", href: "/makers" },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
    items: [
      { label: "Collections", href: "/collections" },
      { label: "Gift Guides", href: "/collections" },
    ],
  },
  {
    label: "Gift Guides",
    href: "/collections",
    items: [
      { label: "Gift Guides", href: "/collections" },
      { label: "Gift Finder", href: "/planner" },
      { label: "Maker Finder", href: "/concierge" },
    ],
  },
  {
    label: "Stories",
    href: "/guides",
    items: [
      { label: "Stories", href: "/guides" },
      { label: "Current Issue", href: "/updates" },
      { label: "Why Trust MadeInVT", href: "/why-trust-southernvt" },
      { label: "Our Coverage", href: "/our-coverage" },
    ],
  },
  {
    label: "Studios",
    href: "/businesses",
    items: [
      { label: "Studios", href: "/businesses" },
      { label: "Claim a Listing", href: "/businesses" },
      { label: "Founding Makers", href: "/founding-partners" },
      { label: "Partner Portal", href: "/partner-portal" },
    ],
  },
  {
    label: "Events",
    href: "/events",
    items: [
      { label: "Events", href: "/events" },
      { label: "Workshops", href: "/events" },
    ],
  },
  {
    label: "Shop",
    href: "/collections",
    items: [
      { label: "Find Handmade", href: "/collections" },
      { label: "Gift Finder", href: "/concierge" },
    ],
  },
];

export const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Our Coverage", href: "/our-coverage" },
  { label: "Why Trust MadeInVT?", href: "/why-trust-southernvt" },
  { label: "Founding Makers", href: "/founding-partners" },
  { label: "Contact", href: "/contact" },
  { label: "Updates", href: "/updates" },
  { label: "Partner Portal", href: "/partner-portal" },
  { label: "Feedback", href: "/feedback" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
