import heroImage from "@/assets/UP.jpg";
import { Link } from "react-router-dom";
import logo from "@/assets/White Logo.png";

const Background = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
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
    </section>
  );
};

export default Background
