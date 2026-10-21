import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rental properties, apartments, and rooms in Sogakope, Ghana | Sogakope Rentals",
    template: "%s | Sogakope Rentals",
  },
  description:
    "Explore rental properties, apartments, and rooms in Sogakope, South Tongu, Ghana. Sogakope Rentals is a local-first marketplace for tenants, landlords, and agents.",
  applicationName: "Sogakope Rentals",
  openGraph: {
    title: "Rental properties, apartments, and rooms in Sogakope, Ghana",
    description:
      "Discover rental properties, apartments, and rooms in Sogakope and across South Tongu, Ghana.",
    locale: "en_GH",
    type: "website",
    siteName: "Sogakope Rentals",
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
      <body>{children}</body>
    </html>
  );
}
