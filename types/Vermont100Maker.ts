export type Vermont100MakerCategory =
  | "Woodworking"
  | "Furniture"
  | "Pottery"
  | "Ceramics"
  | "Glass"
  | "Blacksmith"
  | "Jewelry"
  | "Leather"
  | "Fiber Arts"
  | "Quilting"
  | "Painting"
  | "Photography"
  | "Printmaking"
  | "Metalwork"
  | "Knife Making"
  | "Maple"
  | "Chocolate"
  | "Coffee Roasters"
  | "Breweries"
  | "Distilleries"
  | "Cheese Makers"
  | "Soap Makers"
  | "Candles"
  | "Home Decor"
  | "Toys"
  | "Musical Instruments";

export type Vermont100MakerPriority = "Critical" | "High" | "Medium" | "Low";

export type Vermont100MakerEditorialStatus =
  | "Idea"
  | "Research"
  | "Interview"
  | "Photography"
  | "Writing"
  | "Copy Desk"
  | "Ready"
  | "Published";

export type Vermont100MakerStoryStatus = "Not Started" | "In Progress" | "Ready" | "Published";
export type Vermont100MakerGalleryStatus = "Not Started" | "In Progress" | "Ready" | "Published";
export type Vermont100MakerCustomerExperienceStatus = "Not Started" | "In Progress" | "Ready" | "Published";

export interface Vermont100Maker {
  id: string;
  slug: string;
  makerName: string;
  studio: string;
  town: string;
  region: string;
  craft: string;
  category: Vermont100MakerCategory;
  priority: Vermont100MakerPriority;
  editorialStatus: Vermont100MakerEditorialStatus;
  storyStatus: Vermont100MakerStoryStatus;
  galleryStatus: Vermont100MakerGalleryStatus;
  customerExperienceStatus: Vermont100MakerCustomerExperienceStatus;
  collections: string[];
  giftGuides: string[];
  workshop: boolean;
  ships: boolean;
  customOrders: boolean;
  onlineStore: boolean;
  studioVisits: boolean;
  yearsCrafting: number | null;
  website: string;
  contactEmail: string;
}
