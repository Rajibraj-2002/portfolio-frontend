import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-scroll"; 
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa"; 
import "./Navbar.css"; 
import logo from "../assets/logo.png"; 

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const navRef = useRef(null);

  // 1. Auto-Hide Logic
  useEffect(() => {
    let hideTimer;
    const handleWindowMouseMove = (e) => {
      if (e.clientY <= 100) {
        setIsHidden(false); 
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => setIsHidden(true), 3000);
      }
    };
    window.addEventListener("mousemove", handleWindowMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      clearTimeout(hideTimer);
    };
  }, []);

  // 2. Spotlight Logic
  const handleSpotlightMove = (e) => {
    if (!navRef.current) return;
    const div = navRef.current;
    const rect = div.getBoundingClientRect();
    div.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    div.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <nav 
        ref={navRef}
        className={`nav-spotlight ${isHidden && !mobileMenuOpen ? "nav-hidden" : ""} ${mobileMenuOpen ? "mobile-open" : ""}`}
        onMouseMove={handleSpotlightMove}
    >
      <div className="nav-glow-layer"></div>

      {/* --- LOGO (Left) --- */}
      <div className="nav-logo-container" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <img src={logo} alt="Logo" className="nav-logo-img" />
      </div>
      
      {/* --- LINKS (Center on Desktop / Fullscreen on Mobile) --- */}
      <div className={`nav-links ${mobileMenuOpen ? "show-mobile" : ""}`}>
        {["home", "about", "education", "skills", "projects", "internships", "certificates", "contact"].map((item) => (
            <Link 
                key={item}
                to={item} 
                smooth={true} 
                duration={500} 
                spy={true} 
                activeClass="active" 
                className="nav-pill"
                onClick={() => setMobileMenuOpen(false)} 
            >
                {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
        ))}
      </div>

      {/* --- RIGHT ACTIONS (Theme Toggle + Mobile Menu) --- */}
      <div className="nav-actions">
          {/* Single Theme Toggle for both Desktop & Mobile */}
          <div className="nav-toggle" onClick={toggleTheme} title="Toggle Theme">
            {isDarkMode ? <FaSun color="#fbbf24" size={16} /> : <FaMoon color="#818cf8" size={16} />}
          </div>

          {/* Mobile Hamburger */}
          <div className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
      </div>

    </nav>
  );
};

export default Navbar;