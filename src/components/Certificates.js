import React, { useState } from "react";
import { FaTrash, FaPen, FaTimes, FaLink, FaAward, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import axios from "axios";
import "./Certificates.css"; // Importing new styles

// --- HARDCODED DATA ARRAY ---
const hardcodedCertificates = [
  { id: 'hc-software-eng', certName: 'Software Engineering', issuer: 'NPTEL India', issueDate: '2024-03', link: 'https://drive.google.com/file/d/1c2sjoTKgw4l7O2x4KrBHPJOPSG8Rp-ST/view?usp=sharing' },
  { id: 'hc-ai-blockchain', certName: 'AI-Powered Blockchain', issuer: 'FITT India', issueDate: '2024-06', link: 'https://drive.google.com/file/d/1ghBH95t8JY6ZhX8YNTQWOw9kEkmFb7JK/view?usp=sharing' },
  { id: 'hc-internship', certName: 'Internship Completion', issuer: 'VichaarLab PVT Ltd.', issueDate: '2023-12', link: 'https://drive.google.com/file/d/1BvjsFk-cEd3ZUrYv5PoxDrVSdqDrWX49/view?usp=sharing' },
];

const Certificates = ({ certificates, isAdmin, refreshData }) => {
  const [editingItem, setEditingItem] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this certificate?")) {
      try {
        await axios.delete(`http://localhost:8080/api/certificates/${id}`, { headers: { "Access-Key": "Rajib" } });
        refreshData();
      } catch (error) { alert("Failed to delete."); }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...editingItem };
      await axios.put(`http://localhost:8080/api/certificates/${editingItem.id}`, payload, { headers: { "Access-Key": "Rajib" } });
      alert("Certificate Updated!");
      setEditingItem(null);
      refreshData();
    } catch (error) { alert("Failed to update."); }
  };
  
  const allCertificates = [...hardcodedCertificates, ...(certificates || [])];
  
  return (
    <div className="cert-section" id="certificates">
      <div className="cert-header">
        <h2 className="section-title">Certifications & Awards</h2>
        <div className="title-underline"></div>
      </div>
      
      <div className="cert-grid">
        {allCertificates.map((cert) => {
          const isHardcoded = typeof cert.id === 'string'; 

          return (
            <div key={cert.id} className="cert-card">
              
              {/* Decorative Glow */}
              <div className="cert-glow"></div>

              {/* Icon Section */}
              <div className="cert-icon-box">
                  <FaAward />
              </div>
              
              {/* Content Section */}
              <div className="cert-content">
                <div className="cert-top">
                    <span className="cert-date">
                        <FaCalendarAlt /> {cert.issueDate}
                    </span>
                    {cert.link && (
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link-icon" title="View Certificate">
                            <FaExternalLinkAlt />
                        </a>
                    )}
                </div>

                <h4 className="cert-title">{cert.certName}</h4>
                <p className="cert-issuer">{cert.issuer}</p>
                
                {/* View Button */}
                {cert.link && (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-view-btn">
                        View Credential <FaLink />
                    </a>
                )}
              </div>
              
              {/* Admin Overlay */}
              {isAdmin && !isHardcoded && (
                <div className="cert-admin-controls">
                    <button onClick={() => setEditingItem(cert)} className="btn-icon edit"><FaPen /></button>
                    <button onClick={() => handleDelete(cert.id)} className="btn-icon del"><FaTrash /></button>
                </div>
              )}
              
              {/* Hardcoded Badge */}
              {isAdmin && isHardcoded && ( <span className="badge-fixed">Verified</span> )}
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="modal-backdrop">
          <div className="modal-glass">
            <div className="modal-header">
              <h3>Edit Certificate</h3>
              <FaTimes onClick={() => setEditingItem(null)} className="close-icon"/>
            </div>
            <form onSubmit={handleUpdate} className="modal-form">
              <input value={editingItem.certName || ""} onChange={(e) => setEditingItem({...editingItem, certName: e.target.value})} placeholder="Certificate Name" />
              <input value={editingItem.issuer || ""} onChange={(e) => setEditingItem({...editingItem, issuer: e.target.value})} placeholder="Issuer" />
              <input value={editingItem.issueDate || ""} onChange={(e) => setEditingItem({...editingItem, issueDate: e.target.value})} placeholder="Issue Date" />
              <input value={editingItem.link || ""} onChange={(e) => setEditingItem({...editingItem, link: e.target.value})} placeholder="Link" />
              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;