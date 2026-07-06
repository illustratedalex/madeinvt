type NavigationGroup = {
  label: string;
  href: string;
  items: { label: string; href: string }[];
};

export const publicNavigationGroups: NavigationGroup[] = [
  {
    label: "Explore",
    href: "/search",
    items: [
      { label: "Explore", href: "/search" },
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
      { label: "New Makers", href: "/updates" },
      { label: "Why Trust MadeInVT", href: "/why-trust-southernvt" },
      { label: "How We Choose Makers", href: "/our-coverage" },
    ],
  },
  {
    label: "Studios",
    href: "/businesses",
    items: [
      { label: "Studios", href: "/businesses" },
      { label: "Claim a Listing", href: "/businesses" },
      { label: "Founding Makers", href: "/founding-partners" },
      { label: "Maker Portal", href: "/partner-portal" },
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
  { label: "How We Choose Makers", href: "/our-coverage" },
  { label: "Why Trust MadeInVT?", href: "/why-trust-southernvt" },
  { label: "Founding Makers", href: "/founding-partners" },
  { label: "Contact", href: "/contact" },
  { label: "New Makers", href: "/updates" },
  { label: "Maker Portal", href: "/partner-portal" },
  { label: "Suggest a Maker", href: "/feedback?category=Suggest%20a%20Maker" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
