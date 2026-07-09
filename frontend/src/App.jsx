import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BadgeCheck, 
  Settings, 
  Edit3, 
  Save, 
  X, 
  Wallet, 
  BookOpen, 
  Cpu, 
  CheckCircle,
  HelpCircle,
  Network,
  LogOut,
  FolderKanban,
  User,
  ShieldCheck,
  TrendingUp,
  Activity,
  UserCheck,
  Compass,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from './services/api';
import { ParticleCanvas } from './components/ParticleCanvas';

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace', 'profile', 'wallet'
  const [activeCard, setActiveCard] = useState(0); // 0: Identity, 1: Bio, 2: Skills, 3: Credentials
  const [error, setError] = useState(null);

  // Form State
  const [editName, setEditName] = useState('');
  const [editUniversity, setEditUniversity] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editWallet, setEditWallet] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
      
      // Initialize edit fields
      setEditName(data.name);
      setEditUniversity(data.university);
      setEditDepartment(data.department);
      setEditRole(data.role);
      setEditBio(data.bio);
      setEditSkills(data.skills ? data.skills.join(', ') : '');
      setEditWallet(data.walletAddress || '');
    } catch (err) {
      console.error('Error fetching profile', err);
      setError('Could not connect to MERN backend. Server might be offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleNextCard = () => {
    setActiveCard((prev) => (prev + 1) % 4);
  };

  const handlePrevCard = () => {
    setActiveCard((prev) => (prev - 1 + 4) % 4);
  };

  // Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab === 'profile' && !isModalOpen) {
        if (e.key === 'ArrowRight') {
          handleNextCard();
        } else if (e.key === 'ArrowLeft') {
          handlePrevCard();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isModalOpen]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const skillsArray = editSkills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const payload = {
        name: editName,
        university: editUniversity,
        department: editDepartment,
        role: editRole,
        bio: editBio,
        skills: skillsArray,
        walletAddress: editWallet
      };

      const updatedProfile = await api.updateProfile(payload);
      setProfile(updatedProfile);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsModalOpen(false);
      }, 1000);
    } catch (err) {
      alert('Failed to save profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-darkBg text-white space-y-4 font-sans">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm font-medium">Bootstrapping profile portal...</p>
      </div>
    );
  }

  // Simulated Web3 Transaction Ledger for Web3 Vault Tab
  const mockTransactions = [
    { id: 1, action: 'Escrow Milestone 1 Disbursed', amount: '+$15,000 USDT', status: 'Success', date: 'Jul 05, 2026' },
    { id: 2, action: 'Patent Shares Sold (Backer Pool)', amount: '+$9,800 USDT', status: 'Success', date: 'Jul 02, 2026' },
    { id: 3, action: 'Escrow Contract Setup Fee', amount: '-$200 USDT', status: 'Success', date: 'Jun 28, 2026' }
  ];

  // 3D Cover-Flow / Rotary Carousel Position Calculations
  const getCarouselCardAnimation = (cardId) => {
    const totalCards = 4;
    let diff = cardId - activeCard;
    
    // Normalize diff to stay within [-1, 2] to cycle correctly
    if (diff < -1) diff += totalCards;
    if (diff > 2) diff -= totalCards;

    if (diff === 0) {
      // Center active card
      return {
        x: 0,
        scale: 1,
        rotateY: 0,
        opacity: 1,
        zIndex: 30,
        pointerEvents: 'auto'
      };
    } else if (diff === 1 || diff === -3) {
      // Right card
      return {
        x: 320,
        scale: 0.8,
        rotateY: -40,
        opacity: 0.4,
        zIndex: 20,
        pointerEvents: 'none'
      };
    } else if (diff === -1 || diff === 3) {
      // Left card
      return {
        x: -320,
        scale: 0.8,
        rotateY: 40,
        opacity: 0.4,
        zIndex: 20,
        pointerEvents: 'none'
      };
    } else {
      // Hidden card (sitting at the back of the loop)
      return {
        x: 0,
        scale: 0.6,
        rotateY: 180,
        opacity: 0,
        zIndex: 10,
        pointerEvents: 'none'
      };
    }
  };

  // Drag swiping end handler
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 80;
    if (info.offset.x < -swipeThreshold) {
      handleNextCard();
    } else if (info.offset.x > swipeThreshold) {
      handlePrevCard();
    }
  };

  return (
    <div className="relative min-h-screen bg-darkBg text-white font-sans flex flex-col justify-between p-6 sm:p-8 overflow-hidden select-none">
      
      {/* Interactive Network Particle Background */}
      <ParticleCanvas />
      
      {/* Background Neon Glow Blobs */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-accent/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[25%] left-[35%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Global Header */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between relative z-10 border-b border-primary/20 pb-4 mb-8">
        
        {/* Left Brand & Navigation tabs */}
        <div className="flex items-center gap-8">
          <div onClick={() => setActiveTab('workspace')} className="cursor-pointer flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-neonPrimary transition-transform group-hover:scale-105">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-lightPurple to-accent bg-clip-text text-transparent">
                EquiPatent
              </span>
              <span className="text-[9px] block text-accent tracking-widest font-mono uppercase font-bold">MERN Core</span>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setActiveTab('workspace')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                activeTab === 'workspace'
                  ? 'bg-gradient-to-r from-primary/30 to-accent/20 border-primary text-white shadow-neonPrimary/30'
                  : 'bg-cardBg/40 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
              }`}
            >
              <Compass className="w-4 h-4 text-primary" />
              Workspace
            </button>
            <button
              onClick={() => {
                setActiveTab('profile');
                setActiveCard(0);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-primary/30 to-accent/20 border-primary text-white shadow-neonPrimary/30'
                  : 'bg-cardBg/40 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
              }`}
            >
              <User className="w-4 h-4 text-accent" />
              HER Profile
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-primary/30 to-accent/20 border-primary text-white shadow-neonPrimary/30'
                  : 'bg-cardBg/40 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-secondary" />
              MyProjects
            </button>
          </nav>
        </div>

        {/* Right Side: Avatar Logo & Edit Profile Action */}
        {!error && profile && (
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-white leading-none">{profile.name}</p>
                <span className="text-[10px] font-semibold text-accent font-mono uppercase tracking-wider block mt-1">
                  {profile.role.split(',')[0]}
                </span>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveTab('profile');
                  setActiveCard(0);
                }}
                className={`relative p-0.5 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent shadow-neonPrimary cursor-pointer focus:outline-none transition-all duration-300 ${
                  activeTab === 'profile' ? 'ring-2 ring-accent shadow-neonAccent' : ''
                }`}
              >
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-darkBg"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-darkBg flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </span>
              </motion.button>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-accent hover:text-white transition-all flex items-center gap-1.5 font-bold cursor-pointer border border-accent/30 bg-accent/5 hover:bg-accent/15 px-3.5 py-1.5 rounded-xl mt-1.5 shadow-neonAccent/5 hover:shadow-neonAccent/20"
            >
              <Edit3 className="w-3.5 h-3.5 text-accent" />
              Edit Profile
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto flex-1 relative z-10 flex flex-col justify-start">
        
        {error && (
          <div className="glass-card p-8 border-red-500/20 text-center space-y-4 max-w-md mx-auto my-12 text-white">
            <span className="text-3xl">⚠️</span>
            <p className="text-sm text-red-400 font-medium leading-relaxed">{error}</p>
            <button 
              onClick={fetchProfile}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {!error && profile && (
          <AnimatePresence mode="wait">
            
            {/* 1. WORKSPACE VIEW */}
            {activeTab === 'workspace' && (
              <motion.div
                key="workspace-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
              >
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass-card p-10 border-primary/20 text-center min-h-[45vh] flex flex-col justify-center items-center space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-60 h-60 bg-primary/10 rounded-full blur-[90px] pointer-events-none" />
                    
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent border border-primary/20 flex items-center justify-center text-white text-3xl shadow-neonPrimary">
                      ⚡
                    </div>
                    
                    <div className="space-y-3 max-w-lg">
                      <h2 className="text-xl font-extrabold text-white tracking-wide uppercase">EquiPatent Workspace Core</h2>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        Welcome to your deep-tech incubator channel. You are currently logged in as <strong className="text-accent">{profile.name}</strong>. MERN databases, schemas, and API bridges have been fully established.
                      </p>
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl max-w-xl text-sm text-gray-300 leading-relaxed flex items-start gap-3 text-left">
                      <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p>
                        <strong>Modular Framework</strong>: This is the workspace canvas. Additional tabs (such as milestone proof uploads, patent filing checklists, and fractional investment pools) will be integrated here step-by-step.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6 text-left">
                  <div className="glass-card p-6 border-primary/20 space-y-5">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                      Pipeline Status
                    </h4>
                    
                    <div className="space-y-4 font-mono text-sm pt-1">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">Owner:</span>
                        <span className="text-white font-bold">{profile.name}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">Institutional IP:</span>
                        <span className="text-white font-bold">Stanford Tech Hub</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">AI Innovation:</span>
                        <span className="text-emerald-400 font-bold">{profile.innovationScore}%</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">Vault Wallet:</span>
                        <span className="text-accent font-bold">Connected</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setActiveCard(0);
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent font-bold text-white text-sm transition-all shadow-neonPrimary hover:shadow-neonAccent"
                    >
                      Audit HER Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. HER PROFILE: centered 3D ROTARY STAGE CAROUSEL */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col justify-between space-y-6 relative"
              >
                {/* Carousel wrapper with relative anchor for floating arrows */}
                <div className="relative w-full max-w-5xl mx-auto px-4 md:px-12">
                  
                  {/* Floating Chevron Left Arrow (Middle Left) */}
                  <button
                    onClick={handlePrevCard}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 bg-cardBg/80 border border-primary/30 p-3 rounded-full text-white hover:bg-primary/20 transition-all hover:scale-110 shadow-neonPrimary hover:shadow-neonAccent cursor-pointer focus:outline-none"
                  >
                    <ChevronLeft className="w-6 h-6 text-accent" />
                  </button>

                  {/* 3D Perspective Coverflow Carousel Track */}
                  <div 
                    className="relative w-full h-[450px] flex items-center justify-center overflow-visible"
                    style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
                  >
                    
                    {/* CARD 0: ACADEMIC IDENTITY */}
                    <motion.div
                      animate={getCarouselCardAnimation(0)}
                      onClick={() => setActiveCard(0)}
                      drag={activeCard === 0 ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.6}
                      onDragEnd={handleDragEnd}
                      transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                      className={`absolute w-full max-w-lg h-[400px] glass-card p-8 border-primary/20 flex flex-col justify-between overflow-hidden shadow-glass select-none ${
                        activeCard === 0 ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="flex justify-between items-start border-b border-white/5 pb-4">
                        <div className="space-y-1">
                          <span className="text-xs text-accent font-bold uppercase tracking-widest font-mono">Profile Details • Node 01</span>
                          <h3 className="text-lg font-extrabold text-white">Academic Identity</h3>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">Verified</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-6 py-6 text-left">
                        <div className="relative flex-shrink-0">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent p-1 shadow-neonPrimary">
                            <img 
                              src={profile.avatar} 
                              alt={profile.name} 
                              className="w-full h-full object-cover rounded-full border-4 border-cardBg"
                            />
                          </div>
                          <span className="absolute bottom-0 right-0 w-5.5 h-5.5 rounded-full bg-emerald-500 border-4 border-cardBg" />
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <h4 className="text-xl font-extrabold text-white flex items-center gap-1.5 truncate">
                            {profile.name}
                            {profile.verified && <BadgeCheck className="w-5 h-5 text-accent shrink-0" />}
                          </h4>
                          <p className="text-sm text-gray-200 font-semibold truncate">{profile.role}</p>
                          <p className="text-xs text-gray-400 font-medium truncate">{profile.university} • {profile.department}</p>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 text-xs text-gray-400 text-left flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        Swipe / Drag card, use Left/Right Arrows or keyboard to navigate.
                      </div>
                    </motion.div>

                    {/* CARD 1: RESEARCH BIOGRAPHY */}
                    <motion.div
                      animate={getCarouselCardAnimation(1)}
                      onClick={() => setActiveCard(1)}
                      drag={activeCard === 1 ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.6}
                      onDragEnd={handleDragEnd}
                      transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                      className={`absolute w-full max-w-lg h-[400px] glass-card p-8 border-primary/20 flex flex-col justify-between overflow-hidden shadow-glass select-none ${
                        activeCard === 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="flex justify-between items-start border-b border-white/5 pb-4">
                        <div className="space-y-1">
                          <span className="text-xs text-accent font-bold uppercase tracking-widest font-mono">Profile Details • Node 02</span>
                          <h3 className="text-lg font-extrabold text-white">Research Biography</h3>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">Abstract</span>
                      </div>

                      <div className="py-6 flex-grow flex items-center text-left">
                        <p className="text-base text-gray-200 leading-relaxed font-sans italic">
                          "{profile.bio || 'Please update your bio summary by clicking Edit Profile under your avatar.'}"
                        </p>
                      </div>

                      <div className="border-t border-white/5 pt-4 text-xs text-gray-400 text-left">
                        Swipe / Drag card, use Left/Right Arrows or keyboard to navigate.
                      </div>
                    </motion.div>

                    {/* CARD 2: COGNITIVE SKILLS */}
                    <motion.div
                      animate={getCarouselCardAnimation(2)}
                      onClick={() => setActiveCard(2)}
                      drag={activeCard === 2 ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.6}
                      onDragEnd={handleDragEnd}
                      transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                      className={`absolute w-full max-w-lg h-[400px] glass-card p-8 border-primary/20 flex flex-col justify-between overflow-hidden shadow-glass select-none ${
                        activeCard === 2 ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="flex justify-between items-start border-b border-white/5 pb-4">
                        <div className="space-y-1 text-left">
                          <span className="text-xs text-accent font-bold uppercase tracking-widest font-mono">Profile Details • Node 03</span>
                          <h3 className="text-lg font-extrabold text-white">Cognitive Skills Checklist</h3>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">Technical Core</span>
                      </div>

                      {/* Checklist-style Skill List */}
                      <div className="flex-grow py-4 overflow-y-auto space-y-2.5 max-h-[220px] pr-1 mt-2 text-left skills-scroller">
                        {profile.skills && profile.skills.length > 0 ? (
                          profile.skills.map((skill, index) => (
                            <div 
                              key={index}
                              className="flex items-center gap-3.5 p-3 rounded-xl bg-cardBg/50 border border-white/5 hover:border-primary/20 transition-all duration-300"
                            >
                              <div className="w-5.5 h-5.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.05)]">
                                <CheckCircle className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-sm md:text-base font-semibold text-white tracking-wide">
                                {skill}
                              </span>
                              <span className="ml-auto text-[9px] text-accent font-mono font-bold uppercase tracking-wider bg-accent/5 px-2.5 py-1 rounded border border-accent/10">
                                Verified
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400 italic text-center">No skill tags registered yet.</p>
                        )}
                      </div>

                      <div className="border-t border-white/5 pt-4 text-xs text-gray-400 text-left flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-primary" />
                        Swipe / Drag card, use Left/Right Arrows or keyboard to navigate.
                      </div>
                    </motion.div>

                    {/* CARD 3: TRUSTED BY (EARLY BACKERS) */}
                    <motion.div
                      animate={getCarouselCardAnimation(3)}
                      onClick={() => setActiveCard(3)}
                      drag={activeCard === 3 ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.6}
                      onDragEnd={handleDragEnd}
                      transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                      className={`absolute w-full max-w-lg h-[400px] glass-card p-8 border-primary/20 flex flex-col justify-between overflow-hidden shadow-glass select-none ${
                        activeCard === 3 ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <div className="space-y-1 text-left">
                          <span className="text-xs text-accent font-bold uppercase tracking-widest font-mono">Profile Details • Node 04</span>
                          <h3 className="text-lg font-extrabold text-white">Trusted By</h3>
                        </div>
                        <span className="text-sm text-emerald-400 font-mono font-black flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          Co-Investors
                        </span>
                      </div>

                      {/* Active VC Investors */}
                      <div className="flex-1 flex flex-col justify-center space-y-3.5 py-4 font-sans text-sm text-left">
                        
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-xs font-mono">S</div>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="text-white font-bold leading-none">Sequoia Capital</p>
                                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              </div>
                              <span className="text-[10px] text-gray-500 font-mono block mt-0.5">Deep Tech Fund</span>
                            </div>
                          </div>
                          <span className="text-white font-mono font-bold">$500,000</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center font-black text-primary text-xs font-mono">A</div>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="text-white font-bold leading-none">a16z Crypto</p>
                                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              </div>
                              <span className="text-[10px] text-gray-500 font-mono block mt-0.5">Web3 Hub Pool</span>
                            </div>
                          </div>
                          <span className="text-white font-mono font-bold">$400,000</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center font-black text-orange-400 text-xs font-mono">Y</div>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="text-white font-bold leading-none">Y Combinator</p>
                                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              </div>
                              <span className="text-[10px] text-gray-500 font-mono block mt-0.5 font-bold">W26 Cohort</span>
                            </div>
                          </div>
                          <span className="text-white font-mono font-bold">$150,000</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center font-black text-accent text-xs font-mono">S</div>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="text-white font-bold leading-none">Stanford Biotech</p>
                                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              </div>
                              <span className="text-[10px] text-gray-500 font-mono block mt-0.5">Angel Syndicate</span>
                            </div>
                          </div>
                          <span className="text-white font-mono font-bold">$370,000</span>
                        </div>

                      </div>

                      <div className="border-t border-white/5 pt-3.5 text-xs text-gray-400 text-left flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-accent" />
                        Total Seed Backing: $1,420,000 USD.
                      </div>
                    </motion.div>

                  </div>

                  {/* Floating Chevron Right Arrow (Middle Right) */}
                  <button
                    onClick={handleNextCard}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 bg-cardBg/80 border border-primary/30 p-3 rounded-full text-white hover:bg-primary/20 transition-all hover:scale-110 shadow-neonPrimary hover:shadow-neonAccent cursor-pointer focus:outline-none"
                  >
                    <ChevronRight className="w-6 h-6 text-accent" />
                  </button>

                </div>

                {/* Progress dot indicators (Clean bottom section) */}
                <div className="max-w-md mx-auto w-full flex flex-col space-y-4 pt-4">
                  
                  {/* Indicators */}
                  <div className="flex justify-center gap-2.5">
                    {[0, 1, 2, 3].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveCard(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          activeCard === idx 
                            ? 'bg-accent w-7 shadow-neonAccent' 
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex justify-center pt-2">
                    <button 
                      onClick={() => setActiveTab('workspace')}
                      className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors text-xs font-semibold text-gray-300"
                    >
                      ← Return to Workspace Canvas
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* 3. MYPROJECTS VIEW */}
            {activeTab === 'projects' && (
              <motion.div
                key="projects-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full space-y-6 text-left"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  
                  {/* Project 1 */}
                  <div className="glass-card p-6 border-primary/20 flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold uppercase">Active • 85%</span>
                      <h3 className="text-base font-extrabold text-white">Neural Synapse Bridge</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">Deep-learning brain-computer interface mapping cognitive signals into real-time speech synthesis patterns.</p>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">PyTorch</span>
                        <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">EEG Signals</span>
                        <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">Python</span>
                      </div>
                      <div className="w-full bg-darkBg h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div className="bg-primary h-full rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Project 2 */}
                  <div className="glass-card p-6 border-accent/20 flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <span className="px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 text-[10px] font-mono font-bold uppercase">Review • 40%</span>
                      <h3 className="text-base font-extrabold text-white">Retinal Quantum Sensor</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">Sub-dermal quantum photovoltaic sensor detecting photons at ultra-low single-wavelength efficiency thresholds.</p>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">Quantum</span>
                        <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">Optoelectronics</span>
                      </div>
                      <div className="w-full bg-darkBg h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div className="bg-accent h-full rounded-full" style={{ width: '40%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Project 3 */}
                  <div className="glass-card p-6 border-emerald-500/20 flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">Completed • 100%</span>
                      <h3 className="text-base font-extrabold text-white">Distributed IP Oracle</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">Decentralized zero-knowledge patent attestation protocol for cryptographically signing tech transfer agreements.</p>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">Solidity</span>
                        <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">ZK-Snarks</span>
                        <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">IPFS</span>
                      </div>
                      <div className="w-full bg-darkBg h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>

                </div>

                <div className="flex justify-start pt-2">
                  <button 
                    onClick={() => setActiveTab('workspace')}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors text-xs font-semibold text-gray-300"
                  >
                    ← Return to Workspace Canvas
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto text-center border-t border-primary/20 pt-4 mt-8 text-[11px] text-gray-500 font-mono flex flex-col sm:flex-row justify-between gap-4">
        <span>© 2026 EquiPatent technologies. Seeded via MERN stack.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </footer>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-darkBg/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.96, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 10, opacity: 0 }}
              className="relative w-full max-w-md bg-cardBg border border-primary/20 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh] z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4.5 h-4.5 text-accent" />
                  Edit Profile parameters
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Profile updated in MongoDB successfully!</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4 text-left">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-darkBg border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* University */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Institution</label>
                    <input 
                      type="text" 
                      value={editUniversity}
                      onChange={(e) => setEditUniversity(e.target.value)}
                      className="w-full bg-darkBg border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Department</label>
                    <input 
                      type="text" 
                      value={editDepartment}
                      onChange={(e) => setEditDepartment(e.target.value)}
                      className="w-full bg-darkBg border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Role / Title</label>
                  <input 
                    type="text" 
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-darkBg border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Biographical summary</label>
                  <textarea 
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-darkBg border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                {/* Wallet Address */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Web3 Account Wallet</label>
                  <input 
                    type="text" 
                    value={editWallet}
                    onChange={(e) => setEditWallet(e.target.value)}
                    className="w-full bg-darkBg border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Skills */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-mono uppercase tracking-wider">Skills tags (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. PyTorch, CRISPR, Quantum circuits"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    className="w-full bg-darkBg border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold hover:shadow-neonPrimary transition-all flex items-center gap-1.5 glow-btn"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Profile
                      </>
                    )}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
