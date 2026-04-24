import React from "react";
import "../css/LandingPage.css";
import { motion } from "framer-motion";
import { FaTrophy, FaUsers, FaShieldAlt, FaHeart } from "react-icons/fa";
import storeImg from "../assets/store.jpg"
function About() {
  const features = [
    { icon: FaTrophy, title: "Award Winning", desc: "Recognized for excellence in tattoo artistry" },
    { icon: FaUsers, title: "Expert Artists", desc: "Passionate professionals dedicated to your vision" },
    { icon: FaShieldAlt, title: "Sterile Studio", desc: "Highest safety and hygiene standards" },
    { icon: FaHeart, title: "Custom Designs", desc: "Unique artwork tailored just for you" }
  ];

  return (
    <section className="about" id="about">
      <div className="about-container">
        <motion.div 
          className="about-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="section-tag">About Us</span>
          <h2>Where Art Meets <span className="gradient-text">Skin</span></h2>
          <p className="section-subtitle">
            Pure Ink Co is more than just a tattoo studio — it's a creative sanctuary 
            where your ideas become permanent masterpieces.
          </p>
        </motion.div>

        <div className="about-grid">
          <motion.div 
            className="about-content"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p>
              Founded with a passion for artistic expression, Pure Ink Co has grown into 
              Pretoria's premier destination for custom tattoos. We specialize in fine line, 
              realism, and bespoke designs that tell your unique story.
            </p>
            <p>
              Our studio combines traditional craftsmanship with modern techniques, ensuring 
              every piece is not just a tattoo, but a work of art that you'll cherish forever.
            </p>
            <div className="about-features">
              {features.map((feature, index) => (
                <div key={index} className="feature">
                  <feature.icon className="feature-icon" />
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="about-image"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="image-placeholder">
              {/* Add your studio image here */}
   
              <img src={storeImg} alt="" />
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;