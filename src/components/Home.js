import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Education from "./Education";
import Skills from "./SkillsTabs";
import Projects from "./Projects";
import Experience from "./Experience";
import Certificates from "./Certificates";
import Contact from "./Contact";
import AddData from "./AddData";
import AdminLogin from "./AdminLogin";

// This component holds your entire Single Page Portfolio
const Home = ({ isAdmin, setIsAdmin }) => {
  // Data States
  const [profile, setProfile] = useState({});
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const fetchData = async () => {
    try {
        const [resProfile, resEdu, resExp, resSkills, resProj, resCert] = await Promise.all([
            axios.get("http://localhost:8080/api/profile"),
            axios.get("http://localhost:8080/api/education"),
            axios.get("http://localhost:8080/api/experience"),
            axios.get("http://localhost:8080/api/skills"),
            axios.get("http://localhost:8080/api/projects"),
            axios.get("http://localhost:8080/api/certificates")
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

  const handleDownloadCV = () => {
    if (profile.cvLink) window.open(profile.cvLink, "_blank");
    else alert("CV not available");
  };

  const slideInVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, type: "spring", bounce: 0.3 } }
  };

  return (
    <div className="Home">
      <Navbar />
      <div id="home"><Hero profile={profile} onDownload={handleDownloadCV} /></div>
      
      <motion.div id="about" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInVariants}>
        <About profile={profile} />
      </motion.div>

      <motion.div id="education" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInVariants}>
        <Education education={education} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      <motion.div id="skills" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInVariants}>
        <Skills skills={skills} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      {/* Projects Section - It will now link to details page */}
      <motion.div id="projects" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInVariants}>
        <Projects projects={projects} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      <motion.div id="internships" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInVariants}>
        <Experience experience={experience} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      <motion.div id="certificates" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInVariants}>
        <Certificates certificates={certificates} isAdmin={isAdmin} refreshData={fetchData} />
      </motion.div>

      <motion.div id="contact" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInVariants}>
        <Contact profile={profile} />
      </motion.div>

      <AddData isAdmin={isAdmin} refreshData={fetchData} />
      <AdminLogin isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
    </div>
  );
};

export default Home;