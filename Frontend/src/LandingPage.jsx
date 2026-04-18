import React from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Services from "./components/Services.jsx";
import CTA from "./components/CTA.jsx";
import Footer from "./components/Footer.jsx";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <CTA />
      <Footer />
    </>
  );
}

export default LandingPage;