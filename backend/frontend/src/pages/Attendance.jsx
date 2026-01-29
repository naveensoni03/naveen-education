import React, { useState, useEffect } from "react";
import SidebarModern from "../components/SidebarModern";
import "./dashboard.css"; 

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("Class 10-A");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics (10:00 AM)");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [notifyParents, setNotifyParents] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Kitne students dikhenge ek page par

  useEffect(() => {
    // Real-Like Mock Data (More Data for Pagination Demo)
    const mockStudents = [
      { id: 1, name: "Naveen Soni", roll: "101", status: "Present", monthlyAvg: 92, remarks: "" },
      { id: 2, name: "Kunal Verma", roll: "102", status: "Present", monthlyAvg: 88, remarks: "" },
      { id: 3, name: "Rahul Singh", roll: "103", status: "Absent", monthlyAvg: 45, remarks: "Sick Leave" },
      { id: 4, name: "Mukul Garg", roll: "104", status: "Present", monthlyAvg: 95, remarks: "" },
      { id: 5, name: "Chandresh Soni", roll: "105", status: "Late", monthlyAvg: 70, remarks: "Bus Late" },
      { id: 6, name: "Amit Sharma", roll: "106", status: "Present", monthlyAvg: 82, remarks: "" },
      { id: 7, name: "Priya Singh", roll: "107", status: "Absent", monthlyAvg: 98, remarks: "" },
      { id: 8, name: "Rohan Das", roll: "108", status: "Present", monthlyAvg: 60, remarks: "" },
      { id: 9, name: "Simran Kaur", roll: "109", status: "Present", monthlyAvg: 91, remarks: "" },
      { id: 10, name: "Arjun Mehta", roll: "110", status: "Late", monthlyAvg: 75, remarks: "" },
      { id: 11, name: "Vikas Dubey", roll: "111", status: "Absent", monthlyAvg: 50, remarks: "Not Well" },
      { id: 12, name: "Sneha Gupta", roll: "112", status: "Present", monthlyAvg: 89, remarks: "" },
    ];
    setStudents(mockStudents);
  }, [selectedClass]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Stats
  const total = students.length;
  const present = students.filter(s => s.status === "Present").length;
  const absent = students.filter(s => s.status === "Absent").length;
  const late = students.filter(s => s.status === "Late").length;

  const handleStatusChange = (id, newStatus) => {
    setStudents(prev => prev.map(s => 
        s.id === id ? { ...s, status: newStatus, remarks: newStatus === 'Present' ? "" : s.remarks } : s
    ));
  };

  const handleRemarkChange = (id, text) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, remarks: text } : s));
  };

  const handleSave = () => {
    console.log("Saving Attendance...", { selectedClass, selectedSubject, notifyParents, students });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="dashboard-container" style={{background: '#f8fafc', height: '100vh', display: 'flex', overflow: 'hidden'}}>
      <SidebarModern />

      <div className="main-content" style={{flex: 1, padding: '30px 40px', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column'}}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexShrink: 0 }}>
          <div className="slide-in-left">
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-1px', margin: 0 }}>Daily Attendance</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500', margin: 0 }}>Track student presence for specific periods.</p>
          </div>
          
          <div className="slide-in-right" style={{display: 'flex', gap: '15px'}}>
             <select className="luxe-input-animated" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                <option>Class 10-A</option>
                <option>Class 12-B</option>
             </select>
             <select className="luxe-input-animated" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                <option>Mathematics (10:00 AM)</option>
                <option>Physics (11:30 AM)</option>
                <option>English (01:00 PM)</option>
             </select>
             <input type="date" className="luxe-input-animated" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
        </header>

        {/* STATS */}
        <div className="stats-grid" style={{display: 'flex', gap: '20px', marginBottom: '25px', flexShrink: 0}}>
            <div className="stat-card-pop fade-in-up" style={{animationDelay: '0.1s'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                    <span style={{color:'#64748b', fontSize: '0.85rem', fontWeight: '700'}}>TOTAL</span>
                    <b style={{color:'#0f172a', fontSize:'1.5rem'}}>{total}</b>
                </div>
                <div className="progress-bar-bg" style={{marginTop:'10px'}}><div className="progress-bar-fill" style={{width: '100%', background: '#cbd5e1'}}></div></div>
            </div>
            
            <div className="stat-card-pop fade-in-up" style={{animationDelay: '0.2s'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                    <span style={{color:'#16a34a', fontSize: '0.85rem', fontWeight: '700'}}>PRESENT</span>
                    <b style={{color:'#16a34a', fontSize:'1.5rem'}}>{present}</b>
                </div>
                <div className="progress-bar-bg" style={{marginTop:'10px'}}><div className="progress-bar-fill" style={{width: `${total ? (present/total)*100 : 0}%`, background: '#16a34a'}}></div></div>
            </div>

            <div className="stat-card-pop fade-in-up" style={{animationDelay: '0.3s'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                    <span style={{color:'#dc2626', fontSize: '0.85rem', fontWeight: '700'}}>ABSENT</span>
                    <b style={{color:'#dc2626', fontSize:'1.5rem'}}>{absent}</b>
                </div>
                <div className="progress-bar-bg" style={{marginTop:'10px'}}><div className="progress-bar-fill" style={{width: `${total ? (absent/total)*100 : 0}%`, background: '#dc2626'}}></div></div>
            </div>

            <div className="stat-card-pop fade-in-up" style={{animationDelay: '0.4s'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                    <span style={{color:'#d97706', fontSize: '0.85rem', fontWeight: '700'}}>LATE</span>
                    <b style={{color:'#d97706', fontSize:'1.5rem'}}>{late}</b>
                </div>
                <div className="progress-bar-bg" style={{marginTop:'10px'}}><div className="progress-bar-fill" style={{width: `${total ? (late/total)*100 : 0}%`, background: '#d97706'}}></div></div>
            </div>
        </div>

        {/* ATTENDANCE SHEET (Pagination Added) */}
        <div className="glass-card fade-in-up" style={{ flex: 1, background: 'white', padding: '25px 30px', borderRadius: '24px', animationDelay: '0.5s', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Table Container (No Scroll, Fixed Height) */}
            <div style={{minHeight: '380px'}}> 
                <table className="modern-table luxe-table">
                    <thead>
                        <tr>
                            <th style={{width: '10%'}}>ROLL</th>
                            <th style={{width: '25%'}}>STUDENT</th>
                            <th style={{width: '15%'}}>AVG %</th>
                            <th style={{width: '25%', textAlign: 'center'}}>STATUS</th>
                            <th style={{width: '25%'}}>REMARKS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.map((s, idx) => (
                            <tr key={s.id} className="floating-row" style={{animationDelay: `${idx * 0.05}s`}}>
                                <td><span className="id-pill-Luxe">#{s.roll}</span></td>
                                <td>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                        <div className="mini-avatar-luxe">{s.name.charAt(0)}</div>
                                        <b style={{color: '#334155', fontSize: '0.95rem'}}>{s.name}</b>
                                    </div>
                                </td>
                                <td>
                                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                        <div className="progress-bar-bg" style={{width:'60px', height:'6px'}}>
                                            <div style={{
                                                height:'100%', borderRadius:'4px', width: `${s.monthlyAvg}%`,
                                                background: s.monthlyAvg < 60 ? '#ef4444' : s.monthlyAvg < 85 ? '#f59e0b' : '#10b981'
                                            }}></div>
                                        </div>
                                        <span style={{fontSize:'0.8rem', fontWeight:'700', color: s.monthlyAvg < 75 ? '#ef4444' : '#64748b'}}>{s.monthlyAvg}%</span>
                                    </div>
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <div className="toggle-group-luxe">
                                        <button className={`toggle-btn-anim present ${s.status === 'Present' ? 'active' : ''}`} onClick={() => handleStatusChange(s.id, 'Present')}>P</button>
                                        <button className={`toggle-btn-anim absent ${s.status === 'Absent' ? 'active' : ''}`} onClick={() => handleStatusChange(s.id, 'Absent')}>A</button>
                                        <button className={`toggle-btn-anim late ${s.status === 'Late' ? 'active' : ''}`} onClick={() => handleStatusChange(s.id, 'Late')}>L</button>
                                    </div>
                                </td>
                                <td>
                                    <input type="text" className="remark-input" placeholder={s.status === 'Absent' ? "Reason (e.g. Sick)" : "Optional"} value={s.remarks} disabled={s.status === 'Present'} onChange={(e) => handleRemarkChange(s.id, e.target.value)} style={{ opacity: s.status === 'Present' ? 0.5 : 1, borderColor: s.status === 'Absent' && !s.remarks ? '#fca5a5' : '#e2e8f0' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION CONTROLS */}
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '15px'}}>
                <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    style={{
                        padding: '8px 15px', borderRadius: '8px', border: 'none', 
                        background: currentPage === 1 ? '#f1f5f9' : '#e2e8f0', 
                        color: currentPage === 1 ? '#cbd5e1' : '#475569', 
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold'
                    }}
                >
                    Previous
                </button>
                <span style={{color: '#64748b', fontWeight: '600', fontSize: '0.9rem'}}>
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    style={{
                        padding: '8px 15px', borderRadius: '8px', border: 'none', 
                        background: currentPage === totalPages ? '#f1f5f9' : '#e2e8f0', 
                        color: currentPage === totalPages ? '#cbd5e1' : '#475569', 
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold'
                    }}
                >
                    Next
                </button>
            </div>

            {/* FOOTER ACTIONS */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{display:'flex', alignItems:'center', gap:'10px', cursor:'pointer'}} onClick={() => setNotifyParents(!notifyParents)}>
                    <div style={{
                        width: '40px', height: '22px', background: notifyParents ? '#10b981' : '#cbd5e1',
                        borderRadius: '20px', position: 'relative', transition: '0.3s'
                    }}>
                        <div style={{
                            width: '18px', height: '18px', background: 'white', borderRadius: '50%',
                            position: 'absolute', top: '2px', left: notifyParents ? '20px' : '2px', transition: '0.3s',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}></div>
                    </div>
                    <span style={{color: '#475569', fontWeight: '600', fontSize: '0.9rem'}}>Notify Parents (SMS)</span>
                </div>

                <button className="btn-save-pulse hover-lift-more" onClick={handleSave}>
                    Save Attendance Record
                </button>
            </div>

        </div>

        {/* SUCCESS MODAL */}
        {showSuccess && (
          <div className="overlay-blur centered-flex" style={{zIndex: 3000}}>
              <div className="glass-card bounce-in success-card-luxe">
                <div className="success-ring-luxe"><span className="checkmark-anim">L</span></div>
                <h2 style={{fontSize: '1.6rem', fontWeight: '800', margin: '20px 0 10px', color: '#0f172a'}}>Attendance Locked!</h2>
                <p style={{color: '#64748b', fontSize: '1rem', margin: 0}}>
                    {notifyParents ? `SMS sent to parents of ${absent} absent students.` : "Records updated silently."}
                </p>
              </div>
          </div>
        )}

      </div>

      <style>{`
        /* Animations */
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes checkPop { 0% { transform: scale(0); } 80% { transform: scale(1.2); } 100% { transform: scale(1); } }
        
        .slide-in-left { animation: slideInLeft 0.6s ease-out; }
        .fade-in-up { animation: fadeUp 0.6s ease-out forwards; }
        .bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        /* Custom Styles */
        .luxe-input-animated { padding: 10px 15px; border-radius: 12px; border: 1px solid #cbd5e1; background: white; color: #334155; font-weight: 600; outline: none; transition: 0.2s; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .luxe-input-animated:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
        .stat-card-pop { flex: 1; background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; transition: 0.3s; }
        .stat-card-pop:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
        .progress-bar-bg { background: #f1f5f9; height: 6px; border-radius: 3px; overflow: hidden; }
        .progress-bar-fill { height: 100%; transition: width 0.8s ease-out; border-radius: 3px; }
        .modern-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
        .modern-table th { color: #94a3b8; font-size: 0.75rem; letter-spacing: 1px; text-align: left; padding: 0 15px; font-weight: 700; text-transform: uppercase; }
        .floating-row { background: white; transition: 0.2s; }
        .floating-row td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .floating-row:hover { background: #fcfcfc; }
        .mini-avatar-luxe { width: 36px; height: 36px; background: linear-gradient(135deg, #eef2ff, #e0e7ff); color: #4f46e5; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; }
        .id-pill-Luxe { background: #f8fafc; color: #64748b; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; border: 1px solid #e2e8f0; }
        .toggle-group-luxe { background: #f1f5f9; padding: 4px; border-radius: 10px; display: inline-flex; gap: 5px; }
        .toggle-btn-anim { width: 32px; height: 32px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; transition: 0.2s; background: transparent; color: #94a3b8; font-size: 0.8rem; }
        .toggle-btn-anim:hover { background: #e2e8f0; }
        .toggle-btn-anim.present.active { background: #16a34a; color: white; box-shadow: 0 4px 10px rgba(22, 163, 74, 0.3); }
        .toggle-btn-anim.absent.active { background: #dc2626; color: white; box-shadow: 0 4px 10px rgba(220, 38, 38, 0.3); }
        .toggle-btn-anim.late.active { background: #d97706; color: white; box-shadow: 0 4px 10px rgba(217, 119, 6, 0.3); }
        .remark-input { width: 100%; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; font-size: 0.85rem; color: #334155; transition: 0.2s; background: #fcfcfc; }
        .remark-input:focus { border-color: #cbd5e1; background: white; }
        .btn-save-pulse { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); border: none; color: white; padding: 12px 30px; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2); transition: 0.2s; }
        .btn-save-pulse:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(15, 23, 42, 0.3); }
        .success-card-luxe { background: white; padding: 40px; border-radius: 30px; text-align: center; width: 380px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .success-ring-luxe { width: 80px; height: 80px; background: #ecfdf5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; animation: checkPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .checkmark-anim { font-size: 2.5rem; color: #10b981; transform: rotate(45deg) scaleX(-1); display: inline-block; }
      `}</style>
    </div>
  );
}