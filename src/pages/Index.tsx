import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { NewsSection } from "@/components/NewsSection";
import { CommunitySection } from "@/components/CommunitySection";
import { AICreativeSection } from "@/components/AICreativeSection";
import { MusicSection } from "@/components/MusicSection";
import { Footer } from "@/components/Footer";
import { FloatingParticles } from "@/components/FloatingParticles";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* CRT Scanlines overlay */}
      <div className="crt-overlay" />
      
      {/* Floating particles (Upside Down effect) */}
      <FloatingParticles count={25} />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main content */}
      <main>
        <HeroSection />
        <NewsSection />
        <CommunitySection />
        <AICreativeSection />
        <MusicSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
