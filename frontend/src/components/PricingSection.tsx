import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { membershipsApi } from "@/lib/api";
import {
  SubscribeDialog,
  type PricingPlan,
} from "@/components/SubscribeDialog";

type PlanWithUi = PricingPlan & { popular: boolean };

function formatMonthlyPrice(cents: number) {
  return Math.round(cents / 100);
}

const PricingSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["membership-plans"],
    queryFn: () => membershipsApi.listPlans(),
  });

  const plans = useMemo(() => {
    const raw = (data?.plans || []) as PricingPlan[];
    return raw.map(
      (p) =>
        ({
          ...p,
          popular: p.code === "PRO" || p.name.toLowerCase() === "pro",
        }) satisfies PlanWithUi,
    );
  }, [data]);

  const selectedPlan = useMemo(() => {
    if (!selectedPlanId) return null;
    return plans.find((p) => String(p._id) === String(selectedPlanId)) || null;
  }, [plans, selectedPlanId]);

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest">
            Pricing
          </span>
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
              <p className="text-sm text-muted-foreground mt-1">
                {plan.description}
              </p>

              <div className="mt-6 mb-6">
                <span className="text-5xl font-black gradient-text">
                  ${formatMonthlyPrice(plan.monthlyPriceCents)}
                </span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-secondary-foreground"
                  >
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "hero" : "heroOutline"}
                className="w-full"
                onClick={() => {
                  setSelectedPlanId(String(plan._id));
                  setDialogOpen(true);
                }}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <SubscribeDialog
          open={dialogOpen}
          onOpenChange={(o) => {
            setDialogOpen(o);
            if (!o) setSelectedPlanId(null);
          }}
          plan={selectedPlan}
        />
      </div>
    </section>
  );
};

export default PricingSection;
