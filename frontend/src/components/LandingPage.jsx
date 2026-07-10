// Simpler Landing Page (Reverted Design)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Activity, DollarSign, Users, Mail, Lock, User, ArrowRight, BookOpen, FileText, Cpu, LockKeyhole } from 'lucide-react';

export default function LandingPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Mouse Parallax coordinates for 3D card tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) / 25;
      const y = (clientY - window.innerHeight / 2) / 25;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Invalid email or password.');
        }
        
        const userData = await response.json();
        // Save user email to identify active session in profile calls
        localStorage.setItem('userEmail', email);
        onLogin();
      } else {
        if (!name.trim() || !university.trim()) {
          throw new Error('Name and university affiliation are required for registration.');
        }
        
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, university, email, password })
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Registration failed.');
        }
        
        const userData = await response.json();
        localStorage.setItem('userEmail', email);
        onLogin({ name, university, email });
      }
    } catch (err) {
      if (!isLogin) {
        setErrorMsg('makesure that you are already registered!');
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07080a] text-white overflow-hidden flex flex-col justify-between p-6 sm:p-12 font-sans select-none">
      
      {/* Background Neon Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-[35%] left-[25%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center relative z-20 pb-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-neonPrimary">
            <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="9" r="5" />
              <path d="M12 14v7" />
              <path d="M9 18h6" />
              <circle cx="12" cy="9" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="text-left">
            <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-lightPurple to-accent bg-clip-text text-transparent">
              EquiPatent
            </span>
            <span className="text-[8px] block text-accent tracking-widest font-mono uppercase font-bold">V2V Platform</span>
          </div>
        </div>
              <div className="flex flex-col items-end text-[10px] font-mono text-gray-400 gap-1 text-right">
        <span className="text-[9px] uppercase tracking-wider text-gray-500">Co-Founded by:</span>
        <div className="flex flex-col gap-1 items-end">
          <a href="https://github.com/amancse420142" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
            <span>amancse420142</span>
            <svg className="w-3 h-3 fill-current text-gray-400 hover:text-white transition-colors" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="https://github.com/swarajpattnaik84" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
            <span>swarajpattnaik84</span>
            <svg className="w-3 h-3 fill-current text-gray-400 hover:text-white transition-colors" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
      </div>
      </header>

      {/* Main Hero Container */}
      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-8 my-auto">
        
        {/* Left Column: 3D Parallax visual deck & Text overview */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest font-bold inline-block">
              Two stage deep tech solution
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider leading-tight text-white">
              Empowering <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-accent bg-clip-text text-transparent">Women</span> to Build Their Innovations into <span className="text-fuchsia-400">Reality</span>
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
              We empower female STEM innovators by providing milestone-based capital for prototypes and preparing projects for production and deployment. **EquiPatent** helps you turn university lab research into market-ready tech.
            </p>
          </div>

          {/* Side-by-Side Phase 1 & Phase 2 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
            {/* Phase 1 Card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-gradient-to-br from-primary/10 via-[#0d0e12]/95 to-accent/5 border border-primary/20 rounded-2xl p-5 shadow-neonPrimary/5 flex flex-col justify-between min-h-[290px] relative group hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10" />
              
              {/* 3D Holographic Cube Model */}
              <div className="relative w-full h-24 flex items-center justify-center overflow-visible select-none mb-2" style={{ perspective: 1000 }}>
                <motion.div
                  animate={{ rotateY: 360, rotateX: [15, 25, 15] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="w-14 h-14 relative"
                >
                  <div className="absolute inset-0 bg-primary/15 border-2 border-primary/40 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.25)]" style={{ transform: 'translateZ(28px)' }}>
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center" style={{ transform: 'rotateY(180deg) translateZ(28px)' }}>
                    <Cpu className="w-4 h-4 text-primary/40" />
                  </div>
                  <div className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-xl" style={{ transform: 'rotateY(-90deg) translateZ(28px)' }} />
                  <div className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-xl" style={{ transform: 'rotateY(90deg) translateZ(28px)' }} />
                  <div className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-xl" style={{ transform: 'rotateX(90deg) translateZ(28px)' }} />
                  <div className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-xl" style={{ transform: 'rotateX(-90deg) translateZ(28px)' }} />
                </motion.div>
              </div>

              <div className="flex justify-between items-start text-left">
                <div className="space-y-1">
                  <span className="text-[10px] text-accent font-bold uppercase tracking-widest font-mono">Stage 01</span>
                  <h3 className="text-sm font-extrabold text-white">Phase 1: Prototype Funding</h3>
                </div>
              </div>
              
              <p className="text-[11px] text-gray-400 leading-relaxed mt-2.5 text-left">
                Micro-grants dynamically unlocked only upon system-validated technical milestones, such as verified Git commits and verified peer-review papers.
              </p>
              
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono mt-4 border-t border-white/5 pt-2">
                <span>Escrow Contract</span>
                <span className="text-white font-bold">SECURE</span>
              </div>
            </motion.div>

            {/* Phase 2 Card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-gradient-to-br from-emerald-500/10 via-[#0d0e12]/95 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-5 shadow-neonAccent/5 flex flex-col justify-between min-h-[290px] relative group hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10" />
              
              {/* 3D Holographic Cube Model */}
              <div className="relative w-full h-24 flex items-center justify-center overflow-visible select-none mb-2" style={{ perspective: 1000 }}>
                <motion.div
                  animate={{ rotateY: -360, rotateX: [15, 25, 15] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="w-14 h-14 relative"
                >
                  <div className="absolute inset-0 bg-emerald-500/15 border-2 border-emerald-500/40 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.25)]" style={{ transform: 'translateZ(28px)' }}>
                    <LockKeyhole className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center" style={{ transform: 'rotateY(180deg) translateZ(28px)' }}>
                    <LockKeyhole className="w-4 h-4 text-emerald-400/40" />
                  </div>
                  <div className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 rounded-xl" style={{ transform: 'rotateY(-90deg) translateZ(28px)' }} />
                  <div className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 rounded-xl" style={{ transform: 'rotateY(90deg) translateZ(28px)' }} />
                  <div className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 rounded-xl" style={{ transform: 'rotateX(90deg) translateZ(28px)' }} />
                  <div className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 rounded-xl" style={{ transform: 'rotateX(-90deg) translateZ(28px)' }} />
                </motion.div>
              </div>

              <div className="flex justify-between items-start text-left">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest font-mono">Stage 02</span>
                  <h3 className="text-sm font-extrabold text-white">Phase 2: Production Launch</h3>
                </div>
              </div>
              
              <p className="text-[11px] text-gray-400 leading-relaxed mt-2.5 text-left">
                Transition your validated prototype into a production-grade application, fully optimized for final deployment and global market launch.
              </p>
              
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono mt-4 border-t border-white/5 pt-2">
                <span>Status</span>
                <span className="text-emerald-400 font-bold">PRODUCTION READY</span>
              </div>
            </motion.div>
          </div>

          {/* Quick Statistics Banner */}
          <div className="grid grid-cols-3 gap-6 pt-4 max-w-xl">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-1">
              <span className="text-2xl font-black text-white font-mono tracking-tight">&lt; 3%</span>
              <p className="text-[9px] font-mono text-gray-500 uppercase">VC Capital Received</p>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-1">
              <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">100%</span>
              <p className="text-[9px] font-mono text-gray-500 uppercase">Git Attested Milestone</p>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-1">
              <span className="text-2xl font-black text-accent font-mono tracking-tight">4.0M</span>
              <p className="text-[9px] font-mono text-gray-500 uppercase">IP Escrow Locked</p>
            </div>
          </div>

        </div>

        {/* Right Column: Premium Auth Card Form */}
        <div className="lg:col-span-5 relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none z-0" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 border-primary/20 bg-[#0d0e12]/80 backdrop-blur-md rounded-3xl relative z-10 shadow-[0_20px_50px_rgba(217,70,239,0.08)] flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Form Tab Header Toggle */}
              <div className="flex bg-black/40 border border-white/5 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    isLogin ? 'bg-primary text-white shadow-neonPrimary' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    !isLogin ? 'bg-primary text-white shadow-neonPrimary' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>

              <div className="text-left space-y-1">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  {isLogin ? "Authenticate Credentials" : "Initialize Developer Profile"}
                </h3>
                <p className="text-[11px] text-gray-500">Access your deep-tech innovation workspace and deployment dashboard.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Form fields with slide animation on register toggle */}
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="register-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="space-y-1 text-left">
                        <label className="text-[9px] text-gray-400 font-mono uppercase tracking-wider font-bold">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                            placeholder="Dr. Elena Rostova"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[9px] text-gray-400 font-mono uppercase tracking-wider font-bold">University affiliation</label>
                        <div className="relative">
                          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                            placeholder="Stanford University"
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] text-gray-400 font-mono uppercase tracking-wider font-bold">Corporate Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                      placeholder="rostova@stanford.edu"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] text-gray-400 font-mono uppercase tracking-wider font-bold">Password Key</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                      placeholder="••••••••••••"
                      required
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-[10px] text-red-400 text-left font-mono">{errorMsg}</p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-neonPrimary/25 hover:shadow-neonPrimary/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Decrypting Node...
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Simulated wallet link info */}
            <div className="border-t border-white/5 pt-4 mt-6 text-center">
              <span className="text-[9px] text-gray-500 font-mono block">
                Secured via Cryptographic attestation protocols. 
              </span>
            </div>

          </motion.div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto text-center border-t border-primary/20 pt-4 text-[10px] text-gray-500 font-mono flex flex-col sm:flex-row justify-between gap-4 relative z-10">
        <span>© 2026 EquiPatent technologies. Seeded via MERN stack.</span>
        <div className="flex gap-4 justify-center">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </footer>

    </div>
  );
}
