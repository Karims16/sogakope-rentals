import type { MetadataRoute } from "next";
import { demoProperties } from "@/lib/demo-properties";

const siteUrl = "https://sogakope-rentals.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = [
    { route: "/", changeFrequency: "daily", priority: 1 },
    { route: "/browse", changeFrequency: "daily", priority: 0.8 },
    { route: "/about", changeFrequency: "monthly", priority: 0.6 },
    { route: "/privacy", changeFrequency: "monthly", priority: 0.4 },
    { route: "/terms", changeFrequency: "monthly", priority: 0.4 },
    { route: "/contact", changeFrequency: "monthly", priority: 0.6 },
    { route: "/submit", changeFrequency: "monthly", priority: 0.6 },
  ] as const;
  const staticRouteEntries = staticRoutes.map(({ route, changeFrequency, priority }) => ({
    url: new URL(route, `${siteUrl}/`).toString(),
    lastModified,
    changeFrequency,
    priority,
  }));

  const propertyRoutes = demoProperties.map((property) => ({
    url: new URL(`/properties/${property.id}`, siteUrl).toString(),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticRouteEntries, ...propertyRoutes];
}
