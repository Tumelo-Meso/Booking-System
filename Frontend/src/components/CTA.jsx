import React from "react";
import "../css/LandingPage.css";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaComments, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate("/booking");
  };

  const handleConsultation = () => {
    // Open WhatsApp or contact form
    window.open("https://wa.me/27120650511", "_blank");
  };

  return (
    <section className="cta">
      <div className="cta-container">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="cta-tagline">Start Your Journey</span>
          <h2>Ready To Get <span className="gradient-text">Inked?</span></h2>
          <p>Book a consultation and let's bring your vision to life</p>
          
          <div className="cta-buttons">
            <motion.button 
              className="btn-primary cta-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookAppointment}
            >
              <FaCalendarAlt /> Book Appointment <FaArrowRight />
            </motion.button>
        
          </div>
          
          <div className="cta-features">
            <div className="cta-feature">
              <FaCheckCircle className="check-icon" />
              <span>Free Design Consultation</span>
            </div>
            <div className="cta-feature">
              <FaCheckCircle className="check-icon" />
              <span>Premium Quality Inks</span>
            </div>
            <div className="cta-feature">
              <FaCheckCircle className="check-icon" />
              <span>Aftercare Kit Included</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;