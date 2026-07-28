import Navbar from "@/features/landing/components/Navbar";
import Hero from "@/features/landing/components/Hero";
import Features from "@/features/landing/components/Features";
import Stats from "@/features/landing/components/Stats";
import CTA from "@/features/landing/components/CTA";
import Footer from "@/features/landing/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <CTA />
      <Footer />
    </>
  );
}
