import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sogakope Rentals | Find Affordable Rooms & Apartments",
    template: "%s | Sogakope Rentals",
  },
  description: "Browse verified student hostels, single rooms, and apartments in Sogakope.",
  applicationName: "Sogakope Rentals",
  openGraph: {
    title: "Sogakope Rentals | Find Affordable Rooms & Apartments",
    description:
      "Browse verified student hostels, single rooms, and apartments in Sogakope.",
    locale: "en_GH",
    type: "website",
    siteName: "Sogakope Rentals",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
