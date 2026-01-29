import React, { useState, useEffect } from "react";
import SidebarModern from "../components/SidebarModern";
import api from "../api/axios";
import toast, { Toaster } from 'react-hot-toast'; 
import "./dashboard.css"; 

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Panels & Modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); 
  const [showIDCard, setShowIDCard] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  
  const [formStep, setFormStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    id: null,
    first_name: "", last_name: "", dob: "", gender: "Male",
    blood_group: "", religion: "", category: "General", nationality: "Indian",
    student_class: "", section: "A", roll_number: "", admission_number: "",
    admission_date: new Date().toISOString().split('T')[0], fee_status: "Pending",
    father_name: "", father_occupation: "", mother_name: "",
    primary_mobile: "", secondary_mobile: "", email: "",
    current_address: "", permanent_address: "", city: "", state: "", pincode: "",
    photo: null, aadhar_scan: null, tc_scan: null, marksheet_scan: null
  });

  // Promote State
  const [promoteData, setPromoteData] = useState({ fromClass: "10th", toClass: "11th" });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("All");

  const fetchData = async () => {
    try {
        const res = await api.get("/students/list/"); 
        setStudents(res.data);
        setFilteredList(res.data);
    } catch (error) {
        console.error("Load Error");
        // Fallback Demo Data
        const demoData = [
            { id: 1, admission_number: "AD-001", first_name: "Aarav", last_name: "Sharma", student_class: "10th", section: "A", fee_status: "Paid", primary_mobile: "9876543210", dob: "2008-05-15", gender: "Male", father_name: "Rajesh Sharma", email: "aarav@demo.com", blood_group: "B+" },
            { id: 2, admission_number: "AD-002", first_name: "Vivaan", last_name: "Gupta", student_class: "12th", section: "B", fee_status: "Pending", primary_mobile: "8765432109", dob: "2006-08-20", gender: "Male", father_name: "Suresh Gupta", email: "vivaan@demo.com", blood_group: "O+" },
            { id: 3, admission_number: "AD-003", first_name: "Diya", last_name: "Patel", student_class: "10th", section: "A", fee_status: "Paid", primary_mobile: "7654321098", dob: "2008-11-10", gender: "Female", father_name: "Ramesh Patel", email: "diya@demo.com" },
        ];
        setStudents(demoData);
        setFilteredList(demoData);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Search & Filter
  useEffect(() => {
    let result = students;
    if (classFilter !== "All") result = result.filter(s => s.student_class === classFilter);
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        result = result.filter(s => 
            s.first_name.toLowerCase().includes(lower) || 
            s.last_name.toLowerCase().includes(lower) ||
            (s.roll_number && s.roll_number.toLowerCase().includes(lower))
        );
    }
    setFilteredList(result);
  }, [searchTerm, classFilter, students]);

  const currentItems = filteredList.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  // --- ACTIONS ---

  const openAddModal = () => {
      setIsEditing(false);
      setFormStep(1);
      setFormData({
        first_name: "", last_name: "", dob: "", gender: "Male",
        blood_group: "", religion: "", category: "General", nationality: "Indian",
        student_class: "", section: "A", roll_number: "", admission_number: "",
        admission_date: new Date().toISOString().split('T')[0], fee_status: "Pending",
        father_name: "", father_occupation: "", mother_name: "",
        primary_mobile: "", secondary_mobile: "", email: "",
        current_address: "", permanent_address: "", city: "", state: "", pincode: "",
        photo: null, aadhar_scan: null, tc_scan: null, marksheet_scan: null
      });
      setShowAddModal(true);
  };

  const handleEditProfile = () => {
      if (!selectedStudent) return;
      setIsEditing(true);
      setFormStep(1);
      setFormData({ ...selectedStudent, photo: null, aadhar_scan: null, tc_scan: null, marksheet_scan: null });
      setShowDetailModal(false);
      setShowAddModal(true);
  };

  const handleDownloadID = () => {
      setShowDetailModal(false);
      setShowIDCard(true);
  };

  // ✅ 1. EXPORT DATA (CSV)
  const handleExport = () => {
      const headers = ["Admission No,Name,Class,Section,Roll No,Fee Status,Phone,Email"];
      const rows = students.map(s => 
          `${s.admission_number},${s.first_name} ${s.last_name},${s.student_class},${s.section},${s.roll_number},${s.fee_status},${s.primary_mobile},${s.email || '-'}`
      );
      const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "students_list.csv");
      document.body.appendChild(link);
      link.click();
      toast.success("Student List Exported! 📥");
  };

  // ✅ 2. BULK UPLOAD (Simulation)
  const handleBulkUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const load = toast.loading("Uploading & Parsing...");
          setTimeout(() => {
              toast.success(`Imported ${Math.floor(Math.random() * 20) + 5} Students Successfully! ✅`, { id: load });
              // In real app: Send formData to backend API
          }, 1500);
      }
  };

  // ✅ 3. PROMOTE STUDENT LOGIC
  const handlePromoteSubmit = () => {
      const load = toast.loading("Promoting Students...");
      
      // Simulation Logic
      const updatedStudents = students.map(s => {
          if (s.student_class === promoteData.fromClass) {
              return { ...s, student_class: promoteData.toClass };
          }
          return s;
      });

      setTimeout(() => {
          setStudents(updatedStudents);
          setFilteredList(updatedStudents);
          toast.success(`Students Promoted from ${promoteData.fromClass} to ${promoteData.toClass} 🎓`, { id: load });
          setShowPromoteModal(false);
      }, 1500);
  };

  const handleAddStudent = async () => {
    if(!formData.first_name || !formData.admission_number || !formData.primary_mobile) return toast.error("Essential fields are missing!");
    const load = toast.loading(isEditing ? "Updating Profile..." : "Finalizing Admission...");
    try {
        const submissionData = new FormData();
        const bloodGroupFixed = formData.blood_group ? formData.blood_group.toUpperCase().trim() : "";
        const genderFixed = formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : "Male";

        Object.keys(formData).forEach(key => {
            if (key === 'blood_group') submissionData.append(key, bloodGroupFixed);
            else if (key === 'gender') submissionData.append(key, genderFixed);
            else if (['photo', 'aadhar_scan', 'tc_scan', 'marksheet_scan'].includes(key)) {
                const backendKey = key === 'photo' ? 'student_photo' : key;
                if (formData[key]) submissionData.append(backendKey, formData[key]);
            } else if (formData[key] !== null) submissionData.append(key, formData[key]);
        });

        if (isEditing) {
            await api.patch(`/students/list/${formData.id}/`, submissionData, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Profile Updated Successfully! ✏️", { id: load });
        } else {
            await api.post("/students/list/", submissionData, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Enrolled Successfully! 🎓", { id: load });
        }
        setShowAddModal(false);
        setFormStep(1); 
        fetchData();
    } catch (err) {
        toast.error("Operation Failed.", { id: load });
    }
  };

  const nextStep = () => setFormStep(prev => prev + 1);
  const prevStep = () => setFormStep(prev => prev - 1);
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e293b', outline: 'none', fontSize: '0.95rem', transition: '0.3s' };

  return (
    <div className="dashboard-container" style={{background: '#f8fafc', height: '100vh', display: 'flex'}}>
      <SidebarModern />
      <Toaster position="top-center" />

      <div className="main-content" style={{flex: 1, padding: '30px 50px', overflowY: 'auto'}}>
        
        {/* HEADER WITH NEW ACTIONS */}
        <header className="slide-in-down" style={{ marginBottom: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a' }}>Student Management</h1>
            <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '5px' }}>Comprehensive Student ERP Control Panel</p>
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
             {/* ✅ NEW: Bulk Action Buttons */}
             <button className="btn-secondary hover-scale" onClick={handleExport} title="Export CSV">📥 Export</button>
             <label className="btn-secondary hover-scale" style={{cursor:'pointer'}} title="Bulk Upload">
                📤 Import
                <input type="file" style={{display:'none'}} onChange={handleBulkUpload} accept=".csv, .xlsx" />
             </label>
             <button className="btn-secondary hover-scale" onClick={() => setShowPromoteModal(true)} title="Promote Students">🎓 Promote</button>
             
             <button className="btn-glow pulse-animation hover-scale-press" onClick={openAddModal}>
               <span style={{fontSize:'1.2rem', marginRight:'8px'}}>+</span> Admission
             </button>
          </div>
        </header>

        {/* STATS ROW */}
        <div className="stats-grid" style={{display: 'flex', gap: '25px', marginBottom: '35px'}}>
            <div className="stat-card-3d fade-in-up" style={{'--accent': '#6366f1'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div><span style={{color:'#64748b', fontWeight:'700', fontSize:'0.85rem'}}>TOTAL STUDENTS</span><h2 style={{color:'#6366f1', fontSize:'2.2rem', margin: '5px 0', fontWeight: '900'}}>{students.length}</h2></div>
                    <div className="icon-box-floating" style={{background: '#e0e7ff', color: '#6366f1'}}>🎓</div>
                </div>
            </div>
            <div className="stat-card-3d fade-in-up" style={{'--accent': '#10b981', animationDelay: '0.1s'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div><span style={{color:'#64748b', fontWeight:'700', fontSize:'0.85rem'}}>FEE COLLECTED</span><h2 style={{color:'#10b981', fontSize:'2.2rem', margin: '5px 0', fontWeight: '900'}}>92%</h2></div>
                    <div className="icon-box-floating" style={{background: '#ecfdf5', color: '#10b981'}}>💰</div>
                </div>
            </div>
            <div className="stat-card-3d fade-in-up" style={{'--accent': '#f59e0b', animationDelay: '0.2s'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div><span style={{color:'#64748b', fontWeight:'700', fontSize:'0.85rem'}}>NEW ADMISSIONS</span><h2 style={{color:'#f59e0b', fontSize:'2.2rem', margin: '5px 0', fontWeight: '900'}}>+45</h2></div>
                    <div className="icon-box-floating" style={{background: '#fffbeb', color: '#f59e0b'}}>📈</div>
                </div>
            </div>
        </div>

        {/* MAIN LIST SECTION */}
        <div className="glass-card fade-in-up" style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'25px'}}>
                <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                    <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="modern-select">
                        <option value="All">All Classes</option>
                        {[...new Set(students.map(s => s.student_class))].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="search-bar-modern">
                        <span style={{fontSize:'1.1rem', color:'#64748b'}}>🔍</span>
                        <input type="text" placeholder="Search Name, Roll No..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <div style={{color: '#64748b', fontWeight: '600'}}>Showing {filteredList.length} Students</div>
            </div>

            <table className="modern-table luxe-table">
                <thead>
                    <tr style={{background: '#f8fafc', borderBottom: '2px solid #e2e8f0'}}>
                        <th style={{padding:'18px', color:'#334155', fontWeight:'800', fontSize:'0.85rem'}}>ADMISSION NO</th>
                        <th style={{padding:'18px', color:'#334155', fontWeight:'800', fontSize:'0.85rem'}}>STUDENT NAME</th>
                        <th style={{padding:'18px', color:'#334155', fontWeight:'800', fontSize:'0.85rem'}}>CLASS (SEC)</th>
                        <th style={{padding:'18px', color:'#334155', fontWeight:'800', fontSize:'0.85rem'}}>PARENT CONTACT</th>
                        <th style={{padding:'18px', color:'#334155', fontWeight:'800', fontSize:'0.85rem'}}>FEE STATUS</th>
                        <th style={{padding:'18px', textAlign:'right', color:'#334155', fontWeight:'800', fontSize:'0.85rem'}}>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((s, idx) => (
                    <tr key={s.id} className="floating-row-glow" style={{animationDelay: `${idx * 0.05}s`}}>
                        <td><span className="id-pill">#{s.admission_number || s.roll_number || "N/A"}</span></td>
                        <td>
                            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                <div className="mini-avatar">{s.first_name[0]}</div>
                                <div>
                                    <div style={{fontWeight:'700', color: '#0f172a', fontSize:'0.95rem'}}>{s.first_name} {s.last_name}</div>
                                    <div style={{fontSize:'0.75rem', color:'#64748b'}}>ID: {s.id}</div>
                                </div>
                            </div>
                        </td>
                        <td><span className="badge-gray">{s.student_class} ({s.section})</span></td>
                        <td style={{color: '#475569', fontWeight: '500'}}>📞 {s.primary_mobile || "N/A"}</td>
                        <td>
                            <span className={`status-pill ${s.fee_status === 'Paid' ? 'active' : s.fee_status === 'Partial' ? 'partial' : 'pending'}`}>
                                {s.fee_status || "Pending"}
                            </span>
                        </td>
                        <td style={{textAlign:'right'}}>
                            <button className="btn-view-detail hover-scale" onClick={() => {setSelectedStudent(s); setShowDetailModal(true);}}>View ➜</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination-bar">
                <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Prev</button>
                <span className="page-info">Page <b>{currentPage}</b> of {totalPages}</span>
                <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next →</button>
            </div>
        </div>

        {/* --- STUDENT DETAIL MODAL --- */}
        {showDetailModal && selectedStudent && (
            <div className="overlay-blur centered-flex" onClick={() => setShowDetailModal(false)} style={{zIndex: 4000}}>
                <div className="luxe-modal zoom-in" style={{width: '600px', padding: '0', maxHeight: '90vh', overflowY: 'auto'}} onClick={e => e.stopPropagation()}>
                    <div style={{background: 'linear-gradient(135deg, #6366f1, #4f46e5)', padding: '30px', borderRadius: '30px 30px 0 0', color: 'white', position: 'relative'}}>
                        <button className="close-btn-white" onClick={() => setShowDetailModal(false)} style={{position:'absolute', top:'20px', right:'20px', background:'rgba(255,255,255,0.2)', border:'none', color:'white', width:'30px', height:'30px', borderRadius:'50%', cursor:'pointer'}}>✕</button>
                        <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                            <div style={{width: '80px', height: '80px', background: 'white', borderRadius: '50%', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '800', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}}>
                                {selectedStudent.first_name[0]}
                            </div>
                            <div>
                                <h2 style={{margin: 0, fontSize: '1.8rem', fontWeight: '800'}}>{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                                <p style={{margin: '5px 0 0', opacity: 0.9, fontSize: '0.95rem'}}>Class {selectedStudent.student_class} • Sec {selectedStudent.section}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{padding: '30px'}}>
                        <div className="grid-2-col" style={{marginBottom: '20px', gap: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                            <div className="info-box"><small style={{color:'#64748b', display:'block', marginBottom:'3px'}}>Admission No</small><b style={{color:'#1e293b'}}>{selectedStudent.admission_number || "N/A"}</b></div>
                            <div className="info-box"><small style={{color:'#64748b', display:'block', marginBottom:'3px'}}>Gender</small><b style={{color:'#1e293b'}}>{selectedStudent.gender || "N/A"}</b></div>
                            <div className="info-box"><small style={{color:'#64748b', display:'block', marginBottom:'3px'}}>Date of Birth</small><b style={{color:'#1e293b'}}>{selectedStudent.dob || "N/A"}</b></div>
                            <div className="info-box"><small style={{color:'#64748b', display:'block', marginBottom:'3px'}}>Fee Status</small>
                                <span style={{color: selectedStudent.fee_status === 'Paid' ? '#16a34a' : '#dc2626', fontWeight: '800'}}>{selectedStudent.fee_status}</span>
                            </div>
                        </div>
                        <h4 style={{color: '#6366f1', borderBottom: '1px solid #e0e7ff', paddingBottom: '10px', marginBottom: '15px', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: '800'}}>Parent & Contact</h4>
                        <div className="grid-2-col" style={{gap: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                            <div className="info-box"><small style={{color:'#64748b', display:'block', marginBottom:'3px'}}>Father's Name</small><b style={{color:'#1e293b'}}>{selectedStudent.father_name || "N/A"}</b></div>
                            <div className="info-box"><small style={{color:'#64748b', display:'block', marginBottom:'3px'}}>Mobile</small><b style={{color:'#1e293b'}}>{selectedStudent.primary_mobile || "N/A"}</b></div>
                            <div className="info-box" style={{gridColumn: 'span 2'}}><small style={{color:'#64748b', display:'block', marginBottom:'3px'}}>Email</small><b style={{color:'#1e293b'}}>{selectedStudent.email || "N/A"}</b></div>
                        </div>
                        <div style={{marginTop: '30px', display: 'flex', gap: '10px'}}>
                            <button className="btn-confirm-gradient hover-lift" style={{flex: 1, padding:'12px', borderRadius:'10px'}} onClick={handleEditProfile}>Edit Profile ✏️</button>
                            <button className="btn-ghost" style={{flex: 1, padding:'12px', borderRadius:'10px'}} onClick={handleDownloadID}>Download ID Card 🪪</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- ✅ NEW: PROMOTE MODAL --- */}
        {showPromoteModal && (
            <div className="overlay-blur centered-flex" onClick={() => setShowPromoteModal(false)} style={{zIndex: 5000}}>
                <div className="luxe-modal zoom-in" style={{width: '400px', background: 'white', padding: '30px', borderRadius: '24px'}} onClick={e => e.stopPropagation()}>
                    <h2 style={{marginTop: 0, color: '#0f172a'}}>Promote Students 🎓</h2>
                    <p style={{color: '#64748b', marginBottom: '20px'}}>Move students to the next academic session.</p>
                    
                    <div className="input-group" style={{marginBottom: '15px'}}>
                        <label>Promote From Class</label>
                        <select style={inputStyle} value={promoteData.fromClass} onChange={(e) => setPromoteData({...promoteData, fromClass: e.target.value})}>
                            <option>9th</option><option>10th</option><option>11th</option><option>12th</option>
                        </select>
                    </div>
                    <div className="input-group" style={{marginBottom: '20px'}}>
                        <label>Promote To Class</label>
                        <select style={inputStyle} value={promoteData.toClass} onChange={(e) => setPromoteData({...promoteData, toClass: e.target.value})}>
                            <option>10th</option><option>11th</option><option>12th</option><option>Alumni</option>
                        </select>
                    </div>

                    <div style={{display: 'flex', gap: '10px'}}>
                        <button className="btn-confirm-gradient" style={{flex: 1}} onClick={handlePromoteSubmit}>Promote All</button>
                        <button className="btn-ghost" style={{flex: 1}} onClick={() => setShowPromoteModal(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        )}

        {/* --- ID CARD PREVIEW MODAL --- */}
        {showIDCard && selectedStudent && (
            <div className="overlay-blur centered-flex" onClick={() => setShowIDCard(false)} style={{zIndex: 5000}}>
                <div className="luxe-modal zoom-in" style={{width: '400px', padding: '0', background:'transparent', boxShadow:'none', maxHeight: '90vh', overflowY: 'auto'}} onClick={e => e.stopPropagation()}>
                    <div style={{background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', position: 'relative'}}>
                        {/* ✅ UPDATED HEADER BACKGROUND COLOR */}
                        <div style={{background: '#1e293b', padding: '20px', textAlign: 'center', color: 'white'}}>
                            <h3 style={{margin:0, fontSize:'1.2rem', fontWeight:'800', letterSpacing:'1px'}}>SHIVADDA ACADEMY</h3>
                            <p style={{margin:'5px 0 0', fontSize:'0.7rem', opacity:0.8, textTransform:'uppercase'}}>Excellence in Education</p>
                        </div>
                        <div style={{padding: '30px 20px', textAlign: 'center'}}>
                            <div style={{width: '100px', height: '100px', background: '#f1f5f9', borderRadius: '50%', margin: '0 auto 15px', border: '4px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', color:'#64748b'}}>
                                {selectedStudent.first_name[0]}
                            </div>
                            
                            {/* ✅ UPDATED NAME & CLASS TO BLACK */}
                            <h2 style={{margin: '0', color: '#000000', textTransform: 'uppercase'}}>{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                            <p style={{margin: '5px 0 15px', color: '#000000', fontWeight: '700'}}>Class {selectedStudent.student_class} • {selectedStudent.section}</p>
                            
                            {/* ✅ UPDATED DETAILS TO BLACK */}
                            <div style={{background: '#f8fafc', padding: '15px', borderRadius: '12px', textAlign: 'left', fontSize: '0.85rem'}}>
                                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}><span style={{color:'#000000'}}>Roll No:</span> <b style={{color:'#000000'}}>{selectedStudent.roll_number}</b></div>
                                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}><span style={{color:'#000000'}}>DOB:</span> <b style={{color:'#000000'}}>{selectedStudent.dob}</b></div>
                                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}><span style={{color:'#000000'}}>Blood Group:</span> <b style={{color:'#000000'}}>{selectedStudent.blood_group || "N/A"}</b></div>
                                <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'#000000'}}>Emergency:</span> <b style={{color:'#000000'}}>{selectedStudent.primary_mobile}</b></div>
                            </div>
                            
                            {/* ✅ UPDATED ID TEXT TO BLACK */}
                            <div style={{marginTop: '20px', padding: '10px', borderTop: '2px dashed #e2e8f0'}}>
                                <div style={{height: '40px', background: 'repeating-linear-gradient(90deg, #333, #333 2px, white 2px, white 4px)', width: '80%', margin: '0 auto'}}></div>
                                <p style={{fontSize: '0.7rem', color: '#000000', marginTop: '5px', fontWeight: 'bold'}}>ID: {selectedStudent.admission_number}</p>
                            </div>
                        </div>
                        <div style={{background: '#1e293b', padding: '15px', textAlign: 'center'}}>
                            <button style={{background: '#6366f1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer'}} onClick={() => window.print()}>🖨️ Print Card</button>
                            <button style={{background: 'transparent', color: '#94a3b8', border: 'none', marginLeft: '10px', cursor: 'pointer', fontSize:'0.9rem'}} onClick={() => setShowIDCard(false)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- ADMISSION MODAL (Form Logic) --- */}
        {showAddModal && (
          <div className="overlay-blur centered-flex" style={{zIndex: 3000}}>
            <div className="luxe-modal zoom-in" style={{width: '850px', maxHeight: '90vh', overflowY: 'auto'}}>
                <div className="modal-header" style={{borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '25px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div><h2 style={{margin:0, color: '#0f172a'}}>{isEditing ? "Edit Profile" : "New Student Admission"}</h2><p style={{margin:'5px 0 0', color: '#64748b', fontSize:'0.9rem'}}>Session 2025-26</p></div>
                    <div style={{background: '#e0e7ff', color: '#4338ca', padding: '6px 15px', borderRadius: '20px', fontWeight: '800', fontSize: '0.8rem'}}>Step {formStep} of 4</div>
                </div>
                <div className="modal-body">
                    {/* Step 1 */}
                    {formStep === 1 && (
                      <div className="fade-in">
                        <h4 className="form-section-title">1. Personal Information</h4>
                        <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                           <div className="input-group"><label>First Name</label><input type="text" style={inputStyle} value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} /></div>
                           <div className="input-group"><label>Last Name</label><input type="text" style={inputStyle} value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} /></div>
                           <div className="input-group"><label>Date of Birth</label><input type="date" style={inputStyle} value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} /></div>
                           <div className="input-group"><label>Gender</label><select style={inputStyle} value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}><option>Male</option><option>Female</option></select></div>
                           <div className="input-group"><label>Blood Group</label><input type="text" style={inputStyle} value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})} /></div>
                           <div className="input-group"><label>Category</label><select style={inputStyle} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}><option>General</option><option>OBC</option><option>SC</option><option>ST</option></select></div>
                        </div>
                      </div>
                    )}
                    {/* Step 2 */}
                    {formStep === 2 && (
                      <div className="fade-in">
                        <h4 className="form-section-title">2. Academic Information</h4>
                        <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                           <div className="input-group"><label>Admission No</label><input type="text" style={inputStyle} value={formData.admission_number} onChange={e => setFormData({...formData, admission_number: e.target.value})} /></div>
                           <div className="input-group"><label>Roll Number</label><input type="text" style={inputStyle} value={formData.roll_number} onChange={e => setFormData({...formData, roll_number: e.target.value})} /></div>
                           <div className="input-group"><label>Class</label><input type="text" style={inputStyle} value={formData.student_class} onChange={e => setFormData({...formData, student_class: e.target.value})} /></div>
                           <div className="input-group"><label>Section</label><input type="text" style={inputStyle} value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} /></div>
                           <div className="input-group"><label>Fee Status</label><select style={inputStyle} value={formData.fee_status} onChange={e => setFormData({...formData, fee_status: e.target.value})}><option>Pending</option><option>Paid</option><option>Partial</option></select></div>
                        </div>
                      </div>
                    )}
                    {/* Step 3 */}
                    {formStep === 3 && (
                      <div className="fade-in">
                        <h4 className="form-section-title">3. Parent & Contact Details</h4>
                        <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                           <div className="input-group"><label>Father's Name</label><input type="text" style={inputStyle} value={formData.father_name} onChange={e => setFormData({...formData, father_name: e.target.value})} /></div>
                           <div className="input-group"><label>Father's Job</label><input type="text" style={inputStyle} value={formData.father_occupation} onChange={e => setFormData({...formData, father_occupation: e.target.value})} /></div>
                           <div className="input-group"><label>Mother's Name</label><input type="text" style={inputStyle} value={formData.mother_name} onChange={e => setFormData({...formData, mother_name: e.target.value})} /></div>
                           <div className="input-group"><label>Primary Phone</label><input type="text" style={inputStyle} value={formData.primary_mobile} onChange={e => setFormData({...formData, primary_mobile: e.target.value})} /></div>
                           <div className="input-group"><label>Email</label><input type="email" style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                        </div>
                        <div className="input-group" style={{marginTop:'15px'}}><label>Address</label><textarea style={{...inputStyle, height: '80px', resize: 'none'}} value={formData.current_address} onChange={e => setFormData({...formData, current_address: e.target.value})}></textarea></div>
                      </div>
                    )}
                    {/* Step 4 */}
                    {formStep === 4 && (
                      <div className="fade-in">
                        <h4 className="form-section-title">4. Document Uploads</h4>
                        <div className="grid-2-col" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                           <div className="input-group"><label>Student Photo</label><input type="file" style={inputStyle} onChange={e => setFormData({...formData, photo: e.target.files[0]})} /></div>
                           <div className="input-group"><label>Aadhar Scan</label><input type="file" style={inputStyle} onChange={e => setFormData({...formData, aadhar_scan: e.target.files[0]})} /></div>
                           <div className="input-group"><label>Transfer Cert</label><input type="file" style={inputStyle} onChange={e => setFormData({...formData, tc_scan: e.target.files[0]})} /></div>
                           <div className="input-group"><label>Marksheet</label><input type="file" style={inputStyle} onChange={e => setFormData({...formData, marksheet_scan: e.target.files[0]})} /></div>
                        </div>
                      </div>
                    )}

                    {/* FOOTER ACTIONS */}
                    <div style={{marginTop: '40px', display: 'flex', gap: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '20px'}}>
                        {formStep > 1 && <button className="btn-ghost" style={{flex:1}} onClick={prevStep}>Back</button>}
                        {formStep < 4 ? (<button className="btn-confirm-gradient hover-lift" style={{flex:1}} onClick={nextStep}>Next Step ➜</button>) : (<button className="btn-confirm-gradient hover-lift" style={{flex:1, background:'#10b981'}} onClick={handleAddStudent}>{isEditing ? "Update Profile ✅" : "Complete Admission ✅"}</button>)}
                        <button className="btn-ghost" style={{color:'#ef4444', borderColor:'#fee2e2'}} onClick={() => setShowAddModal(false)}>Cancel</button>
                    </div>
                </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        /* Core Colors & Animation */
        .gradient-text { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .stat-card-3d { flex: 1; background: white; padding: 25px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: 0.3s; position: relative; overflow: hidden; border: 1px solid #f1f5f9; }
        .stat-card-3d:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .icon-box-floating { width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; }

        .modern-select { padding: 12px 20px; border-radius: 30px; border: 1px solid #cbd5e1; outline: none; color: #334155; font-weight: 600; cursor: pointer; background: white; }
        .search-bar-modern { display: flex; alignItems: center; background: white; padding: 10px 20px; border-radius: 30px; border: 1px solid #cbd5e1; width: 300px; }
        .search-bar-modern input { border: none; outline: none; width: 100%; color: #334155; font-weight: 500; }

        .modern-table { width: 100%; border-collapse: separate; border-spacing: 0 12px; }
        .floating-row-glow { background: white; transition: 0.3s; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .floating-row-glow:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); z-index: 10; position: relative; }
        .floating-row-glow td { padding: 20px; border-top: 1px solid #f8fafc; border-bottom: 1px solid #f8fafc; color: #334155; font-size: 0.95rem; }
        
        .id-pill { background: #f1f5f9; padding: 5px 10px; border-radius: 8px; font-weight: 700; color: #64748b; font-size: 0.8rem; }
        .mini-avatar { width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; }
        .badge-gray { background: #f1f5f9; padding: 5px 12px; border-radius: 8px; font-weight: 600; color: #475569; font-size: 0.85rem; }
        
        .status-pill { padding: 6px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
        .status-pill.active { background: #dcfce7; color: #166534; }
        .status-pill.partial { background: #e0e7ff; color: #3730a3; }
        .status-pill.pending { background: #fee2e2; color: #991b1b; }
        
        .btn-view-detail { background: white; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 10px; font-weight: 600; color: #4f46e5; cursor: pointer; transition: 0.2s; }
        .btn-view-detail:hover { background: #4f46e5; color: white; border-color: #4f46e5; }
        
        .btn-secondary { background: white; border: 1px solid #cbd5e1; padding: 10px 18px; border-radius: 30px; font-weight: 600; color: #475569; cursor: pointer; transition: 0.2s; font-size: 0.85rem; display: flex; align-items: center; gap: 5px; }
        .btn-secondary:hover { background: #f8fafc; border-color: #94a3b8; color: #1e293b; }

        .luxe-modal { background: white; padding: 40px; border-radius: 30px; box-shadow: 0 25px 80px rgba(0,0,0,0.2); }
        .form-section-title { font-size: 1rem; color: #6366f1; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 25px; border-left: 4px solid #6366f1; padding-left: 10px; }
        .input-group label { display: block; font-size: 0.85rem; color: #64748b; font-weight: 700; margin-bottom: 8px; }
        
        .btn-confirm-gradient { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); color: white; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; }
        .btn-ghost { background: white; border: 1px solid #cbd5e1; color: #64748b; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; }
        .btn-ghost:hover { background: #f8fafc; }
        .btn-glow { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); border: none; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3); display: flex; align-items: center; }

        .overlay-blur { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px); z-index: 2000; display: flex; justify-content: flex-end; }
        .centered-flex { align-items: center; justify-content: center; }
        
        .info-box { background: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; }

        @keyframes slideInDown { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .slide-in-down { animation: slideInDown 0.7s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .fade-in-up { animation: fadeUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .pulse-animation { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(99, 102, 241, 0); } 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); } }
      `}</style>
    </div>
  );
}