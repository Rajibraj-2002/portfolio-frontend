import React from "react";
import { motion } from "framer-motion";
import { FaRocket, FaLightbulb, FaUsers } from "react-icons/fa";
import "./About.css"; 
import myAboutImage from "../assets/about-pic.jpg";

const About = ({ profile }) => {
  const safeProfile = profile || {};
  const displayAboutImage = safeProfile.aboutPhotoUrl || myAboutImage;

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        
        {/* --- LEFT: IMAGE --- */}
        <motion.div 
            className="about-image-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            {/* Removed glow and badge for a cleaner look */}
            <div className="about-img-frame">
                <img src={displayAboutImage} alt="About Me" />
            </div>
        </motion.div>

        {/* --- RIGHT: CONTENT --- */}
        <div className="about-content">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <motion.h4 variants={fadeInUp} className="about-label">About Me</motion.h4>
                {/* <motion.h2 variants={fadeInUp} className="about-title">
                    Crafting digital experiences with precision and passion.
                </motion.h2> */}
                
                <motion.p variants={fadeInUp} className="about-desc">
                    {safeProfile.aboutContent || "I am a Full-Stack Developer who bridges the gap between design and technology. My focus is on writing clean, efficient code and building user-centric applications that solve real-world problems. I believe in continuous learning and adapting to the ever-evolving tech landscape."}
                </motion.p>

                {/* --- CLEAN TRAIT GRID --- */}
                <motion.div className="traits-grid" variants={staggerContainer}>
                    
                    <motion.div variants={fadeInUp} className="trait-item">
                        <div className="trait-header">
                            <FaRocket className="trait-icon" />
                            <h3>Dynamic</h3>
                        </div>
                        <p>I build fast, interactive websites that come to life.</p>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="trait-item">
                        <div className="trait-header">
                            <FaLightbulb className="trait-icon" />
                            <h3>Intuitive</h3>
                        </div>
                        <p>Strong preference for easy to use, intuitive UX/UI.</p>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="trait-item">
                        <div className="trait-header">
                            <FaUsers className="trait-icon" />
                            <h3>Reliable</h3>
                        </div>
                        <p>Dedicated to delivering robust and scalable solutions.</p>
                    </motion.div>

                </motion.div>
            </motion.div>
        </div>

      </div>
    </section>
  );
};

export default About;