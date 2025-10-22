import heroImage from "@/assets/UP.jpg";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Triangular Mask */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
        }}
      >
        <div className="absolute inset-0 bg-[#012243]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-[96px] font-bold text-white mb-6 leading-[1.1]">
            <span className="block">Welcome to the</span>
            <span className="block text-[#FBB507]">Kolehiyo Experience!</span>
          </h1>

          <p className="text-lg md:text-2xl text-white/95 mb-12 max-w-4xl mx-auto font-medium">
            Your one-stop platform designed to simplify, streamline, and
            personalize every step of your college and scholarship application
            journey.
          </p>

          {/* CTA Button with gradient and triangular bottom */}
          <div className="flex justify-center">
            <div className="relative inline-block">
              <button
                className="relative px-12 py-4 text-[20px] font-bold text-white overflow-hidden shadow-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(180deg, #2091F9 0%, #004689 100%)",
                  borderRadius: "35px",
                }}
              >
                Start Your College Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
