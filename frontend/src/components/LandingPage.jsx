import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Activity, DollarSign, Users, Mail, Lock, User, ArrowRight, BookOpen, FileText } from 'lucide-react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Simulate authenticating/validating
    setTimeout(() => {
      setLoading(false);
      if (isLogin) {
        onLogin();
      } else {
        onLogin({ name, university, email });
      }
    }, 1200);
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
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-lightPurple to-accent bg-clip-text text-transparent">
              EquiPatent
            </span>
            <span className="text-[8px] block text-accent tracking-widest font-mono uppercase font-bold">V2V Platform</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
          <span>SECURED NODE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-8 my-auto">
        
        {/* Left Column: 3D Parallax visual deck & Text overview */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest font-bold inline-block">
              Deep-tech IP attestation & Escrow
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider leading-tight text-white">
              Bridging the gap between <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Breakthrough Tech</span> and <span className="text-emerald-400">IP Escrow</span>
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
              Despite developing breakthrough concepts in university labs, female STEM innovators face a devastating two-part financial hurdle: they receive less than 3% of venture funding, and exhorbitant legal patent fees leave their designs buried. <strong>EquiPatent</strong> bridges this pipeline safely.
            </p>
          </div>

          {/* 3D Interactive Tilt Card Deck */}
          <div 
            className="relative w-full max-w-xl h-56 flex items-center justify-center pointer-events-auto"
            style={{ perspective: 1000 }}
          >
            <motion.div
              style={{
                rotateX: -mousePos.y * 1.5,
                rotateY: mousePos.x * 1.5,
                transformStyle: 'preserve-3d'
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="absolute w-11/12 h-44 bg-gradient-to-br from-primary/10 via-cardBg/90 to-accent/15 border border-primary/20 rounded-2xl p-6 shadow-neonPrimary/10 flex flex-col justify-between z-20 group hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10" />
              
              <div className="flex justify-between items-start" style={{ transform: 'translateZ(30px)' }}>
                <div className="space-y-1">
                  <span className="text-[10px] text-accent font-bold uppercase tracking-widest font-mono">Stage 01 • Escrow Escort</span>
                  <h3 className="text-base font-extrabold text-white">Phase 1: Prototype Funding</h3>
                </div>
                <Activity className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed max-w-md" style={{ transform: 'translateZ(20px)' }}>
                Micro-grants dynamically unlocked only upon system-validated technical milestones, such as verified Git commits and verified peer-review papers.
              </p>
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono" style={{ transform: 'translateZ(10px)' }}>
                <span>Escrow Smart Contract Locked</span>
                <span className="text-white font-bold">100% SECURE</span>
              </div>
            </motion.div>

            {/* Back Stacked Card */}
            <div 
              style={{
                transform: `rotateX(${-mousePos.y * 0.8}deg) rotateY(${mousePos.x * 0.8}deg) translateZ(-40px) translateY(24px) scale(0.95)`
              }}
              className="absolute w-11/12 h-44 bg-gradient-to-br from-emerald-500/10 via-cardBg/90 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 opacity-60 z-10 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest font-mono">Stage 02 • Attestation Ledger</span>
                  <h3 className="text-base font-extrabold text-white">Phase 2: Fractional IP Shares</h3>
                </div>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Unlock fractional IP patent shares for alumni and backers to cover patent filing fees, in exchange for micro-royalties on future software licensing.
              </p>
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>Royalty Ledger Ledgerized</span>
                <span className="text-emerald-400 font-bold">FRACTIONAL IP</span>
              </div>
            </div>
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
                  Sign In Node
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    !isLogin ? 'bg-primary text-white shadow-neonPrimary' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Register Node
                </button>
              </div>

              <div className="text-left space-y-1">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  {isLogin ? "Authenticate Credentials" : "Initialize Developer Profile"}
                </h3>
                <p className="text-[11px] text-gray-500">Access your deep-tech innovation workspace and patent vaults.</p>
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
                      {isLogin ? "Attest Innovation Node" : "Register Node Profile"}
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
