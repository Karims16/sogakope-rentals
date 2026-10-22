import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/auth/",
        "/dashboard/",
        "/update-password",
      ],
    },
    sitemap: "https://sogakope-rentals.vercel.app/sitemap.xml",
  };
}
