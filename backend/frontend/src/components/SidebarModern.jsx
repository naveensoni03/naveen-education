import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const SidebarModern = () => {
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) => ({
    padding: "12px 16px",
    borderRadius: "14px",
    color: isActive ? "#4f46e5" : "#64748b",
    textDecoration: "none",
    background: isActive ? "linear-gradient(145deg, #ffffff, #f5f3ff)" : "transparent",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px", 
    fontSize: "0.95rem",
    fontWeight: isActive ? "700" : "500",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: isActive ? "0 10px 20px -5px rgba(79, 70, 229, 0.15), inset 0 0 0 1px rgba(79, 70, 229, 0.1)" : "none",
  });

  const handleLogout = () => {
    // ✅ Clear all security data
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.clear();
    // ✅ Redirect to login
    navigate("/login");
  };

  return (
    <aside style={{ 
      width: "280px", background: "#ffffff", height: "100vh", position: "fixed", 
      left: 0, top: 0, display: "flex", flexDirection: "column", padding: "35px 25px",
      borderRight: "1px solid #f1f5f9", zIndex: 1000, overflowY: "auto"
    }}>
      <div style={{ marginBottom: "40px", display: 'flex', alignItems: 'center', gap: '15px' }}>
         <div style={{ 
           width: '42px', height: '42px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', 
           borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
           boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)'
         }}>
           <span style={{color:'white', fontWeight: '900', fontSize: '1.4rem'}}>S</span>
         </div>
         <h2 style={{ color: "#0f172a", fontSize: "1.6rem", fontWeight: "900", letterSpacing: "-1px" }}>SHIVADDA</h2>
      </div>

      <nav style={{ flex: 1 }}>
        <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1.5px', paddingLeft: '8px' }}>Admin Engine</p>
        <NavLink to="/dashboard" style={linkStyle}>📊 Dashboard</NavLink>
        <NavLink to="/institutions" style={linkStyle}>🏢 Institutions</NavLink>
        <NavLink to="/teachers" style={linkStyle}>👨‍🏫 Teachers</NavLink>
        <NavLink to="/students" style={linkStyle}>🎓 Student Base</NavLink>
        <NavLink to="/enrollments" style={linkStyle}>📋 Enrollments</NavLink>
        <NavLink to="/courses" style={linkStyle}>📚 Course Manager</NavLink>

        <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '15px', marginTop: '30px', letterSpacing: '1.5px', paddingLeft: '8px' }}>Academic Hub</p>
        <NavLink to="/attendance" style={linkStyle}>📅 Attendance</NavLink>
        <NavLink to="/homework" style={linkStyle}>📝 Homework</NavLink>
        <NavLink to="/exams" style={linkStyle}>📝 Online Exams</NavLink>

        <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '15px', marginTop: '30px', letterSpacing: '1.5px', paddingLeft: '8px' }}>Finance Room</p>
        <NavLink to="/fees" style={linkStyle}>💰 Fees Ledger</NavLink>

        <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '15px', marginTop: '30px', letterSpacing: '1.5px', paddingLeft: '8px' }}>Resources</p>
        <NavLink to="/library" style={linkStyle}>📚 Digital Library</NavLink>
        <NavLink to="/transport" style={linkStyle}>🚌 Transport Fleet</NavLink>
        <NavLink to="/hostel" style={linkStyle}>🛏️ Hostel & Mess</NavLink>
        <NavLink to="/inventory" style={linkStyle}>📦 Inventory Control</NavLink>

        <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '15px', marginTop: '30px', letterSpacing: '1.5px', paddingLeft: '8px' }}>Control Room</p>
        <NavLink to="/system" style={linkStyle}>⚙️ System Config</NavLink>
      </nav>

      {/* ✅ Corrected Logout Button */}
      <div 
        onClick={handleLogout} 
        style={{ 
          color: "#ef4444", cursor: "pointer", padding: "16px", borderRadius: "16px", 
          display: "flex", alignItems: "center", gap: "12px", fontWeight: "700",
          background: "#fff1f2", border: "1px solid #fee2e2", marginTop: '30px'
        }}
      >
        🛰️ Terminate Session
      </div>
    </aside>
  );
};

export default SidebarModern;