import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProgramsSection from "@/components/ProgramsSection";
import TrainersSection from "@/components/TrainersSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <ProgramsSection />
    <TrainersSection />
    <PricingSection />
    <TestimonialsSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
