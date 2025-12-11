import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
import { FaTrash, FaPen, FaTimes, FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";
import "./Projects.css"; 

// Local Images
import lmsPrimeImg from "../assets/lms-prime.png"; 
// Note: We are no longer using defaultProjectImg as a forced fallback
// import defaultProjectImg from "../assets/logo.png"; 

const Projects = ({ projects, isAdmin, refreshData }) => {
  const [editingItem, setEditingItem] = useState(null);
  const allProjects = projects || []; 

  // --- Image Selection Logic ---
  const getProjectImage = (title) => {
    if (!title) return null;
    if (title.toLowerCase().includes("lms")) return lmsPrimeImg;
    return null; // Will rely on DB url or fallback pattern
  };

  const getTechStack = (techStack) => {
    if (Array.isArray(techStack)) return techStack;
    if (typeof techStack === 'string') return techStack.split(',').map(t => t.trim());
    return [];
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      try {
        await axios.delete(`https://rajib-portfolio-api.onrender.com/api/projects/${id}`, { headers: { "Access-Key": "Rajib" } });
        refreshData();
      } catch (error) { alert("Failed to delete"); }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        const payload = { 
            projectName: editingItem.projectName,
            description: editingItem.description,
            techStack: editingItem.techStack,
            projectLink: editingItem.projectLink,
            repoLink: editingItem.repoLink, 
            projectCredentials: editingItem.projectCredentials 
        }; 
        await axios.put(`https://rajib-portfolio-api.onrender.com/api/projects/${editingItem.id}`, payload, { headers: { "Access-Key": "Rajib" } });
        alert("Updated Successfully!");
        setEditingItem(null);
        refreshData();
    } catch (error) { 
        console.error(error);
        alert("Failed to update."); 
    }
  };

  return (
    <div className="projects-section" id="projects">
      <div className="projects-header">
        <h2 className="section-title">Projects</h2>
        <div className="title-underline"></div>
      </div>
      
      {allProjects.length === 0 && (
          <div className="empty-state">
            <p>No projects showcased yet.</p>
          </div>
      )}

      <div className="projects-grid">
        {allProjects.map((proj) => {
            const techBadges = getTechStack(proj.techStack);
            const localImg = getProjectImage(proj.projectName);
            
            // --- AUTOMATIC SCREENSHOT GENERATION (Using WordPress API) ---
            // This service is more stable and free compared to thum.io
            const liveScreenshot = proj.projectLink 
                ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(proj.projectLink)}?w=800`
                : null;
            
            // Priority: Local Hardcoded > Manual Upload > Live Screenshot > Default Placeholder
            const bgImage = localImg || proj.imageUrl || liveScreenshot;

            // Conditional Hiding for specific projects if needed
            const hideImage = proj.projectName && proj.projectName.includes("Real-Time Customer Relationship Management");

            return (
                <div key={proj.id} className="project-card-modern">
                    {/* --- Admin Overlay --- */}
                    {isAdmin && (
                        <div className="admin-controls-pill">
                            <button onClick={() => setEditingItem(proj)} className="admin-btn edit" title="Edit">
                                <FaPen size={12} />
                            </button>
                            <button onClick={() => handleDelete(proj.id)} className="admin-btn delete" title="Delete">
                                <FaTrash size={12} />
                            </button>
                        </div>
                    )}

                    {/* --- Card Header / Image --- */}
                    <div className="card-visual">
                         <div className="card-bg-wrapper">
                            {/* LOGIC: Show Image OR Show Abstract Pattern */}
                            {!hideImage && bgImage ? (
                                <img src={bgImage} alt={proj.projectName} className="visual-img" />
                            ) : (
                                /* Fallback Pattern (No Logo) */
                                <div className="visual-pattern" style={{
                                    width: '100%', height: '100%', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'var(--bg-body)'
                                }}>
                                    <div className="circle-deco" style={{
                                        width: '80px', height: '80px', borderRadius: '50%',
                                        background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                                        opacity: 0.2, position: 'absolute'
                                    }}></div>
                                    <span style={{
                                        fontSize: '3rem', fontWeight: '800', 
                                        color: 'var(--text-secondary)', opacity: 0.1
                                    }}>
                                        {proj.projectName ? proj.projectName.charAt(0) : "P"}
                                    </span>
                                </div>
                            )}
                         </div>
                         
                         <div className="card-overlay">
                            <Link to={`/project/${proj.id}`} className="view-btn">
                                View Details
                            </Link>
                         </div>
                    </div>

                    {/* --- Card Body --- */}
                    <div className="card-body">
                        <div className="card-top">
                            <h3 className="project-name">{proj.projectName}</h3>
                            <div className="tech-row">
                                {techBadges.slice(0, 3).map((tech, i) => (
                                    <span key={i} className="tech-pill">{tech}</span>
                                ))}
                                {techBadges.length > 3 && <span className="tech-more">+{techBadges.length - 3}</span>}
                            </div>
                        </div>
                        
                        <p className="project-desc">
                            {proj.description ? (proj.description.length > 100 ? proj.description.substring(0, 100) + "..." : proj.description) : "No description."}
                        </p>

                        <div className="card-footer">
                            <Link to={`/project/${proj.id}`} className="details-link">
                                Case Study <FaArrowRight className="arrow" />
                            </Link>
                            {proj.projectLink && (
                                <a href={proj.projectLink} target="_blank" rel="noreferrer" className="icon-link" title="Live Demo">
                                    <FaExternalLinkAlt />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      {/* --- Edit Modal --- */}
      {editingItem && (
        <div className="modal-backdrop">
            <div className="modal-glass">
                <div className="modal-header">
                    <h3>Edit Project</h3>
                    <FaTimes className="close-icon" onClick={() => setEditingItem(null)}/>
                </div>
                <form onSubmit={handleUpdate} className="modal-form">
                    <div className="form-group">
                        <label>Project Name</label>
                        <input value={editingItem.projectName || ""} onChange={(e) => setEditingItem({...editingItem, projectName: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={editingItem.description || ""} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Tech Stack</label>
                        <input value={editingItem.techStack || ""} onChange={(e) => setEditingItem({...editingItem, techStack: e.target.value})} placeholder="React, Node, MongoDB..." />
                    </div>
                    <div className="form-group">
                        <label>Live Link</label>
                        <input value={editingItem.projectLink || ""} onChange={(e) => setEditingItem({...editingItem, projectLink: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>GitHub Repo Link</label>
                        <input value={editingItem.repoLink || ""} onChange={(e) => setEditingItem({...editingItem, repoLink: e.target.value})} />
                    </div>
                    
                    <div className="form-group">
                        <label style={{color: '#f59e0b'}}>Project Credentials (Optional)</label>
                        <textarea 
                            value={editingItem.projectCredentials || ""} 
                            onChange={(e) => setEditingItem({...editingItem, projectCredentials: e.target.value})} 
                            placeholder="User: admin / Pass: 123"
                            style={{ background: '#fffbeb', borderColor: '#fcd34d' }}
                        />
                    </div>

                    <button type="submit" className="save-btn">Save Changes</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Projects;