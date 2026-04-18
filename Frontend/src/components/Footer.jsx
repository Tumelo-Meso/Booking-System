import React from "react";
import "../css/LandingPage.css";
import { FaInstagram, FaFacebook, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp } from "react-icons/fa";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const date = new Date();
  const year = date.getFullYear();

  // Google Maps embed URL for 1090 Burnett St, Hatfield, Pretoria
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.123456789012!2d28.235678!3d-25.745678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9561234567890b%3A0x1234567890abcdef!2s1090%20Burnett%20St%2C%20Hatfield%2C%20Pretoria%2C%200083%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus";

  // Alternative: Direct Google Maps directions link
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=1090+Burnett+St%2C+Hatfield%2C+Pretoria%2C+0083%2C+South+Africa";

  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-logo">INK BY NALA</h3>
            <p>Creating timeless masterpieces that tell your unique story through art and passion.</p>
            <div className="social-links">
              <a href="#" ><FaInstagram /></a>
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="/gallery">Gallery</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul className="contact-info">
              <li><FaMapMarkerAlt /> 1025 Richard St, Hatfield, Pretoria, 0883</li>
              <li><FaEnvelope /> hello@inkbytm.com</li>
              <li><FaPhone /> +27 15 654 8889</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Opening Hours</h4>
            <ul className="hours">
              <li>Mon - Fri: 10am - 8pm</li>
              <li>Saturday: 11am - 6pm</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="footer-map">
          <h4>Find Us Here</h4>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.2000000000007!2d28.235678!3d-25.745678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9561a2c2a2a2a1%3A0x2a2a2a2a2a2a2a2a!2s1090%20Burnett%20St%2C%20Hatfield%2C%20Pretoria%2C%200083!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ink By Nala Location - 1090 Burnett St, Hatfield, Pretoria"
            ></iframe>
          </div>
          <div className="map-links">
            <a 
              href={directionsUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="map-link"
            >
              <FaMapMarkerAlt /> Get Directions from Your Location
            </a>
            <a 
              href="https://www.google.com/maps/place/1090+Burnett+St,+Hatfield,+Pretoria,+0083/@-25.745678,28.235678,17z"
              target="_blank" 
              rel="noopener noreferrer"
              className="map-link"
            >
              <FaMapMarkerAlt /> Open in Google Maps
            </a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {year} Ink By TM Tattoos. All rights reserved.</p>
          <button className="scroll-top" onClick={scrollToTop}>
            <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;