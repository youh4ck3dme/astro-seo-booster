import { TrendingUp, Star, Calendar, Shield } from "lucide-react";

export function TrustBar() {
  const stats = [
    {
      icon: TrendingUp,
      value: "2500+",
      label: "Úspešných sťahovaní",
      testId: "stat-moves"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Hodnotenie Google",
      testId: "stat-rating"
    },
    {
      icon: Calendar,
      value: "15",
      label: "Rokov skúseností",
      testId: "stat-years"
    },
    {
      icon: Shield,
      value: "100%",
      label: "Poistenie zodpovednosti",
      testId: "stat-insurance"
    }
  ];

  return (
    <section className="py-8 md:py-12 bg-gradient-to-r from-primary via-accent to-primary">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center space-y-2"
              data-testid={stat.testId}
            >
              <div className="flex justify-center mb-3">
                <stat.icon className="h-8 w-8 text-white opacity-90" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-white/90 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
