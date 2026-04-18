import React from "react";
import "../css/LandingPage.css";
import { FaArrowRight, FaCalendarCheck, FaPalette } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero-image.jpg";

function Hero() {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate("/booking");
  };

  const handleExploreWork = () => {
    // Scroll to portfolio section or navigate to portfolio page
    navigate("/gallery")
  };

  return (
    <section className="hero" id="home">
      <div 
        className="hero-bg-image" 
        style={{ backgroundImage: `url(${heroImg})` }}
        aria-label="Hero background tattoo artwork"
        role="img"
      ></div>
      
      <div className="hero-overlay"></div>
      
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.span 
          className="hero-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FaPalette /> Premium Tattoo Studio
        </motion.span>
        
        <h1>Your Skin. <span className="gradient-text">Your Story.</span></h1>
        
        <p>
          Premium custom tattoos crafted with precision, creativity, and passion.
          Transform your ideas into timeless artwork.
        </p>
        
        <div className="hero-buttons">
          <motion.button 
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookAppointment}
          >
            Book Appointment <FaArrowRight className="icon" />
          </motion.button>
          
          <motion.button 
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExploreWork}
          >
            Explore Work
          </motion.button>
        </div>
        
      </motion.div>
    </section>
  );
}

export default Hero;