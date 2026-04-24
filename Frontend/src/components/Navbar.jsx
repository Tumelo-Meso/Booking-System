import React, { useState } from "react";
import "../css/LandingPage.css";
import { FaBars, FaTimes, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booking");
  };

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      <motion.h2 
        className="logo"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        Pure Ink Co.  
      </motion.h2>

      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        <a href="#" onClick={() => handleNavClick("home")}>Home</a>
        <a href="#about" onClick={() => handleNavClick("about")}>About</a>
        <a href="#services" onClick={() => handleNavClick("services")}>Services</a>
        <a href="/gallery" onClick={() => navigate("/gallery")}>Gallery</a> 
        <a href="#contact" onClick={() => handleNavClick("contact")}>Contact</a>
      </div>

      <motion.button 
        className="nav-btn"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBookNow}
      >
        <FaCalendarAlt /> Book Now
      </motion.button>

      <div className="mobile-menu" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
}

export default Navbar;