import { afterEach, describe, expect, it, vi } from "vitest";
import { absoluteUrl, createPageMetadata, getSiteUrl } from "@/lib/seo";

afterEach(() => vi.unstubAllEnvs());

describe("production canonical host", () => {
  it.each([undefined, "https://madeinvt.com", "https://madeinvt.com/", "http://www.madeinvt.com/", "https://www.madeinvt.com/", "invalid-url"])("normalizes %s to the live HTTPS www host", (configured) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", configured);
    expect(getSiteUrl()).toBe("https://www.madeinvt.com");
    expect(absoluteUrl("/collections")).toBe("https://www.madeinvt.com/collections");
    const metadata = createPageMetadata({ title: "Collections", description: "Explore Vermont craft", path: "/collections" });
    expect(metadata.alternates?.canonical).toBe("https://www.madeinvt.com/collections");
    expect(metadata.openGraph).toMatchObject({ url: "https://www.madeinvt.com/collections" });
  });

  it("preserves custom preview configuration and external URLs", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.org/");
    expect(absoluteUrl("guides")).toBe("https://preview.example.org/guides");
    expect(absoluteUrl("https://external.example.org/photo.jpg")).toBe("https://external.example.org/photo.jpg");
  });
});
