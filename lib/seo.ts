import type { Metadata } from "next";
import { links, treeNodes } from "@/lib/data";

export const SITE_NAME = "Aman Tyagi";
export const TITLE = "AI & Backend Engineer";

/* Per-page metadata. The canonical has to be set on every page: a canonical
   in the root layout would be inherited, and every page would claim to be
   the home page. Setting `openGraph` here replaces the layout's whole object,
   so the shared fields are repeated on purpose. */
export function pageMeta(
  path: string,
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} - ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      // replacing openGraph also drops the inherited file-based image
      images: "/opengraph-image",
    },
  };
}

/* schema.org Person, for search engines and AI answer engines */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: links.site,
  jobTitle: "Senior Software Engineer",
  description: `${TITLE} building production RAG, LLM agents and multi-tenant backends.`,
  worksFor: { "@type": "Organization", name: "Delightree" },
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  email: links.email,
  sameAs: [links.github, links.linkedin],
  knowsAbout: treeNodes.map((n) => n.label),
};

/** JSON for a <script> tag: `<` escaped so content can never close the tag */
export const jsonLd = (data: object) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
