import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/projects",
    "/projects/fsae",
    "/projects/fsae/regen-design",
    "/projects/fsae/vehicle-dynamics",
    "/projects/fsae/delaunay",
    "/projects/ftc",
    "/projects/ftc/command-framework",
    "/projects/ftc/localization",
    "/projects/ftc/vision",
    "/projects/ftc/turret",
    "/projects/sabacc",
    "/projects/embedded",
    "/projects/embedded/sailboat",
    "/projects/embedded/speedcubing-timer",
  ];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));
}
