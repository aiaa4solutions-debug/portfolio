import { jsonLd, site } from "@/lib/seo";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Technologies } from "@/components/sections/technologies";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "@id": `${site.url}/#profile`,
            url: site.url,
            name: site.title,
            description: site.description,
            mainEntity: { "@id": `${site.url}/#person` },
          }),
        }}
      />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Technologies />
      <Contact />
    </>
  );
}
