import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";
import "./Contact.css";

const Contact = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("");
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      // Simulate success
      setTimeout(() => {
         setStatus("success");
         setFormData({ name: "", email: "", message: "" });
         setTimeout(() => setStatus(""), 3000); // Clear success msg
      }, 1500);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-header">
        <h2 className="section-title">Let's Connect</h2>
        <div className="title-underline"></div>
        <p className="contact-subtitle">Have a project in mind? Let's build something extraordinary.</p>
      </div>
      
      <div className="contact-container">
        {/* Background Decorative Glow */}
        <div className="contact-glow"></div>

        <motion.div 
            className="contact-glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} className="contact-form">
            
            {/* Name Input */}
            <div className={`form-group ${focused === 'name' ? 'focused' : ''}`}>
              <label>
                <FaUser className="input-icon" /> Name
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email Input */}
            <div className={`form-group ${focused === 'email' ? 'focused' : ''}`}>
              <label>
                <FaEnvelope className="input-icon" /> Email
              </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Message Input */}
            <div className={`form-group ${focused === 'message' ? 'focused' : ''}`}>
              <label>
                <FaCommentDots className="input-icon" /> Message
              </label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                placeholder="Tell me about your project..."
                rows="5"
                required
              ></textarea>
            </div>

            <button type="submit" className="contact-btn">
              {status === "Sending..." ? "Sending..." : (
                  <>Send Message <FaPaperPlane /></>
              )}
            </button>

            {status === "success" && (
                <div className="status-msg success">Message sent successfully!</div>
            )}
            {status === "error" && (
                <div className="status-msg error">Failed to send. Please try again.</div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;