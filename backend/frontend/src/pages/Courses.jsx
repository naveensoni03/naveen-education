import React, { useState, useEffect } from "react";
import SidebarModern from "../components/SidebarModern";
import "./dashboard.css"; 
import toast, { Toaster } from 'react-hot-toast';
import api from "../api/axios"; // ✅ Real API connection

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  
  // Panel States
  const [activePanel, setActivePanel] = useState("none"); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [panelTab, setPanelTab] = useState("overview"); 

  // Filters & Categories
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories] = useState(["Development", "Design", "Data Science", "Marketing", "Business"]); 
  const [isAddingCategory, setIsAddingCategory] = useState(false); 
  const [newCategoryName, setNewCategoryName] = useState(""); 

  // Notification States
  const [showSuccess, setShowSuccess] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "", code: "", instructor: "", 
    duration: "", price: "", level: "Beginner",
    category: "Development", 
    description: "", modules: 0,
    image: null 
  });

  const [imagePreview, setImagePreview] = useState(null); 

  // ✅ FIX: Alag-alag photos ki list
  const courseImages = [
    "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80", // Coding
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80", // Python/AI
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80", // Design/Art
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80", // Cyber Security
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", // Marketing
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"  // Data/Analytics
  ];

  // ✅ FETCH REAL COURSES FROM DB
  const fetchCourses = async () => {
    try {
      const response = await api.get("courses/");
      // Backend format handle karna (Array vs Object)
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      // Data ko UI format me map karna (taki purana design na tute)
      const formattedData = data.map((c, index) => ({
        id: c.id,
        title: c.name, // Backend 'name' bhejta hai, frontend 'title' use kar raha hai
        code: `CRS-${100 + index}`, // Auto-generate code if missing
        instructor: "Expert Instructor", // Default placeholder
        students: Math.floor(Math.random() * 200) + 50, // Mock stats
        rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1), // Mock rating
        modules: 12,
        price: 2999, // Default price
        level: "Intermediate",
        category: "Development",
        // ✅ FIX: Index ke hisaab se alag photo uthayega
        image: courseImages[index % courseImages.length],
        description: c.description || "No description available."
      }));

      setCourses(formattedData);
      setFilteredCourses(formattedData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load courses from database");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (categoryFilter === "All") {
        setFilteredCourses(courses);
    } else {
        setFilteredCourses(courses.filter(c => c.category === categoryFilter));
    }
  }, [categoryFilter, courses]);

  // --- ACTIONS ---
  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setPanelTab("overview");
    setActivePanel("detail");
  };

  const handleCreateOpen = () => {
    setSelectedCourse(null);
    setFormData({ title: "", code: "", instructor: "", duration: "", price: "", level: "Beginner", category: categories[0], description: "", modules: 0, image: null });
    setImagePreview(null);
    setIsAddingCategory(false); 
    setActivePanel("create");
  };

  const handleEdit = () => {
    setFormData({
        title: selectedCourse.title,
        code: selectedCourse.code,
        instructor: selectedCourse.instructor,
        price: selectedCourse.price,
        level: selectedCourse.level,
        category: selectedCourse.category,
        description: selectedCourse.description,
        duration: "20 Hrs", 
        modules: selectedCourse.modules,
        image: selectedCourse.image
    });
    setImagePreview(selectedCourse.image);
    setIsAddingCategory(false);
    setActivePanel("create");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file)); 
    }
  };

  // ✅ REAL DELETE FUNCTION
  const handleDelete = async () => {
    if(!selectedCourse) return;
    if(!window.confirm("Are you sure? This will remove the course from Enrollment dropdown too.")) return;

    try {
        await api.delete(`courses/${selectedCourse.id}/`);
        toast.success("Course Deleted Successfully! 🗑️");
        setActivePanel("none");
        fetchCourses(); // Refresh list
    } catch (error) {
        toast.error("Failed to delete course");
    }
  };

  // ✅ REAL SAVE FUNCTION
  const handleSave = async () => {
    if(!formData.title) return toast.error("Title is required");
    
    try {
        const payload = {
            name: formData.title,
            description: formData.description
        };

        if (selectedCourse) {
            await api.put(`courses/${selectedCourse.id}/`, payload);
            toast.success("Course Updated Successfully! ✅");
        } else {
            await api.post("courses/", payload);
            toast.success("New Course Published! 🎉");
        }
        
        setActivePanel("none");
        fetchCourses(); // Refresh List
    } catch (error) {
        toast.error("Server Error: Could not save course");
    }
  };

  // ✅ Add New Category Logic
  const handleAddNewCategory = () => {
      if(!newCategoryName.trim()) return;
      setCategories([...categories, newCategoryName]);
      setFormData({...formData, category: newCategoryName});
      setIsAddingCategory(false);
      setNewCategoryName("");
      toast.success(`Category '${newCategoryName}' Added!`);
  };

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '12px', 
    border: '1px solid #334155', background: '#1e293b', 
    color: '#ffffff', outline: 'none', fontSize: '0.9rem',
    transition: '0.3s'
  };

  return (
    <div className="dashboard-container" style={{background: '#f8fafc', height: '100vh', display: 'flex', overflow: 'hidden', position: 'relative'}}>
      <div className="ambient-bg"></div>
      <SidebarModern />
      <Toaster position="top-center" />

      <div className="main-content" style={{flex: 1, padding: '30px 40px', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column', zIndex: 1}}>
        
        <header className="slide-in-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexShrink: 0 }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px', margin: 0 }}>Course Manager</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500', margin: '5px 0 0' }}>Create, manage and publish learning content.</p>
          </div>
          
          <div style={{display:'flex', gap:'15px'}}>
             <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)} 
                className="filter-select"
             >
                <option value="All">All Categories</option>
                {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
             </select>

             <button className="btn-glow pulse-animation hover-scale-press" onClick={handleCreateOpen}>
                <span style={{marginRight: '8px', fontSize: '1.2rem'}}>+</span> Create New Course
             </button>
          </div>
        </header>

        {/* COURSES GRID */}
        <div className="courses-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', paddingBottom: '30px'}}>
            {filteredCourses.map((course, idx) => (
                <div 
                    key={course.id} 
                    className="course-card fade-in-up" 
                    style={{animationDelay: `${idx * 0.1}s`}}
                    onClick={() => handleCardClick(course)}
                >
                    <div style={{height: '160px', borderRadius: '20px 20px 0 0', position: 'relative', overflow:'hidden'}}>
                        <img src={course.image} alt="Course" style={{width:'100%', height:'100%', objectFit:'cover', transition:'0.5s'}} className="course-img"/>
                        <div className="level-badge">{course.level}</div>
                        <div className="category-tag">{course.category}</div>
                    </div>
                    
                    <div style={{padding: '20px', background: 'white', borderRadius: '0 0 20px 20px', border: '1px solid #f1f5f9', borderTop: 'none'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                            <span style={{fontSize: '0.8rem', color: '#6366f1', fontWeight: '700', background: '#eef2ff', padding: '4px 10px', borderRadius: '8px'}}>{course.code}</span>
                            <span style={{fontSize: '0.8rem', color: '#f59e0b', fontWeight: '700'}}>★ {course.rating}</span>
                        </div>
                        
                        <h3 style={{margin: '0 0 5px', color: '#1e293b', fontSize: '1.1rem'}}>{course.title}</h3>
                        <p style={{margin: '0 0 15px', color: '#64748b', fontSize: '0.9rem'}}>by {course.instructor}</p>
                        
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px'}}>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <span style={{fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600'}}>Price</span>
                                <span style={{fontSize: '1.1rem', color: '#0f172a', fontWeight: '800'}}>₹{course.price}</span>
                            </div>
                            <button className="btn-icon-round hover-scale-press">➜</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* --- SLIDING PANEL --- */}
        {activePanel !== "none" && (
            <div className="overlay-blur" onClick={() => setActivePanel("none")}>
                <div className="luxe-panel slide-in-right" onClick={(e) => e.stopPropagation()}>
                    
                    <div className="panel-header-simple" style={{borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '20px'}}>
                        <div>
                            <h2 style={{margin: '0 0 5px', color: '#0f172a', fontWeight:'800', fontSize: '1.5rem'}}>
                                {activePanel === 'create' ? (selectedCourse ? 'Edit Course' : 'Create Course') : 'Course Details'}
                            </h2>
                            <p style={{margin: 0, color: '#64748b', fontSize: '0.9rem'}}>
                                {activePanel === 'create' ? 'Manage curriculum details.' : selectedCourse?.code}
                            </p>
                        </div>
                        <button className="close-circle-btn hover-rotate" onClick={() => setActivePanel("none")}>✕</button>
                    </div>

                    {activePanel === 'create' && (
                        <div className="panel-content-scroll">
                            
                            <div className="upload-box" style={{marginBottom: '20px', textAlign: 'center', border: '2px dashed #334155', padding: '20px', borderRadius: '12px', background: imagePreview ? `url(${imagePreview}) center/cover` : '#1e293b', position:'relative'}}>
                                {!imagePreview && <span style={{color: '#94a3b8'}}>📁 Click to Upload Thumbnail</span>}
                                <input type="file" accept="image/*" onChange={handleImageUpload} style={{opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer'}} />
                            </div>

                            <div className="input-group"><label>Course Title</label><input type="text" placeholder="e.g. Master React JS" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={inputStyle} /></div>
                            
                            <div className="grid-2-col">
                                <div className="input-group"><label>Course Code</label><input type="text" placeholder="CS-101" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} style={inputStyle} /></div>
                                <div className="input-group"><label>Instructor</label><input type="text" placeholder="Name" value={formData.instructor} onChange={(e) => setFormData({...formData, instructor: e.target.value})} style={inputStyle} /></div>
                            </div>
                            
                            <div className="grid-2-col">
                                <div className="input-group">
                                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                                        <label style={{margin:0}}>Category</label>
                                        <span onClick={() => setIsAddingCategory(!isAddingCategory)} style={{color:'#3b82f6', fontSize:'0.8rem', cursor:'pointer', fontWeight:'600'}}>
                                            {isAddingCategory ? "Select Existing" : "+ Add New"}
                                        </span>
                                    </div>
                                    
                                    {isAddingCategory ? (
                                        <div style={{display:'flex', gap:'5px'}}>
                                            <input type="text" placeholder="New Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} style={inputStyle} autoFocus />
                                            <button onClick={handleAddNewCategory} style={{background:'#10b981', color:'white', border:'none', borderRadius:'12px', padding:'0 15px', cursor:'pointer'}}>✓</button>
                                        </div>
                                    ) : (
                                        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={inputStyle}>
                                            {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                                        </select>
                                    )}
                                </div>
                                
                                <div className="input-group"><label>Level</label>
                                    <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} style={inputStyle}>
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid-2-col">
                                <div className="input-group"><label>Price (₹)</label><input type="number" placeholder="4999" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={inputStyle} /></div>
                                <div className="input-group"><label>Duration</label><input type="text" placeholder="e.g. 3 Months" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} style={inputStyle} /></div>
                            </div>

                            <div className="input-group"><label>Description</label><textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Course details..." style={{...inputStyle, resize:'none'}}></textarea></div>
                            
                            <button className="btn-confirm-gradient hover-lift" onClick={handleSave} style={{width: '100%', padding: '16px', fontSize: '1rem', marginTop:'20px'}}>
                                {selectedCourse ? 'Update Course' : '✨ Publish Course'}
                            </button>
                        </div>
                    )}

                    {activePanel === 'detail' && selectedCourse && (
                        <div className="panel-content-scroll">
                            <div style={{height: '200px', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px', position: 'relative'}}>
                                <img src={selectedCourse.image} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="Course" />
                                <div style={{position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '20px'}}>
                                    <span style={{background:'#6366f1', color:'white', padding:'4px 10px', borderRadius:'10px', fontSize:'0.75rem', fontWeight:'700'}}>{selectedCourse.category}</span>
                                    <h2 style={{fontSize: '1.8rem', fontWeight: '800', margin: '10px 0 0', color: 'white'}}>{selectedCourse.title}</h2>
                                </div>
                            </div>

                            <div style={{display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px'}}>
                                <button className={`tab-text ${panelTab==='overview'?'active':''}`} onClick={()=>setPanelTab('overview')}>Overview</button>
                                <button className={`tab-text ${panelTab==='curriculum'?'active':''}`} onClick={()=>setPanelTab('curriculum')}>Curriculum</button>
                            </div>

                            {panelTab === 'overview' && (
                                <div className="fade-in-up">
                                    <h4 style={{color:'#64748b', fontSize:'0.85rem', fontWeight:'700', marginBottom:'10px', textTransform:'uppercase'}}>Description</h4>
                                    <p style={{color:'#334155', lineHeight:'1.6', fontSize:'0.95rem', marginBottom:'25px'}}>
                                        {selectedCourse.description || "This comprehensive course covers everything from basics to advanced concepts."}
                                    </p>

                                    <div className="grid-2-col" style={{background:'#f8fafc', padding:'15px', borderRadius:'16px'}}>
                                        <div><small style={{color:'#64748b'}}>Students</small><h3 style={{margin:0, color:'#0f172a'}}>{selectedCourse.students}</h3></div>
                                        <div><small style={{color:'#64748b'}}>Modules</small><h3 style={{margin:0, color:'#0f172a'}}>{selectedCourse.modules}</h3></div>
                                        <div><small style={{color:'#64748b'}}>Rating</small><h3 style={{margin:0, color:'#f59e0b'}}>{selectedCourse.rating} ★</h3></div>
                                        <div><small style={{color:'#64748b'}}>Price</small><h3 style={{margin:0, color:'#10b981'}}>₹{selectedCourse.price}</h3></div>
                                    </div>
                                </div>
                            )}

                            {panelTab === 'curriculum' && (
                                <div className="fade-in-up">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} style={{padding: '15px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '10px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                            <div>
                                                <h5 style={{margin:0, color:'#0f172a'}}>Module {i}: Introduction & Setup</h5>
                                                <small style={{color:'#64748b'}}>3 Video Lectures • 45 Mins</small>
                                            </div>
                                            <span style={{fontSize:'1.2rem', color:'#cbd5e1'}}>▶</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{marginTop: '30px', display:'flex', gap:'10px'}}>
                                <button className="btn-confirm-gradient hover-lift" style={{flex: 1}} onClick={handleEdit}>Edit Course ✏️</button>
                                <button className="btn-glow hover-lift" style={{flex: 1, background:'#fee2e2', color:'#dc2626'}} onClick={handleDelete}>Delete 🗑️</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {showSuccess && (
          <div className="overlay-blur centered-flex" style={{zIndex: 3000}}>
              <div className="glass-card bounce-in success-card-luxe">
                <div className="success-ring-luxe"><span className="checkmark-anim">L</span></div>
                <h2 style={{fontSize: '1.5rem', fontWeight: '900', margin: '20px 0 10px', color: '#0f172a'}}>Success!</h2>
                <p style={{color: '#64748b', fontSize: '1rem', margin: 0}}>{notificationMsg}</p>
              </div>
          </div>
        )}

      </div>

      <style>{`
        .gradient-text { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .course-card { border-radius: 20px; transition: 0.3s; cursor: pointer; background: white; overflow: hidden; }
        .course-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
        .course-img:hover { transform: scale(1.05); }

        .level-badge { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .category-tag { position: absolute; bottom: 15px; left: 15px; background: #6366f1; color: white; padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }

        .btn-icon-round { width: 40px; height: 40px; border-radius: 50%; background: #0f172a; color: white; border: none; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .tab-text { background: transparent; border: none; font-weight: 600; color: #94a3b8; font-size: 1rem; padding: 0 10px 10px; cursor: pointer; transition: 0.2s; border-bottom: 2px solid transparent; }
        .tab-text.active { color: #0f172a; border-bottom: 2px solid #0f172a; }
        
        .filter-select { padding: 10px 15px; border-radius: 30px; border: 1px solid #cbd5e1; outline: none; background: white; color: #334155; font-weight: 600; cursor: pointer; }

        @keyframes slideInDown { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes pulseBlue { 0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); } 70% { box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); } 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); } }
        @keyframes checkPop { 0% { transform: scale(0); } 80% { transform: scale(1.2); } 100% { transform: scale(1); } }
        @keyframes rotateAmbient { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes bounceIn { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }

        .slide-in-down { animation: slideInDown 0.7s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .fade-in-up { animation: fadeUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .slide-in-right { animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .pulse-animation { animation: pulseBlue 2s infinite; }
        .bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        .ambient-bg { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at center, rgba(99,102,241,0.08) 0%, rgba(248,250,252,0) 60%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.05) 0%, transparent 50%); animation: rotateAmbient 60s linear infinite; z-index: 0; pointer-events: none; }
        
        .overlay-blur { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px); z-index: 2000; display: flex; justify-content: flex-end; }
        .luxe-panel { width: 500px; height: 100%; background: white; padding: 35px; display: flex; flex-direction: column; box-shadow: -20px 0 60px rgba(0,0,0,0.15); overflow-y: auto; }
        .panel-header-simple { display: flex; justify-content: space-between; alignItems: flex-start; }
        .close-circle-btn { width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; border: none; cursor: pointer; color: #64748b; font-size: 1rem; }

        .btn-confirm-gradient { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); border: none; color: white; border-radius: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2); }
        .btn-glow { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); border: none; color: white; padding: 10px 22px; border-radius: 50px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 15px rgba(99, 102, 241, 0.25); display: flex; align-items: center; font-size: 0.9rem; }

        .success-card-luxe { background: white; padding: 40px; border-radius: 30px; text-align: center; width: 380px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .success-ring-luxe { width: 100px; height: 100px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; animation: checkPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .checkmark-anim { font-size: 3.5rem; color: #10b981; transform: rotate(45deg) scaleX(-1); display: inline-block; }
        .centered-flex { display: flex; alignItems: center; justifyContent: center; }
        .hover-scale-press:hover { transform: scale(1.03); transition: 0.1s; }
        .hover-rotate:hover { transform: rotate(90deg); background: #e2e8f0; transition: 0.2s; }
        .grid-2-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .input-group label { display: block; font-size: 0.85rem; color: #64748b; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.3px; }
      `}</style>
    </div>
  );
}