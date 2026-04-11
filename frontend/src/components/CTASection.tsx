import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const CTASection = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
    <div className="container mx-auto px-4 relative">
      <div className="glass-card p-12 md:p-16 text-center max-w-3xl mx-auto neon-glow-blue">
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          Ready to <span className="gradient-text">Transform</span>?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Join 10,000+ members who chose to invest in themselves. Your first week is on us.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="hero" size="lg" className="text-base px-10" onClick={() => { document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); toast.success("Choose a plan to start your free trial!"); }}>
            Start Free Trial <ArrowRight className="ml-2" size={18} />
          </Button>
          <Button variant="heroOutline" size="lg" className="text-base px-10" onClick={() => toast.info("Tour booking coming soon! Call us at +1 (555) 123-4567")}>
            Book a Tour
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
