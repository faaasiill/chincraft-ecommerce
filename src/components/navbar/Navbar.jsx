import { useState, useEffect } from "react";
import { Home, Package, MessageCircle, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"

const Navbar = ({ scrollToContact }) => {
  const { isAuthenticated, logout } = useAuth(); // Get authentication status and logout function
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showBackground, setShowBackground] = useState(false);

  // Centralized menu configuration
  const navigationItems = [
    { href: "/", text: "Home", icon: Home, component: Link },
    { href: "/products", text: "Products", icon: Package, component: Link },
    { href: "#contact", text: "Contact", icon: MessageCircle, component: "a" },
    {
      href: isAuthenticated ? "#" : "/login",
      text: isAuthenticated ? "Logout" : "Login",
      icon: isAuthenticated ? LogOut : LogIn,
      component: isAuthenticated ? "a" : Link,
      onClick: isAuthenticated ? logout : null, // Call logout if authenticated
    },
  ];

  // Handle scroll for navbar visibility and background
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
        setShowBackground(currentScrollY > 50);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
        setIsMenuOpen(false);
        setShowBackground(false);
      } else if (currentScrollY <= 50) {
        // At the top of the page
        setShowBackground(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-150 border-b border-[#DD6A99] transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${showBackground ? "bg-[#fcf5ea]" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Desktop Hamburger */}
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#DD6A99] hover:text-[#d9256e] transition-all duration-300"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute h-0.5 w-6 bg-current transform origin-center transition-all duration-300 ease-in-out ${
                    isMenuOpen
                      ? "rotate-45 translate-y-0 top-2.5"
                      : "rotate-0 translate-y-0 top-1"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-6 bg-current transform origin-center transition-all duration-300 ease-in-out top-2.5 ${
                    isMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-6 bg-current transform origin-center transition-all duration-300 ease-in-out ${
                    isMenuOpen
                      ? "-rotate-45 translate-y-0 top-2.5"
                      : "rotate-0 translate-y-0 top-4"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex-shrink-0 md:flex md:flex-1 md:justify-center">
            <div className="text-2xl font-bold transition-colors duration-200">
              <img src={'https://res.cloudinary.com/dgcy8wanx/image/upload/v1756040476/no3zy9ahdiqt5lsai2u6.svg'} alt="Logo" className="w-24 md:w-32 h-auto" />
            </div>
          </div>

          {/* Right: Mobile Hamburger */}
          <div className="flex items-center">
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#DD6A99] hover:text-[#d9256e] transition-all duration-300"
              >
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform origin-center transition-all duration-300 ease-in-out ${
                      isMenuOpen
                        ? "rotate-45 translate-y-0 top-2.5"
                        : "rotate-0 translate-y-0 top-1"
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform origin-center transition-all duration-300 ease-in-out top-2.5 ${
                      isMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-6 bg-current transform origin-center transition-all duration-300 ease-in-out ${
                      isMenuOpen
                        ? "-rotate-45 translate-y-0 top-2.5"
                        : "rotate-0 translate-y-0 top-4"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <div
          className={`hidden md:block fixed left-0 top-0 w-screen h-screen bg-white shadow-lg z-40 transition-all duration-500 ease-in-out ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <button
            onClick={toggleMenu}
            className="absolute top-4 left-4 p-2 text-[#DD6A99] hover:text-[#d9256e] transition-colors duration-300"
          >
            <div className="relative w-6 h-6">
              <span className="absolute h-0.5 w-6 bg-current transform rotate-45 top-2.5" />
              <span className="absolute h-0.5 w-6 bg-current transform -rotate-45 top-2.5" />
            </div>
          </button>
          <div
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full space-y-8 transition-all duration-700 ease-out ${
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {/* Desktop Navigation Items */}
            {navigationItems.map((item, index) => {
              const Component = item.component;
              const delay = `${200 + (index + 1) * 100}ms`;

              const handleClick = (e) => {
                if (item.text === "Contact") {
                  e.preventDefault();
                  scrollToContact();
                } else if (item.text === "Logout") {
                  e.preventDefault();
                  item.onClick(); // Call logout
                }
                closeMenu();
              };

              return (
                <Component
                  key={item.text}
                  to={item.component === Link ? item.href : undefined}
                  href={item.component === "a" ? item.href : undefined}
                  className={`block px-6 py-3 text-2xl text-[#DD6A99] hover:text-[#d9256e] rounded-md transition-all duration-500 transform hover:scale-105 ${
                    isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-8 opacity-0"
                  }`}
                  style={{ transitionDelay: isMenuOpen ? delay : "0ms" }}
                  onClick={handleClick}
                >
                  {item.text}
                </Component>
              );
            })}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className={`px-2 pt-2 pb-3 mb-2 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2 transform transition-all duration-500 ease-out ${
              isMenuOpen ? "translate-y-0 scale-100" : "-translate-y-4 scale-95"
            }`}
          >
            {/* Mobile Navigation Links */}
            {navigationItems.map((item, index) => {
              const Component = item.component;
              const delay = `${200 + (index + 1) * 100}ms`;

              const handleClick = (e) => {
                if (item.text === "Contact") {
                  e.preventDefault();
                  scrollToContact();
                } else if (item.text === "Logout") {
                  e.preventDefault();
                  item.onClick(); // Call logout
                }
                closeMenu();
              };

              return (
                <Component
                  key={item.text}
                  to={item.component === Link ? item.href : undefined}
                  href={item.component === "a" ? item.href : undefined}
                  className={`flex items-center px-3 py-3 text-[#DD6A99] hover:text-[#d9256e] hover:bg-white rounded-md transition-all duration-300 transform hover:translate-x-2 hover:shadow-md ${
                    isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: isMenuOpen ? delay : "0ms" }}
                  onClick={handleClick}
                >
                  <item.icon className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-12" />
                  {item.text}
                </Component>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;