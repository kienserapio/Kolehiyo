import { Facebook, Linkedin, Mail, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#1D5D95' }}>
            Contact Us From Kolehiyo
          </h2>
          <p className="text-base md:text-xl lg:text-[24px] text-foreground/70 mb-12 font-medium">
            It's free, easy, and made just for students like you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto items-start">
          {/* Left side - Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: '#012243' }}>
              Contact Us
            </h3>
            
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-6 py-4 rounded-full bg-gray-50 border-0 focus:ring-2 focus:ring-[#1D5D95] focus:outline-none font-medium"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-6 py-4 rounded-full bg-gray-50 border-0 focus:ring-2 focus:ring-[#1D5D95] focus:outline-none font-medium"
              />
              <textarea
                placeholder="Your Message"
                rows={6}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-0 focus:ring-2 focus:ring-[#1D5D95] focus:outline-none resize-none font-medium"
              />
              
              <button
                type="submit"
                className="px-12 py-3 rounded-full text-white font-medium text-lg hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(180deg, #1D5D95 0%, #004689 100%)' }}
              >
                Send
              </button>
            </form>
          </div>

          {/* Right side - Contact Info */}
          <div className="flex flex-col justify-center space-y-12">
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16">
                <Phone className="text-[#FBB507]" size={40} />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground/80">(+63) 000 0000 000</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16">
                <Mail className="text-[#FBB507]" size={40} />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground/80">marketing@kolehiyo.ph</p>
              </div>
            </div>

            <div className="flex gap-6 pt-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 rounded-lg transition-transform hover:scale-110"
                style={{ backgroundColor: '#1D5D95' }}
              >
                <Facebook className="text-white" size={28} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 rounded-lg transition-transform hover:scale-110"
                style={{ backgroundColor: '#1D5D95' }}
              >
                <Linkedin className="text-white" size={28} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
