import { docs } from "@/lib/docs";
import type { MetadataRoute } from "next";

const SITE_URL = "https://wristkit-web.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const docRoutes = docs.map((doc) => ({
    url: `${SITE_URL}/${doc.slug}`,
    lastModified: new Date(),
  }));

  return [{ url: SITE_URL, lastModified: new Date() }, ...docRoutes];
}
