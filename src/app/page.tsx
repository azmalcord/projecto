import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { OverviewSection } from "@/components/overview-section";
import { ScienceSection } from "@/components/science-section";
import { PlaylistSection } from "@/components/playlist-section";
import { LatestSection } from "@/components/latest-section";
import { CreatorSection } from "@/components/creator-section";
import { AboutSection } from "@/components/about-section";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <OverviewSection />
      <ScienceSection />
      <PlaylistSection />
      <LatestSection />
      <CreatorSection />
      <AboutSection />
      <Footer />
    </main>
  );
}