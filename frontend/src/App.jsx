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
  ChevronRight,
  ChevronDown,
  FileText,
  Upload
} from 'lucide-react';
import { api } from './services/api';
import { ParticleCanvas } from './components/ParticleCanvas';

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'profile', 'projects'
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

  // Project-Specific State Schema
  const [activeProject, setActiveProject] = useState('synapse'); // 'synapse', 'sensor', 'oracle'

  const [projectStates, setProjectStates] = useState({
    synapse: {
      gitUsernameInput: '',
      gitUser: null,
      gitRepos: [],
      selectedGitRepo: '',
      gitCommits: [],
      gitError: null,
      uploadedDocs: [
        { name: 'neural_synapse_mapping_draft.pdf', type: 'Patent Draft', size: '4.2 MB', status: 'Verified Successfully' }
      ],
      peerPapersVerified: false
    },
    sensor: {
      gitUsernameInput: '',
      gitUser: null,
      gitRepos: [],
      selectedGitRepo: '',
      gitCommits: [],
      gitError: null,
      uploadedDocs: [
        { name: 'quantum_retinal_clinical_abstract.pdf', type: 'Lab Results', size: '1.8 MB', status: 'Verified Successfully' }
      ],
      peerPapersVerified: false
    },
    oracle: {
      gitUsernameInput: '',
      gitUser: null,
      gitRepos: [],
      selectedGitRepo: '',
      gitCommits: [],
      gitError: null,
      uploadedDocs: [], // starts empty so the user has to upload!
      peerPapersVerified: false
    }
  });

  const [gitVerifying, setGitVerifying] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Dynamic getters for rendering
  const currentProjectState = projectStates[activeProject];
  const gitUser = currentProjectState.gitUser;
  const gitUsernameInput = currentProjectState.gitUsernameInput;
  const gitRepos = currentProjectState.gitRepos;
  const selectedGitRepo = currentProjectState.selectedGitRepo;
  const gitCommits = currentProjectState.gitCommits;
  const gitError = currentProjectState.gitError;
  const uploadedDocs = currentProjectState.uploadedDocs;
  const peerPapersVerified = currentProjectState.peerPapersVerified;

  const projectMilestonesData = {
    synapse: [
      { id: 1, name: 'Build Core BCI Speech API', amount: '$15,000 USDT', desc: 'Establish data mapping schemas, seed MongoDB models, and achieve initial REST/WebSocket synchronizations.' },
      { id: 2, name: 'Complete CAD Prototype Model', amount: '$20,000 USDT', desc: 'Export 3D CAD schematic modeling files and verify tech clearance with Stanford Tech Transfer board.', statusKey: 'Awaiting IPFS Model' },
      { id: 3, name: 'Neural Signals Mapping Abstract', amount: '$10,000 USDT', desc: 'Verify motor cortex signals attenuation rates and validate cryptographic signatures.' }
    ],
    sensor: [
      { id: 1, name: 'Setup Photo-Optic Arrays', amount: '$25,000 USDT', desc: 'Configure optoelectronic sensory mapping arrays and align photon reception beams.' },
      { id: 2, name: 'Retinal Quantum Sensor Validation', amount: '$30,000 USDT', desc: 'Run optoelectronic sensory testing arrays to verify photon reception rates match research parameters.', statusKey: 'Pending array clearance' }
    ],
    oracle: [
      { id: 1, name: 'Audit ZK-Snark Smart Contracts', amount: '$35,000 USDT', desc: 'Perform zero-knowledge verification testing arrays and cryptographically audit Solidity circuits.' }
    ]
  };

  const setGitUsernameInput = (val) => {
    setProjectStates(prev => ({
      ...prev,
      [activeProject]: {
        ...prev[activeProject],
        gitUsernameInput: val
      }
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file only.');
      return;
    }
    
    setUploadingDoc(true);
    
    // Simulate digital signature & peer validation
    setTimeout(() => {
      const newDoc = {
        name: file.name,
        type: 'Peer-Signed Research Paper',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'Verified Successfully'
      };
      setProjectStates(prev => ({
        ...prev,
        [activeProject]: {
          ...prev[activeProject],
          uploadedDocs: [...prev[activeProject].uploadedDocs, newDoc],
          peerPapersVerified: true
        }
      }));
      setUploadingDoc(false);
    }, 2000);
  };

  const fetchCommits = async (username, repoName, targetProject = activeProject) => {
    try {
      const commitsRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=3`);
      if (commitsRes.ok) {
        const commitsData = await commitsRes.json();
        setProjectStates(prev => ({
          ...prev,
          [targetProject]: {
            ...prev[targetProject],
            gitCommits: commitsData
          }
        }));
      } else {
        throw new Error('Commits fetch failed.');
      }
    } catch (err) {
      // API Limit or Offline fallback
      const simulatedCommits = [
        { 
          sha: '5db1f9640ecfd4696268686727b42d11', 
          commit: { 
            message: `Mock Sync: Active commit validation on ${repoName}`, 
            author: { name: username, date: new Date().toISOString() } 
          }
        }
      ];
      setProjectStates(prev => ({
        ...prev,
        [targetProject]: {
          ...prev[targetProject],
          gitCommits: simulatedCommits
        }
      }));
    }
  };

  const handleVerifyGitHub = async (e) => {
    if (e) e.preventDefault();
    if (!gitUsernameInput.trim()) return;

    setGitVerifying(true);

    try {
      // 1. Fetch User Profile Info
      const userRes = await fetch(`https://api.github.com/users/${gitUsernameInput}`);
      if (!userRes.ok) {
        throw new Error(userRes.status === 404 ? 'GitHub user profile not found.' : 'Failed to query GitHub API.');
      }
      const userData = await userRes.json();

      // 2. Fetch Repositories
      const reposRes = await fetch(`https://api.github.com/users/${gitUsernameInput}/repos?sort=updated&per_page=10`);
      if (!reposRes.ok) {
        throw new Error('Failed to query GitHub repositories.');
      }
      const reposData = await reposRes.json();

      setProjectStates(prev => ({
        ...prev,
        [activeProject]: {
          ...prev[activeProject],
          gitUser: userData,
          gitRepos: reposData,
          selectedGitRepo: reposData.length > 0 ? reposData[0].name : '',
          gitCommits: [],
          gitError: null
        }
      }));

      // If they have repos, select the first one and fetch its commits
      if (reposData.length > 0) {
        const firstRepo = reposData[0].name;
        await fetchCommits(gitUsernameInput, firstRepo, activeProject);
      }
    } catch (err) {
      console.warn('GitHub API failed, falling back to simulated verification...', err);
      // Fallback to high-quality simulated verification if offline or API is rate-limited
      const simulatedUser = {
        login: gitUsernameInput,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${gitUsernameInput}`,
        name: gitUsernameInput.charAt(0).toUpperCase() + gitUsernameInput.slice(1) + " (Dev)",
        bio: "AI Innovator & Fullstack MERN Architect. Stanford Biotech Fellow."
      };
      
      const simulatedRepos = [
        { name: activeProject === 'synapse' ? 'Neural-Synapse-Speech-Core' : activeProject === 'sensor' ? 'Retinal-Quantum-Simulation' : 'Vibe_Tribe-v2v', description: 'Interactive React portal for deep-tech creator grants verification.', stargazers_count: 12, html_url: '#' },
        { name: 'Core-AI-Processing', description: 'Signal mapping array processor.', stargazers_count: 8, html_url: '#' }
      ];

      const simulatedCommits = [
        { 
          sha: '0ec9becb3d7b72bffb2021e6727911bc', 
          commit: { 
            message: `Merge branch 'main' of ${simulatedRepos[0].name}`, 
            author: { name: simulatedUser.name, date: new Date().toISOString() } 
          }
        },
        { 
          sha: '3784ca6913619f60a52d2f11ca2b5535', 
          commit: { 
            message: "Project setup and core specifications configured successfully", 
            author: { name: simulatedUser.name, date: new Date(Date.now() - 3600000).toISOString() } 
          }
        }
      ];

      setProjectStates(prev => ({
        ...prev,
        [activeProject]: {
          ...prev[activeProject],
          gitUser: simulatedUser,
          gitRepos: simulatedRepos,
          selectedGitRepo: simulatedRepos[0].name,
          gitCommits: simulatedCommits,
          gitError: 'Rate-Limited / Offline: Loaded Verified Simulation Mode'
        }
      }));
    } finally {
      setGitVerifying(false);
    }
  };

  const handleRepoChange = async (e) => {
    const repoName = e.target.value;
    setProjectStates(prev => ({
      ...prev,
      [activeProject]: {
        ...prev[activeProject],
        selectedGitRepo: repoName
      }
    }));
    if (gitUser) {
      await fetchCommits(gitUser.login, repoName, activeProject);
    }
  };

  const handleDisconnectGit = () => {
    setProjectStates(prev => ({
      ...prev,
      [activeProject]: {
        ...prev[activeProject],
        gitUser: null,
        gitRepos: [],
        selectedGitRepo: '',
        gitCommits: [],
        gitUsernameInput: '',
        gitError: null
      }
    }));
  };

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

  // Auto-transition to Milestones Page once GitHub or Document gets verified
  useEffect(() => {
    if (gitUser !== null || peerPapersVerified) {
      const transitionTimer = setTimeout(() => {
        setActiveTab('milestones');
      }, 1800);
      return () => clearTimeout(transitionTimer);
    }
  }, [gitUser, peerPapersVerified]);

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
          <div onClick={() => setActiveTab('dashboard')} className="cursor-pointer flex items-center gap-2 group">
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
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-primary/30 to-accent/20 border-primary text-white shadow-neonPrimary/30'
                  : 'bg-cardBg/40 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
              }`}
            >
              <Compass className="w-4 h-4 text-primary" />
              Creator Dashboard
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
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">
            
            {/* Global Left Sidebar: Verification Progress Roadmap (2 cols) */}
            <div className="lg:col-span-2 h-full">
              <div className="glass-card p-4 border-primary/20 flex flex-col justify-between h-full">
                
                <div>
                  {/* Overview Header */}
                  <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl mb-6">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shrink-0">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="text-[10px] font-black text-white leading-none uppercase truncate">Overview</h4>
                      <span className="text-[8px] text-gray-500 font-medium block truncate">Home</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block text-left">
                      YOUR JOURNEY
                    </span>

                    <div className="relative text-left pl-1">
                      
                      {/* Continuous Background Timeline Rail */}
                      <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-white/10 rounded-full" />
                      
                      {/* Glowing Progress Timeline Rail Overlay */}
                      <div 
                        className="absolute left-[9px] top-2 w-[2px] bg-emerald-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                        style={{ 
                          height: (gitUser || peerPapersVerified) 
                            ? '80%' 
                            : '40%' 
                        }}
                      />

                      <div className="space-y-[52px]">
                        
                        {/* Step 1: Login Platform (Completed) */}
                        <div 
                          onClick={() => { setActiveTab('profile'); setActiveCard(0); }}
                          className="relative pl-7 py-0.5 cursor-pointer hover:bg-white/5 transition-all rounded-r-lg -ml-1 pr-1 group text-left"
                        >
                          <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0 z-10 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                            ✓
                          </div>
                          <p className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">Platform Login</p>
                        </div>

                        {/* Step 2: HER Profile Verified (Completed) */}
                        <div 
                          onClick={() => { setActiveTab('profile'); setActiveCard(2); }}
                          className="relative pl-7 py-0.5 cursor-pointer hover:bg-white/5 transition-all rounded-r-lg -ml-1 pr-1 group text-left"
                        >
                          <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0 z-10 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                            ✓
                          </div>
                          <p className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">Profile Verification</p>
                        </div>

                        {/* Step 3: Developer & Document Sync */}
                        {(gitUser || peerPapersVerified) ? (
                          <div 
                            onClick={() => setActiveTab('dashboard')}
                            className="relative pl-7 py-0.5 cursor-pointer hover:bg-white/5 transition-all rounded-r-lg -ml-1 pr-1 group text-left"
                          >
                            <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0 z-10 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                              ✓
                            </div>
                            <p className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors leading-tight">Developer & Document Sync</p>
                          </div>
                        ) : (
                          <div 
                            onClick={() => setActiveTab('dashboard')}
                            className="relative pl-7 py-2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-l-2 border-primary rounded-r-lg -ml-2 pr-2 cursor-pointer hover:from-primary/30 transition-all text-left"
                          >
                            <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center font-mono shrink-0 z-10 shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                              3
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">Developer & Document Sync</p>
                              <span className="text-[8px] text-primary font-mono block mt-0.5 font-black">Active Step</span>
                            </div>
                          </div>
                        )}

                        {/* Step 4: Project Milestone Tracker */}
                        {(gitUser || peerPapersVerified) ? (
                          <div 
                            onClick={() => setActiveTab('milestones')}
                            className="relative pl-7 py-0.5 cursor-pointer hover:bg-white/5 transition-all rounded-r-lg -ml-1 pr-1 group text-left"
                          >
                            <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0 z-10 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                              ✓
                            </div>
                            <p className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors leading-tight">Milestone Tracker</p>
                          </div>
                        ) : (
                          <div className="relative pl-7 py-0.5 text-left">
                            <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-white/5 border border-white/10 text-gray-600 text-[9px] font-bold flex items-center justify-center font-mono shrink-0 z-10">
                              4
                            </div>
                            <p className="text-xs font-bold text-gray-500 leading-tight">Milestone Tracker</p>
                          </div>
                        )}

                        {/* Step 5: Phase 1 Grants Approval */}
                        {(gitUser || peerPapersVerified) ? (
                          <div className="relative pl-7 py-2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-l-2 border-primary rounded-r-lg -ml-2 pr-2 text-left">
                            <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center font-mono shrink-0 z-10 shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                              5
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight font-black">Phase 1 Grants</p>
                              <span className="text-[8px] text-primary font-mono block mt-0.5 font-black">Active Step</span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative pl-7 py-0.5 text-left">
                            <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-white/5 border border-white/10 text-gray-600 text-[9px] font-bold flex items-center justify-center font-mono shrink-0 z-10">
                              5
                            </div>
                            <p className="text-xs font-bold text-gray-500">Phase 1 Grants</p>
                          </div>
                        )}

                        {/* Step 6: Phase 2 Roadmapping (Locked) */}
                        <div className="relative pl-7 py-0.5 text-left">
                          <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-white/5 border border-white/10 text-gray-600 text-[9px] font-bold flex items-center justify-center font-mono shrink-0 z-10">
                            6
                          </div>
                          <p className="text-xs font-bold text-gray-500">Phase 2 Setup</p>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Right Workspace View: dynamic routes (10 cols) */}
            <div className="lg:col-span-10 h-full">
              <AnimatePresence mode="wait">
                
                {/* 1. CREATOR DASHBOARD VIEW */}
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="dashboard-view"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex flex-col gap-6 text-left"
                  >
                    {/* Project Selector Control Bar */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2 relative z-20">
                      <div className="text-left space-y-1">
                        <h2 className="text-lg font-bold text-white tracking-wide">Active Project Workspace</h2>
                        <p className="text-[11px] text-gray-400">Toggle between your registered deep-tech ventures to manage verification states.</p>
                      </div>
                      <div className="text-right w-full sm:w-auto">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#d946ef] font-black block mb-1.5 text-left sm:text-right">MANAGE PROJECT</span>
                        <div className="relative flex items-center">
                          {/* Glowing Green Dot */}
                          <span className="absolute left-4 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse z-30" />
                          <select 
                            value={activeProject} 
                            onChange={(e) => setActiveProject(e.target.value)}
                            className="bg-black/60 border border-white/10 rounded-full pl-8 pr-10 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#d946ef]/50 cursor-pointer appearance-none relative z-20 w-full sm:min-w-[210px] shadow-inner"
                          >
                            <option value="synapse">Neural Synapse Bridge</option>
                            <option value="sensor">Retinal Quantum Sensor</option>
                            <option value="oracle">Distributed IP Oracle</option>
                          </select>
                          {/* Custom chevron indicator */}
                          <ChevronDown className="absolute right-3.5 w-4 h-4 text-gray-400 pointer-events-none z-30" />
                        </div>
                      </div>
                    </div>

                    {/* Verification Center Grid (GitHub & Document Sync side-by-side) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch flex-1 min-h-0">
                  
                      {/* GitHub Verification Form & Status */}
                      {!gitUser ? (
                        <div className="glass-card p-7 border-primary/20 space-y-6 flex flex-col justify-between h-full">
                          <div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                  </svg>
                                </div>
                                <span className="tracking-widest">GITHUB VERIFICATION</span>
                              </h3>
                              <span className="px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 text-red-400 text-[10px] font-mono uppercase font-bold tracking-wide">Not Linked</span>
                            </div>

                            <div className="mt-5 text-left space-y-2">
                              <p className="text-base font-bold text-white leading-relaxed">
                                Link your GitHub profile to verify your project commits and authenticate Phase 1 milestone grants.
                              </p>
                              <span className="text-xs text-gray-400 italic mt-2 block">
                                Enter username to synchronize your repositories.
                              </span>
                            </div>
                          </div>

                          <form onSubmit={handleVerifyGitHub} className="flex gap-4 mt-6">
                            <input 
                              type="text" 
                              placeholder="GitHub Username" 
                              value={gitUsernameInput}
                              onChange={(e) => setGitUsernameInput(e.target.value)}
                              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d946ef]/50 transition-all font-mono"
                            />
                            <button 
                              type="submit"
                              disabled={gitVerifying}
                              className="bg-[#d946ef] hover:bg-[#d946ef]/90 disabled:bg-[#d946ef]/40 text-black font-black text-sm px-7 py-4 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(217,70,239,0.4)] flex items-center gap-2 shrink-0"
                            >
                              {gitVerifying && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin shrink-0" />}
                              Sync
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="glass-card p-7 border-emerald-500/20 space-y-6 bg-gradient-to-br from-cardBg/90 via-emerald-500/[0.02] to-cardBg/90 shadow-[0_0_20px_rgba(16,185,129,0.05)] relative overflow-hidden flex flex-col justify-between h-full">
                          {/* Decorative glowing gradient at the top */}
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                          
                          <div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                  </svg>
                                </div>
                                <span className="tracking-widest">GITHUB CONNECTED</span>
                              </h3>
                              <span className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono uppercase font-bold tracking-wide">Synchronized</span>
                            </div>

                            <div className="mt-5 text-left">
                              <p className="text-base font-bold text-white leading-relaxed">
                                GitHub profile connected successfully. Commits are synchronizing on Web3 milestone contracts.
                              </p>
                            </div>
                          </div>

                          {/* Connected User Identity Badge */}
                          <div className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl mt-8">
                            <div className="flex items-center gap-4">
                              <img 
                                src={gitUser.avatar_url} 
                                alt={gitUser.login} 
                                className="w-12 h-12 rounded-2xl border border-white/10 shrink-0"
                              />
                              <div className="text-left">
                                <p className="font-bold text-white text-sm leading-none">{gitUser.name || gitUser.login}</p>
                                <a 
                                  href={`https://github.com/${gitUser.login}`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-xs text-[#d946ef] font-mono hover:underline block mt-1.5"
                                >
                                  @{gitUser.login}
                                </a>
                              </div>
                            </div>
                            
                            <button 
                              onClick={handleDisconnectGit}
                              className="px-4.5 py-2.5 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 rounded-xl text-xs font-bold text-red-400 cursor-pointer transition-all"
                            >
                              Disconnect
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Document Verification */}
                      <div className="glass-card p-7 border-primary/20 space-y-4 flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                              </div>
                              <span className="tracking-widest">DOCUMENT VERIFICATION</span>
                            </h3>
                            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 text-[10px] font-mono uppercase font-bold tracking-wide">
                              {uploadedDocs.length} Verified
                            </span>
                          </div>

                          <div className="space-y-3 mt-5">
                            {uploadedDocs.map((doc, idx) => (
                              <div key={idx} className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-2xl text-xs">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                  <div className="w-11 h-11 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 shrink-0">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="text-left space-y-0.5 min-w-0 flex-1 pr-2">
                                    <p className="font-bold text-white truncate text-sm">{doc.name}</p>
                                    <span className="text-gray-500 font-mono text-xs block uppercase mt-0.5">{doc.type.split('/')[1] || 'PDF'} • {doc.size}</span>
                                  </div>
                                </div>
                                <span className="px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono font-bold shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                                  {doc.status.toUpperCase()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          {/* PDF Uploader Box */}
                          {uploadingDoc ? (
                            <div className="border border-dashed border-[#d946ef]/40 bg-[#d946ef]/5 p-7 rounded-2xl flex flex-col items-center justify-center space-y-2.5 mt-6">
                              <div className="w-5 h-5 border-2 border-[#d946ef] border-t-transparent rounded-full animate-spin" />
                              <div className="text-center">
                                <span className="text-[11px] font-bold text-white block">Verifying digital signatures...</span>
                                <span className="text-[9px] text-gray-500 font-mono">Attesting peer credentials & pinning to IPFS</span>
                              </div>
                            </div>
                          ) : (
                            <label 
                              htmlFor="pdf-upload-input" 
                              className="border-2 border-dashed border-white/5 hover:border-[#d946ef]/30 hover:bg-white/[0.01] transition-all p-7 rounded-2xl flex flex-col items-center justify-center space-y-3.5 cursor-pointer bg-black/10 mt-6 group"
                            >
                              <input 
                                type="file" 
                                accept=".pdf" 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                id="pdf-upload-input" 
                              />
                              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:border-[#d946ef]/40 flex items-center justify-center text-purple-400 transition-all shrink-0">
                                <Upload className="w-5 h-5 text-purple-400 group-hover:text-[#d946ef] transition-colors" />
                              </div>
                              <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">Upload Peer-Signed Research Paper</span>
                              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider mt-1">SUPPORTS PDF • MAX 15MB</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
            )}

            {/* 1.5 DEDICATED PROJECT MILESTONE TRACKER PAGE */}
            {activeTab === 'milestones' && (
              <motion.div
                key="milestones-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full space-y-6 text-left"
              >
                {/* Dynamic Page Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-4 mb-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono uppercase font-bold tracking-wider">
                        Escrow Status: ACTIVE
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        ID: F1-POP-0284
                      </span>
                    </div>
                    <h1 className="text-xl font-black text-white uppercase tracking-wider">
                      {activeProject === 'synapse' ? 'Neural Synapse Bridge' : activeProject === 'sensor' ? 'Retinal Quantum Sensor' : 'Distributed IP Oracle'}
                    </h1>
                    <p className="text-xs text-gray-400">Escrow-backed deep-tech funding released on cryptographically verified milestones.</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Project Selector inside Milestones View */}
                    <select 
                      value={activeProject} 
                      onChange={(e) => setActiveProject(e.target.value)} 
                      className="bg-darkBg border border-primary/30 rounded-xl px-4 py-2 text-xs text-white font-bold focus:outline-none focus:border-accent cursor-pointer"
                    >
                      <option value="synapse">Neural Synapse Bridge</option>
                      <option value="sensor">Retinal Quantum Sensor</option>
                      <option value="oracle">Distributed IP Oracle</option>
                    </select>

                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="px-4 py-2 border border-white/10 hover:border-primary bg-white/5 hover:bg-primary/10 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-neonPrimary/10"
                    >
                      ← Back to Verification Center
                    </button>
                  </div>
                </div>

                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Milestones Timeline (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="glass-card p-6 border-primary/20 space-y-5">
                      <div className="border-b border-white/5 pb-2 text-left">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Milestone Roadmap</h3>
                        <p className="text-[10px] text-gray-500">Deliverables and release targets for the current phase</p>
                      </div>

                      <div className="space-y-4">
                        {projectMilestonesData[activeProject].map((milestone, idx) => {
                          const isVerified = gitUser !== null || peerPapersVerified;
                          
                          // Milestone 1 (Index 0)
                          if (idx === 0) {
                            return (
                              <div key={milestone.id} className="p-5 bg-darkBg/60 border border-white/5 rounded-2xl space-y-3">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="checkbox" 
                                      checked={isVerified} 
                                      readOnly 
                                      className={`w-5 h-5 border-white/20 rounded focus:ring-primary focus:ring-offset-darkBg ${
                                        isVerified ? 'text-emerald-500 bg-emerald-500' : 'text-primary'
                                      }`} 
                                    />
                                    <h4 className="text-sm font-bold text-white">{milestone.name}</h4>
                                  </div>
                                  <span className={`text-xs font-bold font-mono ${
                                    isVerified ? 'text-emerald-400' : 'text-primary'
                                  }`}>
                                    {milestone.amount} {isVerified ? 'Disbursed' : 'in Escrow'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed pl-7">{milestone.desc}</p>
                                <div className="flex items-center justify-between text-[10px] pl-7 pt-1 border-t border-white/5">
                                  <span className={isVerified ? 'text-emerald-400' : 'text-gray-500'}>
                                    Progress: {isVerified ? '100%' : '0%'}
                                  </span>
                                  <span className={isVerified ? 'text-accent font-mono' : 'text-gray-500 font-mono'}>
                                    {isVerified 
                                      ? `Linked: ${gitCommits[0]?.sha?.slice(0, 7) || '0ec9bec'}` 
                                      : 'Awaiting GitHub & Document Verification'}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          
                          // Milestone 2 (Index 1)
                          if (idx === 1) {
                            return (
                              <div key={milestone.id} className="p-5 bg-darkBg/60 border border-white/5 rounded-2xl space-y-3">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={false} readOnly className="w-5 h-5 text-primary border-white/20 rounded focus:ring-primary focus:ring-offset-darkBg" />
                                    <h4 className="text-sm font-bold text-white">{milestone.name}</h4>
                                  </div>
                                  <span className="text-xs font-bold text-primary font-mono">{milestone.amount} in Escrow</span>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed pl-7">{milestone.desc}</p>
                                <div className="flex items-center justify-between text-[10px] text-gray-500 pl-7 pt-1 border-t border-white/5">
                                  <span>Progress: {isVerified ? '40%' : '0%'}</span>
                                  <span className={isVerified ? 'text-amber-400 font-mono font-bold' : 'text-gray-500 font-mono'}>
                                    {isVerified ? milestone.statusKey : 'Locked'}
                                  </span>
                                </div>
                              </div>
                            );
                          }

                          // Milestone 3 (Index 2)
                          return (
                            <div key={milestone.id} className="p-5 bg-darkBg/60 border border-white/5 rounded-2xl space-y-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <input type="checkbox" checked={false} readOnly className="w-5 h-5 text-primary border-white/20 rounded focus:ring-primary focus:ring-offset-darkBg" />
                                  <h4 className="text-sm font-bold text-white">{milestone.name}</h4>
                                </div>
                                <span className="text-xs font-bold text-primary font-mono">{milestone.amount} in Escrow</span>
                              </div>
                              <p className="text-xs text-gray-400 leading-relaxed pl-7">{milestone.desc}</p>
                              <div className="flex items-center justify-between text-[10px] text-gray-500 pl-7 pt-1 border-t border-white/5">
                                <span>Progress: 0%</span>
                                <span className="font-mono">{isVerified ? 'Pending Milestone 2 Approval' : 'Locked'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Web3 Ledger (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="glass-card p-6 border-primary/20 space-y-6">
                      <div className="border-b border-white/5 pb-3 text-left">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Web3 Escrow Stats</h3>
                        <p className="text-[10px] text-gray-500">Autonomous smart contract distribution ledger</p>
                      </div>

                      {/* Stats List */}
                      <div className="grid grid-cols-3 gap-4 text-left">
                        <div className="bg-darkBg/60 border border-white/5 p-3 rounded-xl">
                          <span className="text-[9px] text-gray-500 uppercase font-mono block">Total Budget</span>
                          <span className="text-xs font-black text-white font-mono block truncate mt-0.5">
                            {activeProject === 'synapse' ? '$45,000' : activeProject === 'sensor' ? '$55,000' : '$35,000'}
                          </span>
                        </div>
                        <div className="bg-darkBg/60 border border-white/5 p-3 rounded-xl">
                          <span className="text-[9px] text-gray-500 uppercase font-mono block">Disbursed</span>
                          <span className="text-xs font-black text-emerald-400 font-mono block truncate mt-0.5">
                            {gitUser || peerPapersVerified 
                              ? (activeProject === 'synapse' ? '$15,000' : activeProject === 'sensor' ? '$25,000' : '$35,000') 
                              : '$0'}
                          </span>
                        </div>
                        <div className="bg-darkBg/60 border border-white/5 p-3 rounded-xl">
                          <span className="text-[9px] text-gray-500 uppercase font-mono block">In Escrow</span>
                          <span className="text-xs font-black text-primary font-mono block truncate mt-0.5">
                            {gitUser || peerPapersVerified 
                              ? (activeProject === 'synapse' ? '$30,000' : activeProject === 'sensor' ? '$30,000' : '$0') 
                              : (activeProject === 'synapse' ? '$45,000' : activeProject === 'sensor' ? '$55,000' : '$35,000')}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 text-left">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400 font-bold">Funding Disbursed</span>
                          <span className="text-emerald-400 font-mono font-bold">
                            {gitUser || peerPapersVerified 
                              ? (activeProject === 'synapse' ? '33%' : activeProject === 'sensor' ? '45%' : '100%') 
                              : '0%'}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                            style={{ 
                              width: gitUser || peerPapersVerified 
                                ? (activeProject === 'synapse' ? '33%' : activeProject === 'sensor' ? '45%' : '100%') 
                                : '0%' 
                            }}
                          />
                        </div>
                      </div>

                      {/* Blockchain Contract Transactions */}
                      <div className="space-y-2.5">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold block text-left">Blockchain Attestations</span>
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 skills-scroller">
                          <div className="p-3 bg-darkBg/40 border border-white/5 rounded-xl space-y-1 font-mono text-xs text-left">
                            <div className="flex justify-between text-gray-400 text-[10px]">
                              <span className="font-bold text-accent">tx:0x7d81a9f</span>
                              <span className="text-emerald-400">Confirmed</span>
                            </div>
                            <p className="text-white font-semibold text-[11px]">Deploy Escrow Smart Contract</p>
                            <span className="text-[9px] text-gray-500 block">Released: 2026-07-08</span>
                          </div>

                          {gitUser && (
                            <div className="p-3 bg-darkBg/40 border border-white/5 rounded-xl space-y-1 font-mono text-xs text-left">
                              <div className="flex justify-between text-gray-400 text-[10px]">
                                <span className="font-bold text-accent">tx:0x391fec0</span>
                                <span className="text-emerald-400">Confirmed</span>
                              </div>
                              <p className="text-white font-semibold text-[11px]">Attest Git Commit Hash ({selectedGitRepo.slice(0,10)}...)</p>
                              <span className="text-[9px] text-gray-500 block">Released: Just Now</span>
                            </div>
                          )}

                          {peerPapersVerified && (
                            <div className="p-3 bg-darkBg/40 border border-white/5 rounded-xl space-y-1 font-mono text-xs text-left">
                              <div className="flex justify-between text-gray-400 text-[10px]">
                                <span className="font-bold text-accent">tx:0xbd82ff1</span>
                                <span className="text-emerald-400">Confirmed</span>
                              </div>
                              <p className="text-white font-semibold text-[11px]">Pin Peer Verification Proof (IPFS)</p>
                              <span className="text-[9px] text-gray-500 block">Released: Just Now</span>
                            </div>
                          )}

                          {(gitUser || peerPapersVerified) && (
                            <div className="p-3 bg-darkBg/40 border border-emerald-500/20 rounded-xl space-y-1 font-mono text-xs text-left bg-emerald-500/[0.02]">
                              <div className="flex justify-between text-emerald-400 text-[10px]">
                                <span className="font-bold">tx:0x00fec88</span>
                                <span>Tranche Disbursed</span>
                              </div>
                              <p className="text-white font-semibold text-[11px]">
                                Disburse Milestone 1 Escrow Funding ({activeProject === 'synapse' ? '$15,000' : activeProject === 'sensor' ? '$25,000' : '$35,000'} USDT)
                              </p>
                              <span className="text-[9px] text-gray-500 block">Released: Just Now</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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
                      onClick={() => setActiveTab('dashboard')}
                      className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors text-xs font-semibold text-gray-300"
                    >
                      ← Return to Creator Dashboard
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
                  <div className="glass-card p-6 border-primary/20 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="w-full h-36 rounded-xl overflow-hidden border border-white/5 relative bg-darkBg/40">
                        <img src="/neural_synapse.png" alt="Neural Synapse Bridge" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold uppercase">Active • 85%</span>
                        <h3 className="text-base font-extrabold text-white mt-1">Neural Synapse Bridge</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">Deep-learning brain-computer interface mapping cognitive signals into real-time speech synthesis patterns.</p>
                      </div>
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
                  <div className="glass-card p-6 border-accent/20 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="w-full h-36 rounded-xl overflow-hidden border border-white/5 relative bg-darkBg/40">
                        <img src="/quantum_sensor.png" alt="Retinal Quantum Sensor" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 text-[10px] font-mono font-bold uppercase">Review • 40%</span>
                        <h3 className="text-base font-extrabold text-white mt-1">Retinal Quantum Sensor</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">Sub-dermal quantum photovoltaic sensor detecting photons at ultra-low single-wavelength efficiency thresholds.</p>
                      </div>
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
                  <div className="glass-card p-6 border-emerald-500/20 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="w-full h-36 rounded-xl overflow-hidden border border-white/5 relative bg-darkBg/40">
                        <img src="/ip_oracle.png" alt="Distributed IP Oracle" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">Completed • 100%</span>
                        <h3 className="text-base font-extrabold text-white mt-1">Distributed IP Oracle</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">Decentralized zero-knowledge patent attestation protocol for cryptographically signing tech transfer agreements.</p>
                      </div>
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
                    onClick={() => setActiveTab('dashboard')}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors text-xs font-semibold text-gray-300"
                  >
                    ← Return to Creator Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
            </div>
          </div>
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
