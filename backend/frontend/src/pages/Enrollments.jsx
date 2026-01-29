import React, { useState, useEffect } from "react";
import SidebarModern from "../components/SidebarModern";
import api from "../api/axios";
import { toast, Toaster } from "react-hot-toast";

export default function Enrollments() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  
  // UI States
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("All");
  
  // View Panel States
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  // ✅ NEW: Delete Prompt States
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [enrollmentToDeleteId, setEnrollmentToDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = async () => {
    try {
      const [s, c, e] = await Promise.all([
        api.get("students/list/"),
        api.get("courses/"),
        api.get("enrollments/")
      ]);
      setStudents(Array.isArray(s.data) ? s.data : s.data.results || []);
      setCourses(Array.isArray(c.data) ? c.data : c.data.results || []);
      setEnrollments(Array.isArray(e.data) ? e.data : e.data.results || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Database connection failed!");
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- ACTIONS ---
  const handleEnroll = async () => {
    if (!studentId || !courseId) return toast.error("Select both Student and Course");
    const exists = enrollments.find(e => e.student === parseInt(studentId) && e.course === parseInt(courseId));
    if(exists) return toast.error("Student already enrolled!");

    setLoading(true);
    try {
      await api.post("enrollments/", { student: studentId, course: courseId });
      toast.success("Enrollment Successful! 🎉");
      loadData();
      setStudentId(""); setCourseId("");
    } catch (err) {
      toast.error("Enrollment Failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Trigger Delete Prompt UI (Alert hataya)
  const handleUnrollClick = (id) => {
      setEnrollmentToDeleteId(id);
      setShowDeletePrompt(true);
  };

  // ✅ NEW: Confirm Delete Action
  const confirmDelete = async () => {
    if (!enrollmentToDeleteId) return;
    setDeleteLoading(true);
    try {
        await api.delete(`enrollments/${enrollmentToDeleteId}/`);
        toast.success("Enrollment Cancelled Successfully");
        loadData();
        setShowDetailPanel(false); // Close side panel if open
        setShowDeletePrompt(false); // Close prompt
    } catch (err) {
        toast.error("Failed to cancel enrollment");
    } finally {
        setDeleteLoading(false);
        setEnrollmentToDeleteId(null);
    }
  };

  // ✅ NEW: Working Download Button (Simulation)
  const handleDownloadReceipt = (enrollment) => {
      if (!enrollment) return;
      toast.loading("Generating Receipt...");
      
      // Simulate server delay for realism
      setTimeout(() => {
          toast.dismiss();
          // Create dummy receipt content
          const receiptContent = `
RECEIPT - SHIVADDA PLATFORM
---------------------------
Transaction ID: TXN-${enrollment.id}${Date.now().toString().slice(-4)}
Date: ${new Date().toDateString()}

Student Details:
Name: ${enrollment.student_name || 'N/A'}
Student ID: ${enrollment.student}

Course Details:
Course: ${enrollment.course_name}
Enrollment Date: ${new Date(enrollment.enrolled_at).toDateString()}

Status: Paid (Demo Receipt)
---------------------------
Thank you for learning with us!
          `;
          
          // Trigger file download in browser
          const element = document.createElement("a");
          const file = new Blob([receiptContent], {type: 'text/plain'});
          element.href = URL.createObjectURL(file);
          element.download = `Receipt_${enrollment.student_name.replace(/\s+/g, '_')}_${enrollment.id}.txt`;
          document.body.appendChild(element); 
          element.click();
          document.body.removeChild(element);
          toast.success("Receipt Downloaded! 📄");
      }, 1500);
  };

  const handleView = (enrollment) => {
      setSelectedEnrollment(enrollment);
      setShowDetailPanel(true);
  };

  // --- FILTERING ---
  const filteredEnrollments = enrollments.filter(e => {
    const sName = e.student_name ? e.student_name.toLowerCase() : "";
    const matchesSearch = sName.includes(searchTerm.toLowerCase());
    const matchesFilter = selectedCourseFilter === "All" || e.course_name === selectedCourseFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard-container" style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <SidebarModern />
      <Toaster position="top-right" />
      
      <div className="main-content" style={{ flex: 1, padding: '40px', marginLeft: '280px', transition: '0.3s', filter: showDeletePrompt ? 'blur(4px)' : 'none' }}>
        
        {/* Header */}
        <header style={{ marginBottom: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Enrollment Hub</h1>
                <p style={{ color: '#64748b', marginTop: '5px' }}>Manage student admissions & records.</p>
            </div>
            
            <div className="search-box">
                <input 
                    type="text" 
                    placeholder="Search students..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span>🔍</span>
            </div>
        </header>

        <div style={{ display: 'flex', gap: '30px' }}>
          
          {/* Left: Enrollment Form */}
          <div className="card-glass form-card">
            <h3 className="section-title">New Admission</h3>
            <div className="input-group">
                <label>SELECT STUDENT</label>
                <select className="modern-input" value={studentId} onChange={e => setStudentId(e.target.value)}>
                    <option value="">-- Choose Student --</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name || s.username} (ID: {s.id})</option>)}
                </select>
            </div>
            <div className="input-group">
                <label>TARGET COURSE</label>
                <select className="modern-input" value={courseId} onChange={e => setCourseId(e.target.value)}>
                    <option value="">-- Choose Course --</option>
                    {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
            </div>
            <button onClick={handleEnroll} disabled={loading} className="btn-primary">
                {loading ? "Processing..." : "Confirm Enrollment ➜"}
            </button>
          </div>

          {/* Right: List Table */}
          <div className="card-glass table-card" style={{ flex: 2 }}>
            <div className="table-header">
                <h3>Active Enrollments</h3>
                <select 
                    value={selectedCourseFilter} 
                    onChange={(e) => setSelectedCourseFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="All">All Courses</option>
                    {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
            </div>

            <div className="table-wrapper">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>STUDENT INFO</th>
                            <th>COURSE</th>
                            <th>ENROLL DATE</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEnrollments.map(e => (
                            <tr key={e.id}>
                                <td>
                                    <div className="student-cell">
                                        <div className="avatar-circle">{e.student_name ? e.student_name[0].toUpperCase() : 'S'}</div>
                                        <div>
                                            <div className="s-name">{e.student_name || `Student ${e.student}`}</div>
                                            <div className="s-id">ID: {e.student}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="badge-course">{e.course_name}</span></td>
                                <td style={{color:'#64748b', fontSize:'0.9rem'}}>
                                    {e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString('en-GB') : 'N/A'}
                                </td>
                                <td><span className="badge-active">● ACTIVE</span></td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleView(e)} className="btn-icon view" title="View Details">👁️</button>
                                        {/* ✅ Changed to trigger custom prompt */}
                                        <button onClick={() => handleUnrollClick(e.id)} className="btn-icon delete" title="Remove">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredEnrollments.length === 0 && <div className="empty-state">No records found.</div>}
            </div>
          </div>
        </div>
      </div>

      {/* SLIDING DETAIL PANEL */}
      <div className={`detail-panel-overlay ${showDetailPanel ? 'open' : ''}`} onClick={() => setShowDetailPanel(false)}>
        <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
            {selectedEnrollment && (
                <>
                    <div className="panel-header">
                        <h2>Student Profile</h2>
                        <button onClick={() => setShowDetailPanel(false)} className="close-btn">✕</button>
                    </div>
                    <div className="panel-body">
                        <div className="profile-section">
                            <div className="large-avatar">
                                {selectedEnrollment.student_name ? selectedEnrollment.student_name[0].toUpperCase() : 'S'}
                            </div>
                            <h3>{selectedEnrollment.student_name || "Unknown Student"}</h3>
                            <span className="id-badge">Student ID: {selectedEnrollment.student}</span>
                        </div>
                        <div className="info-grid">
                            <div className="info-item"><label>Enrolled Course</label><div className="info-val highlight">{selectedEnrollment.course_name}</div></div>
                            <div className="info-item"><label>Enrollment Date</label><div className="info-val">{selectedEnrollment.enrolled_at ? new Date(selectedEnrollment.enrolled_at).toDateString() : 'N/A'}</div></div>
                            <div className="info-item"><label>Current Status</label><div className="info-val active-text">● Active Student</div></div>
                            <div className="info-item"><label>Fee Status</label><div className="info-val">Paid (Demo)</div></div>
                        </div>
                        <div className="panel-footer">
                            {/* ✅ Working Download Button */}
                            <button onClick={() => handleDownloadReceipt(selectedEnrollment)} className="btn-full-width secondary">Download Receipt 📄</button>
                            {/* ✅ Triggers custom prompt */}
                            <button onClick={() => handleUnrollClick(selectedEnrollment.id)} className="btn-full-width danger">Cancel Enrollment</button>
                        </div>
                    </div>
                </>
            )}
        </div>
      </div>

      {/* ✅ NEW: CUSTOM DELETE PROMPT UI */}
      {showDeletePrompt && (
        <div className="prompt-overlay">
            <div className="prompt-card bounce-in">
                <div className="prompt-icon">⚠️</div>
                <h2>Are you sure?</h2>
                <p>Do you really want to cancel this student's enrollment? This process cannot be undone.</p>
                <div className="prompt-actions">
                    <button className="btn-prompt cancel" onClick={() => setShowDeletePrompt(false)} disabled={deleteLoading}>No, Keep it</button>
                    <button className="btn-prompt confirm" onClick={confirmDelete} disabled={deleteLoading}>
                        {deleteLoading ? "Deleting..." : "Yes, Cancel Enrollment"}
                    </button>
                </div>
            </div>
        </div>
      )}

      <style>{`
        /* Global & Layout */
        .gradient-text { background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .card-glass { background: white; padding: 25px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; }
        
        /* Search & Form */
        .search-box { position: relative; }
        .search-box input { padding: 12px 20px 12px 45px; border-radius: 30px; border: 1px solid #e2e8f0; width: 300px; outline: none; transition: 0.3s; }
        .search-box input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .search-box span { position: absolute; left: 15px; top: 12px; opacity: 0.5; }

        .form-card { flex: 1; position: sticky; top: 40px; height: fit-content; }
        .section-title { margin-bottom: 20px; border-left: 4px solid #3b82f6; padding-left: 15px; color: #1e293b; font-weight: 800; }
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 8px; letter-spacing: 0.5px; }
        .modern-input { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; outline: none; font-size: 0.95rem; background: #f8fafc; }
        .modern-input:focus { border-color: #3b82f6; background: white; }
        
        .btn-primary { width: 100%; padding: 14px; background: #0f172a; color: white; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(15, 23, 42, 0.2); }

        /* Table Styling */
        .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .filter-select { padding: 8px 15px; border-radius: 10px; border: 1px solid #e2e8f0; cursor: pointer; outline: none; }
        .modern-table { width: 100%; border-collapse: collapse; }
        .modern-table th { text-align: left; color: #94a3b8; font-size: 0.75rem; padding: 15px; border-bottom: 2px solid #f1f5f9; letter-spacing: 0.5px; }
        .modern-table td { padding: 15px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
        .modern-table tr:hover { background: #fcfdfe; }

        .student-cell { display: flex; align-items: center; gap: 12px; }
        .avatar-circle { width: 35px; height: 35px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
        .s-name { font-weight: 700; color: #1e293b; font-size: 0.9rem; }
        .s-id { font-size: 0.75rem; color: #94a3b8; }

        .badge-course { background: #eff6ff; color: #3b82f6; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; }
        .badge-active { background: #dcfce7; color: #16a34a; padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.5px; }

        .action-buttons { display: flex; gap: 8px; }
        .btn-icon { width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; font-size: 1rem; }
        .btn-icon.view { background: #f1f5f9; color: #3b82f6; }
        .btn-icon.view:hover { background: #3b82f6; color: white; }
        .btn-icon.delete { background: #fff1f2; color: #ef4444; }
        .btn-icon.delete:hover { background: #ef4444; color: white; }
        .empty-state { text-align: center; padding: 40px; color: #94a3b8; }

        /* Sliding Detail Panel */
        .detail-panel-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); z-index: 2000; opacity: 0; pointer-events: none; transition: 0.3s; }
        .detail-panel-overlay.open { opacity: 1; pointer-events: auto; }
        
        .detail-panel { position: absolute; top: 0; right: 0; width: 400px; height: 100%; background: white; box-shadow: -10px 0 30px rgba(0,0,0,0.1); transform: translateX(100%); transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; z-index: 2001; }
        .detail-panel-overlay.open .detail-panel { transform: translateX(0); }

        .panel-header { padding: 25px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .panel-header h2 { margin: 0; font-size: 1.2rem; color: #0f172a; font-weight: 800; }
        .close-btn { background: #f1f5f9; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; color: #64748b; font-weight: 700; }
        .close-btn:hover { background: #e2e8f0; color: #0f172a; }

        .panel-body { padding: 30px; overflow-y: auto; flex: 1; }
        .profile-section { text-align: center; margin-bottom: 30px; }
        .large-avatar { width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; margin: 0 auto 15px; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3); }
        .profile-section h3 { margin: 0 0 5px; color: #0f172a; font-size: 1.4rem; }
        .id-badge { background: #f1f5f9; color: #64748b; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }

        .info-grid { display: grid; gap: 20px; background: #f8fafc; padding: 20px; border-radius: 16px; margin-bottom: 30px; }
        .info-item label { display: block; font-size: 0.75rem; color: #94a3b8; font-weight: 700; margin-bottom: 5px; text-transform: uppercase; }
        .info-val { font-size: 1rem; color: #334155; font-weight: 600; }
        .info-val.highlight { color: #3b82f6; }
        .info-val.active-text { color: #16a34a; }

        .panel-footer { display: flex; flex-direction: column; gap: 10px; margin-top: auto; }
        .btn-full-width { width: 100%; padding: 12px; border-radius: 10px; border: none; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-full-width.secondary { background: #e2e8f0; color: #475569; }
        .btn-full-width.secondary:hover { background: #cbd5e1; }
        .btn-full-width.danger { background: #fee2e2; color: #dc2626; }
        .btn-full-width.danger:hover { background: #fca5a5; color: white; }

        /* ✅ NEW: CUSTOM PROMPT UI STYLES */
        .prompt-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(5px); z-index: 3000; display: flex; align-items: center; justify-content: center; }
        .prompt-card { background: white; padding: 30px; border-radius: 24px; width: 400px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .prompt-icon { font-size: 3rem; margin-bottom: 15px; }
        .prompt-card h2 { margin: 0 0 10px; color: #0f172a; font-weight: 800; }
        .prompt-card p { color: #64748b; margin-bottom: 25px; line-height: 1.5; }
        .prompt-actions { display: flex; gap: 10px; }
        .btn-prompt { flex: 1; padding: 12px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-prompt.cancel { background: #e2e8f0; color: #475569; }
        .btn-prompt.cancel:hover { background: #cbd5e1; }
        .btn-prompt.confirm { background: #dc2626; color: white; }
        .btn-prompt.confirm:hover { background: #b91c1c; }
        .btn-prompt:disabled { opacity: 0.7; cursor: not-allowed; }

        @keyframes bounceIn { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
        .bounce-in { animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
}