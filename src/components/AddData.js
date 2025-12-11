import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const AddData = ({ isAdmin, refreshData }) => {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("project");
    
    const [existingItems, setExistingItems] = useState([]);
    
    // State management for form data
    const [formData, setFormData] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);

    // --- FETCH DATA WHEN TAB CHANGES ---
    useEffect(() => {
        if (!showModal) return;

        // Clear form when switching tabs (except for profile, which fetches data)
        setFormData({});
        setEditingId(null);

        if (activeTab === "skill") {
            fetchItems("skills");
        } else if (activeTab === "edu") {
            fetchItems("education");
        } else if (activeTab === "profile") {
            fetchProfile(); 
        }
    }, [showModal, activeTab]);

    // Fetch Generic Lists (Skills, Edu)
    const fetchItems = async (type) => {
        try {
            const res = await axios.get(`https://rajib-portfolio-api.onrender.com/api/${type}`);
            setExistingItems(res.data);
        } catch (err) { console.error(`Error fetching ${type}:`, err); }
    };

    // Fetch Profile Data (Home & About Section)
    const fetchProfile = async () => {
        try {
            const res = await axios.get("https://rajib-portfolio-api.onrender.com/api/profile");
            // Pre-fill the form with existing database data
            if (res.data) {
                setFormData(res.data);
            }
        } catch (err) { console.error("Error fetching profile:", err); }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- FILE UPLOAD HANDLER ---
    const handleFileChange = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append("file", file);
        setUploading(true);
        try {
            const res = await axios.post("https://rajib-portfolio-api.onrender.com/api/upload", uploadData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setFormData(prev => ({ ...prev, [fieldName]: res.data }));
        } catch (err) { alert("Upload failed"); } 
        finally { setUploading(false); }
    };

    // --- EDIT PREP (For Lists) ---
    const handleEdit = (item) => {
        setFormData(item);
        setEditingId(item.id);
    };

    // --- DELETE (Generic) ---
    const handleDelete = async (id, type) => {
        // FIX: Ensure correct endpoint for delete as well
        const typeMap = {
            skill: "skills",
            edu: "education"
        };
        const endpoint = typeMap[type] || type;

        if(!window.confirm(`Delete this item?`)) return;
        try {
            await axios.delete(`https://rajib-portfolio-api.onrender.com/api/${endpoint}/${id}`, { headers: { "Access-Key": "Rajib" } });
            fetchItems(endpoint); 
            refreshData(); 
        } catch (err) { alert(`Delete failed.`); }
    };

    // --- FORM SUBMISSION ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const headers = { "Access-Key": "Rajib" };
        let url = "https://rajib-portfolio-api.onrender.com/api";
        let success = false;

        // FIX: Map activeTab to the correct Backend API Endpoint
        const endpointMap = {
            profile: "profile",
            project: "projects",
            skill: "skills",
            edu: "education",
            cert: "certificates",
            exp: "experience"
        };

        const endpointType = endpointMap[activeTab];

        try {
            let endpoint = `${url}/${endpointType}`;
            let method = axios.post;

            if (activeTab === "profile") {
                // Profile is always an UPDATE to ID 1
                await axios.put(`${url}/profile/1`, formData, { headers }); 
            } else if (editingId) {
                // UPDATE (Skill, Edu)
                endpoint = `${url}/${endpointType}/${editingId}`;
                method = axios.put;
                await method(endpoint, formData, { headers });
            } else {
                // CREATE (Project, Cert, Exp, Edu, Skill)
                await method(endpoint, formData, { headers });
            }
            success = true;
        } catch (error) {
            console.error("API Submission Failed:", error);
            alert(`Error saving data. Check console.`);
        }
        
        if (success) {
            alert(editingId || activeTab === "profile" ? "Updated Successfully!" : "Added Successfully!");
            
            // Only clear form if NOT profile
            if (activeTab !== "profile") {
                setFormData({});
                setEditingId(null);
            }
            
            // Refresh lists inside modal
            if (activeTab === "skill") fetchItems("skills");
            if (activeTab === "edu") fetchItems("education");
            
            // Close modal for simple additions
            if (activeTab === "project" || activeTab === "cert" || activeTab === "exp") {
                setShowModal(false);
            }
            
            refreshData(); 
        }
    };

    if (!isAdmin) return null; 

    return (
        <>
            <div 
                onClick={() => setShowModal(true)}
                style={addButtonStyle}
                title="Add / Edit Data"
            >
                <FaPlus size={24} />
            </div>

            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <FaTimes onClick={() => setShowModal(false)} style={closeIcon}/>
                        
                        <h3 style={{color: '#333', marginTop: 0}}>{editingId || activeTab === "profile" ? "Edit / Update" : "Add New Item"}</h3>
                        
                        <div style={{ display:'flex', gap:'5px', marginBottom:'20px', flexWrap: 'wrap' }}>
                            {["profile", "skill", "edu", "project", "cert", "exp"].map(tab => (
                                <TabButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </TabButton>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                            
                            {/* --- PROFILE TAB (Home & About) --- */}
                            {activeTab === "profile" && (
                                <>
                                    <SectionHeader>Home Section</SectionHeader>
                                    <StyledInput name="fullName" value={formData.fullName || ""} placeholder="Full Name" onChange={handleChange} />
                                    <StyledInput name="title" value={formData.title || ""} placeholder="Job Title" onChange={handleChange} />
                                    <StyledTextArea name="summary" value={formData.summary || ""} placeholder="Hero Section Summary (Short Bio)" onChange={handleChange} style={{height:'60px'}}/>
                                    
                                    <label style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#555'}}>Hero Image:</label>
                                    <input type="file" onChange={(e) => handleFileChange(e, "photoUrl")} />
                                    <StyledInput name="photoUrl" value={formData.photoUrl || ""} readOnly placeholder="Image URL (Hero)" style={{background: '#eee', fontSize:'0.8rem'}} />

                                    <SectionHeader>About Section</SectionHeader>
                                    <StyledTextArea name="aboutContent" value={formData.aboutContent || ""} placeholder="About Me Content (Long Description)" onChange={handleChange} style={{height:'100px'}}/>
                                    
                                    <label style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#555'}}>About Image:</label>
                                    <input type="file" onChange={(e) => handleFileChange(e, "aboutPhotoUrl")} />
                                    <StyledInput name="aboutPhotoUrl" value={formData.aboutPhotoUrl || ""} readOnly placeholder="Image URL (About)" style={{background: '#eee', fontSize:'0.8rem'}} />

                                    <SectionHeader>Social Links</SectionHeader>
                                    <StyledInput name="email" value={formData.email || ""} placeholder="Email" onChange={handleChange} />
                                    <StyledInput name="linkedinLink" value={formData.linkedinLink || ""} placeholder="LinkedIn URL" onChange={handleChange} />
                                    <StyledInput name="githubLink" value={formData.githubLink || ""} placeholder="GitHub URL" onChange={handleChange} />
                                    <StyledInput name="cvLink" value={formData.cvLink || ""} placeholder="CV Download Link" onChange={handleChange} />
                                </>
                            )}

                            {/* --- SKILL TAB --- */}
                            {activeTab === "skill" && (
                                <>
                                    <StyledInput name="skillName" value={formData.skillName || ""} placeholder="Skill Name (e.g. Java)" onChange={handleChange} required />
                                    <StyledInput name="category" value={formData.category || ""} placeholder="Category (e.g. Languages)" onChange={handleChange} required />
                                </>
                            )}

                            {/* --- EDUCATION TAB --- */}
                            {activeTab === "edu" && (
                                <>
                                    <StyledInput name="degree" value={formData.degree || ""} placeholder="Degree (e.g. MCA)" onChange={handleChange} required />
                                    <StyledInput name="university" value={formData.university || ""} placeholder="University/College" onChange={handleChange} required />
                                    <StyledInput name="yearRange" value={formData.yearRange || ""} placeholder="Year (e.g. 2023-2025)" onChange={handleChange} required />
                                    <StyledTextArea name="description" value={formData.description || ""} placeholder="Short Description (Optional)" onChange={handleChange} />
                                </>
                            )}
                            
                            {/* --- PROJECT TAB (Updated) --- */}
                            {activeTab === "project" && (
                                <>
                                    <StyledInput name="projectName" value={formData.projectName || ""} placeholder="Project Name" onChange={handleChange} required />
                                    <StyledTextArea name="description" value={formData.description || ""} placeholder="Description" onChange={handleChange} required />
                                    <StyledInput name="techStack" value={formData.techStack || ""} placeholder="Tech Stack (comma separated)" onChange={handleChange} required />
                                    <StyledInput name="projectLink" value={formData.projectLink || ""} placeholder="Live Demo URL" onChange={handleChange} />
                                    <StyledInput name="repoLink" value={formData.repoLink || ""} placeholder="GitHub Repo URL" onChange={handleChange} />
                                    
                                    {/* --- NEW CREDENTIALS FIELD --- */}
                                    <label style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#555', marginTop: '5px'}}>
                                        Project Credentials (Optional):
                                    </label>
                                    <StyledTextArea 
                                        name="projectCredentials" 
                                        value={formData.projectCredentials || ""} 
                                        placeholder="e.g. Admin ID: admin@test.com | Pass: 12345" 
                                        onChange={handleChange} 
                                        style={{height: '60px', background: '#fffbeb', borderColor: '#f1c40f'}}
                                    />
                                </>
                            )}

                            {/* --- CERTIFICATE TAB --- */}
                            {activeTab === "cert" && (
                                <>
                                    <StyledInput name="certName" value={formData.certName || ""} placeholder="Certificate Name" onChange={handleChange} required />
                                    <StyledInput name="issuer" value={formData.issuer || ""} placeholder="Issuer" onChange={handleChange} required />
                                    <StyledInput name="issueDate" value={formData.issueDate || ""} placeholder="Date" onChange={handleChange} required />
                                    <StyledInput name="link" value={formData.link || ""} placeholder="Credential Link" onChange={handleChange} />
                                </>
                            )}
                            
                            {/* --- EXPERIENCE TAB --- */}
                            {activeTab === "exp" && (
                                <>
                                    <StyledInput name="role" value={formData.role || ""} placeholder="Role" onChange={handleChange} required />
                                    <StyledInput name="company" value={formData.company || ""} placeholder="Company Name" onChange={handleChange} required />
                                    <StyledInput name="duration" value={formData.duration || ""} placeholder="Duration" onChange={handleChange} required />
                                    <StyledTextArea name="description" value={formData.description || ""} placeholder="Description" onChange={handleChange} required />
                                </>
                            )}

                            <button type="submit" style={submitBtnStyle} disabled={uploading}>
                                {uploading ? "Uploading..." : (editingId || activeTab === "profile" ? "Update" : "Save")}
                            </button>
                            
                            {editingId && (
                                <button type="button" onClick={() => { setEditingId(null); setFormData({}); }} style={{ padding:'5px', background:'#95a5a6', color:'white', border:'none', borderRadius: '5px', cursor: 'pointer' }}>
                                    Cancel Edit
                                </button>
                            )}
                        </form>

                        {/* --- MANAGER LISTS --- */}
                        {(activeTab === "skill" || activeTab === "edu") && (
                            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                <h4 style={{color: '#333'}}>Existing {activeTab === "skill" ? "Skills" : "Education"}</h4>
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {existingItems.map(item => (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #f0f0f0', color: '#333' }}>
                                            <span>
                                                <b>{item.degree || item.skillName}</b> 
                                                {activeTab === "edu" && ` (${item.university || item.yearRange})`}
                                                {activeTab === "skill" && ` - ${item.category}`}
                                            </span>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <FaEdit color="orange" style={{ cursor: 'pointer' }} onClick={() => handleEdit(item)} />
                                                <FaTrash color="red" style={{ cursor: 'pointer' }} onClick={() => handleDelete(item.id, activeTab)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </>
    );
};

// Styles
const addButtonStyle = { position: 'fixed', bottom: '80px', right: '20px', background: '#00b894', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 1000 };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalContent = { background: 'white', padding: '30px', borderRadius: '10px', width: '500px', position:'relative', maxHeight: '90vh', overflowY: 'auto' };
const closeIcon = { position:'absolute', right:'15px', top:'15px', cursor:'pointer', color: '#333'};
const submitBtnStyle = { marginTop:'10px', padding:'10px', background: '#6c63ff', color:'white', border:'none', borderRadius: '5px', cursor: 'pointer' };

const TabButton = ({ active, children, onClick }) => (
    <button type="button" onClick={onClick} disabled={active} style={{ padding: '6px 12px', background: active ? '#6c63ff' : '#f0f0f0', color: active ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: active ? 'default' : 'pointer', fontSize: '0.85rem' }}>{children}</button>
);
const StyledInput = (props) => ( <input {...props} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '0.9rem', color: '#333', ...props.style }} /> );
const StyledTextArea = (props) => ( <textarea {...props} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '0.9rem', color: '#333', resize: 'vertical', ...props.style }} /> );
const SectionHeader = ({ children }) => ( <h4 style={{ margin: '15px 0 5px 0', borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#555' }}>{children}</h4> );

export default AddData;