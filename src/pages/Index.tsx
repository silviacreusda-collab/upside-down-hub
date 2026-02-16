import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { NewsSection } from "@/components/NewsSection";
import { EventsSection } from "@/components/EventsSection";
import { MerchSection } from "@/components/MerchSection";
import { CommunitySection } from "@/components/CommunitySection";
import { AICreativeSection } from "@/components/AICreativeSection";
import { AmbientMusicPlayer } from "@/components/AmbientMusicPlayer";
import { ContestsSection } from "@/components/ContestsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { FloatingParticles } from "@/components/FloatingParticles";
import { AIChatbot } from "@/components/AIChatbot";
import { AIRecommendations } from "@/components/AIRecommendations";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const Index = () => {
  useSmoothScroll();

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
        <EventsSection />
        <MerchSection />
        <CommunitySection />
        <AICreativeSection />
        <AIRecommendations />
        <AmbientMusicPlayer />
        <ContestsSection />
        <ContactSection />
      </main>
      
      {/* Footer */}
      <Footer />

      {/* Floating AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default Index;
