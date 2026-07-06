import { RelatedContentRail } from "@/components/public/RelatedContentRail";
import type { Place } from "@/types/Place";

type NearbyPlacesRailProps = {
  places: Place[];
  title?: string;
};

export function NearbyPlacesRail({ places, title = "Related Makers" }: NearbyPlacesRailProps) {
  return (
    <RelatedContentRail
      title={title}
      items={places.map((place) => ({
        id: place.id,
        title: place.name,
        subtitle: `${place.placeType} · ${place.city}`,
        href: `/places/${place.slug}`,
        badge: place.featured ? "Featured" : undefined,
      }))}
      emptyTitle="No related makers yet"
      emptyDescription="Related makers will appear as more maker relationships are mapped."
    />
  );
}
