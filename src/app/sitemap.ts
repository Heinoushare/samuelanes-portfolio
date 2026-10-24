import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/projects/fsae",
    "/projects/fsae/regen-design",
    "/projects/fsae/vehicle-dynamics",
    "/projects/fsae/delaunay",
    "/projects/ftc",
    "/projects/sabacc",
    "/projects/embedded",
  ];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));
}
