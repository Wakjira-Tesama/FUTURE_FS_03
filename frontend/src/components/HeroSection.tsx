import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImg from "@/assets/hero-gym.jpg";

const phrases = [
  "Transform Your Body",
  "Unlock Your Potential",
  "Crush Your Limits",
  "Build Your Legacy",
];

const HeroSection = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting && displayed === current) {
      setTimeout(() => setIsDeleting(true), 2000);
      return;
    }
    if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayed(
        isDeleting
          ? current.slice(0, displayed.length - 1)
          : current.slice(0, displayed.length + 1),
      );
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, phraseIndex]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Modern gym interior with neon lighting"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 pt-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold text-accent uppercase tracking-widest">
              Limited Offer — 30% Off First Month
            </span>
          </div>

          {/* Typing headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6">
            <span className="gradient-text min-h-[1.2em] inline-block">
              {displayed}
              <span className="animate-pulse text-primary">|</span>
            </span>
            <br />
            <span className="text-foreground">Start Today.</span>
          </h1>

          <p
            className="text-lg text-muted-foreground max-w-lg mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Join the smartest fitness platform. AI-powered training, expert
            coaches, and a community that pushes you beyond your limits.
          </p>

          <div
            className="flex flex-wrap gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              variant="hero"
              size="lg"
              className="text-base px-8"
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Start Your Transformation{" "}
              <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button
              variant="heroOutline"
              size="lg"
              className="text-base px-8"
              onClick={() =>
                document
                  .getElementById("testimonials")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Play className="mr-2" size={18} /> Watch Tour
            </Button>
          </div>

          {/* Stats */}
          <div
            className="flex gap-10 mt-12 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            {[
              { value: "10K+", label: "Active Members" },
              { value: "50+", label: "Expert Trainers" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black gradient-text">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
