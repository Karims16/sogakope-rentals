import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import FloatingSupportButton from "@/components/floating-support-button";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sogakope-rentals.vercel.app"),
  title: "Sogakope Rentals | Rent Rooms & Apartments Direct from Landlords",
  description:
    "Find verified rooms, apartments, and houses for rent in Sogakope. Browse photos, pricing, and available units with direct landlord contact.",
  applicationName: "Sogakope Rentals",
  icons: {
    icon: "/logo-round.png",
    apple: "/logo-round.png",
  },
  verification: {
    google: "eTmYsegr_xLuRYOgRx27wk4Tc5l5dk3IZi8HojQbXmw",
  },
  openGraph: {
    title: "Sogakope Rentals | Rent Rooms & Apartments Direct from Landlords",
    description:
      "Find verified rooms, apartments, and houses for rent in Sogakope. Browse photos, pricing, and available units.",
    url: "https://sogakope-rentals.vercel.app",
    locale: "en_GH",
    type: "website",
    siteName: "Sogakope Rentals",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sogakope Rentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sogakope Rentals | Rooms & Apartments Direct from Landlords",
    description:
      "Browse verified rentals in Sogakope with transparent unit availability.",
    images: ["/og-image.png"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Sogakope Rentals",
              alternateName: ["SogakopeRentals", "Sogakope Rentals Ghana"],
              url: "https://sogakope-rentals.vercel.app",
            }),
          }}
        />
        {children}
        <FloatingSupportButton />
        <Analytics />
      </body>
    </html>
  );
}
