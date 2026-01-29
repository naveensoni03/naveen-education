import React, { useEffect, useState } from "react";
import SidebarModern from "../components/SidebarModern";
import api from "../api/axios";
import "./dashboard.css";
import toast, { Toaster } from 'react-hot-toast'; 

export default function Institutions() {
  const [institutions, setInstitutions] = useState([]);
  
  // Modals State
  const [showRegModal, setShowRegModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Data State
  const [selectedInst, setSelectedInst] = useState(null);
  
  // ✅ Full Form State
  const [formData, setFormData] = useState({
      name: "", code: "", type: "School", affiliation: "", affiliation_number: "",
      principal_name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", website: ""
  });

  const loadData = () => {
    api.get("/institutions/")
       .then((res) => {
           const data = Array.isArray(res.data) ? res.data : (res.data.institutions || []);
           setInstitutions(data);
       })
       .catch(err => { console.error(err); setInstitutions([]); });
  };

  useEffect(() => { loadData(); }, []);

  // Handlers
  const handleRegister = async (e) => {
    e.preventDefault();
    if(!formData.name.trim() || !formData.code.trim()) return toast.error("Name & Code required");

    try {
      await api.post("/institutions/", formData);
      setShowRegModal(false);
      setFormData({ name: "", code: "", type: "School", affiliation: "", affiliation_number: "", principal_name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", website: "" }); 
      loadData();
      toast.success("Institution Registered!");
    } catch (err) { toast.error("Registration Failed."); }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/institutions/${selectedInst.id}/`);
      setShowDeleteModal(false);
      loadData();
      toast.success("Deleted Successfully");
    } catch (err) { toast.error("Delete Failed"); }
  };

  const openView = (inst) => { setSelectedInst(inst); setShowViewModal(true); };
  const openDelete = (inst) => { setSelectedInst(inst); setShowDeleteModal(true); };
  const handleInput = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  return (
    <div className="dashboard-container" style={{background: '#f8fafc', height: '100vh', display: 'flex', overflow: 'hidden'}}>
      <SidebarModern />
      <Toaster position="top-center" />
      
      <div className="main-content" style={{flex: 1, padding: '40px', overflowY: 'auto'}}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#0f172a' }}>Institutions Directory</h1>
            <p style={{color: '#64748b', marginTop: '5px'}}>Manage registered schools, colleges & coaching centers</p>
          </div>
          <button className="btn-confirm-gradient hover-lift" onClick={() => setShowRegModal(true)}>+ Register Institution</button>
        </header>

        <div className="glass-card fade-in-up" style={{background: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}>
          <div className="table-ui">
            <table className="modern-table" style={{width: '100%'}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left', padding:'15px', color:'#94a3b8'}}>CODE</th>
                  <th style={{textAlign:'left', padding:'15px', color:'#94a3b8'}}>INSTITUTE DETAILS</th>
                  <th style={{textAlign:'left', padding:'15px', color:'#94a3b8'}}>CONTACT</th>
                  <th style={{textAlign:'left', padding:'15px', color:'#94a3b8'}}>LOCATION</th>
                  <th style={{textAlign:'right', padding:'15px', color:'#94a3b8'}}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {institutions.length === 0 ? (
                    <tr><td colSpan="5" style={{textAlign:'center', padding:'40px', color:'#94a3b8'}}>No institutions found. Add one to start.</td></tr>
                ) : institutions.map((inst) => (
                  <tr key={inst.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td style={{padding:'15px'}}><b style={{color: '#6366f1'}}>#{inst.code}</b></td>
                    <td style={{padding:'15px'}}>
                        <div style={{fontWeight: '700', color:'#1e293b'}}>{inst.name}</div>
                        <div style={{fontSize:'0.75rem', color:'#64748b'}}>{inst.type} • {inst.affiliation || 'N/A'}</div>
                    </td>
                    <td style={{padding:'15px', fontSize:'0.85rem', color:'#475569'}}>
                        <div>📞 {inst.phone || '-'}</div>
                        <div>✉️ {inst.email || '-'}</div>
                    </td>
                    <td style={{padding:'15px', color:'#475569'}}>{inst.city}, {inst.state}</td>
                    <td style={{textAlign:'right', padding:'15px'}}>
                      <button className="icon-btn" style={{color:'#3b82f6', background:'#eff6ff', marginRight:'10px', padding:'8px 12px', border:'none', borderRadius:'8px', cursor:'pointer'}} onClick={() => openView(inst)}>👁️</button>
                      <button className="icon-btn" style={{color:'#ef4444', background:'#fef2f2', padding:'8px 12px', border:'none', borderRadius:'8px', cursor:'pointer'}} onClick={() => openDelete(inst)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- REGISTER MODAL --- */}
      {showRegModal && (
        <div className="overlay-blur centered-flex" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', justifyContent:'center', alignItems:'center'}}>
          <div className="glass-card zoom-in" style={{background:'white', padding:'30px', borderRadius:'24px', width:'600px', maxHeight:'90vh', overflowY:'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'}}>
            <h2 style={{marginTop:0, color:'#0f172a', marginBottom:'20px', borderBottom:'1px solid #f1f5f9', paddingBottom:'15px'}}>Register New Institution</h2>
            
            <form onSubmit={handleRegister}>
              {/* SECTION 1: BASIC INFO */}
              <h4 style={{color:'#6366f1', margin:'0 0 10px', fontSize:'0.9rem', textTransform:'uppercase', letterSpacing:'0.5px'}}>1. Basic Information</h4>
              <div style={{display:'flex', gap:'15px', marginBottom:'15px'}}>
                  <div style={{flex:2}}>
                      <label className="form-label">Institute Name *</label>
                      <input type="text" name="name" className="modern-input" value={formData.name} onChange={handleInput} required placeholder="e.g. Delhi Public School" />
                  </div>
                  <div style={{flex:1}}>
                      <label className="form-label">Code (Unique) *</label>
                      <input type="text" name="code" className="modern-input" placeholder="SCH-001" value={formData.code} onChange={handleInput} required />
                  </div>
              </div>

              <div style={{display:'flex', gap:'15px', marginBottom:'20px'}}>
                  <div style={{flex:1}}>
                      <label className="form-label">Type</label>
                      <select name="type" className="modern-input" value={formData.type} onChange={handleInput}>
                          <option>School</option><option>College</option><option>Coaching</option><option>University</option>
                      </select>
                  </div>
                  <div style={{flex:1}}>
                      <label className="form-label">Affiliation Board</label>
                      <input type="text" name="affiliation" className="modern-input" placeholder="CBSE/ICSE" value={formData.affiliation} onChange={handleInput} />
                  </div>
                  <div style={{flex:1}}>
                      <label className="form-label">Affiliation No</label>
                      <input type="text" name="affiliation_number" className="modern-input" placeholder="Optional" value={formData.affiliation_number} onChange={handleInput} />
                  </div>
              </div>

              {/* SECTION 2: CONTACT & HEAD */}
              <h4 style={{color:'#6366f1', margin:'0 0 10px', fontSize:'0.9rem', textTransform:'uppercase', letterSpacing:'0.5px'}}>2. Contact Details</h4>
              <div style={{display:'flex', gap:'15px', marginBottom:'15px'}}>
                  <div style={{flex:1}}>
                      <label className="form-label">Principal Name</label>
                      <input type="text" name="principal_name" className="modern-input" placeholder="Dr. A. Sharma" value={formData.principal_name} onChange={handleInput} />
                  </div>
                  <div style={{flex:1}}>
                      <label className="form-label">Official Email</label>
                      <input type="email" name="email" className="modern-input" placeholder="admin@school.com" value={formData.email} onChange={handleInput} />
                  </div>
                  <div style={{flex:1}}>
                      <label className="form-label">Phone</label>
                      <input type="text" name="phone" className="modern-input" placeholder="+91 98765..." value={formData.phone} onChange={handleInput} />
                  </div>
              </div>

              <div style={{marginBottom:'20px'}}>
                  <label className="form-label">Website URL</label>
                  <input type="text" name="website" className="modern-input" placeholder="https://www.school.com" value={formData.website} onChange={handleInput} />
              </div>

              {/* SECTION 3: ADDRESS */}
              <h4 style={{color:'#6366f1', margin:'0 0 10px', fontSize:'0.9rem', textTransform:'uppercase', letterSpacing:'0.5px'}}>3. Location</h4>
              <div style={{marginBottom:'15px'}}>
                  <label className="form-label">Full Address</label>
                  <textarea name="address" className="modern-input" rows="2" placeholder="Street, Area, Landmark..." value={formData.address} onChange={handleInput}></textarea>
              </div>
              <div style={{display:'flex', gap:'15px', marginBottom:'25px'}}>
                  <div style={{flex:1}}><input type="text" name="city" className="modern-input" placeholder="City" value={formData.city} onChange={handleInput} /></div>
                  <div style={{flex:1}}><input type="text" name="state" className="modern-input" placeholder="State" value={formData.state} onChange={handleInput} /></div>
                  <div style={{flex:1}}><input type="text" name="pincode" className="modern-input" placeholder="Pincode" value={formData.pincode} onChange={handleInput} /></div>
              </div>

              <div style={{display:'flex', gap:'10px', justifyContent:'flex-end', borderTop:'1px solid #f1f5f9', paddingTop:'20px'}}>
                <button type="button" style={{padding:'12px 20px', border:'1px solid #cbd5e1', background:'transparent', borderRadius:'10px', cursor:'pointer', color:'#64748b', fontWeight:'600'}} onClick={() => setShowRegModal(false)}>Cancel</button>
                <button type="submit" className="btn-confirm-gradient" style={{padding:'12px 30px', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'700'}}>Register Institution</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW MODAL --- */}
      {showViewModal && selectedInst && (
        <div className="overlay-blur centered-flex" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', justifyContent:'center', alignItems:'center'}}>
          <div className="glass-card zoom-in" style={{background:'white', padding:'30px', borderRadius:'24px', width:'500px'}}>
            <div style={{textAlign:'center', marginBottom:'20px'}}>
                <div style={{width:'70px', height:'70px', background:'#e0e7ff', color:'#4f46e5', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', fontWeight:'bold', margin:'0 auto 15px'}}>
                    {selectedInst.name.charAt(0)}
                </div>
                <h2 style={{margin:0, color:'#0f172a'}}>{selectedInst.name}</h2>
                <p style={{color:'#64748b', margin:'5px 0 0'}}>{selectedInst.address}, {selectedInst.city}</p>
            </div>
            <button style={{width: '100%', padding:'14px', background:'#0f172a', color:'white', border:'none', borderRadius:'12px', cursor:'pointer', fontWeight:'700'}} onClick={() => setShowViewModal(false)}>Close Details</button>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {showDeleteModal && (
        <div className="overlay-blur centered-flex" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', justifyContent:'center', alignItems:'center'}}>
          <div className="glass-card zoom-in" style={{background:'white', padding:'30px', borderRadius:'24px', width:'400px', textAlign:'center'}}>
            <div style={{fontSize:'3rem', marginBottom:'10px'}}>⚠️</div>
            <h2 style={{margin:0, color:'#0f172a'}}>Are you sure?</h2>
            <p style={{color:'#64748b'}}>Deleting <b>{selectedInst?.name}</b> is permanent.</p>
            <div style={{display:'flex', gap:'10px', justifyContent:'center', marginTop:'20px'}}>
              <button style={{padding:'10px 20px', border:'1px solid #cbd5e1', background:'transparent', borderRadius:'10px', cursor:'pointer'}} onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button style={{padding:'10px 20px', background:'#ef4444', color:'white', border:'none', borderRadius:'10px', cursor:'pointer'}} onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
      
      {/* ✅ UPDATED STYLES FOR VISIBILITY */}
      <style>{`
        .btn-confirm-gradient { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); }
        .btn-confirm-gradient:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2); }
        
        /* ✅ Input Styling: Black Text on White Bg with Border */
        .modern-input { 
            width: 100%; 
            padding: 12px; 
            border-radius: 10px; 
            border: 1px solid #cbd5e1; 
            font-size: 0.9rem; 
            outline: none; 
            transition: 0.2s; 
            color: #1e293b; /* Dark Text */
            background: #ffffff; /* White Bg */
            font-weight: 500;
        }
        .modern-input::placeholder { color: #94a3b8; } /* Lighter Placeholder */
        .modern-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
        
        .form-label { display: block; font-size: 0.8rem; font-weight: 700; color: #475569; margin-bottom: 5px; }
        .zoom-in { animation: zoomIn 0.3s ease-out; }
        @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .fade-in-up { animation: fadeInUp 0.5s ease-out; }
        @keyframes fadeInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}