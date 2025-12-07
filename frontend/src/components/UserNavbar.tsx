import { useState } from "react";
import { Menu, X, CircleUserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import WhiteLogo from "@/assets/White Logo.png";
import BlueLogo from "@/assets/Kolehiyo Logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isBoardPage = location.pathname === "/board";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const linkColor = isBoardPage ? "text-[#1D5D95]" : "text-white";
  const hoverColor = "hover:text-[#FBB507]";

  return (
    <nav
      className={`${
        isBoardPage ? "bg-white" : "bg-transparent"
      } absolute top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <div className="container mx-auto px-6 py-10 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={isBoardPage ? BlueLogo : WhiteLogo}
            alt="Kolehiyo Logo"
            className="w-[150px] h-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/college"
            className={`${linkColor} ${hoverColor} transition-colors font-medium`}
          >
            Colleges
          </Link>

          <Link
            to="/scholarship"
            className={`${linkColor} ${hoverColor} transition-colors font-medium`}
          >
            Scholarships
          </Link>

          <Link
            to="/board"
            className={`${linkColor} ${hoverColor} transition-colors font-medium`}
          >
            <CircleUserRound size={24} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className={`md:hidden p-2 ${linkColor} ${hoverColor} transition-colors`}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          className={`md:hidden ${
            isBoardPage ? "bg-white/95 border-t border-gray-200" : "bg-[#012243]/90 border-t border-white/20"
          } py-4`}
        >
          <div className="flex flex-col space-y-4 px-4">
            <Link
              to="/college"
              className={`${linkColor} ${hoverColor} transition-colors font-medium`}
            >
              Colleges
            </Link>

            <Link
              to="/scholarship"
              className={`${linkColor} ${hoverColor} transition-colors font-medium`}
            >
              Scholarships
            </Link>

            <Link
              to="/board"
              className={`${linkColor} ${hoverColor} transition-colors font-medium`}
            >
              <CircleUserRound size={24} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
