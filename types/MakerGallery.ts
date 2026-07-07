export type MakerGalleryImageStatus = "pending" | "approved" | "rejected";

export interface MakerGalleryImage {
  id: string;
  makerSlug: string;
  userId: string;
  imageUrl: string;
  caption: string;
  altText: string;
  status: MakerGalleryImageStatus;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  signedUrl?: string;
}
