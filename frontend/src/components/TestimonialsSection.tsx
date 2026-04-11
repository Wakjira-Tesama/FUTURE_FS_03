import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Lost 30 lbs in 3 months",
    text: "ApexFit completely changed my life. The AI workout planner kept me on track and the trainers are world-class. Best investment I've ever made.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Competitive Bodybuilder",
    text: "The Pro plan gives me everything I need. 24/7 access, smart tracking, and the nutrition plans are spot-on for my competition prep.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Yoga Enthusiast",
    text: "I love the variety of classes and the flexibility of the booking system. The app makes it so easy to manage my schedule.",
    rating: 5,
  },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="py-24 relative">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest">Testimonials</span>
        <h2 className="text-4xl md:text-5xl font-black mt-3">
          Real <span className="gradient-text">Results</span>, Real People
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t) => (
          <div key={t.name} className="glass-card p-6 hover:border-primary/30 transition-all duration-300">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-secondary-foreground leading-relaxed mb-6">"{t.text}"</p>
            <div>
              <div className="font-semibold text-foreground">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
