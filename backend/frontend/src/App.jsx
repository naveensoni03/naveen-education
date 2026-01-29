import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Enrollments from "./pages/Enrollments";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";
import Institutions from "./pages/Institutions";
import Teachers from "./pages/Teachers";
import FeesLedger from "./pages/FeesLedger";
import SystemConfig from './pages/SystemConfig';
import Exams from "./pages/Exams";
import Homework from "./pages/Homework";
import Library from "./pages/Library";
import Transport from "./pages/Transport";
import Hostel from "./pages/Hostel";
import Inventory from "./pages/Inventory";
// ✅ Import ChatWidget
import ChatWidget from './components/ChatWidget';

export default function App() {
  return (
    <Router>
      <div className="app-layout">
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Priority Routes */}
          <Route path="/enrollments" element={<Enrollments />} />
          <Route path="/library" element={<Library />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/hostel" element={<Hostel />} />
          <Route path="/inventory" element={<Inventory />} />
          
          {/* Core Modules */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/homework" element={<Homework />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/fees" element={<FeesLedger />} />
          <Route path="/system" element={<SystemConfig />} />

          {/* Catch-all Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        {/* ✅ AI CHATBOT ADDED HERE */}
        <ChatWidget />
      </div>
    </Router>
  );
}