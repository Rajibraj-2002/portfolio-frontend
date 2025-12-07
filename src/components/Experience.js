import React, { useState } from "react";
import { FaTrash, FaPen, FaTimes, FaBriefcase, FaBuilding, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import "./Experience.css"; 

// Use the Full URL to avoid Proxy issues
const API_BASE_URL = "http://localhost:8080/api/experience";

const Experience = ({ experience, isAdmin, refreshData }) => {
  const [editingItem, setEditingItem] = useState(null);
  const allExperience = experience || [];

  const handleDelete = async (id) => {
    if (window.confirm("Delete this experience?")) {
      try {
        // FIXED: Using full URL
        await axios.delete(`${API_BASE_URL}/${id}`, { headers: { "Access-Key": "Rajib" } });
        refreshData();
      } catch (error) { 
        console.error("Delete Error:", error);
        alert("Error deleting. Make sure Backend is running and restarted."); 
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        // FIXED: Using full URL
        await axios.put(`${API_BASE_URL}/${editingItem.id}`, editingItem, { headers: { "Access-Key": "Rajib" } });
        alert("Experience Updated!");
        setEditingItem(null);
        refreshData();
    } catch (error) { 
        console.error("Update Error:", error);
        alert("Failed to update experience. Check console for details."); 
    }
  };

  return (
    <div className="experience-wrapper" id="internships">
      <div className="experience-header">
        <h2 className="section-title">internships and Experience</h2>
        <div className="title-underline"></div>
      </div>
      
      {allExperience.length === 0 && <p className="empty-state">No experience added yet.</p>}

      {/* NEW GRID LAYOUT (Replaces Timeline) */}
      <div className="experience-grid">
        {allExperience.map((exp) => (
            <div key={exp.id} className="exp-modern-card">
                
                {/* 1. Card Header: Role & Duration */}
                <div className="exp-card-header">
                    <div className="exp-icon-box">
                        <FaBriefcase />
                    </div>
                    <div className="exp-header-text">
                        <h3 className="exp-role">{exp.role}</h3>
                        <span className="exp-duration">
                            <FaCalendarAlt size={12} style={{marginRight:'5px'}}/> {exp.duration}
                        </span>
                    </div>
                </div>

                {/* 2. Company Info */}
                <div className="exp-company-row">
                    <FaBuilding className="company-icon" />
                    <span className="exp-company">{exp.company}</span>
                </div>

                {/* 3. Divider */}
                <div className="exp-divider"></div>

                {/* 4. Description */}
                <p className="exp-desc">
                    {exp.description}
                </p>

                {/* 5. Admin Controls */}
                {isAdmin && (
                    <div className="exp-controls">
                        <button onClick={() => setEditingItem(exp)} className="ctrl-btn edit"><FaPen /></button>
                        <button onClick={() => handleDelete(exp.id)} className="ctrl-btn del"><FaTrash /></button>
                    </div>
                )}
            </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="modal-backdrop">
            <div className="modal-glass">
                <div className="modal-header">
                    <h3>Edit Experience</h3>
                    <FaTimes onClick={() => setEditingItem(null)} className="close-icon"/>
                </div>
                <form onSubmit={handleUpdate} className="modal-form">
                    <div className="form-group">
                        <label>Job Role</label>
                        <input value={editingItem.role || ""} onChange={(e) => setEditingItem({...editingItem, role: e.target.value})} placeholder="e.g. Senior Developer" />
                    </div>
                    <div className="form-group">
                        <label>Company</label>
                        <input value={editingItem.company || ""} onChange={(e) => setEditingItem({...editingItem, company: e.target.value})} placeholder="e.g. Google" />
                    </div>
                    <div className="form-group">
                        <label>Duration</label>
                        <input value={editingItem.duration || ""} onChange={(e) => setEditingItem({...editingItem, duration: e.target.value})} placeholder="e.g. Jan 2023 - Present" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={editingItem.description || ""} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} placeholder="Key responsibilities..." />
                    </div>
                    <button type="submit" className="save-btn">Update Experience</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Experience;