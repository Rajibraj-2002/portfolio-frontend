import React, { useState } from "react";
import axios from "axios";
import { FaGraduationCap, FaTrash, FaPen, FaUniversity, FaCalendarAlt, FaTimes } from "react-icons/fa";
import "./Education.css";

const Education = ({ education, isAdmin, refreshData }) => {
  const [editingItem, setEditingItem] = useState(null); 

  const handleDelete = async (id) => {
    if (window.confirm("Delete this education entry?")) {
      try {
        await axios.delete(`https://rajib-portfolio-api.onrender.com/api/education/${id}`, { headers: { "Access-Key": "Rajib" } });
        refreshData();
      } catch (error) { alert("Failed to delete."); }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        await axios.put(`https://rajib-portfolio-api.onrender.com/api/education/${editingItem.id}`, editingItem, {
            headers: { "Access-Key": "Rajib" }
        });
        alert("Updated Successfully!");
        setEditingItem(null); 
        refreshData();
    } catch (error) { alert("Failed to update."); }
  };

  return (
    <div className="edu-section" id="education">
      <div className="edu-header">
        <h2 className="section-title">Academic History</h2>
        <div className="title-underline"></div>
      </div>

      <div className="edu-grid">
        {education && education.map((edu) => (
          <div key={edu.id} className="edu-card">
            
            {/* 4. Admin Actions (Placed first to handle stacking context for hover) */}
            {isAdmin && (
                <div className="edu-admin-controls">
                    <button className="edu-btn edit" onClick={() => setEditingItem(edu)}><FaPen /></button>
                    <button className="edu-btn delete" onClick={() => handleDelete(edu.id)}><FaTrash /></button>
                </div>
            )}

            {/* 1. Header with Icon & Year */}
            <div className="edu-card-top">
                <div className="edu-icon-box">
                    <FaGraduationCap />
                </div>
                <div className="edu-year-badge">
                    <FaCalendarAlt size={12} /> {edu.yearRange}
                </div>
            </div>

            {/* 2. Main Content */}
            <div className="edu-content">
                <h3 className="edu-degree">{edu.degree}</h3>
                <div className="edu-school">
                    <FaUniversity className="school-icon" />
                    <span>{edu.university}</span>
                </div>
                
                {edu.description && (
                    <p className="edu-description">
                        {edu.description}
                    </p>
                )}
            </div>

            {/* 3. Decorative Bottom Bar */}
            <div className="edu-bar"></div>

          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="modal-backdrop">
            <div className="modal-glass">
                <div className="modal-header">
                    <h3>Edit Education</h3>
                    <FaTimes onClick={() => setEditingItem(null)} className="close-icon"/>
                </div>
                <form onSubmit={handleUpdate} className="modal-form">
                    <div className="form-group">
                        <label>Degree</label>
                        <input name="degree" value={editingItem.degree || ""} onChange={(e) => setEditingItem({...editingItem, degree: e.target.value})} placeholder="e.g. B.Tech Computer Science" />
                    </div>
                    <div className="form-group">
                        <label>University</label>
                        <input name="university" value={editingItem.university || ""} onChange={(e) => setEditingItem({...editingItem, university: e.target.value})} placeholder="University Name" />
                    </div>
                    <div className="form-group">
                        <label>Year Range</label>
                        <input name="yearRange" value={editingItem.yearRange || ""} onChange={(e) => setEditingItem({...editingItem, yearRange: e.target.value})} placeholder="e.g. 2018 - 2022" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={editingItem.description || ""} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} placeholder="Short description or grade" />
                    </div>
                    <button type="submit" className="save-btn">Update Entry</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Education;