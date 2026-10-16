import { LenisProvider } from "@/lib/about-page/scroll";
import Navigation from "@/components/about-page/Navigation";
import Hero from "@/components/about-page/hero/Hero";
import About from "@/components/about-page/sections/About";
import Skills from "@/components/about-page/sections/Skills";
import Work from "@/components/about-page/sections/Work";
import Certifications from "@/components/about-page/sections/Certifications";
import Experience from "@/components/about-page/sections/Experience";
import Achievements from "@/components/about-page/sections/Achievements";
import Contact from "@/components/about-page/sections/Contact";
import RevealObserver from "@/components/about-page/ui/RevealObserver";

export default function AboutPage() {
  return (
    <>
      <LenisProvider />
      <RevealObserver />
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        <Achievements />
        <Contact />
      </main>
    </>
  );
}
