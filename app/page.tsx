import { PageShell } from "@/components/Page";
import {
  Band,
  Experience,
  Hero,
  Incidents,
  Numbers,
  SelectedWork,
  Stack,
} from "@/components/Sections";
import { jsonLd, personJsonLd } from "@/lib/seo";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(personJsonLd) }}
      />
      <Hero />
      <Numbers />
      <Band />
      <SelectedWork />
      <Experience />
      <Stack />
      <Incidents />
    </PageShell>
  );
}
