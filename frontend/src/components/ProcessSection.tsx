import laptop from '@/assets/Laptop.png';

const ProcessSection = () => {
  const steps = [
    { number: 1, text: "Create Your Account", color: "#FBB507" },
    { number: 2, text: "Find Opportunities", color: "#FBB507" },
    { number: 3, text: "Track Progress", color: "#FBB507" },
    { number: 4, text: "Review Smartly", color: "#FBB507" },
  ];

  return (
    <section id="process" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left side - Steps */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#1D5D95' }}>
              How Kolehiyo Works
            </h2>
          <p className="text-base md:text-xl lg:text-[24px] text-foreground/70 mb-12 font-medium">
            Kolehiyo guides you from start to finish — one step at a time.
          </p>


            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center gap-4">
                  <span 
                    className="text-3xl font-bold"
                    style={{ color: step.color }}
                  >
                    {step.number}.
                  </span>
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: step.color }}
                  >
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Laptop mockup */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl">
              <img 
                src={laptop} 
                alt="Kolehiyo Dashboard Preview" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
