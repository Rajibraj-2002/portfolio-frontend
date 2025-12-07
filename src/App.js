import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Routes, Route } from "react-router-dom"; 
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

// --- OPTIMIZED ANIMATION VARIANTS (High Performance) ---

// 1. Elegant Fade + Float Up 
const blurFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

// 2. Gentle Soft Scale
const softScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

// 3. Smooth Slide from Right
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
  
  useEffect(() => {
    // Reset scroll when landing on home
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> 

      <div id="home">
        <Hero profile={profile} onDownload={handleDownloadCV} isAdmin={isAdmin} />
      </div>

      {/* About */}
      <motion.div 
        id="about" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={blurFadeUp}
      >
        <About profile={profile} />
      </motion.div>

      {/* Education: Slide Right */}
      <motion.div 
        id="education" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={smoothSlideRight}
      >
        <Education education={education} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      {/* Skills: Soft Scale */}
      <motion.div 
        id="skills" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={softScale}
      >
        <Skills skills={skills} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      {/* Projects: Fade Up */}
      <motion.div 
        id="projects" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={blurFadeUp}
      >
        <Projects projects={projects} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      {/* Experience: Slide Right */}
      <motion.div 
        id="internships" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={smoothSlideRight}
      >
        <Experience experience={experience} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      {/* Certificates: Soft Scale */}
      <motion.div 
        id="certificates" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={softScale}
      >
        <Certificates certificates={certificates} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      {/* Contact: Fade Up */}
      <motion.div 
        id="contact" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-50px" }} 
        variants={blurFadeUp}
      >
        <Contact profile={profile} />
      </motion.div>

      {/* Footer: Added profile prop for social icons */}
      <Footer isDarkMode={isDarkMode} profile={profile} />
    </>
  );
};

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  
  // --- DARK MODE STATE ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
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
      const [resProfile, resEdu, resExp, resSkills, resProj, resCert] = await Promise.all([
        axios.get("http://localhost:8080/api/profile"),
        axios.get("http://localhost:8080/api/education"),
        axios.get("http://localhost:8080/api/experience"),
        axios.get("http://localhost:8080/api/skills"),
        axios.get("http://localhost:8080/api/projects"),
        axios.get("http://localhost:8080/api/certificates"),
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