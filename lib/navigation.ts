type NavigationGroup = {
  label: string;
  href: string;
  items: { label: string; href: string }[];
};

export const publicNavigationGroups: NavigationGroup[] = [
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
      { label: "Suggest a Maker", href: "/feedback?category=Suggest%20a%20Maker" },
    ],
  },
  {
    label: "Stories",
    href: "/guides",
    items: [
      { label: "Maker Stories", href: "/guides" },
      { label: "Behind the Bench", href: "/guides" },
      { label: "Why Trust MadeInVT?", href: "/why-trust-southernvt" },
      { label: "How We Choose Makers", href: "/our-coverage" },
    ],
  },
  {
    label: "Shop",
    href: "/collections",
    items: [
      { label: "Gift Guides", href: "/collections" },
      { label: "New Collections", href: "/collections" },
      { label: "Browse Handmade Products", href: "/collections" },
      { label: "Support Vermont Makers", href: "/collections" },
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
