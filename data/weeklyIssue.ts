import type { EditorialIssue } from "@/types/EditorialIssue";

export type PublicationStage = "Idea" | "Assigned" | "Draft" | "Copy Desk" | "Photo Desk" | "Ready" | "Published";

export type WeeklyIssueStory = {
  title: string;
  summary: string;
  href: string;
  status: PublicationStage;
  contentHealth: number;
};

export type WeeklyIssueCard = {
  title: string;
  summary: string;
  href: string;
};

export type WeeklyIssueTask = {
  title: string;
  detail: string;
  status: "pending" | "in_progress" | "complete";
};

export type WeeklyIssueChecklistItem = {
  title: string;
  detail: string;
  complete: boolean;
};

export type WeeklyIssue = {
  issueNumber: number;
  title: string;
  theme: string;
  coverStory: WeeklyIssueStory & {
    leadPhotoPlaceholder: string;
  };
  publicationDate: string;
  completionPercent: number;
  currentStage: PublicationStage;
  publicationStages: Array<{ label: PublicationStage; complete: boolean }>;
  supportingStories: WeeklyIssueStory[];
  featuredCollections: WeeklyIssueCard[];
  photographyAssignments: WeeklyIssueTask[];
  verificationTasks: WeeklyIssueTask[];
  publicationChecklist: WeeklyIssueChecklistItem[];
  newsletterPreview: {
    subject: string;
    sections: WeeklyIssueCard[];
  };
  metrics: {
    storiesInProgress: number;
    storiesPublished: number;
    averageContentHealth: number;
    assignmentsComplete: number;
    photosOutstanding: number;
    verificationOutstanding: number;
  };
  editorialNotes: string;
};

export const weeklyIssue: WeeklyIssue = {
  issueNumber: 4,
  title: "Holiday Gift Guide",
  theme: "Vermont makers and handcrafted gifting",
  publicationDate: "2026-07-12",
  completionPercent: 76,
  currentStage: "Photo Desk",
  coverStory: {
    title: "Meet Vermont Woodworkers",
    summary:
      "A lead maker story focused on workshop process, materials, and the craft behind heirloom-quality furniture.",
    href: "/guides/behind-the-bench-vermont-woodshop",
    status: "Copy Desk",
    contentHealth: 91,
    leadPhotoPlaceholder: "Lead workshop photo placeholder",
  },
  publicationStages: [
    { label: "Idea", complete: true },
    { label: "Assigned", complete: true },
    { label: "Draft", complete: true },
    { label: "Copy Desk", complete: true },
    { label: "Photo Desk", complete: false },
    { label: "Ready", complete: false },
    { label: "Published", complete: false },
  ],
  supportingStories: [
    {
      title: "Makers of the Green Mountains",
      summary: "A broad editorial feature introducing maker studios across regions and disciplines.",
      href: "/guides",
      status: "Draft",
      contentHealth: 86,
    },
    {
      title: "Handcrafted for the Home",
      summary: "Collection notes focused on home decor, kitchen goods, and everyday handmade essentials.",
      href: "/collections/home-decor",
      status: "Assigned",
      contentHealth: 84,
    },
    {
      title: "Women Makers of Vermont",
      summary: "A spotlight package highlighting women-led studios and maker stories.",
      href: "/guides",
      status: "Idea",
      contentHealth: 82,
    },
    {
      title: "Made with Maple",
      summary: "Maker notes on maple producers creating gift-ready pantry products.",
      href: "/collections/maple",
      status: "Published",
      contentHealth: 94,
    },
    {
      title: "Vermont Potters",
      summary: "An editorial guide to pottery studios, clay process, and seasonal gift picks.",
      href: "/collections/pottery",
      status: "Copy Desk",
      contentHealth: 88,
    },
    {
      title: "Blacksmiths & Metal Artists",
      summary: "A craft feature exploring forged work, metal techniques, and studio traditions.",
      href: "/guides",
      status: "Draft",
      contentHealth: 85,
    },
  ],
  featuredCollections: [
    {
      title: "Holiday Gifts",
      summary: "Seasonal gift highlights from Vermont makers and artisan studios.",
      href: "/collections/holiday-gifts",
    },
    {
      title: "Wedding Gifts",
      summary: "Heirloom-minded gifting from ceramics, woodwork, textiles, and glassmakers.",
      href: "/collections/wedding-gifts",
    },
    {
      title: "Home Decor",
      summary: "Handcrafted home pieces curated for warmth, utility, and lasting design.",
      href: "/collections/home-decor",
    },
  ],
  photographyAssignments: [
    { title: "Cover workshop hero", detail: "Hands-at-bench hero frame for woodworker cover story", status: "in_progress" },
    { title: "Studio portrait set", detail: "Portraits for women maker profiles and maker spotlight cards", status: "pending" },
    { title: "Gift guide flat lays", detail: "Holiday, wedding, and kitchen collection support imagery", status: "in_progress" },
    { title: "Process reels", detail: "Short-form clips from pottery and blacksmith studios", status: "pending" },
  ],
  verificationTasks: [
    { title: "Confirm maker details", detail: "Validate maker names, studio names, and craft categories", status: "in_progress" },
    { title: "Check collection links", detail: "Ensure all holiday and gift links resolve to active collection pages", status: "pending" },
    { title: "Review copy claims", detail: "Remove any overclaiming language and keep profile-safe phrasing", status: "complete" },
  ],
  publicationChecklist: [
    { title: "Cover story approved", detail: "Lead maker story and subhead approved by editorial", complete: true },
    { title: "Story desk aligned", detail: "Maker Notes, Workshop Visits, Behind the Bench, and Studio Stories wired", complete: true },
    { title: "Photo desk cleared", detail: "Hero and supporting galleries delivered", complete: false },
    { title: "Collection QA complete", detail: "Gift guide and collection cards reviewed on homepage", complete: false },
    { title: "Newsletter preview locked", detail: "Subject and section lineup approved", complete: true },
  ],
  newsletterPreview: {
    subject: "This Week at MadeInVT: Holiday Gift Guide + Maker Stories",
    sections: [
      { title: "Featured Maker", summary: "Meet this week's maker and go behind the bench.", href: "/makers" },
      { title: "Gift Guide", summary: "Holiday picks from Vermont studios and handmade collections.", href: "/collections/holiday-gifts" },
      { title: "Maker Story", summary: "Workshop process notes from our latest editorial feature.", href: "/guides" },
      { title: "Collection Spotlight", summary: "A closer look at handcrafted home and wedding gifts.", href: "/collections" },
    ],
  },
  metrics: {
    storiesInProgress: 4,
    storiesPublished: 2,
    averageContentHealth: 88,
    assignmentsComplete: 5,
    photosOutstanding: 2,
    verificationOutstanding: 1,
  },
  editorialNotes:
    "The current issue is gift-guide-led and maker-first, centered on workshop process, studio storytelling, and handcrafted collections.",
};

export const weeklyIssueEditorialIssue: EditorialIssue = {
  id: "issue-004",
  title: weeklyIssue.title,
  weekOf: "2026-07-12",
  theme: weeklyIssue.theme,
  status: "active",
  coverStoryId: "story-meet-vermont-woodworkers",
  featuredPlaces: [
    "place-vermont-country-store",
    "place-brattleboro-farmers-market",
    "place-windham-brewing-co",
    "place-grafton-inn",
  ],
  featuredCollections: ["collection-holiday-gifts", "collection-wedding-gifts", "collection-home-decor"],
  featuredArticles: ["article-bennington-potters-story", "article-behind-the-bench-woodshop"],
  featuredEvents: ["event-brattleboro-farmers-market"],
  featuredDeals: ["deal-free-coffee-breakfast-brattleboro", "deal-family-museum-admission"],
  assignments: [
    {
      id: "assign-cover-story",
      title: "Meet Vermont Woodworkers cover package",
      type: "story",
      assignee: "Alex Chen",
      status: "in_progress",
      priority: "urgent",
      dueDate: "2026-07-10",
      contentId: "story-meet-vermont-woodworkers",
      notes: "Center craft process, materials, and workshop rhythm.",
      createdAt: "2026-07-05T10:00:00Z",
      updatedAt: "2026-07-06T11:00:00Z",
    },
    {
      id: "assign-photo",
      title: "Holiday Gift Guide studio photo set",
      type: "photography",
      assignee: "Jordan Davis",
      status: "assigned",
      priority: "high",
      dueDate: "2026-07-11",
      notes: "Capture product, process, and portrait frames for homepage blocks.",
      createdAt: "2026-07-05T10:00:00Z",
      updatedAt: "2026-07-06T10:30:00Z",
    },
    {
      id: "assign-research",
      title: "Women makers issue research",
      type: "research",
      assignee: "Morgan Lee",
      status: "submitted",
      priority: "high",
      dueDate: "2026-07-09",
      notes: "Compile profiles and verify studio/contact details.",
      createdAt: "2026-07-05T10:00:00Z",
      updatedAt: "2026-07-06T10:45:00Z",
    },
    {
      id: "assign-seo",
      title: "Maker issue SEO pass",
      type: "seo",
      assignee: "Casey Smith",
      status: "idea",
      priority: "medium",
      dueDate: "2026-07-12",
      notes: "Prioritize terms around woodworking, pottery, maple gifts, and holiday handmade products.",
      createdAt: "2026-07-05T10:00:00Z",
      updatedAt: "2026-07-06T09:45:00Z",
    },
  ],
  notes: weeklyIssue.editorialNotes,
  createdAt: "2026-07-05T09:00:00Z",
  updatedAt: "2026-07-06T12:00:00Z",
};
