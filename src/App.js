import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom"; 
import "./App.css";

// Components
import ProjectDetails from "./components/ProjectDetails";
import AddData from "./components/AddData";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Skills from "./components/SkillsTabs";
import Projects from "./components/Projects";
import Certificates from "./components/Certificates";
import Contact from "./components/Contact";
import AdminLogin from "./components/AdminLogin";
import Footer from "./components/Footer"; 
import SEO from "./components/SEO"; // Import SEO Component

// --- ANIMATION VARIANTS ---
const blurFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const softScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const smoothSlideRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.5, ease: "circOut" } 
  }
};

// --- HomeContent Component ---
const HomeContent = ({ 
  profile, education, experience, skills, projects, certificates, 
  isAdmin, handleDownloadCV, fetchData, 
  isDarkMode, toggleTheme 
}) => {
  
  const location = useLocation();

  useEffect(() => {
    // 1. Handle Scroll Restoration Manual
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Smart Scroll Logic
    if (location.hash) {
      const elementId = location.hash.replace("#", "");
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); 
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      {/* ADD SEO FOR HOME PAGE */}
      <SEO 
        title="Home" 
        description={profile.summary || "Full Stack Developer Portfolio showcasing projects in React, Spring Boot, and MySQL."}
      />

      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> 

      <div id="home">
        <Hero profile={profile} onDownload={handleDownloadCV} isAdmin={isAdmin} />
      </div>

      <motion.div 
        id="about" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={blurFadeUp}
      >
        <About profile={profile} />
      </motion.div>

      <motion.div 
        id="education" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={smoothSlideRight}
      >
        <Education education={education} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      <motion.div 
        id="skills" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={softScale}
      >
        <Skills skills={skills} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      <motion.div 
        id="projects" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={blurFadeUp}
      >
        <Projects projects={projects} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      <motion.div 
        id="internships" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={smoothSlideRight}
      >
        <Experience experience={experience} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      <motion.div 
        id="certificates" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={softScale}
      >
        <Certificates certificates={certificates} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      <motion.div 
        id="contact" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={blurFadeUp}
      >
        <Contact profile={profile} />
      </motion.div>

      <Footer isDarkMode={isDarkMode} profile={profile} />
    </>
  );
};

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // --- RELOAD HANDLER ---
  useEffect(() => {
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0 && navEntries[0].type === "reload") {
        navigate("/"); // Force navigate to Home on reload
    }
  }, [navigate]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // Data States
  const [profile, setProfile] = useState({});
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Fetch Data
  const fetchData = async () => {
    try {
      // PROD URL for fetching data
      const API_URL = "https://rajib-portfolio-api.onrender.com/api";
      
      const [resProfile, resEdu, resExp, resSkills, resProj, resCert] = await Promise.all([
        axios.get(`${API_URL}/profile`),
        axios.get(`${API_URL}/education`),
        axios.get(`${API_URL}/experience`),
        axios.get(`${API_URL}/skills`),
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/certificates`),
      ]);

      setProfile(resProfile.data);
      setEducation(resEdu.data);
      setExperience(resExp.data);
      setSkills(resSkills.data);
      setProjects(resProj.data);
      setCertificates(resCert.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownloadCV = (link) => {
    if (link) window.open(link, "_blank");
    else alert("CV link not available");
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <HomeContent 
              profile={profile} 
              education={education}
              experience={experience}
              skills={skills}
              projects={projects}
              certificates={certificates}
              isAdmin={isAdmin}
              handleDownloadCV={handleDownloadCV}
              fetchData={fetchData}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
          />
        } />
        
        <Route path="/project/:id" element={<ProjectDetails projects={projects} />} />
      </Routes>

      <AddData isAdmin={isAdmin} refreshData={fetchData} />
      <AdminLogin isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
    </div>
  );
}

export default App;