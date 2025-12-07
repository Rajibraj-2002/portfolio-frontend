import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import "./Hero.css";

// --- IMPORT YOUR HARDCODED IMAGE AS FALLBACK ---
import myHeroImage from "../assets/hero-pic.jpg"; 

// --- HARDCODED RESUME LINK AS FALLBACK ---
const HARDCODED_CV_LINK = "https://drive.google.com/file/d/12tfz41DEGS9EUOW8iFpdCWaiShZo5DyB/view?usp=sharing";

// --- ANIMATION VARIANTS (Typing Effect) ---
const typingContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, 
      delayChildren: 0.2,    
    },
  },
};

const typingLetterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// --- Standard Fade Variants ---
const standardFadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, delay: 1.5 } 
  }
};

const Hero = ({ profile, onDownload }) => {
  const safeProfile = profile || {};
  const displayImage = safeProfile.photoUrl || myHeroImage;
  const cvLink = safeProfile.cvLink || HARDCODED_CV_LINK;
  
  const handleDownload = () => {
      if (cvLink) {
          onDownload ? onDownload(cvLink) : window.open(cvLink, "_blank");
      } else {
          alert("CV link not available.");
      }
  };

  // --- Helper to Render Typing Text ---
  // Updated to use CSS Variables for dynamic theming
  const renderAnimatedText = (text, tagStyle, colorVar) => {
    const characters = Array.from(text);
    return (
      <motion.div
        variants={typingContainerVariants}
        initial="hidden"
        animate="visible"
        className={tagStyle}
        style={{ 
            display: "flex", 
            flexWrap: "nowrap", /* CHANGED: Forces text to stay on one line */
            marginBottom: "10px",
            color: colorVar || "var(--text-main)" // Default to main text color
        }} 
      >
        {characters.map((char, index) => (
          <motion.span key={index} variants={typingLetterVariants}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="hero-section">
      <div className="hero-bg-shape"></div> 

      <div className="hero-wrapper">
        
        {/* TEXT CONTAINER */}
        <div className="hero-text">
          
          {/* 1. Animated Greeting */}
          <h3 className="hero-greeting">
            {renderAnimatedText("Hello, I am", "", "var(--text-secondary)")}
          </h3>
          
          {/* 2. Animated Name (ACCENT COLOR - Primary) */}
          <div className="hero-name-wrapper">
             {renderAnimatedText(safeProfile.fullName || "Rajibraj Raymohapatra", "", "var(--primary)")}
          </div>
          
          {/* 3. Animated Title */}
          <h2 className="hero-title-role">
            {renderAnimatedText(safeProfile.title || "Full-Stack Java Developer", "", "var(--text-main)")}
          </h2>
          
          {/* Static Fade-in Elements */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={standardFadeVariants}
          >
            <p>
              {safeProfile.summary || "Motivated and detail-oriented full-stack Java developer passionate about building scalable solutions."}
            </p>

            <div className="social-icons">
              <a href={safeProfile.linkedinLink || "#"} target="_blank" rel="noreferrer"><FaLinkedin /></a>
              <a href={safeProfile.githubLink || "#"} target="_blank" rel="noreferrer"><FaGithub /></a>
              <a href={`mailto:${safeProfile.email || ""}`}><FaEnvelope /></a>
            </div>

            <button onClick={handleDownload} className="btn-primary-custom">
                Download CV
            </button>
          </motion.div>
        </div>

        {/* IMAGE ANIMATION */}
        <motion.div 
          className="hero-img-container"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        >
          <div className="img-circle-bg">
             <img 
               src={displayImage} 
               alt="Profile" 
             />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;