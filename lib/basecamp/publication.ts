export type BasecampPublicationId = "southernvt" | "madeinvt";

export const BASECAMP_PUBLICATION_STORAGE_KEY = "basecamp.activePublication";
export const BASECAMP_PUBLICATION_EVENT = "basecamp:publication-changed";

export const basecampPublicationOptions: Array<{ id: BasecampPublicationId; label: string }> = [
  { id: "madeinvt", label: "MadeInVT" },
  { id: "southernvt", label: "SouthernVT" },
];

export const basecampPublicationSidebarItems: Record<BasecampPublicationId, Array<{ label: string; href: string }>> = {
  southernvt: [
    { label: "SouthernVT 100", href: "/basecamp/southernvt-100" },
    { label: "Places", href: "/basecamp/places" },
    { label: "Businesses", href: "/basecamp/businesses" },
    { label: "Events", href: "/basecamp/events" },
    { label: "Collections", href: "/basecamp/collections" },
  ],
  madeinvt: [
    { label: "Vermont 100 Makers", href: "/basecamp/vermont-100-makers" },
    { label: "Makers", href: "/basecamp/places" },
    { label: "Studios", href: "/basecamp/businesses" },
    { label: "Collections", href: "/basecamp/collections" },
    { label: "Gift Guides", href: "/basecamp/collections?view=gift-guides" },
  ],
};

export const basecampPublicationDashboard: Record<
  BasecampPublicationId,
  {
    brandLabel: string;
    focusTitle: string;
    focusReason: string;
    focusHref: string;
    currentIssueTitle: string;
    currentIssueTheme: string;
    currentIssueProgress: number;
    storiesReadyLabel: string;
    storiesReadyValue: string;
    kpis: Array<{ label: string; value: string }>;
    coverageTitle: string;
    coverageCtaLabel: string;
    coverageCtaHref: string;
  }
> = {
  madeinvt: {
    brandLabel: "MadeInVT",
    focusTitle: "Today’s Highest Impact Maker Work",
    focusReason: "Priority maker profiles and gift-guide coverage for this week's publication cycle.",
    focusHref: "/basecamp/vermont-100-makers",
    currentIssueTitle: "Vermont Summer Makers",
    currentIssueTheme: "Maker-first editorial issue focused on workshops, craftsmanship stories, and gift-ready collections.",
    currentIssueProgress: 74,
    storiesReadyLabel: "Maker stories ready to publish",
    storiesReadyValue: "14",
    kpis: [
      { label: "Analytics · Visitors", value: "3,012" },
      { label: "Analytics · Search Conversions", value: "268" },
      { label: "Stories · Publish Ready", value: "14" },
      { label: "KPIs · Active Makers", value: "100" },
      { label: "KPIs · Gift Guides", value: "27" },
    ],
    coverageTitle: "Vermont 100 Makers Coverage Progress",
    coverageCtaLabel: "Open Vermont 100 Makers",
    coverageCtaHref: "/basecamp/vermont-100-makers",
  },
  southernvt: {
    brandLabel: "SouthernVT",
    focusTitle: "Today’s Highest Impact Travel Work",
    focusReason: "Priority legacy place coverage and guide updates for the current editorial issue.",
    focusHref: "/basecamp/southernvt-100",
    currentIssueTitle: "Southern Vermont Summer Escapes",
    currentIssueTheme: "Legacy travel issue with destination, events, and seasonal guide updates.",
    currentIssueProgress: 61,
    storiesReadyLabel: "Travel stories ready to publish",
    storiesReadyValue: "9",
    kpis: [
      { label: "Analytics · Visitors", value: "2,143" },
      { label: "Analytics · Trips Planned", value: "186" },
      { label: "Stories · Ready for Review", value: "11" },
      { label: "KPIs · Featured Places", value: "246" },
      { label: "KPIs · Active Collections", value: "19" },
    ],
    coverageTitle: "SouthernVT 100 Coverage Progress",
    coverageCtaLabel: "Open SouthernVT 100",
    coverageCtaHref: "/basecamp/southernvt-100",
  },
};
