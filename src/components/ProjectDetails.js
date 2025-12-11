import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaLaptopCode, FaDatabase, FaClock, FaLock, FaKey } from "react-icons/fa";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get("https://rajib-portfolio-api.onrender.com/api/projects");
        
        // FIX: Convert both IDs to string for strict comparison (===)
        const foundProject = response.data.find(p => String(p.id) === String(id));
        
        setProject(foundProject);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setLoading(false);
      }
    };
    fetchProject();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="detail-status">Loading...</div>;
  if (!project) return <div className="detail-status">Project not found.</div>;

  const techStackArray = project.techStack ? project.techStack.split(",") : [];
  
  // --- SPECIAL LOGIC FOR SPECIFIC PROJECTS ---
  let repoLinks = project.repoLink ? project.repoLink.split(",") : [];
  let isPrivateRepo = false;
  
  const titleLower = project.projectName ? project.projectName.toLowerCase() : "";

  // 1. LMS Prime Override (Only for links if missing)
  if ((titleLower.includes("lms prime") || titleLower.includes("learning management")) && repoLinks.length === 0) {
      repoLinks = [
          "https://github.com/Rajibraj-2002/lms-frontend.git",
          "https://github.com/Rajibraj-2002/lms-backend.git"
      ];
  } 
  // 2. CRM Private Logic
  else if (titleLower.includes("customer relationship") || titleLower.includes("crm")) {
      repoLinks = [];
      isPrivateRepo = true;
  }

  const getLinkLabel = (url, index, total) => {
      if (url.includes("frontend")) return "Frontend Repo";
      if (url.includes("backend")) return "Backend Repo";
      return total > 1 ? `Source Code ${index + 1}` : "View Source Code";
  };

  return (
    <div className="pd-wrapper">
      
      {/* --- HERO HEADER --- */}
      <div className="pd-hero">
        <div className="pd-hero-content">
            <Link to="/#projects" className="pd-back-btn">
                <FaArrowLeft /> Back to Projects
            </Link>
            <h1 className="pd-title">{project.projectName}</h1>
            <div className="pd-badges">
                <span className="pd-badge category">Full Stack</span>
                <span className="pd-badge status">Completed</span>
            </div>
        </div>
        
        <div className="pd-hero-visual">
            <div className="pd-visual-box">
                <FaLaptopCode className="pd-visual-icon"/>
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="pd-grid">
        
        {/* LEFT: Narrative */}
        <div className="pd-main">
            <div className="pd-section">
                <h2>Project Overview</h2>
                <p className="pd-text">{project.description}</p>
            </div>
            
            <div className="pd-section">
                <h2>Tech Stack</h2>
                <div className="pd-tech-grid">
                    {techStackArray.map((tech, i) => (
                        <div key={i} className="pd-tech-card">
                            <FaDatabase className="pd-tech-icon"/>
                            <span>{tech.trim()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* RIGHT: Sidebar / Action Card */}
        <div className="pd-sidebar">
            <div className="pd-action-card">
                <h3>Project Actions</h3>
                <p>Explore the source code or view the live deployment.</p>
                
                <div className="pd-actions">
                    {/* Live Link */}
                    {project.projectLink && (
                        <a href={project.projectLink} target="_blank" rel="noreferrer" className="pd-btn primary">
                            <FaExternalLinkAlt /> Open Live Demo
                        </a>
                    )}
                    
                    {/* --- PROJECT CREDENTIALS BOX --- */}
                    {project.projectCredentials && (
                        <div className="pd-creds-box">
                            <div className="creds-header">
                                <FaKey /> <span>Test Credentials</span>
                            </div>
                            <pre className="creds-content">{project.projectCredentials}</pre>
                        </div>
                    )}

                    {/* GitHub Links OR Private Message */}
                    {isPrivateRepo ? (
                        <div className="pd-private-msg">
                            <FaLock className="lock-icon" />
                            <span>The source codes are private as per the Industry norms.</span>
                        </div>
                    ) : (
                        repoLinks.map((link, idx) => (
                            <a key={idx} href={link.trim()} target="_blank" rel="noreferrer" className="pd-btn secondary">
                                <FaGithub /> {getLinkLabel(link, idx, repoLinks.length)}
                            </a>
                        ))
                    )}
                </div>
                
                <div className="pd-meta">
                    <div className="meta-row">
                        <FaClock /> <span>Last Updated: Recently</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;