import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const plans = [
  {
    name: "Basic",
    price: 29,
    period: "/month",
    desc: "Perfect for getting started",
    features: [
      "Gym access (6AM–10PM)",
      "Basic equipment usage",
      "Locker room access",
      "1 group class/week",
      "Mobile app access",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: 59,
    period: "/month",
    desc: "Most popular for serious athletes",
    features: [
      "24/7 gym access",
      "All equipment & zones",
      "Unlimited group classes",
      "1 personal training/month",
      "AI workout planner",
      "Progress tracking",
      "Nutrition guidance",
    ],
    popular: true,
  },
  {
    name: "Elite",
    price: 99,
    period: "/month",
    desc: "The ultimate fitness experience",
    features: [
      "Everything in Pro",
      "4 personal trainings/month",
      "Custom meal plans",
      "Recovery & spa access",
      "Priority booking",
      "1-on-1 coaching",
      "Exclusive events",
      "Guest passes (2/month)",
    ],
    popular: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-24 relative">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold text-accent uppercase tracking-widest">Pricing</span>
        <h2 className="text-4xl md:text-5xl font-black mt-3">
          Choose Your <span className="gradient-text">Plan</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto">
          Flexible plans that scale with your fitness journey.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-card p-8 flex flex-col relative transition-all duration-300 hover:-translate-y-1 ${
              plan.popular ? "border-primary/50 neon-glow-blue" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-blue-red text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}

            <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>

            <div className="mt-6 mb-6">
              <span className="text-5xl font-black gradient-text">${plan.price}</span>
              <span className="text-muted-foreground text-sm">{plan.period}</span>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-secondary-foreground">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Button variant={plan.popular ? "hero" : "heroOutline"} className="w-full" onClick={() => toast.success(`Great choice! You selected the ${plan.name} plan ($${plan.price}/mo). Sign-up coming soon!`)}>
              Get Started
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
