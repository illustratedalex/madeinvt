import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsEventBindings } from "@/components/analytics/AnalyticsEventBindings";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { BetaBanner } from "@/components/public/BetaBanner";
import { CommandPalette } from "@/components/search/CommandPalette";
import { RelationshipStoreProvider } from "@/components/relationships/RelationshipStoreProvider";
import { SearchProvider } from "@/components/search/SearchProvider";
import { ErrorBoundary, ToastProvider } from "@/components/ui";
import { RepositoryProvider } from "@/lib/repositories/RepositoryProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MadeInVT | Makers, Artisans & Handcrafted Vermont",
  description: "Explore handcrafted goods, artisan workshops, local creators, and the stories behind Vermont craftsmanship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-(--color-cream) text-(--color-slate)">
        <ErrorBoundary>
          <RepositoryProvider mode="auto">
            <ToastProvider>
              <SearchProvider>
                <RelationshipStoreProvider>
                  <CommandPalette />
                  <BetaBanner />
                  {children}
                </RelationshipStoreProvider>
              </SearchProvider>
            </ToastProvider>
          </RepositoryProvider>
        </ErrorBoundary>
        <AnalyticsEventBindings />
        <GoogleAnalytics />
        <MicrosoftClarity />
        <Analytics />
      </body>
    </html>
  );
}
