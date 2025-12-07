import heroImage from "@/assets/scholarship_image.jpg";

const HeroSection = () => {
  return (
    <section
    id="home"
    className="relative h-[500px] md:h-[500px] lg:h-[400px] flex items-center justify-center overflow-hidden"
    >
    {/* Background Image */}
    <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
        backgroundImage: `url(${heroImage})`,
        }}
    >
        <div className="absolute inset-0 bg-[#012243]/70" />
    </div>


      {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-white mb-3 leading-[1.1]">
            <span className="block">
                Become a <span className="text-[#FBB507]">Scholar</span> Today!
            </span>
            </h1>

            <p className="text-[18px] md:text-[20px] text-white/95 mb-10 max-w-4xl mx-auto font-medium">
            View any incoming or open scholarship application that fits your requirements.
            </p>

          {/* CTA Button with gradient and triangular bottom */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
