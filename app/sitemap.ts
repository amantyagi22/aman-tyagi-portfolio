import type { MetadataRoute } from "next";
import { links } from "@/lib/data";
import { projects } from "@/lib/work";
import { posts } from "@/lib/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  // drafts never belong in a sitemap, even in a dev build
  const published = posts.filter((p) => !p.draft);
  const paths = [
    "",
    ...projects.map((p) => `/work/${p.slug}`),
    "/how-i-build",
    "/recruiters",
    "/resume",
    ...(published.length ? ["/writing"] : []),
    ...published.map((p) => `/writing/${p.slug}`),
  ];
  return paths.map((path) => ({ url: `${links.site}${path}` }));
}
