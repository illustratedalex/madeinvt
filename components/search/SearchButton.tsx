"use client";

import { useSearch } from "./SearchProvider";

export function SearchButton() {
  const { openPalette } = useSearch();

  return (
    <button
      type="button"
      onClick={openPalette}
      className="hidden min-w-[18rem] items-center justify-between gap-3 rounded-full border border-[#d8c9ad] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-[#1f3b2f] transition hover:border-[#c5b187] hover:bg-white lg:inline-flex xl:min-w-[21rem]"
    >
      <span className="truncate text-left">Search makers, studios, products...</span>
      <span className="rounded-md border border-[#d8c9ad] bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">Ctrl K</span>
    </button>
  );
}
