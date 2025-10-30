import { useState } from "react";
import { Menu, X, CircleUserRound, Circle } from "lucide-react";
import { Link } from "react-router-dom";
import logo from '@/assets/White Logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Kolehiyo White Logo"
            className="w-[150px] h-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <span
            className="text-white hover:text-[#FBB507] transition-colors font-medium cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            Home
          </span>
          <span
            className="text-white hover:text-[#FBB507] transition-colors font-medium cursor-pointer"
            onClick={() => scrollToSection("features")}
          >
            Features
          </span>
          <span
            className="text-white hover:text-[#FBB507] transition-colors font-medium cursor-pointer"
            onClick={() => scrollToSection("process")}
          >
            Process
          </span>
          <span
            className="text-white hover:text-[#FBB507] transition-colors font-medium cursor-pointer"
            onClick={() => scrollToSection("reviews")}
          >
            Reviews
          </span>
          <span
            className="text-white hover:text-[#FBB507] transition-colors font-medium cursor-pointer"
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </span>

          {/* Log In */}
              <Link to="/auth/log_in" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
                <CircleUserRound size={24} />   
              </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-white hover:text-blue-200 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#012243]/90 py-4 border-t border-white/20">
          <div className="flex flex-col space-y-4 px-4">
            <a
              href="#home"
              className="text-white hover:text-[#FBB507] font-medium py-2"
              onClick={toggleMenu}
            >
              Home
            </a>
            <a
              href="#features"
              className="text-white hover:text-[#FBB507] font-medium py-2"
              onClick={toggleMenu}
            >
              Features
            </a>
            <a
              href="#process"
              className="text-white hover:text-[#FBB507] font-medium py-2"
              onClick={toggleMenu}
            >
              Process
            </a>
            <a
              href="#reviews"
              className="text-white hover:text-[#FBB507] font-medium py-2"
              onClick={toggleMenu}
            >
              Reviews
            </a>
            <a
              href="#contact"
              className="text-white hover:text-[#FBB507] font-medium py-2"
              onClick={toggleMenu}
            >
              Contact
            </a>

            <div className="flex gap-4 pt-2">
              <Link to="/auth/log_in" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
                <CircleUserRound size={24} />   
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
