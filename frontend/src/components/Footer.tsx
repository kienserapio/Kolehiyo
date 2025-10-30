import { Facebook, Linkedin, Mail } from "lucide-react";
import logo from '@/assets/White Logo.png';

const Footer = () => {
  return (
    <footer className="text-white py-16" style={{ background: 'linear-gradient(180deg, #1D5D95 0%, #004689 100%)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8">
          {/* Logo */}
          <img
            src={logo}
            alt="Kolehiyo White Logo"
            className="mx-auto w-[250px] h-auto"
          />
          
          {/* Email */}
          <div className="flex items-center justify-center gap-3">
            <Mail className="text-[#FBB507]" size={24} />
            <a href="mailto:marketing@kolehiyo.ph" className="text-lg font-medium hover:text-blue-200 transition-colors">
              marketing@kolehiyo.ph
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-6">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-white rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Facebook className="text-[#1D5D95]" size={24} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-white rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Linkedin className="text-[#1D5D95]" size={24} />
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/20">
            <p className="text-white/90 font-medium">
              © 2025 Kolehiyo — Empowering Every Filipino Student's Future.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
