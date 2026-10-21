import type { MetadataRoute } from "next";
import { demoProperties } from "@/lib/demo-properties";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/submit",
  ].map((route) => ({
    url: new URL(route, siteUrl).toString(),
    changeFrequency: route === "" ? "daily" as const : "monthly" as const,
    priority: route === "" ? 1 : 0.6,
  }));

  const propertyRoutes = demoProperties.map((property) => ({
    url: new URL(`/properties/${property.id}`, siteUrl).toString(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
