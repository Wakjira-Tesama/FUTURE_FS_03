import { Dumbbell, Heart, Flame, Salad, Zap, Users } from "lucide-react";

const programs = [
  {
    icon: Dumbbell,
    title: "Strength Training",
    desc: "Build muscle and power with progressive overload programs.",
    color: "text-primary neon-text-blue",
  },
  {
    icon: Heart,
    title: "Cardio Programs",
    desc: "Boost endurance and torch calories with HIIT and steady-state cardio.",
    color: "text-accent neon-text-red",
  },
  {
    icon: Flame,
    title: "CrossFit",
    desc: "High-intensity functional movements for total body conditioning.",
    color: "text-primary neon-text-blue",
  },
  {
    icon: Salad,
    title: "Nutrition Plans",
    desc: "Custom meal plans designed by certified nutritionists.",
    color: "text-accent neon-text-red",
  },
  {
    icon: Zap,
    title: "Yoga & Flexibility",
    desc: "Improve mobility, balance, and mental clarity.",
    color: "text-primary neon-text-blue",
  },
  {
    icon: Users,
    title: "Group Classes",
    desc: "Energizing group workouts to keep you motivated.",
    color: "text-accent neon-text-red",
  },
];

const ProgramsSection = () => (
  <section id="programs" className="py-24 relative">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest">Our Programs</span>
        <h2 className="text-4xl md:text-5xl font-black mt-3">
          Train <span className="gradient-text">Smarter</span>, Not Harder
        </h2>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto">
          Discover programs designed for every fitness level and goal.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((p, i) => (
          <div
            key={p.title}
            className="glass-card p-6 group hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <p.icon className={`w-10 h-10 mb-4 ${p.color}`} />
            <h3 className="text-xl font-bold mb-2 text-foreground">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProgramsSection;
