import Link from "next/link";
import type { MakerCollectionReference, MakerEventReference, MakerRelationship } from "@/types/MakerDNA";

type MakerHighlightsProps = {
  products: string[];
  customerExperiences: string[];
  collections: MakerCollectionReference[];
  events: MakerEventReference[];
  relationships: MakerRelationship[];
};

function ItemList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
      {items.length ? (
        <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-700">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1f3b2f]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-600">No highlights yet.</p>
      )}
    </div>
  );
}

function LinkList({ title, items }: { title: string; items: { label: string; href?: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
      {items.length ? (
        <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-700">
          {items.map((item) => (
            <li key={`${title}-${item.label}`} className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1f3b2f]" />
              {item.href ? (
                <Link href={item.href} className="underline underline-offset-4">
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-600">No highlights yet.</p>
      )}
    </div>
  );
}

export function MakerHighlights({ products, customerExperiences, collections, events, relationships }: MakerHighlightsProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f5a3d]">Highlights</p>
      <h3 className="mt-2 text-2xl font-semibold text-slate-900">Editorial Highlights</h3>

      <div className="mt-4 grid gap-5 md:grid-cols-2">
        <ItemList title="Products" items={products} />
        <ItemList title="Customer Experiences" items={customerExperiences} />
        <LinkList title="Collections" items={collections.map((collection) => ({ label: collection.title, href: collection.href }))} />
        <LinkList title="Events" items={events.map((event) => ({ label: event.title, href: event.href }))} />
      </div>

      <div className="mt-5 border-t border-[#ece3cf] pt-4">
        <LinkList title="Related Makers" items={relationships.map((relationship) => ({ label: relationship.label, href: relationship.href }))} />
      </div>
    </article>
  );
}
