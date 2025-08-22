import { Instagram, Mail, Phone } from "lucide-react";

const Footer = ({ scrollToContact }) => {
  const handleClick = () => {
    scrollToContact();
    const contactBtn = document.getElementById("contact-link");
    contactBtn.classList.add("bounce-contact");
    setTimeout(() => {
      contactBtn.classList.remove("bounce-contact");
    }, 2000);
  };

  return (
    <footer
      className="rounded-t-4xl border-t-2 mt-30 relative  py-16 px-6 md:px-12 lg:px-20"
      style={{
        background: "linear-gradient(to top, #dd6a9a92 0%, #fff 40%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-2 tracking-tighter">
              Crafting Memories,
              <br />
              One Handmade Gift at a Time
            </h2>
            <button
              onClick={scrollToContact}
              className="mt-6 px-8 py-3 border-2 border-gray-800 rounded-full text-gray-800 font-medium hover:bg-gray-800 hover:text-white transition-colors duration-300"
            >
              Contact
            </button>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 tracking-tight hover:text-gray-800 transition-colors"
                >
                  Gift Hampers & Bouquets
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 tracking-tight hover:text-gray-800 transition-colors"
                >
                  Personalized Frames & Polaroids
                </a>
              </li>
            </ul>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 tracking-tight hover:text-gray-800 transition-colors"
                >
                  All Products
                </a>
              </li>
              <li>
                <button
                  onClick={handleClick}
                  id="contact-link"
                  className="text-gray-600 tracking-tight hover:text-gray-800 transition-colors flex items-center gap-2"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Say hello!
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/yourhandle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-500 transition-colors flex items-center gap-2"
                >
                  <Instagram size={16} /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@chincraft.com"
                  className="text-gray-600 hover:text-pink-500 transition-colors flex items-center gap-2"
                >
                  <Mail size={16} /> contact@chincraft.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+911234567890"
                  className="text-gray-600 hover:text-pink-500 transition-colors flex items-center gap-2"
                >
                  <Phone size={16} /> +91 123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-12">
          <h1 className="text-6xl md:text-8xl lg:text-9xl tracking-tighter font-bold text-gray-900 ">
            ChinCraft.
          </h1>
        </div>
      </div>
     <div className="flex justify-center text-center">
       <p className="absolute text-xs mb-3 tracking-tight font-thin text-gray-500  bottom-0">© 2025 ChinCraft. All rights reserved.</p>
     </div>
    </footer>

  );
};

export default Footer;
