import React, { useState, useEffect } from "react";
import "./css/Gallery.css";
import { motion } from "framer-motion";
import { 
  FaSearch, 
  FaTimes, 
  FaHeart, 
  FaShare, 
  FaFilter,
  FaPaintBrush,
  FaPenFancy,
  FaRegEye,
  FaDragon,
  FaStar,
  FaArrowLeft
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";


import img1 from "./assets/back.jpg"
import img2 from "./assets/chest.jpg"
import img3 from "./assets/hand-2.jpg"
import img4 from "./assets/hand-3.jpg"
import img5 from "./assets/full-image.jpg"
import img6 from "./assets/neck.jpg"
import img7 from "./assets/hand.jpg"

function Gallery() {
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  
  // Real tattoo images from reliable sources
  useEffect(() => {
    // Simulate loading from API
    setTimeout(() => {
      const sampleGallery = [
        {
          id: 1,
          title: "Hand Written Back Tatto",
          category: "custom",
          image: img1,
          artist: "Nala",
          date: "2024-02-15",
          likes: 234,
          description: "Detailed geometric lion design with mandala background",
          tags: ["geometric", "lion", "sleeve", "mandala"]
        },
        {
          id: 2,
          title: "Fine Line Floral Wrist",
          category: "fineLine",
          image: img2,
          artist: "Nala",
          date: "2024-02-10",
          likes: 189,
          description: "Delicate fine line flowers with dotwork on wrist",
          tags: ["floral", "wrist", "delicate", "minimalist"]
        },
        {
          id: 3,
          title: "Realistic Wolf Portrait",
          category: "realism",
          image: img3,
          artist: "Nala",
          date: "2024-02-05",
          likes: 456,
          description: "Hyper-realistic wolf portrait with detailed fur texture",
          tags: ["wolf", "portrait", "realistic", "animal"]
        },
        {
          id: 4,
          title: "Japanese Hand Sleeve",
          category: "sleeve",
          image: img4,
          artist: "Nala",
          date: "2024-01-28",
          likes: 312,
          description: "Traditional Japanese dragon and koi fish full sleeve",
          tags: ["japanese", "dragon", "koi", "traditional"]
        },
        {
          id: 5,
          title: "Rose Cover-up Transformation",
          category: "coverup",
          image: img5,
          artist: "Nala",
          date: "2024-01-20",
          likes: 278,
          description: "Amazing cover-up transforming old tattoo into beautiful rose",
          tags: ["rose", "coverup", "transformation", "flower"]
        },
        {
          id: 6,
          title: "Watercolor Galaxy",
          category: "watercolor",
          image: img6,
          artist: "Nala",
          date: "2024-01-15",
          likes: 198,
          description: "Vibrant watercolor galaxy with nebula effects",
          tags: ["galaxy", "watercolor", "colorful", "space"]
        },
        {
          id: 7,
          title: "Mandala Back Piece",
          category: "custom",
          image: img7,
          artist: "Nala",
          date: "2024-01-10",
          likes: 345,
          description: "Intricate mandala design covering upper back",
          tags: ["mandala", "back", "intricate", "spiritual"]
        },
          
      ];
      
      setGalleryItems(sampleGallery);
      setFilteredItems(sampleGallery);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter gallery items
  useEffect(() => {
    let filtered = galleryItems;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredItems(filtered);
  }, [selectedCategory, searchTerm, galleryItems]);

  const categories = [
    { id: "all", name: "All Work", icon: FaPaintBrush, count: galleryItems.length },
    { id: "custom", name: "Custom", icon: FaPaintBrush, count: galleryItems.filter(i => i.category === "custom").length },
    { id: "fineLine", name: "Fine Line", icon: FaPenFancy, count: galleryItems.filter(i => i.category === "fineLine").length },
    { id: "realism", name: "Realism", icon: FaRegEye, count: galleryItems.filter(i => i.category === "realism").length },
    { id: "sleeve", name: "Sleeves", icon: FaDragon, count: galleryItems.filter(i => i.category === "sleeve").length },
    { id: "coverup", name: "Cover-ups", icon: FaPaintBrush, count: galleryItems.filter(i => i.category === "coverup").length },
    { id: "watercolor", name: "Watercolor", icon: FaStar, count: galleryItems.filter(i => i.category === "watercolor").length }
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <button className="back-to-home-gallery" onClick={() => navigate("/")}>
        <FaArrowLeft /> Back to Home
      </button>

      <section className="gallery-page">
        <div className="gallery-container">
          <motion.div 
            className="gallery-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Our <span className="gradient-text">Gallery</span></h1>
            <p>Explore our collection of custom tattoo masterpieces</p>
            <div className="gallery-stats">
              <span>{galleryItems.length}+ Amazing Tattoos</span>
              <span>15+ Years Combined Experience</span>
            </div>
          </motion.div>

          <div className="gallery-controls">
          

            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`filter-btn ${selectedCategory === category.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon />
                  <span>{category.name}</span>
                  <span className="category-count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="gallery-loader">
              <div className="spinner"></div>
              <p>Loading amazing artwork...</p>
            </div>
          ) : (
            <>
              <motion.div 
                className="gallery-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="gallery-item"
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    onClick={() => setSelectedImage(item)}
                  >
                    <div className="gallery-image">
                      <img src={item.image} alt={item.title} />
                      <div className="gallery-overlay">
                        <div className="overlay-content">
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                          <div className="overlay-stats">
                            <span><FaHeart /> {item.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="gallery-info">
                      <h4>{item.title}</h4>
                      <div className="gallery-meta">
                        <span className="category-tag">{item.category}</span>
                        <span className="likes"><FaHeart /> {item.likes}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {filteredItems.length === 0 && (
                <div className="no-results">
                  <FaPaintBrush />
                  <h3>No tattoos found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                  <button onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }} className="reset-filters">
                    Reset Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="gallery-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedImage(null)}>
              <FaTimes />
            </button>
            <img src={selectedImage.image} alt={selectedImage.title} />
            <div className="modal-info">
              <h2>{selectedImage.title}</h2>
              <p>{selectedImage.description}</p>
              <div className="modal-details">
                <div className="detail">
                  <strong>Artist:</strong>
                  <span>{selectedImage.artist}</span>
                </div>
                <div className="detail">
                  <strong>Category:</strong>
                  <span>{selectedImage.category}</span>
                </div>
                <div className="detail">
                  <strong>Date:</strong>
                  <span>{selectedImage.date}</span>
                </div>
                <div className="detail">
                  <strong>Likes:</strong>
                  <span><FaHeart /> {selectedImage.likes}</span>
                </div>
              </div>
              <div className="modal-tags">
                <strong>Tags:</strong>
                <div className="tags-list">
                  {selectedImage.tags.map((tag, idx) => (
                    <span key={idx} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
              <button className="share-btn" onClick={() => {
                navigator.share?.({
                  title: selectedImage.title,
                  text: selectedImage.description,
                  url: window.location.href
                }).catch(() => alert("Share feature not supported"));
              }}>
                <FaShare /> Share this work
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Gallery;