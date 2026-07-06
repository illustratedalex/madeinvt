export type MakerRelationship = {
  label: string;
  href?: string;
};

export type MakerCollectionReference = {
  id: string;
  title: string;
  href?: string;
};

export type MakerEventReference = {
  id: string;
  title: string;
  href?: string;
};

export interface MakerDNA {
  maker: string;
  craft: string;
  specialties: string[];
  materials: string[];
  techniques: string[];
  ships: boolean;
  workshopVisits: boolean;
  customOrders: boolean;
  apprentices: number | null;
  yearsCrafting: number | null;
  story: string;
  products: string[];
  gallery: string[];
  customerExperiences: string[];
  collections: MakerCollectionReference[];
  events: MakerEventReference[];
  relationships: MakerRelationship[];
}
