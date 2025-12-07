const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative h-[350px] flex items-center justify-center mt-15"
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-[#1D5D95] mb-3 leading-[1.1]">
            <span className="block">My Board & Progress Tracker</span>
          </h1>

          <p className="text-[18px] md:text-[20px] text-[#1D5D95]/95 mb-8 max-w-4xl mx-auto font-medium">
            Track your desired college and scholarship applications by checking progress.
          </p>

          <hr className="border-t border-gray-300 w-full mx-auto px-8" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
