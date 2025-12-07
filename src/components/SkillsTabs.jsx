import React, { useState, useMemo } from "react";
import axios from "axios"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaJava, FaReact, FaHtml5, FaCss3Alt, FaNodeJs, FaPython, FaDatabase, FaDocker, FaAws, FaGitAlt, FaCode,
  FaPen, FaTrash, FaTimes 
} from "react-icons/fa";
import { SiSpringboot, SiMysql, SiJavascript, SiTypescript, SiMongodb } from "react-icons/si";
import "./SkillsTabs.css";

const SkillsTabs = ({ skills, isAdmin, refreshData }) => {
  // FIX: Wrap initialization in useMemo to prevent unstable dependency warning
  // This ensures 'allSkills' doesn't create a new array reference on every render
  const allSkills = useMemo(() => skills || [], [skills]);
  
  // State for Edit Modal
  const [editingItem, setEditingItem] = useState(null);

  // 1. Get unique categories
  const categories = useMemo(() => {
    const allCats = allSkills
      .map(s => s.category || "Other")
      .filter(cat => cat !== "Programming Languages and Libraries"); 
      
    return ["All", ...new Set(allCats)];
  }, [allSkills]);

  const [activeTab, setActiveTab] = useState("All");

  // 2. Filter skills based on active tab
  const filteredSkills = useMemo(() => {
    if (activeTab === "All") return allSkills;
    return allSkills.filter(s => s.category === activeTab);
  }, [activeTab, allSkills]);

  // --- ADMIN ACTIONS ---
  const handleDelete = async (id) => {
    if (window.confirm("Delete this skill?")) {
      try {
        await axios.delete(`http://localhost:8080/api/skills/${id}`, { headers: { "Access-Key": "Rajib" } });
        refreshData();
      } catch (error) { alert("Failed to delete skill."); }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        await axios.put(`http://localhost:8080/api/skills/${editingItem.id}`, editingItem, { 
            headers: { "Access-Key": "Rajib" } 
        });
        alert("Skill Updated!");
        setEditingItem(null);
        refreshData();
    } catch (error) { alert("Failed to update skill."); }
  };

  // 3. Helper function to assign icons automatically
  const getIcon = (name) => {
    const lowerName = name ? name.toLowerCase() : "";
    
    if (lowerName.includes("java") && !lowerName.includes("script")) return <FaJava />;
    if (lowerName.includes("spring")) return <SiSpringboot />;
    if (lowerName.includes("react")) return <FaReact />;
    if (lowerName.includes("html")) return <FaHtml5 />;
    if (lowerName.includes("css")) return <FaCss3Alt />;
    if (lowerName.includes("node")) return <FaNodeJs />;
    if (lowerName.includes("python")) return <FaPython />;
    if (lowerName.includes("sql") || lowerName.includes("mysql")) return <SiMysql />;
    if (lowerName.includes("mongo")) return <SiMongodb />;
    if (lowerName.includes("data")) return <FaDatabase />;
    if (lowerName.includes("docker")) return <FaDocker />;
    if (lowerName.includes("aws")) return <FaAws />;
    if (lowerName.includes("git")) return <FaGitAlt />;
    if (lowerName.includes("javascript") || lowerName.includes("js")) return <SiJavascript />;
    if (lowerName.includes("typescript") || lowerName.includes("ts")) return <SiTypescript />;
    
    return <FaCode />;
  };

  return (
    <div className="skills-section" id="skills">
      <div className="skills-container">
        
        {/* Header */}
        <div className="skills-header">
          <h2>My Expertise</h2>
          <h1>Skills</h1>
        </div>

        {/* Categories / Tabs */}
        <div className="tabs-container">
          {categories.map((cat, index) => (
            <button 
              key={index} 
              className={`tab-btn ${activeTab === cat ? "active" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid with Animation */}
        <motion.div 
            className="skills-grid"
            layout 
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: "20px",
                justifyContent: "center"
            }}
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.length > 0 ? (
                filteredSkills.map((skill) => (
                    <motion.div 
                        key={skill.id}
                        className="skill-card"
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px 10px",
                            minHeight: "140px",
                            background: "var(--bg-card)",
                            borderRadius: "15px",
                            border: "1px solid var(--border-color)",
                            boxShadow: "0 5px 15px var(--shadow)",
                            position: "relative" 
                        }}
                    >
                        {/* --- ADMIN CONTROLS --- */}
                        {isAdmin && (
                            <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px', zIndex: 10 }}>
                                <FaPen size={12} style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setEditingItem(skill)} />
                                <FaTrash size={12} style={{ cursor: 'pointer', color: '#e74c3c' }} onClick={() => handleDelete(skill.id)} />
                            </div>
                        )}

                        <div className="icon-wrapper" style={{ fontSize: "2.5rem", marginBottom: "10px", color: "var(--text-secondary)" }}>
                            {getIcon(skill.skillName)}
                        </div>
                        <div className="skill-name" style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)" }}>
                            {skill.skillName}
                        </div>
                        <div className="skill-category-tag" style={{ fontSize: "0.7rem", marginTop: "5px", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                            {skill.category}
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="no-skills" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px", color: "var(--text-secondary)" }}>
                    No skills found in this category.
                </div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* --- EDIT MODAL --- */}
      {editingItem && (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <FaTimes onClick={() => setEditingItem(null)} style={closeIconStyle}/>
                <h3 style={{color: '#333'}}>Edit Skill</h3>
                <form onSubmit={handleUpdate} style={formStyle}>
                    <input 
                        value={editingItem.skillName || ""} 
                        onChange={(e) => setEditingItem({...editingItem, skillName: e.target.value})} 
                        placeholder="Skill Name" style={inputStyle} 
                    />
                    <input 
                        value={editingItem.category || ""} 
                        onChange={(e) => setEditingItem({...editingItem, category: e.target.value})} 
                        placeholder="Category" style={inputStyle} 
                    />
                    <button type="submit" style={buttonStyle}>Update</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

// --- Modal Styles ---
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalContentStyle = { background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px', position: 'relative', color: '#333' };
const closeIconStyle = { position: 'absolute', right: '15px', top: '15px', cursor: 'pointer', color: '#555' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' };
const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', background: '#f9f9fa', color: '#333', fontSize: '0.95rem' };
const buttonStyle = { padding: '10px', background: '#6c63ff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default SkillsTabs;