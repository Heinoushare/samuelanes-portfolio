import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import { site } from "./site";

/**
 * Builds a page's metadata, including the Open Graph block.
 *
 * Without this, a page that sets only a title and description inherits the
 * root layout's openGraph wholesale, so every shared link previews as the
 * home page. Twitter tags are left to Next, which derives them from
 * openGraph when no twitter block is set.
 */
export function pageMetadata({
  title,
  description,
  image,
  path,
  type = "article",
}: {
  title: string;
  description: string;
  image: StaticImageData;
  path: string;
  type?: "article" | "website";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: `${site.url}${path}`,
      siteName: site.name,
      images: [{ url: image.src, width: image.width, height: image.height }],
      type,
    },
  };
}
