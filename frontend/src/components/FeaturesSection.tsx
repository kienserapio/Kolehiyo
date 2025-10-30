import { UserCheck, BookOpen, Bell } from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Personalized Dashboard",
    description: "See all your applications in one place.",
  },
  {
    icon: BookOpen,
    title: "Integrated Review Resources",
    description: "Study guides and mock exams linked to each school.",
  },
  {
    icon: Bell,
    title: "Smart Deadline Alerts",
    description: "Never miss an application again.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#1D5D95' }}>
            All-in-One College Companion
          </h2>
          <p className="text-base md:text-xl lg:text-[24px] text-foreground/70 mb-12 font-medium">
            The unique core features that makes Kolehiyo special.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center"
              >
                <div className="flex justify-center mb-6">
                  <Icon className="text-[#FBB507]" size={80} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#012243' }}>
                  {feature.title}
                </h3>
                <p className="text-foreground/70 font-medium">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
