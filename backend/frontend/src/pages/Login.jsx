import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import api from "../api/axios";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await api.post("/auth/token/", { email, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      setError("Incorrect email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg">
      {/* Background Decorative Circles */}
      <div style={{ position: 'absolute', width: '300px', height: '300px', background: '#6366f1', filter: 'blur(100px)', opacity: 0.1, top: '10%', left: '10%' }}></div>
      <div style={{ position: 'absolute', width: '300px', height: '300px', background: '#a855f7', filter: 'blur(100px)', opacity: 0.1, bottom: '10%', right: '10%' }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="login-card"
      >
        <div style={{ textAlign: 'center' }}>
            <motion.div 
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
              style={{ display: 'inline-block', marginBottom: '1rem' }}
            >
               <ShieldCheck size={48} color="#6366f1" />
            </motion.div>
            <h2>Welcome Back</h2>
            <p className="subtitle">Secure access to Shivadda CRM</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="error"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin}>
          <div className="input-container">
            <Mail className="input-icon" size={20} />
            <input 
              type="email"
              placeholder="Email Address" 
              required
              autoComplete="email"
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          <div className="input-container">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <>
                Sign In <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a href="#" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
              Forgot Password?
            </a>
        </div>
      </motion.div>
    </div>
  );
}
