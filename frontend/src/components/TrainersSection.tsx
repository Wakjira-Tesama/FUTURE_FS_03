import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const trainers = [
  {
    name: "Alex Stone",
    specialty: "Strength & Conditioning",
    initials: "AS",
  },
  {
    name: "Maya Rivera",
    specialty: "Mobility & Yoga",
    initials: "MR",
  },
  {
    name: "Jordan Lee",
    specialty: "HIIT & Fat Loss",
    initials: "JL",
  },
];

const TrainersSection = () => (
  <section id="trainers" className="py-24 relative">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest">
          Trainers
        </span>
        <h2 className="text-4xl md:text-5xl font-black mt-3">
          Meet Your <span className="gradient-text">Coaches</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto">
          Expert guidance to keep you consistent, safe, and progressing.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {trainers.map((t) => (
          <div
            key={t.name}
            className="glass-card p-8 flex flex-col gap-4 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="font-bold">
                  {t.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">
                  {t.specialty}
                </div>
              </div>
            </div>

            <Button
              variant="heroOutline"
              className="w-full mt-2"
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Plans
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrainersSection;
