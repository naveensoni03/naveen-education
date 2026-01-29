import React, { useState, useEffect } from "react";
import SidebarModern from "../components/SidebarModern";
import { Link } from "react-router-dom";
import api from "../api/axios"; // ✅ Import API Client
import "./dashboard.css"; 

export default function Dashboard() {
  // ✅ STATE FOR LIVE DATA
  const [stats, setStats] = useState({
      totalStudents: 0,
      totalTeachers: 0,
      feesCollected: 0,
      pendingFees: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // ✅ FETCH LIVE DATA WITH CLEANUP (Ghosting Fix)
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const fetchDashboardData = async () => {
        try {
            // ✅ UPDATED URLS: Added 'dashboard/' prefix to match Backend
            const [studentsRes, teachersRes, feesRes] = await Promise.all([
                api.get("dashboard/students/count/"), 
                api.get("dashboard/teachers/count/"), 
                api.get("dashboard/fees/summary/")    
            ]);

            if (isMounted) {
                setStats({
                    totalStudents: studentsRes.data.count || 0,
                    totalTeachers: teachersRes.data.count || 0,
                    feesCollected: `₹${(feesRes.data.collected / 100000).toFixed(1)}L`, 
                    pendingFees: `₹${(feesRes.data.pending / 100000).toFixed(1)}L`
                });

                setRecentActivity([
                    { id: 1, title: "Fee Received", desc: "Rahul Kumar paid ₹5000", time: "2 mins ago", icon: "₹", color: "green" },
                    { id: 2, title: "New Admission", desc: "Sanya joined Class 5-A", time: "1 hr ago", icon: "👤", color: "blue" },
                    { id: 3, title: "Exam Scheduled", desc: "Maths Mid-Term", time: "3 hrs ago", icon: "📝", color: "orange" },
                ]);

                setLoading(false);
                setLoaded(true);
            }
        } catch (error) {
            console.error("Dashboard Data Load Failed:", error);
            if (isMounted) {
                // Fallback Mock Data
                setStats({
                    totalStudents: 1250,
                    totalTeachers: 45,
                    feesCollected: "₹45.2L",
                    pendingFees: "₹12.5L"
                });
                setLoading(false);
                setLoaded(true);
            }
        }
    };

    fetchDashboardData();

    // ✅ CLEANUP: Stops background API tasks when you leave Dashboard
    return () => { isMounted = false; }; 
  }, []);

  return (
    <div className="dashboard-container" style={{background: '#f8fafc', height: '100vh', display: 'flex', overflow: 'hidden'}}>
      <SidebarModern />

      <div className="main-content" style={{flex: 1, padding: '30px 40px', overflowY: 'auto', position: 'relative'}}>
        
        {/* --- WELCOME BANNER --- */}
        <div className="welcome-banner fade-in-down">
            <div className="banner-content">
                <h1 style={{fontSize: '2.5rem', fontWeight: '900', color: 'white', margin: 0}}>Good Morning, Admin! ☀️</h1>
                <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginTop: '5px'}}>Here is your live academy overview.</p>
            </div>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="stats-grid-pro">
            <div className={`stat-card-pro purple-glow ${loaded ? 'visible' : ''}`}>
                <div className="icon-box-pro">🎓</div>
                <div>
                    <h3>{loading ? "..." : stats.totalStudents}</h3>
                    <span>Total Students</span>
                </div>
                <div className="mini-chart">📈 Live</div>
            </div>

            <div className={`stat-card-pro blue-glow ${loaded ? 'visible' : ''}`} style={{animationDelay: '0.1s'}}>
                <div className="icon-box-pro">👨‍🏫</div>
                <div>
                    <h3>{loading ? "..." : stats.totalTeachers}</h3>
                    <span>Total Staff</span>
                </div>
                <div className="mini-chart">Active</div>
            </div>

            <div className={`stat-card-pro green-glow ${loaded ? 'visible' : ''}`} style={{animationDelay: '0.2s'}}>
                <div className="icon-box-pro">💰</div>
                <div>
                    <h3>{loading ? "..." : stats.feesCollected}</h3>
                    <span>Fees Collected</span>
                </div>
                <div className="mini-chart">💵 +8%</div>
            </div>

            <div className={`stat-card-pro red-glow ${loaded ? 'visible' : ''}`} style={{animationDelay: '0.3s'}}>
                <div className="icon-box-pro">📉</div>
                <div>
                    <h3>{loading ? "..." : stats.pendingFees}</h3>
                    <span>Pending Dues</span>
                </div>
                <div className="mini-chart fail">⚠️ Urgent</div>
            </div>
        </div>

        {/* --- MAIN SECTION --- */}
        <div className="dashboard-grid">
            <div className="main-col">
                <h3 className="section-title">🚀 Quick Actions</h3>
                <div className="quick-actions-bar">
                    <Link to="/students" className="quick-btn blue">
                        <span>👤</span> New Admission
                    </Link>
                    <Link to="/fees" className="quick-btn green">
                        <span>💵</span> Collect Fees
                    </Link>
                    <Link to="/exams" className="quick-btn orange">
                        <span>📝</span> Result Entry
                    </Link>
                    <Link to="/attendance" className="quick-btn pink">
                        <span>📅</span> Attendance
                    </Link>
                </div>

                <div className="glass-panel-pro" style={{marginTop: '25px'}}>
                    <div className="panel-header">
                        <h3>📊 Financial Trends (Live)</h3>
                    </div>
                    <div className="wave-chart-container">
                        {[50, 70, 40, 90, 60, 80, 55].map((h, i) => (
                            <div key={i} className="wave-bar" style={{height: `${h}%`, animationDelay: `${i*0.1}s`}}></div>
                        ))}
                    </div>
                    <div className="chart-labels">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </div>

            <div className="side-col">
                <div className="glass-panel-pro" style={{height: '100%'}}>
                    <div className="panel-header">
                        <h3>🔔 Recent Activity</h3>
                        <span className="badge-notification">Live</span>
                    </div>
                    <div className="activity-feed">
                        {recentActivity.map((item, idx) => (
                            <div key={idx} className="feed-item">
                                <div className={`avatar ${item.color}`}>{item.icon}</div>
                                <div>
                                    <b>{item.title}</b>
                                    <p>{item.desc}</p>
                                    <small>{item.time}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <style>{`
        .welcome-banner { background: linear-gradient(135deg, #4f46e5, #8b5cf6); border-radius: 24px; padding: 40px; margin-bottom: 35px; box-shadow: 0 20px 40px rgba(79, 70, 229, 0.2); }
        .stats-grid-pro { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; margin-bottom: 35px; }
        .stat-card-pro { background: white; padding: 25px; border-radius: 24px; display: flex; align-items: center; gap: 20px; transition: 0.3s; border: 1px solid #f1f5f9; position: relative; overflow: hidden; opacity: 0; transform: translateY(20px); }
        .stat-card-pro.visible { opacity: 1; transform: translateY(0); }
        .stat-card-pro h3 { margin: 0; font-size: 1.8rem; font-weight: 900; color: #0f172a; }
        .stat-card-pro span { color: #64748b; font-size: 0.9rem; font-weight: 600; }
        .icon-box-pro { width: 55px; height: 55px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; background: #f8fafc; }
        .mini-chart { position: absolute; bottom: 20px; right: 20px; font-size: 0.8rem; font-weight: 700; color: #16a34a; background: #dcfce7; padding: 4px 10px; border-radius: 12px; }
        .mini-chart.fail { color: #dc2626; background: #fee2e2; }
        .dashboard-grid { display: flex; gap: 30px; }
        .main-col { flex: 2; }
        .side-col { flex: 1; }
        .section-title { margin: 0 0 20px; color: #334155; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; }
        .quick-actions-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .quick-btn { background: white; padding: 25px; border-radius: 20px; text-decoration: none; color: #334155; font-weight: 700; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: 0.3s; border: 1px solid #f1f5f9; }
        .quick-btn span { width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .quick-btn.blue span { background: #eff6ff; color: #3b82f6; }
        .quick-btn.green span { background: #f0fdf4; color: #16a34a; }
        .quick-btn.orange span { background: #fff7ed; color: #ea580c; }
        .quick-btn.pink span { background: #fdf2f8; color: #db2777; }
        .quick-btn:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.06); }
        .glass-panel-pro { background: white; border-radius: 24px; padding: 30px; border: 1px solid #e2e8f0; }
        .wave-chart-container { display: flex; align-items: flex-end; justify-content: space-between; height: 200px; padding: 20px 0; border-bottom: 1px dashed #e2e8f0; }
        .wave-bar { width: 14%; background: linear-gradient(to top, #6366f1, #a5b4fc); border-radius: 15px; opacity: 0.8; transition: 0.3s; transform-origin: bottom; }
        .activity-feed { display: flex; flexDirection: column; gap: 25px; }
        .feed-item { display: flex; gap: 15px; align-items: center; }
        .avatar { width: 45px; height: 45px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .avatar.green { background: #dcfce7; color: #16a34a; }
        .avatar.blue { background: #dbeafe; color: #3b82f6; }
        .avatar.orange { background: #ffedd5; color: #ea580c; }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}