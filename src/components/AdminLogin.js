import React, { useState } from "react";
import { FaUserShield, FaTimes } from "react-icons/fa";

const AdminLogin = ({ isAdmin, setIsAdmin }) => {
  const [showModal, setShowModal] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (keyInput === "rajib") {
      setIsAdmin(true);
      setShowModal(false);
      setError("");
      alert("Welcome Admin Rajib! You can now edit/delete items.");
    } else {
      setError("Access Denied: Wrong Key");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    alert("Logged out.");
  };

  return (
    <>
      {/* Static Bottom Button (Appears below Footer) */}
      <div 
        onClick={() => isAdmin ? handleLogout() : setShowModal(true)}
        style={{
          // Layout
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: 'fit-content',
          margin: '40px auto 30px', // Spacing from Footer and bottom edge
          
          // Visuals
          background: isAdmin ? '#ef4444' : 'var(--bg-card)', 
          color: isAdmin ? 'white' : 'var(--text-secondary)',
          border: '1px solid var(--border-color)',
          padding: '8px 20px',       
          borderRadius: '30px', // Pill shape
          
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '0.85rem',
          fontWeight: '500',
          opacity: 0.7 // Subtle by default
        }}
        onMouseOver={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.borderColor = 'var(--primary)';
            if(!isAdmin) e.currentTarget.style.color = 'var(--primary)';
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.borderColor = 'var(--border-color)';
            if(!isAdmin) e.currentTarget.style.color = 'var(--text-secondary)';
        }}
        title={isAdmin ? "Logout" : "Admin Access"}
      >
        <FaUserShield size={16} />
        <span>{isAdmin ? "Admin Active" : "Admin Login"}</span>
      </div>

      {/* Login Modal (Remains Fixed Centered) */}
      {showModal && !isAdmin && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          zIndex: 2001, display: 'flex', 
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--bg-card)', 
            padding: '30px', 
            borderRadius: '20px',
            width: '320px', 
            textAlign: 'center', 
            position: 'relative',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)'
          }}>
            <FaTimes 
                onClick={() => setShowModal(false)}
                style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', color: 'var(--text-secondary)' }}
            />
            
            <h3 style={{ margin: '0 0 20px 0', color: 'var(--text-main)' }}>Admin Access</h3>
            
            <input 
              type="password" 
              placeholder="Enter Access Key" 
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              style={{ 
                  width: '100%', 
                  padding: '12px', 
                  marginBottom: '15px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: '1rem'
              }}
            />
            
            {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '15px' }}>{error}</p>}
            
            <button 
              onClick={handleLogin}
              style={{
                background: 'var(--primary)', 
                color: 'white', 
                border: 'none',
                padding: '12px', 
                borderRadius: '10px', 
                cursor: 'pointer', 
                width: '100%',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 15px var(--primary-glow)'
              }}
            >
              Unlock Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLogin;