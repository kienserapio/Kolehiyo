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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent py-10">
      <div className="container mx-auto flex items-center justify-center">
        {/* Logo */}
            <div className="flex items-center">
            <img
                src={logo}
                alt="Kolehiyo White Logo"
                className="w-[100px] h-auto"
            />
            </div>
        </div>
    </nav>
  );
};

export default Navbar;
