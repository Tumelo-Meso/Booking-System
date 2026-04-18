import React, { useState } from "react";
import "../css/LandingPage.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaintBrush, FaPenFancy, FaRegEye, FaDragon, FaHeartbeat, FaStar, FaClock, FaShieldAlt, FaAward } from "react-icons/fa";

function Services() {
  const [expandedCard, setExpandedCard] = useState(null);

  const services = [
    { 
      icon: FaPaintBrush, 
      title: "Custom Tattoos", 
      desc: "Unique designs created specifically for each client", 
      price: "From R1,500",
      duration: "2-4 hours",
      features: ["Personalized design", "Multiple revisions", "Aftercare kit included"],
      color: "#FFD700" 
    },
    { 
      icon: FaPenFancy, 
      title: "Fine Line", 
      desc: "Clean, delicate and detailed minimal tattoos", 
      price: "From R1,200",
      duration: "1-3 hours",
      features: ["Single needle technique", "Delicate linework", "Minimalist style"],
      color: "#FFD700" 
    },
    { 
      icon: FaRegEye, 
      title: "Realism", 
      desc: "Highly detailed realistic portrait and object work", 
      price: "From R2,500",
      duration: "3-6 hours",
      features: ["Photorealistic detail", "Portrait specialists", "Black & grey or color"],
      color: "#FFD700" 
    },
    { 
      icon: FaDragon, 
      title: "Sleeves", 
      desc: "Half and full sleeve custom tattoo designs", 
      price: "From R5,000",
      duration: "Multiple sessions",
      features: ["Cohesive design", "Payment plans available", "Custom artwork"],
      color: "#FFD700" 
    },
    { 
      icon: FaHeartbeat, 
      title: "Cover-ups", 
      desc: "Transform old tattoos into new masterpieces", 
      price: "From R2,000",
      duration: "2-5 hours",
      features: ["Free consultation", "Creative solutions", "Quality guaranteed"],
      color: "#FFD700" 
    },
    { 
      icon: FaStar, 
      title: "Watercolor", 
      desc: "Vibrant artistic watercolor effects", 
      price: "From R1,800",
      duration: "2-4 hours",
      features: ["Artistic blending", "Vibrant colors", "Unique effects"],
      color: "#FFD700" 
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="services" id="services">
      <div className="services-container">
        <motion.div 
          className="services-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="section-tag">What We Offer</span>
          <h2>Premium <span className="gradient-text">Tattoo Services</span></h2>
          <p className="section-subtitle">
            From consultation to aftercare, we provide a complete premium experience
          </p>
        </motion.div>

        <motion.div 
          className="service-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              className={`service-card ${expandedCard === index ? 'expanded' : ''}`}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              onClick={() => setExpandedCard(expandedCard === index ? null : index)}
            >
              <div className="service-icon" style={{ background: `${service.color}20` }}>
                <service.icon style={{ color: service.color }} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              
              <div className="service-meta">
                <div className="service-price">{service.price}</div>
                <div className="service-duration">
                  <FaClock /> {service.duration}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedCard === index && (
                  <motion.div 
                    className="service-features"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4>What's Included:</h4>
                    <ul>
                      {service.features.map((feature, i) => (
                        <li key={i}>
                          <FaShieldAlt className="feature-check" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.button 
                className="service-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Add booking logic here
                  
                }}
              >
                {"Learn More →"}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="pricing-note">
          <FaAward className="note-icon" />
          <p>*Prices are estimates and may vary based on size, complexity, and number of sessions. Contact us for a detailed quote.</p>
        </div>
      </div>
    </section>
  );
}

export default Services;