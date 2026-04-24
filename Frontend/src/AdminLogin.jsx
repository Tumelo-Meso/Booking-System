import React, { useState } from "react";
import "./css/AdminLogin.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUserShield, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaSignInAlt,
  FaArrowLeft,
  FaShieldAlt,
  FaKey
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function AdminLogin() {





  const navigate = useNavigate();

  const [email , setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data , setData] = useState("");
  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  async function autheticateLogin(){



      try {
        
        if(!email || !password){
           return
        }

        const response = await fetch("http://localhost:1010/login",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body : JSON.stringify({
              email,password
            })
        })

        const returnValue = await response.json();

        if(!response.ok) {
          return  setData(returnValue.message)
        }

        const token = returnValue.token;

        localStorage.setItem("token",JSON.stringify(token));

        navigate("/admin/dashboard")
        
      } catch (error) {

         console.error(error)
      }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    validateForm();
  
    autheticateLogin()
 
    
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="admin-login-page">
      <button className="back-home-btn" onClick={handleBackToHome}>
        <FaArrowLeft /> Back to Home
      </button>

      <div className="admin-login-container">
        <motion.div 
          className="admin-login-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="admin-login-header">
            <div className="admin-icon">
              <FaUserShield />
            </div>
            <h1>Admin Portal</h1>
            <p>Staff & Administrators Only</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label>
                <FaEnvelope className="input-icon" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event)=>{

                  setEmail(event.target.value)
                }}
                placeholder="Enter your email"
                autoComplete="off"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>
                <FaLock className="input-icon" />
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(event)=>{

                      setPassword(event.target.value);
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  
                />
                <span>Remember me</span>
              </label>
             
            </div>

            {errors.submit && (
              <div className="submit-error">
                <FaShieldAlt />
                <span>{errors.submit}</span>
              </div>
            )}

            <motion.button
              type="submit"
              className="login-btn"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <FaSignInAlt /> Login to Dashboard
                </>
              )}
            </motion.button>

            <div className="security-note">
              <FaKey />
              <p>This area is restricted to authorized personnel only.</p>
            </div>
          </form>

          
        </motion.div>
      </div>

      {/* Security Warning Modal */}
      <AnimatePresence>
        {errors.submit === "Invalid email or password. Please try again." && (
          <motion.div 
            className="security-warning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <FaShieldAlt />
            <div>
              <strong>Security Alert</strong>
              <p>Multiple failed attempts will be logged</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminLogin;