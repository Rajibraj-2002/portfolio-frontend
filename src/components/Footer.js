import React from "react";
// Importing icons from react-icons
import { FaLinkedin, FaGithub, FaEnvelope, FaInstagram, FaTwitter } from "react-icons/fa"; 
import { SiLeetcode } from "react-icons/si"; 

const Footer = ({ isDarkMode, profile }) => {
  const currentYear = new Date().getFullYear();
  
  // Conditional Styles based on Theme
  const themeStyles = isDarkMode ? styles.dark : styles.light;
  
  // Safe profile access
  const safeProfile = profile || {};

  return (
    <footer style={{ ...styles.footer, ...themeStyles.footer }}>
      <div style={styles.container}>
        
        {/* --- SOCIAL ICONS SECTION --- */}
        <div style={styles.iconContainer}>
          {safeProfile.linkedinLink && (
            <a href={safeProfile.linkedinLink} target="_blank" rel="noreferrer" style={styles.iconLink}>
              <FaLinkedin size={24} />
            </a>
          )}
          {safeProfile.githubLink && (
            <a href={safeProfile.githubLink} target="_blank" rel="noreferrer" style={styles.iconLink}>
              <FaGithub size={24} />
            </a>
          )}
          {/* Email */}
          {safeProfile.email && (
            <a href={`mailto:${safeProfile.email}`} style={styles.iconLink}>
              <FaEnvelope size={24} />
            </a>
          )}
          {/* LeetCode (Assuming you add this field to your DB/Admin) */}
          {safeProfile.leetcodeLink && (
            <a href={safeProfile.leetcodeLink} target="_blank" rel="noreferrer" style={styles.iconLink}>
              <SiLeetcode size={24} />
            </a>
          )}
          {/* Instagram */}
          {safeProfile.instagramLink && (
            <a href={safeProfile.instagramLink} target="_blank" rel="noreferrer" style={styles.iconLink}>
              <FaInstagram size={24} />
            </a>
          )}
          {/* X (Twitter) */}
          {safeProfile.twitterLink && (
            <a href={safeProfile.twitterLink} target="_blank" rel="noreferrer" style={styles.iconLink}>
              <FaTwitter size={24} />
            </a>
          )}
        </div>

        {/* --- COPYRIGHT TEXT --- */}
        <p style={{ ...styles.text, color: themeStyles.text }}>
          &copy; {currentYear} <span style={styles.name}>Rajibraj Raymohapatra</span>. All rights reserved.
        </p>
        <p style={{ ...styles.subText, color: themeStyles.subText }}>
          Designed & Built by <span style={{ color: "#6c63ff", fontSize: "1.2rem", verticalAlign: "middle" }}>Rajib</span>
        </p>
      </div>
    </footer>
  );
};

// Inline Styles
const styles = {
  footer: {
    padding: "3rem 0",
    textAlign: "center",
    marginTop: "50px",
    position: "relative",
    zIndex: 10,
    transition: "all 0.3s ease",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  iconContainer: {
    display: "flex",
    gap: "25px",
    marginBottom: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  iconLink: {
    color: "#6c63ff", // Brand color for icons
    transition: "transform 0.2s ease, color 0.2s ease",
    display: "flex",
    alignItems: "center",
  },
  text: {
    fontSize: "1rem",
    marginBottom: "0.2rem",
    letterSpacing: "0.5px",
    transition: "color 0.3s ease",
  },
  name: {
    color: "#6c63ff", 
    fontWeight: "600",
  },
  subText: {
    fontSize: "0.85rem",
    transition: "color 0.3s ease",
  },
  
  // --- THEME SPECIFIC STYLES ---
  light: {
    footer: {
      background: "#f8f9fa", 
      borderTop: "1px solid #e2e8f0",
    },
    text: "#334155",    
    subText: "#64748b", 
  },
  dark: {
    footer: {
      background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))", 
      borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    },
    text: "#cbd5e1",    
    subText: "#94a3b8", 
  }
};

export default Footer;