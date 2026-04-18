import React, { useState, useRef } from "react";
import "./css/BookingPage.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaPaintBrush, 
  FaArrowRight, 
  FaArrowLeft,
  FaCheckCircle,
  FaInfoCircle,
  FaWhatsapp,
  FaTimes,
  FaImage,
  FaUpload,
  FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function BookingPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Service Details
    service: "",
    tattooSize: "",
    placement: "",
    description: "",
    referenceImages: [],
    
    // Step 2: Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Step 3: Appointment Details
    preferredDate: "",
    preferredTime: "",
    alternativeDate: "",
    notes: "",
    
    // Step 4: Confirmation
    agreeToTerms: false,
    receiveUpdates: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const services = [
    { id: "custom", name: "Custom Tattoo", price: "From R1,500", icon: FaPaintBrush },
    { id: "fineLine", name: "Fine Line", price: "From R1,200", icon: FaPaintBrush },
    { id: "realism", name: "Realism", price: "From R2,500", icon: FaPaintBrush },
    { id: "sleeve", name: "Sleeve", price: "From R5,000", icon: FaPaintBrush },
    { id: "coverup", name: "Cover-up", price: "From R2,000", icon: FaPaintBrush },
    { id: "watercolor", name: "Watercolor", price: "From R1,800", icon: FaPaintBrush }
  ];

  const sizes = ["Small (2-3 inches)", "Medium (4-6 inches)", "Large (7-10 inches)", "Extra Large (10+ inches)"];
  const placements = ["Arm", "Leg", "Chest", "Back", "Ribs", "Neck", "Hand", "Foot", "Other"];
  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.service) newErrors.service = "Please select a service";
      if (!formData.tattooSize) newErrors.tattooSize = "Please select tattoo size";
      if (!formData.placement) newErrors.placement = "Please select placement";
      if (!formData.description) newErrors.description = "Please describe your tattoo idea";
    }
    
    if (currentStep === 2) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.phone) newErrors.phone = "Phone number is required";
    }
    
    if (currentStep === 3) {
      if (!formData.preferredDate) newErrors.preferredDate = "Please select a preferred date";
      if (!formData.preferredTime) newErrors.preferredTime = "Please select a preferred time";
    }
    
    if (currentStep === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call with image upload
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 3000);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + formData.referenceImages.length > 5) {
      alert("You can only upload up to 5 images");
      return;
    }
    
    setUploadingImage(true);
    
    // Process each file
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageData = {
            id: Date.now() + Math.random(),
            name: file.name,
            data: reader.result,
            size: file.size,
            type: file.type
          };
          setFormData(prev => ({
            ...prev,
            referenceImages: [...prev.referenceImages, imageData]
          }));
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please upload only image files (JPEG, PNG, GIF, etc.)");
      }
    });
    
    setUploadingImage(false);
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (imageId) => {
    setFormData({
      ...formData,
      referenceImages: formData.referenceImages.filter(img => img.id !== imageId)
    });
  };

  const getSelectedService = () => {
    return services.find(s => s.id === formData.service);
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="booking-step"
    >
      <h3>Select Your Service</h3>
      
      <div className="form-group">
        <label>Service Type *</label>
        <div className="service-options">
          {services.map(service => (
            <button
              key={service.id}
              type="button"
              className={`service-option ${formData.service === service.id ? "selected" : ""}`}
              onClick={() => setFormData({ ...formData, service: service.id })}
            >
              <service.icon />
              <div>
                <strong>{service.name}</strong>
                <span>{service.price}</span>
              </div>
            </button>
          ))}
        </div>
        {errors.service && <span className="error">{errors.service}</span>}
      </div>

      <div className="form-group">
        <label>Tattoo Size *</label>
        <select name="tattooSize" value={formData.tattooSize} onChange={handleChange}>
          <option value="">Select size</option>
          {sizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        {errors.tattooSize && <span className="error">{errors.tattooSize}</span>}
      </div>

      <div className="form-group">
        <label>Placement on Body *</label>
        <select name="placement" value={formData.placement} onChange={handleChange}>
          <option value="">Select placement</option>
          {placements.map(placement => (
            <option key={placement} value={placement}>{placement}</option>
          ))}
        </select>
        {errors.placement && <span className="error">{errors.placement}</span>}
      </div>

      <div className="form-group">
        <label>Tattoo Description *</label>
        <textarea
          name="description"
          rows="4"
          placeholder="Describe your tattoo idea in detail (style, elements, colors, etc.)"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      {/* Image Upload Section */}
      <div className="form-group image-upload-section">
        <label>
          <FaImage /> Reference Images (Optional)
          <span className="optional-badge">Optional</span>
        </label>
        <p className="upload-hint">
          Upload reference images or sketches of what you have in mind (Max 5 images)
        </p>
        
        <div 
          className="upload-area"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />
          <FaUpload className="upload-icon" />
          <p>Click or drag to upload images</p>
          <span>Supported formats: JPEG, PNG, GIF (Max 5MB each)</span>
        </div>

        {uploadingImage && (
          <div className="uploading-indicator">
            <div className="spinner"></div>
            <p>Uploading images...</p>
          </div>
        )}

        {formData.referenceImages.length > 0 && (
          <div className="image-preview-grid">
            <h4>Uploaded Images ({formData.referenceImages.length}/5)</h4>
            <div className="image-grid">
              {formData.referenceImages.map((image) => (
                <div key={image.id} className="image-preview-item">
                  <img src={image.data} alt={image.name} />
                  <button 
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(image.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="booking-step"
    >
      <h3>Personal Information</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label>Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+27 XX XXX XXXX"
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="booking-step"
    >
      <h3>Schedule Your Appointment</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>Preferred Date *</label>
          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.preferredDate && <span className="error">{errors.preferredDate}</span>}
        </div>

        <div className="form-group">
          <label>Preferred Time *</label>
          <select name="preferredTime" value={formData.preferredTime} onChange={handleChange}>
            <option value="">Select time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          {errors.preferredTime && <span className="error">{errors.preferredTime}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Alternative Date (Optional)</label>
        <input
          type="date"
          name="alternativeDate"
          value={formData.alternativeDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="form-group">
        <label>Additional Notes</label>
        <textarea
          name="notes"
          rows="3"
          placeholder="Any specific requests, concerns, or information we should know?"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="booking-info">
        <FaInfoCircle />
        <p>Our artist will review your request and confirm availability within 24-48 hours.</p>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="booking-step"
    >
      <h3>Confirm Your Booking</h3>
      
      <div className="booking-summary">
        <h4>Booking Summary</h4>
        
        <div className="summary-item">
          <strong>Service:</strong>
          <span>{getSelectedService()?.name}</span>
        </div>
        
        <div className="summary-item">
          <strong>Size:</strong>
          <span>{formData.tattooSize}</span>
        </div>
        
        <div className="summary-item">
          <strong>Placement:</strong>
          <span>{formData.placement}</span>
        </div>
        
        <div className="summary-item">
          <strong>Date:</strong>
          <span>{formData.preferredDate || "Not specified"}</span>
        </div>
        
        <div className="summary-item">
          <strong>Time:</strong>
          <span>{formData.preferredTime || "Not specified"}</span>
        </div>
        
        <div className="summary-item">
          <strong>Name:</strong>
          <span>{formData.firstName} {formData.lastName}</span>
        </div>
        
        <div className="summary-item">
          <strong>Email:</strong>
          <span>{formData.email}</span>
        </div>
        
        <div className="summary-item">
          <strong>Phone:</strong>
          <span>{formData.phone}</span>
        </div>

        {formData.referenceImages.length > 0 && (
          <div className="summary-item summary-images">
            <strong>Reference Images:</strong>
            <div className="summary-image-grid">
              {formData.referenceImages.map((image, idx) => (
                <img key={idx} src={image.data} alt={`Reference ${idx + 1}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
          />
          I agree to the booking policy and understand that a deposit may be required
        </label>
        {errors.agreeToTerms && <span className="error">{errors.agreeToTerms}</span>}
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="receiveUpdates"
            checked={formData.receiveUpdates}
            onChange={handleChange}
          />
          Subscribe to newsletter for offers and updates
        </label>
      </div>

      <div className="whatsapp-contact">
        <FaWhatsapp />
        <div>
          <strong>Prefer WhatsApp?</strong>
          <p>Contact us directly on +27 12 065 0511 for quick booking</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <button className="back-to-home" onClick={() => navigate("/")}>
        <FaArrowLeft /> Back to Home
      </button>

      <section className="booking-page">
        <div className="booking-container">
          <motion.div 
            className="booking-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Book Your <span className="gradient-text">Tattoo Session</span></h1>
            <p>Fill out the form below and we'll get back to you within 24-48 hours to confirm your appointment</p>
          </motion.div>

          <motion.div 
            className="booking-progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[1, 2, 3, 4].map(step => (
              <div key={step} className={`progress-step ${currentStep >= step ? "active" : ""}`}>
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 && "Service"}
                  {step === 2 && "Info"}
                  {step === 3 && "Schedule"}
                  {step === 4 && "Confirm"}
                </div>
              </div>
            ))}
          </motion.div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </AnimatePresence>

            <div className="booking-navigation">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  className="btn-secondary"
                  onClick={handleBack}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowLeft /> Back
                </motion.button>
              )}
              
              {currentStep < 4 ? (
                <motion.button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next <FaArrowRight />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Booking"}
                </motion.button>
              )}
            </div>
          </form>
        </div>
      </section>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            className="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="success-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <FaCheckCircle className="success-icon" />
              <h2>Booking Submitted!</h2>
              <p>Thank you for choosing Ink By Nala. We'll contact you within 24-48 hours to confirm your appointment.</p>
              <button onClick={() => navigate("/")} className="btn-primary">Back to Home</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default BookingPage;