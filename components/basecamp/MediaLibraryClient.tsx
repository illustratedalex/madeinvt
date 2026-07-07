"use client";

import { useMemo, useState } from "react";
import { Button, Input, useToasts } from "@/components/ui";
import type { CompassPublication, MediaAsset, MediaSection, MediaFolder, RelatedEntityType } from "@/types/MediaAsset";

type MediaLibraryClientProps = {
  initialAssets: MediaAsset[];
};

const sections: MediaSection[] = [
  "All Media",
  "Photos",
  "Drone",
  "Video",
  "Portraits",
  "Hero Images",
  "Social Images",
  "Logos",
  "Documents",
];

const publications: CompassPublication[] = ["SouthernVT", "MadeInVT", "Modern Relic", "Future"];
const folders: MediaFolder[] = ["Hero", "Gallery", "Drone", "Portrait", "Workshop", "Products", "Social", "Logos", "Documents"];
const relatedEntityTypes: RelatedEntityType[] = ["Place", "Maker", "Business", "Collection", "Issue", "Story"];
const quickActions = ["Attach to Story", "Attach to Maker", "Attach to Place", "Use as Hero", "Use in Collection", "Export"] as const;

function statusPill(status: MediaAsset["status"]) {
  if (status === "approved" || status === "active") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "archived") return "border-slate-200 bg-slate-100 text-slate-700";
  return "border-amber-200 bg-amber-50 text-amber-900";
}

export function MediaLibraryClient({ initialAssets }: MediaLibraryClientProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [section, setSection] = useState<MediaSection>("All Media");
  const [search, setSearch] = useState("");
  const [searchPublication, setSearchPublication] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [searchIssue, setSearchIssue] = useState("");
  const [searchPhotographer, setSearchPhotographer] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchEntity, setSearchEntity] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    publication: "MadeInVT" as CompassPublication,
    folder: "Gallery" as MediaFolder,
    altText: "",
    caption: "",
    photographer: "",
    capturedAt: "",
    gps: "",
    relatedEntityType: "Maker" as RelatedEntityType,
    relatedEntity: "",
    issue: "",
    tags: "",
    keywords: "",
    aiDescription: "",
    file: null as File | null,
  });
  const { pushToast } = useToasts();

  const selectedAsset = useMemo(() => assets.find((asset) => asset.id === selectedId) ?? null, [assets, selectedId]);

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assets
      .filter((asset) => (section === "All Media" ? true : asset.section === section))
      .filter((asset) => (searchPublication ? asset.publication === searchPublication : true))
      .filter((asset) => (searchTag ? asset.tags.includes(searchTag) : true))
      .filter((asset) => (searchIssue ? asset.issue.toLowerCase().includes(searchIssue.toLowerCase()) : true))
      .filter((asset) => (searchDate ? asset.capturedAt === searchDate : true))
      .filter((asset) => (searchPhotographer ? asset.photographer.toLowerCase().includes(searchPhotographer.toLowerCase()) : true))
      .filter((asset) => (searchEntity ? asset.relatedEntity.toLowerCase().includes(searchEntity.toLowerCase()) : true))
      .filter((asset) => {
        if (!query) return true;
        return `${asset.title} ${asset.caption} ${asset.altText} ${asset.tags.join(" ")} ${asset.relatedEntity} ${asset.issue}`
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [assets, section, search, searchPublication, searchTag, searchIssue, searchDate, searchPhotographer, searchEntity]);

  const refreshAssets = async () => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (section !== "All Media") query.set("section", section);
    if (searchPublication) query.set("publication", searchPublication);
    if (searchTag) query.set("tag", searchTag);
    if (searchIssue) query.set("issue", searchIssue);
    if (searchDate) query.set("date", searchDate);
    if (searchPhotographer) query.set("photographer", searchPhotographer);
    if (searchEntity) query.set("relatedEntity", searchEntity);

    const response = await fetch(`/api/basecamp/media?${query.toString()}`);
    const payload = (await response.json()) as { assets?: MediaAsset[]; error?: string };
    if (!response.ok) {
      pushToast({ tone: "error", title: "Unable to load media", description: payload.error ?? "Try again." });
      return;
    }
    setAssets(payload.assets ?? []);
  };

  const submitUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!uploadForm.file) {
      pushToast({ tone: "warning", title: "File required", description: "Select a file to upload." });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", uploadForm.title);
    formData.append("publication", uploadForm.publication);
    formData.append("folder", uploadForm.folder);
    formData.append("altText", uploadForm.altText);
    formData.append("caption", uploadForm.caption);
    formData.append("photographer", uploadForm.photographer);
    formData.append("capturedAt", uploadForm.capturedAt);
    formData.append("gps", uploadForm.gps);
    formData.append("relatedEntityType", uploadForm.relatedEntityType);
    formData.append("relatedEntity", uploadForm.relatedEntity);
    formData.append("issue", uploadForm.issue);
    formData.append("tags", uploadForm.tags);
    formData.append("keywords", uploadForm.keywords);
    formData.append("aiDescription", uploadForm.aiDescription);
    formData.append("file", uploadForm.file);

    const response = await fetch("/api/basecamp/media", {
      method: "POST",
      body: formData,
    });
    const payload = (await response.json()) as { asset?: MediaAsset; error?: string };
    if (!response.ok || !payload.asset) {
      pushToast({ tone: "error", title: "Upload failed", description: payload.error ?? "Unable to upload media asset." });
      setUploading(false);
      return;
    }

    setAssets((current) => [payload.asset!, ...current]);
    setUploadForm({
      title: "",
      publication: "MadeInVT",
      folder: "Gallery",
      altText: "",
      caption: "",
      photographer: "",
      capturedAt: "",
      gps: "",
      relatedEntityType: "Maker",
      relatedEntity: "",
      issue: "",
      tags: "",
      keywords: "",
      aiDescription: "",
      file: null,
    });
    pushToast({ tone: "success", title: "Upload saved", description: "Asset added as draft for editorial review." });
    setUploading(false);
  };

  const applyQuickAction = async (asset: MediaAsset, action: (typeof quickActions)[number]) => {
    const targetType = action === "Attach to Place" ? "Place" : action === "Attach to Story" ? "Story" : action === "Use in Collection" ? "Collection" : action === "Attach to Maker" ? "Maker" : action === "Use as Hero" ? "Issue" : "Export";
    const targetValue = action === "Export" ? "Export Queue" : asset.relatedEntity;
    const response = await fetch(`/api/basecamp/media/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        relationType: action,
        targetType,
        targetValue,
        publication: asset.publication,
      }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      pushToast({ tone: "error", title: "Quick action failed", description: payload.error ?? "Unable to apply action." });
      return;
    }
    pushToast({ tone: "success", title: "Quick action applied", description: `${action} added for ${asset.title}.` });
  };

  const setStatus = async (asset: MediaAsset, status: "draft" | "approved" | "archived") => {
    const response = await fetch(`/api/basecamp/media/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const payload = (await response.json()) as { asset?: MediaAsset; error?: string };
    if (!response.ok || !payload.asset) {
      pushToast({ tone: "error", title: "Status update failed", description: payload.error ?? "Unable to update status." });
      return;
    }
    setAssets((current) => current.map((entry) => (entry.id === asset.id ? payload.asset! : entry)));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(31,77,58,0.08),transparent_28%),linear-gradient(135deg,#f8f5ee_0%,#fcfaf6_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[32px] border border-[#e8dfc8] bg-white p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1f3b2f]">Basecamp</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">Compass Media Library</h1>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
            Central DAM for SouthernVT, MadeInVT, Modern Relic, and future publications. Upload assets, maintain metadata, and attach relationships from one workspace.
          </p>
        </header>

        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Sections</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sections.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSection(item)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                  section === item ? "border-[#1f3b2f] bg-[#1f3b2f] text-[#f8f2e4]" : "border-[#d7cbb3] bg-white text-slate-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Search</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by Maker, Place, Tag..." />
            <Input value={searchPublication} onChange={(event) => setSearchPublication(event.target.value)} placeholder="Publication" />
            <Input value={searchTag} onChange={(event) => setSearchTag(event.target.value)} placeholder="Tag" />
            <Input value={searchIssue} onChange={(event) => setSearchIssue(event.target.value)} placeholder="Issue" />
            <Input value={searchDate} onChange={(event) => setSearchDate(event.target.value)} type="date" />
            <Input value={searchPhotographer} onChange={(event) => setSearchPhotographer(event.target.value)} placeholder="Photographer" />
            <Input value={searchEntity} onChange={(event) => setSearchEntity(event.target.value)} placeholder="Maker / Place" />
            <Button type="button" variant="secondary" onClick={() => void refreshAssets()}>
              Refresh
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Upload</p>
          <form onSubmit={submitUpload} className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input value={uploadForm.title} onChange={(event) => setUploadForm((current) => ({ ...current, title: event.target.value }))} placeholder="Asset title" required />
            <select value={uploadForm.publication} onChange={(event) => setUploadForm((current) => ({ ...current, publication: event.target.value as CompassPublication }))} className="h-11 rounded-2xl border border-[#d7cbb3] bg-white px-3 text-sm text-slate-800">
              {publications.map((publication) => (
                <option key={publication} value={publication}>
                  {publication}
                </option>
              ))}
            </select>
            <select value={uploadForm.folder} onChange={(event) => setUploadForm((current) => ({ ...current, folder: event.target.value as MediaFolder }))} className="h-11 rounded-2xl border border-[#d7cbb3] bg-white px-3 text-sm text-slate-800">
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
            <Input type="file" accept=".jpg,.jpeg,.png,.webp,.heic,.mp4,.mov,.pdf,image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime,application/pdf" onChange={(event) => setUploadForm((current) => ({ ...current, file: event.target.files?.[0] ?? null }))} required />
            <Input value={uploadForm.altText} onChange={(event) => setUploadForm((current) => ({ ...current, altText: event.target.value }))} placeholder="Alt text" required />
            <Input value={uploadForm.caption} onChange={(event) => setUploadForm((current) => ({ ...current, caption: event.target.value }))} placeholder="Caption" />
            <Input value={uploadForm.photographer} onChange={(event) => setUploadForm((current) => ({ ...current, photographer: event.target.value }))} placeholder="Photographer" />
            <Input type="date" value={uploadForm.capturedAt} onChange={(event) => setUploadForm((current) => ({ ...current, capturedAt: event.target.value }))} />
            <Input value={uploadForm.gps} onChange={(event) => setUploadForm((current) => ({ ...current, gps: event.target.value }))} placeholder="GPS" />
            <select value={uploadForm.relatedEntityType} onChange={(event) => setUploadForm((current) => ({ ...current, relatedEntityType: event.target.value as RelatedEntityType }))} className="h-11 rounded-2xl border border-[#d7cbb3] bg-white px-3 text-sm text-slate-800">
              {relatedEntityTypes.map((entityType) => (
                <option key={entityType} value={entityType}>
                  {entityType}
                </option>
              ))}
            </select>
            <Input value={uploadForm.relatedEntity} onChange={(event) => setUploadForm((current) => ({ ...current, relatedEntity: event.target.value }))} placeholder="Related Entity (Maker/Place...)" required />
            <Input value={uploadForm.issue} onChange={(event) => setUploadForm((current) => ({ ...current, issue: event.target.value }))} placeholder="Issue" required />
            <Input value={uploadForm.tags} onChange={(event) => setUploadForm((current) => ({ ...current, tags: event.target.value }))} placeholder="Tags (comma separated)" />
            <Input value={uploadForm.keywords} onChange={(event) => setUploadForm((current) => ({ ...current, keywords: event.target.value }))} placeholder="Keywords (comma separated)" />
            <Input value={uploadForm.aiDescription} onChange={(event) => setUploadForm((current) => ({ ...current, aiDescription: event.target.value }))} placeholder="Future AI description" />
            <Button type="submit" disabled={uploading} className="md:col-span-2 xl:col-span-1">
              {uploading ? "Uploading..." : "Upload Asset"}
            </Button>
          </form>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssets.map((asset) => (
            <article key={asset.id} className="rounded-3xl border border-[#e8dfc8] bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{asset.title}</p>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusPill(asset.status)}`}>
                  {asset.status}
                </span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                {asset.publication} · {asset.section} · {asset.folder}
              </p>
              <p className="mt-2 text-sm text-slate-700">{asset.caption || asset.altText}</p>
              <p className="mt-1 text-xs text-slate-500">
                Related: {asset.relatedEntityType} · {asset.relatedEntity}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Photographer: {asset.photographer || "Unknown"} · Date: {asset.capturedAt}
              </p>
              <p className="mt-1 text-xs text-slate-500">Issue: {asset.issue}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {asset.tags.map((tag) => (
                  <span key={`${asset.id}-${tag}`} className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => setSelectedId(asset.id)}>
                  Details
                </Button>
                <Button size="sm" variant="secondary" onClick={() => void setStatus(asset, "approved")}>
                  Approve
                </Button>
                <Button size="sm" variant="ghost" onClick={() => void setStatus(asset, "archived")}>
                  Archive
                </Button>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <button
                    key={`${asset.id}-${action}`}
                    type="button"
                    onClick={() => void applyQuickAction(asset, action)}
                    className="rounded-xl border border-[#d7cbb3] bg-[#fcfaf6] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>

        {selectedAsset ? (
          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Asset Details</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">{selectedAsset.title}</h2>
              </div>
              <Button variant="ghost" onClick={() => setSelectedId(null)}>
                Close
              </Button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3 text-sm">
              <p><span className="font-semibold">Publication:</span> {selectedAsset.publication}</p>
              <p><span className="font-semibold">Folder:</span> {selectedAsset.folder}</p>
              <p><span className="font-semibold">Section:</span> {selectedAsset.section}</p>
              <p><span className="font-semibold">Type:</span> {selectedAsset.type}</p>
              <p><span className="font-semibold">MIME:</span> {selectedAsset.mimeType}</p>
              <p><span className="font-semibold">File:</span> {selectedAsset.fileName}</p>
              <p><span className="font-semibold">Photographer:</span> {selectedAsset.photographer || "Unknown"}</p>
              <p><span className="font-semibold">GPS:</span> {selectedAsset.gps || "Not set"}</p>
              <p><span className="font-semibold">Issue:</span> {selectedAsset.issue}</p>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
