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
  Upload,
  DollarSign,
  Plus,
  Trash2,
  Send,
  Bell,
  AlertCircle,
  Award,
  Users
} from 'lucide-react';
import { api } from './services/api';
import { ParticleCanvas } from './components/ParticleCanvas';
import LandingPage from './components/LandingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [profileVerified, setProfileVerified] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'profile', 'projects', 'milestones', 'phase2', 'deployed'
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
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

  // Grant Application State
  const [grantTotalAmount, setGrantTotalAmount] = useState(50000);
  const [grantPhase1Amount, setGrantPhase1Amount] = useState(20000);
  const [projectDescription, setProjectDescription] = useState('');
  const [budgetSplitItems, setBudgetSplitItems] = useState([
    { category: 'US Patent Filing Fee', amount: 8000 },
    { category: 'Software & Cloud Services', amount: 5000 },
    { category: 'Research & Development', amount: 7000 }
  ]);
  const [grantApplying, setGrantApplying] = useState(false);
  const [grantApplied, setGrantApplied] = useState(false);

  // Counter Offer States
  const [showCounterOffer, setShowCounterOffer] = useState(false);
  const [counterEquity, setCounterEquity] = useState(10); // user wants to offer less equity, default 10%
  const [counterAmount, setCounterAmount] = useState(0);   // user wants to request more capital
  const [phase2Attested, setPhase2Attested] = useState(false);

  // Dynamic projects list state matching user profile flashcard style
  const [projectsList, setProjectsList] = useState([
    {
      id: 'synapse',
      name: 'Neural Synapse Bridge',
      description: 'Deep-learning brain-computer interface mapping cognitive signals into real-time speech synthesis patterns.',
      image: '/synapse_real.jpg',
      tags: ['PyTorch', 'EEG Signals', 'Python'],
      progress: 85,
      phase1Verified: true,
      phase2Verified: false,
      documents: ['neural_synapse_mapping_draft.pdf']
    },
    {
      id: 'sensor',
      name: 'Retinal Quantum Sensor',
      description: 'Sub-dermal quantum photovoltaic sensor detecting photons at ultra-low single-wavelength efficiency thresholds.',
      image: '/sensor_real.jpg',
      tags: ['Quantum', 'Optoelectronics'],
      progress: 40,
      phase1Verified: false,
      phase2Verified: false,
      documents: ['quantum_retinal_clinical_abstract.pdf']
    },
    {
      id: 'oracle',
      name: 'Distributed IP Oracle',
      description: 'Decentralized zero-knowledge patent attestation protocol for cryptographically signing tech transfer agreements.',
      image: '/oracle_real.jpg',
      tags: ['Solidity', 'ZK-Snarks', 'IPFS'],
      progress: 100,
      phase1Verified: true,
      phase2Verified: true,
      documents: []
    }
  ]);

  // Project Modal State Fields
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null); // null means add project
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTags, setProjTags] = useState('');
  const [projProgress, setProjProgress] = useState(0);
  const [projPhase1Verified, setProjPhase1Verified] = useState(false);
  const [projPhase2Verified, setProjPhase2Verified] = useState(false);
  const [projDocs, setProjDocs] = useState([]);
  const [projImage, setProjImage] = useState('');

  const handleOpenEditProject = (project) => {
    setEditingProjectId(project.id);
    setProjName(project.name);
    setProjDesc(project.description);
    setProjTags(project.tags.join(', '));
    setProjProgress(project.progress);
    setProjPhase1Verified(project.phase1Verified);
    setProjPhase2Verified(project.phase2Verified);
    setProjDocs(project.documents || []);
    setProjImage(project.image || '');
    setIsProjectModalOpen(true);
  };

  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setProjName('');
    setProjDesc('');
    setProjTags('');
    setProjProgress(0);
    setProjPhase1Verified(false);
    setProjPhase2Verified(false);
    setProjDocs([]);
    setProjImage('/ip_oracle.png');
    setIsProjectModalOpen(true);
  };

  const saveProjectsToBackend = async (newProjectsList, newProjectStates = projectStates) => {
    try {
      const mergedProjects = newProjectsList.map(proj => {
        const state = newProjectStates[proj.id] || {
          gitUsernameInput: '',
          gitUser: null,
          gitRepos: [],
          selectedGitRepo: '',
          gitCommits: [],
          uploadedDocs: [],
          peerPapersVerified: false
        };
        return {
          ...proj,
          gitUsernameInput: state.gitUsernameInput || '',
          gitUser: state.gitUser || null,
          gitRepos: state.gitRepos || [],
          selectedGitRepo: state.selectedGitRepo || '',
          gitCommits: state.gitCommits || [],
          uploadedDocs: state.uploadedDocs || [],
          peerPapersVerified: state.peerPapersVerified || false
        };
      });
      const updatedProfile = await api.updateProfile({ projects: mergedProjects });
      setProfile(updatedProfile);
    } catch (err) {
      console.error("Error saving projects to database:", err);
    }
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projName.trim() || !projDesc.trim()) return;
    const parsedTags = projTags.split(',').map(t => t.trim()).filter(Boolean);

    let updatedProjectsList = [];
    if (editingProjectId) {
      updatedProjectsList = projectsList.map(proj => {
        if (proj.id === editingProjectId) {
          return {
            ...proj,
            name: projName,
            description: projDesc,
            tags: parsedTags,
            progress: Number(projProgress),
            phase1Verified: projPhase1Verified,
            phase2Verified: projPhase2Verified,
            documents: projDocs,
            image: projImage || proj.image || '/ip_oracle.png'
          };
        }
        return proj;
      });
    } else {
      const newId = `project-${Date.now()}`;
      const newProj = {
        id: newId,
        name: projName,
        description: projDesc,
        tags: parsedTags,
        progress: Number(projProgress),
        phase1Verified: projPhase1Verified,
        phase2Verified: projPhase2Verified,
        documents: projDocs,
        image: projImage || '/ip_oracle.png'
      };
      updatedProjectsList = [...projectsList, newProj];
    }
    
    setProjectsList(updatedProjectsList);
    saveProjectsToBackend(updatedProjectsList, projectStates);
    
    setIsProjectModalOpen(false);
    setToastMessage(editingProjectId ? "Project updated successfully!" : "New project registered successfully!");
    setShowToast(true);
  }

  const handleAddProjectDoc = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjDocs(prev => [...prev, file.name]);
    }
  };

  const handleRemoveMockDoc = (idxToRemove) => {
    setProjDocs(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleUploadProjImage = () => {
    const imgUrl = prompt("Enter mock project cover image path or URL:", "/ip_oracle.png");
    if (imgUrl) {
      setProjImage(imgUrl);
    }
  };

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
      const newState = {
        ...projectStates,
        [activeProject]: {
          ...projectStates[activeProject],
          uploadedDocs: [...projectStates[activeProject].uploadedDocs, newDoc],
          peerPapersVerified: true
        }
      };
      setProjectStates(newState);
      
      const updatedProjectsList = projectsList.map(proj => {
        if (proj.id === activeProject) {
          return {
            ...proj,
            phase2Verified: true,
            progress: 100
          };
        }
        return proj;
      });
      setProjectsList(updatedProjectsList);
      saveProjectsToBackend(updatedProjectsList, newState);
      
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

      // Fetch commits for the first repo to include in state
      let commitsData = [];
      if (reposData.length > 0) {
        try {
          const firstRepo = reposData[0].name;
          const commitsRes = await fetch(`https://api.github.com/repos/${gitUsernameInput}/${firstRepo}/commits?per_page=3`);
          if (commitsRes.ok) {
            commitsData = await commitsRes.json();
          }
        } catch (e) {
          console.warn("Commits fetch failed on initial sync, using empty list");
        }
      }

      const newState = {
        ...projectStates,
        [activeProject]: {
          ...projectStates[activeProject],
          gitUser: userData,
          gitRepos: reposData,
          selectedGitRepo: reposData.length > 0 ? reposData[0].name : '',
          gitCommits: commitsData,
          gitError: null
        }
      };
      setProjectStates(newState);

      const updatedProjectsList = projectsList.map(proj => {
        if (proj.id === activeProject) {
          return {
            ...proj,
            phase1Verified: true,
            progress: Math.max(proj.progress, 90)
          };
        }
        return proj;
      });
      setProjectsList(updatedProjectsList);
      saveProjectsToBackend(updatedProjectsList, newState);
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

      const newState = {
        ...projectStates,
        [activeProject]: {
          ...projectStates[activeProject],
          gitUser: simulatedUser,
          gitRepos: simulatedRepos,
          selectedGitRepo: simulatedRepos[0].name,
          gitCommits: simulatedCommits,
          gitError: 'Rate-Limited / Offline: Loaded Verified Simulation Mode'
        }
      };
      setProjectStates(newState);

      const updatedProjectsList = projectsList.map(proj => {
        if (proj.id === activeProject) {
          return {
            ...proj,
            phase1Verified: true,
            progress: Math.max(proj.progress, 90)
          };
        }
        return proj;
      });
      setProjectsList(updatedProjectsList);
      saveProjectsToBackend(updatedProjectsList, newState);
    } finally {
      setGitVerifying(false);
    }
  };

  const handleRepoChange = async (e) => {
    const repoName = e.target.value;
    
    // Fetch commits for selected repo
    let commitsData = [];
    if (gitUser) {
      try {
        const commitsRes = await fetch(`https://api.github.com/repos/${gitUser.login}/${repoName}/commits?per_page=3`);
        if (commitsRes.ok) {
          commitsData = await commitsRes.json();
        }
      } catch (err) {
        commitsData = [
          { 
            sha: '0ec9becb3d7b72bffb2021e6727911bc', 
            commit: { 
              message: `Mock Sync: Active commit validation on ${repoName}`, 
              author: { name: gitUser.name || gitUser.login, date: new Date().toISOString() } 
            }
          }
        ];
      }
    }

    const newState = {
      ...projectStates,
      [activeProject]: {
        ...projectStates[activeProject],
        selectedGitRepo: repoName,
        gitCommits: commitsData
      }
    };
    setProjectStates(newState);
    saveProjectsToBackend(projectsList, newState);
  };

  const handleDisconnectGit = () => {
    const newState = {
      ...projectStates,
      [activeProject]: {
        ...projectStates[activeProject],
        gitUser: null,
        gitRepos: [],
        selectedGitRepo: '',
        gitCommits: [],
        gitUsernameInput: '',
        gitError: null
      }
    };
    setProjectStates(newState);

    const updatedProjectsList = projectsList.map(proj => {
      if (proj.id === activeProject) {
        return {
          ...proj,
          phase1Verified: false,
          progress: Math.max(0, proj.progress - 50)
        };
      }
      return proj;
    });
    setProjectsList(updatedProjectsList);
    saveProjectsToBackend(updatedProjectsList, newState);
  };

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
      
      // Initialize projects from database if present
      if (data.projects && data.projects.length > 0) {
        setProjectsList(data.projects);
        
        // Populate projectStates from data.projects
        const updatedStates = {};
        data.projects.forEach(proj => {
          updatedStates[proj.id] = {
            gitUsernameInput: proj.gitUsernameInput || '',
            gitUser: proj.gitUser || null,
            gitRepos: proj.gitRepos || [],
            selectedGitRepo: proj.selectedGitRepo || '',
            gitCommits: proj.gitCommits || [],
            gitError: null,
            uploadedDocs: proj.uploadedDocs || [],
            peerPapersVerified: proj.peerPapersVerified || false
          };
        });
        setProjectStates(prev => ({
          ...prev,
          ...updatedStates
        }));
      }

      // Initialize grant fields from database if present
      if (data.grantTotalAmount !== undefined) setGrantTotalAmount(data.grantTotalAmount);
      if (data.grantPhase1Amount !== undefined) setGrantPhase1Amount(data.grantPhase1Amount);
      if (data.projectDescription !== undefined) setProjectDescription(data.projectDescription);
      if (data.budgetSplitItems && data.budgetSplitItems.length > 0) setBudgetSplitItems(data.budgetSplitItems);
      if (data.grantApplied !== undefined) setGrantApplied(data.grantApplied);
      if (data.phase2Attested !== undefined) setPhase2Attested(data.phase2Attested);
      
      // Initialize edit fields
      setEditName(data.name);
      setEditUniversity(data.university);
      setEditDepartment(data.department);
      setEditRole(data.role);
      setEditBio(data.bio);
      setEditSkills(data.skills ? data.skills.join(', ') : '');
      setEditWallet(data.walletAddress || '');
      
      // Auto-verify profile if all required parameters are pre-filled
      if (data.bio && data.skills && data.skills.length > 0 && data.walletAddress) {
        setProfileVerified(true);
      } else {
        setProfileVerified(false);
      }
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

  const handleLoginSuccess = async (regData) => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    if (regData && regData.name) {
      setLoading(true);
      try {
        const updated = await api.updateProfile({
          name: regData.name,
          university: regData.university,
          walletAddress: regData.email,
          role: 'Lead Researcher',
          department: 'Bioengineering & Computer Science',
          bio: '',
          skills: []
        });
        setProfile(updated);
        setEditName(updated.name);
        setEditUniversity(updated.university);
        setEditDepartment(updated.department || '');
        setEditRole(updated.role || '');
        setEditBio(updated.bio || '');
        setEditSkills('');
        setEditWallet(updated.walletAddress || '');
        setProfileVerified(false);
      } catch (err) {
        console.error("Error setting up profile on register:", err);
      } finally {
        setLoading(false);
      }
    } else {
      if (profile && profile.bio && profile.skills && profile.skills.length > 0 && profile.walletAddress) {
        setProfileVerified(true);
      } else {
        setProfileVerified(false);
      }
    }
    
    // Switch active tab to profile verification
    setActiveTab('profile');
    setActiveCard(0);
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[#07080a] text-white overflow-hidden flex flex-col justify-between">
        <ParticleCanvas />
        <LandingPage onLogin={handleLoginSuccess} />
      </div>
    );
  }

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
            
            <div className="flex gap-2 mt-1.5">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-accent hover:text-white transition-all flex items-center gap-1.5 font-bold cursor-pointer border border-accent/30 bg-accent/5 hover:bg-accent/15 px-3.5 py-1.5 rounded-xl shadow-neonAccent/5 hover:shadow-neonAccent/20"
              >
                <Edit3 className="w-3.5 h-3.5 text-accent" />
                Edit Profile
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('isAuthenticated');
                  setIsAuthenticated(false);
                }}
                className="text-xs text-red-400 hover:text-white transition-all flex items-center gap-1.5 font-bold cursor-pointer border border-red-500/30 bg-red-500/5 hover:bg-red-500/15 px-3.5 py-1.5 rounded-xl shadow-neonRed/5 hover:shadow-neonRed/20"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                Log Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto flex-1 relative z-10 flex flex-col justify-start">
        
        {/* Top-Right Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="fixed top-6 right-6 z-[9999] max-w-md w-full bg-[#0d0e12]/95 border-2 border-emerald-500/30 rounded-2xl p-5 shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)] backdrop-blur-md flex items-start gap-3.5"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <CheckCircle className="w-5.5 h-5.5 text-emerald-400" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider">Transaction Approved</h4>
                <p className="text-xs text-gray-200 font-medium leading-relaxed">{toastMessage}</p>
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/5 mt-1.5 text-[9px] text-gray-500 font-mono">
                  <span>Target: Bank Account (*4890)</span>
                  <span>•</span>
                  <span>Instant Wire</span>
                </div>
              </div>
              <button 
                onClick={() => setShowToast(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
          <div className={`w-full grid grid-cols-1 lg:grid-cols-12 gap-6 text-left ${(activeTab === 'milestones' || activeTab === 'phase2' || activeTab === 'deployed') ? 'items-start' : 'items-stretch'}`}>
            
            {/* Global Left Sidebar: Verification Progress Roadmap (2 cols) */}
            <div className={`lg:col-span-2 ${(activeTab === 'milestones' || activeTab === 'phase2' || activeTab === 'deployed') ? 'h-auto' : 'h-full'}`}>
              <div className={`glass-card p-4 border-primary/20 flex flex-col justify-between ${(activeTab === 'milestones' || activeTab === 'phase2' || activeTab === 'deployed') ? 'h-auto' : 'h-full'}`}>
                
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
                          height: phase2Attested
                            ? '100%'
                            : grantApplied 
                            ? '85%' 
                            : (gitUser || peerPapersVerified) 
                            ? '65%' 
                            : profileVerified
                            ? '35%' 
                            : '15%' 
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

                        {/* Step 2: HER Profile Verified (Conditional) */}
                        {profileVerified ? (
                          <div 
                            onClick={() => { setActiveTab('profile'); setActiveCard(0); }}
                            className="relative pl-7 py-0.5 cursor-pointer hover:bg-white/5 transition-all rounded-r-lg -ml-1 pr-1 group text-left"
                          >
                            <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0 z-10 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                              ✓
                            </div>
                            <p className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">Profile Verification</p>
                          </div>
                        ) : (
                          <div 
                            onClick={() => { setActiveTab('profile'); setActiveCard(0); }}
                            className="relative pl-7 py-2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-l-2 border-primary rounded-r-lg -ml-2 pr-2 cursor-pointer hover:from-primary/30 transition-all text-left"
                          >
                            <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center font-mono shrink-0 z-10 shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                              2
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">Profile Verification</p>
                              <span className="text-[8px] text-primary font-mono block mt-0.5 font-black">Active Step</span>
                            </div>
                          </div>
                        )}

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
                        ) : profileVerified ? (
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
                        ) : (
                          <div className="relative pl-7 py-0.5 opacity-40 text-left">
                            <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[9px] text-gray-500 font-mono shrink-0 z-10">
                              3
                            </div>
                            <p className="text-xs font-bold text-gray-500 leading-tight">Developer & Document Sync</p>
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
                        {grantApplied ? (
                          <div 
                            onClick={() => setActiveTab('milestones')}
                            className="relative pl-7 py-0.5 cursor-pointer hover:bg-white/5 transition-all rounded-r-lg -ml-1 pr-1 group text-left"
                          >
                            <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0 z-10 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                              ✓
                            </div>
                            <p className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors leading-tight">Phase 1 Grants</p>
                          </div>
                        ) : (gitUser || peerPapersVerified) ? (
                          <div 
                            onClick={() => setActiveTab('milestones')}
                            className="relative pl-7 py-2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-l-2 border-primary rounded-r-lg -ml-2 pr-2 text-left cursor-pointer hover:from-primary/30"
                          >
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

                        {/* Step 6: Phase 2 Setup */}
                        {phase2Attested ? (
                          <div 
                            onClick={() => setActiveTab('phase2')}
                            className="relative pl-7 py-0.5 cursor-pointer hover:bg-white/5 transition-all rounded-r-lg -ml-1 pr-1 group text-left"
                          >
                            <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0 z-10 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                              ✓
                            </div>
                            <p className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors leading-tight">Phase 2 Setup</p>
                          </div>
                        ) : grantApplied ? (
                          <div 
                            onClick={() => setActiveTab('phase2')}
                            className="relative pl-7 py-2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-l-2 border-primary rounded-r-lg -ml-2 pr-2 text-left cursor-pointer hover:from-primary/30"
                          >
                            <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center font-mono shrink-0 z-10 shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                              6
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight font-black">Phase 2 Setup</p>
                              <span className="text-[8px] text-primary font-mono block mt-0.5 font-black">Active Step</span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative pl-7 py-0.5 text-left">
                            <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-white/5 border border-white/10 text-gray-600 text-[9px] font-bold flex items-center justify-center font-mono shrink-0 z-10">
                              6
                            </div>
                            <p className="text-xs font-bold text-gray-500">Phase 2 Setup</p>
                          </div>
                        )}

                        {/* Step 7: Project Deployed */}
                        {phase2Attested ? (
                          <div 
                            onClick={() => setActiveTab('deployed')}
                            className="relative pl-7 py-2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-l-2 border-primary rounded-r-lg -ml-2 pr-2 text-left cursor-pointer hover:from-primary/30"
                          >
                            <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center font-mono shrink-0 z-10 shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                              7
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight font-black">Project Deployed</p>
                              <span className="text-[8px] text-primary font-mono block mt-0.5 font-black">Active Step</span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative pl-7 py-0.5 text-left">
                            <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-white/5 border border-white/10 text-gray-600 text-[9px] font-bold flex items-center justify-center font-mono shrink-0 z-10">
                              7
                            </div>
                            <p className="text-xs font-bold text-gray-500">Project Deployed</p>
                          </div>
                        )}

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
                        <h2 className="text-lg font-bold text-white tracking-wide">
                          Active Project Workspace <span className="text-xs font-semibold text-accent font-mono lowercase block sm:inline-block sm:ml-2">(select the project you want to deploy now)</span>
                        </h2>
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

            {/* 1.5 DEDICATED GRANT APPLICATION PAGE */}
            {activeTab === 'milestones' && (
              <motion.div
                key="milestones-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full space-y-6 text-left"
              >
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-4 mb-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 text-[10px] font-mono uppercase font-bold tracking-wider">
                        Grant Application
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        ID: GA-{activeProject.toUpperCase().slice(0,3)}-{new Date().getFullYear()}
                      </span>
                    </div>
                    <h1 className="text-xl font-black text-white uppercase tracking-wider">
                      {activeProject === 'synapse' ? 'Neural Synapse Bridge' : activeProject === 'sensor' ? 'Retinal Quantum Sensor' : 'Distributed IP Oracle'}
                    </h1>
                    <p className="text-xs text-gray-400">Request funding from investors & sponsors for your project phases.</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Project Selector */}
                    <select 
                      value={activeProject} 
                      onChange={(e) => { setActiveProject(e.target.value); setGrantApplied(false); }} 
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
                      ← Back to Verification Center
                    </button>
                  </div>
                </div>

                {/* Success Notification Banner */}
                <AnimatePresence>
                  {grantApplied && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
                      className="w-full p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] backdrop-blur-sm relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-emerald-500/5 pointer-events-none" />
                      <div className="absolute top-0 left-1/4 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="relative flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <h3 className="text-base font-black text-emerald-400 uppercase tracking-wider">Application Submitted Successfully!</h3>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            Your grant application for <span className="font-bold text-white">${grantTotalAmount.toLocaleString()}</span> has been submitted to our investor & sponsor network.
                          </p>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-emerald-500/10">
                            <Bell className="w-4 h-4 text-fuchsia-400" />
                            <p className="text-sm text-fuchsia-300 font-semibold">
                              You will be notified when investors are ready to sponsor your project. Stay tuned!
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Form Content */}
                <div className="space-y-6">

                  {/* 1. PROJECT DESCRIPTION CARD */}
                  <div className="glass-card p-6 border-primary/20 space-y-4">
                    <div className="border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-fuchsia-500/15 border border-fuchsia-500/25 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-fuchsia-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Project Description</h3>
                          <p className="text-[10px] text-gray-500">Briefly explain your project vision, goals, and how the funds will be utilized</p>
                        </div>
                      </div>
                    </div>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe your project — what problem does it solve, what is your approach, and what impact will the funding create?"
                      rows={5}
                      className="w-full bg-darkBg/80 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-fuchsia-500/50 focus:shadow-[0_0_15px_rgba(217,70,239,0.1)] resize-none transition-all duration-300 leading-relaxed"
                    />
                    <div className="flex justify-end">
                      <span className="text-[10px] text-gray-500 font-mono">{projectDescription.length} / 2000 characters</span>
                    </div>
                  </div>

                  {/* 2. TOTAL GRANT AMOUNT SLIDER */}
                  <div className="glass-card p-6 border-primary/20 space-y-5">
                    <div className="border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Total Grant Request</h3>
                          <p className="text-[10px] text-gray-500">Combined Phase 1 + Phase 2 funding amount</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">Requesting Amount</span>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-fuchsia-400" />
                          <span className="text-2xl font-black text-white font-mono tracking-tight">{grantTotalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Slider Track */}
                      <div className="relative w-full h-10 flex items-center">
                        <div className="absolute inset-x-0 h-3 bg-white/5 rounded-full border border-white/10 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 transition-all duration-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                            style={{ width: `${((grantTotalAmount - 5000) / (500000 - 5000)) * 100}%` }}
                          />
                        </div>
                        <input
                          type="range"
                          min={5000}
                          max={500000}
                          step={1000}
                          value={grantTotalAmount}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setGrantTotalAmount(val);
                            if (grantPhase1Amount > val) setGrantPhase1Amount(val);
                          }}
                          className="absolute inset-x-0 w-full h-10 opacity-0 cursor-pointer z-10"
                        />
                        {/* Thumb indicator */}
                        <div 
                          className="absolute w-6 h-6 rounded-full bg-white border-2 border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)] pointer-events-none transition-all duration-200"
                          style={{ left: `calc(${((grantTotalAmount - 5000) / (500000 - 5000)) * 100}% - 12px)` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                        <span>$5,000</span>
                        <span>$500,000</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. PHASE 1 PROTOTYPE DEVELOPMENT SLIDER */}
                  <div className="glass-card p-6 border-primary/20 space-y-5">
                    <div className="border-b border-white/5 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Phase 1 — Prototype Development</h3>
                            <p className="text-[10px] text-gray-500">Amount allocated for prototype improvement</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">Phase 1 Amount</span>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span className="text-2xl font-black text-white font-mono tracking-tight">{grantPhase1Amount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Slider Track */}
                      <div className="relative w-full h-10 flex items-center">
                        <div className="absolute inset-x-0 h-3 bg-white/5 rounded-full border border-white/10 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400 transition-all duration-200 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                            style={{ width: `${grantTotalAmount > 0 ? (grantPhase1Amount / grantTotalAmount) * 100 : 0}%` }}
                          />
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={grantTotalAmount}
                          step={1000}
                          value={grantPhase1Amount}
                          onChange={(e) => setGrantPhase1Amount(Number(e.target.value))}
                          className="absolute inset-x-0 w-full h-10 opacity-0 cursor-pointer z-10"
                        />
                        {/* Thumb indicator */}
                        <div 
                          className="absolute w-6 h-6 rounded-full bg-white border-2 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] pointer-events-none transition-all duration-200"
                          style={{ left: `calc(${grantTotalAmount > 0 ? (grantPhase1Amount / grantTotalAmount) * 100 : 0}% - 12px)` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                        <span>$0</span>
                        <span>${grantTotalAmount.toLocaleString()}</span>
                      </div>

                      {/* Phase Split Summary */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-darkBg/60 border border-emerald-500/15 rounded-xl p-4 space-y-1">
                          <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold tracking-wider block">Phase 1 — Prototype</span>
                          <span className="text-lg font-black text-white font-mono">${grantPhase1Amount.toLocaleString()}</span>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${grantTotalAmount > 0 ? (grantPhase1Amount / grantTotalAmount) * 100 : 0}%` }} />
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono">{grantTotalAmount > 0 ? ((grantPhase1Amount / grantTotalAmount) * 100).toFixed(0) : 0}% of total</span>
                        </div>
                        <div className="bg-darkBg/60 border border-violet-500/15 rounded-xl p-4 space-y-1">
                          <span className="text-[10px] text-violet-400 uppercase font-mono font-bold tracking-wider block">Phase 2 — Scale & Launch</span>
                          <span className="text-lg font-black text-white font-mono">${(grantTotalAmount - grantPhase1Amount).toLocaleString()}</span>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-400 rounded-full" style={{ width: `${grantTotalAmount > 0 ? ((grantTotalAmount - grantPhase1Amount) / grantTotalAmount) * 100 : 0}%` }} />
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono">{grantTotalAmount > 0 ? (((grantTotalAmount - grantPhase1Amount) / grantTotalAmount) * 100).toFixed(0) : 0}% of total</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. BUDGET SPLIT SECTION */}
                  <div className="glass-card p-6 border-primary/20 space-y-5">
                    <div className="border-b border-white/5 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-amber-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Budget Allocation</h3>
                            <p className="text-[10px] text-gray-500">Specify how you plan to spend the Phase 1 funds</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setBudgetSplitItems([...budgetSplitItems, { category: '', amount: 0 }])}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/25 text-fuchsia-400 text-xs font-bold hover:bg-fuchsia-500/20 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Item
                        </button>
                      </div>
                    </div>

                    {/* Budget Rows */}
                    <div className="space-y-3">
                      {budgetSplitItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex items-center gap-3 group"
                        >
                          <div className="flex-1 flex items-center gap-3 bg-darkBg/60 border border-white/8 rounded-xl p-3 hover:border-white/15 transition-all">
                            <span className="text-xs text-gray-500 font-mono w-6 text-center flex-shrink-0">{String(index + 1).padStart(2, '0')}</span>
                            <input
                              type="text"
                              value={item.category}
                              onChange={(e) => {
                                const updated = [...budgetSplitItems];
                                updated[index].category = e.target.value;
                                setBudgetSplitItems(updated);
                              }}
                              placeholder="e.g., Hardware, Software, Team..."
                              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none font-medium"
                            />
                            <div className="flex items-center gap-1 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              <input
                                type="number"
                                value={item.amount}
                                onChange={(e) => {
                                  const updated = [...budgetSplitItems];
                                  updated[index].amount = Number(e.target.value);
                                  setBudgetSplitItems(updated);
                                }}
                                className="w-24 bg-transparent text-sm text-white font-mono font-bold focus:outline-none text-right"
                                min={0}
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => setBudgetSplitItems(budgetSplitItems.filter((_, i) => i !== index))}
                            className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    {/* Budget Summary Footer */}
                    <div className="border-t border-white/5 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">Total Allocated</span>
                        <span className={`text-sm font-black font-mono ${
                          budgetSplitItems.reduce((sum, i) => sum + i.amount, 0) > grantPhase1Amount
                            ? 'text-red-400'
                            : budgetSplitItems.reduce((sum, i) => sum + i.amount, 0) === grantPhase1Amount
                            ? 'text-emerald-400'
                            : 'text-white'
                        }`}>
                          ${budgetSplitItems.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            budgetSplitItems.reduce((sum, i) => sum + i.amount, 0) > grantPhase1Amount
                              ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                          }`}
                          style={{ width: `${Math.min(grantPhase1Amount > 0 ? (budgetSplitItems.reduce((sum, i) => sum + i.amount, 0) / grantPhase1Amount) * 100 : 0, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-gray-500">
                          {budgetSplitItems.reduce((sum, i) => sum + i.amount, 0) > grantPhase1Amount 
                            ? <span className="text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3 inline" /> Over budget by ${(budgetSplitItems.reduce((sum, i) => sum + i.amount, 0) - grantPhase1Amount).toLocaleString()}</span>
                            : <span className="text-gray-500">Remaining: ${(grantPhase1Amount - budgetSplitItems.reduce((sum, i) => sum + i.amount, 0)).toLocaleString()}</span>
                          }
                        </span>
                        <span className="text-gray-500">Phase 1 Budget: ${grantPhase1Amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* 5. APPLY BUTTON */}
                  <div className="flex justify-center pt-2 pb-4">
                    {!grantApplied ? (
                      <button
                        onClick={async () => {
                          setGrantApplying(true);
                          try {
                            const updatedProfile = await api.updateProfile({
                              grantTotalAmount,
                              grantPhase1Amount,
                              projectDescription,
                              budgetSplitItems,
                              grantApplied: true
                            });
                            setProfile(updatedProfile);
                            setGrantApplied(true);
                            setToastMessage(`Your grant application for ${grantTotalAmount.toLocaleString()} has been granted successfully! Your requested Phase 1 amount of ${grantPhase1Amount.toLocaleString()} has been disbursed and debited into your bank account.`);
                            setShowToast(true);
                            // Auto-navigate to phase2 view after a 3.5s delay
                            setTimeout(() => {
                              setActiveTab('phase2');
                            }, 3500);
                          } catch (err) {
                            alert("Failed to submit grant application: " + err.message);
                          } finally {
                            setGrantApplying(false);
                          }
                        }}
                        disabled={grantApplying || !projectDescription.trim()}
                        className={`group relative px-10 py-4 rounded-2xl text-base font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                          grantApplying
                            ? 'bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300'
                            : !projectDescription.trim()
                            ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-fuchsia-600 via-violet-600 to-purple-600 border border-fuchsia-500/50 text-white shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:shadow-[0_0_50px_rgba(217,70,239,0.5)] hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                      >
                        {grantApplying ? (
                          <>
                            <div className="w-5 h-5 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin" />
                            Submitting Application...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Submit Grant Application
                          </>
                        )}
                        {!grantApplying && projectDescription.trim() && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fuchsia-600/0 via-white/10 to-fuchsia-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-base font-black uppercase tracking-widest">Application Submitted</span>
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            )}

            {/* 1.6 DEDICATED PHASE 2 SETUP PAGE */}
            {activeTab === 'phase2' && (
              <motion.div
                key="phase2-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full space-y-6 text-left"
              >
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-4 mb-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono uppercase font-bold tracking-wider">
                        Production Deck & Escrow Lock
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        Vault: ${(grantTotalAmount - grantPhase1Amount).toLocaleString()} USDT Pending Lock
                      </span>
                    </div>
                    <h1 className="text-xl font-black text-white uppercase tracking-wider">
                      Phase 2 Investment Board
                    </h1>
                    <p className="text-xs text-gray-400">Review the finalized prototype, testing metrics, patent status, and release terms for investor equity exchange.</p>
                  </div>

                  <button 
                    onClick={() => setActiveTab('milestones')}
                    className="px-4 py-2 border border-white/10 hover:border-primary bg-white/5 hover:bg-primary/10 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-neonPrimary/10"
                  >
                    ← Back to Phase 1 Setup
                  </button>
                </div>

                {/* Symmetrical 2-Column Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  
                  {/* Left Column: Pitch, System Testing, Security and Patent */}
                  <div className="space-y-6 flex flex-col justify-between">
                    
                    {/* 1. PROTOTYPE PRESENTATION & ORIGINALITY */}
                    <div className="glass-card p-6 border-primary/20 space-y-4 flex-1">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Finalized Phase 1 Prototype</h3>
                          <p className="text-[10px] text-gray-500">Working execution schematic and patent attestation</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-darkBg/60 border border-white/5 p-4 rounded-xl space-y-2">
                          <h4 className="text-xs font-bold text-white uppercase font-mono text-primary">Originality & IP Protection</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            A completely novel hardware-software synthesis validated through differential testing logic. IP verification checks confirm zero overlapping repository signatures.
                          </p>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold uppercase">
                              US Patent Pending: #63/981,204
                            </span>
                          </div>
                        </div>

                        <div className="bg-darkBg/60 border border-white/5 p-4 rounded-xl space-y-2">
                          <h4 className="text-xs font-bold text-white uppercase font-mono text-accent">Phase 2 Utility Outlook</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Phase 2 funding triggers production-scale array integration, transition from silicon simulators to certified deployment frameworks.
                          </p>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                            <span className="px-2 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 text-[9px] font-mono font-bold uppercase">
                              Market Ready Rating: 9.8 / 10
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. FULL SCALE SYSTEM TESTING & BETA METRICS */}
                    <div className="glass-card p-6 border-primary/20 space-y-4 flex-1">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Full-Scale System Testing</h3>
                          <p className="text-[10px] text-gray-500">Real-time simulation audit logs for target scale load capacity</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-darkBg/40 border border-white/5 p-3 rounded-xl text-center">
                            <span className="text-[9px] text-gray-500 uppercase font-mono block">Node Consensus</span>
                            <span className="text-sm font-black text-emerald-400 font-mono mt-0.5 block">99.98%</span>
                          </div>
                          <div className="bg-darkBg/40 border border-white/5 p-3 rounded-xl text-center">
                            <span className="text-[9px] text-gray-500 uppercase font-mono block">Latency</span>
                            <span className="text-sm font-black text-white font-mono mt-0.5 block">14.2 ms</span>
                          </div>
                          <div className="bg-darkBg/40 border border-white/5 p-3 rounded-xl text-center">
                            <span className="text-[9px] text-gray-500 uppercase font-mono block">Load Capacity</span>
                            <span className="text-sm font-black text-white font-mono mt-0.5 block">1.5M/s</span>
                          </div>
                          <div className="bg-darkBg/40 border border-white/5 p-3 rounded-xl text-center">
                            <span className="text-[9px] text-gray-500 uppercase font-mono block">Accuracy</span>
                            <span className="text-sm font-black text-emerald-400 font-mono mt-0.5 block">99.999%</span>
                          </div>
                        </div>

                        <div className="p-3 bg-black/30 border border-white/5 rounded-xl font-mono text-[10px] text-gray-400 space-y-1">
                          <p className="text-white font-bold mb-1">Recent Automated Pipeline Reports:</p>
                          <p><span className="text-emerald-400">[PASS]</span> Load Simulation test: 15,000 parallel workers sustained over 72 hours.</p>
                          <p><span className="text-emerald-400">[PASS]</span> Integrity attestation: Merkle root hashes synchronized with IPFS.</p>
                        </div>
                      </div>
                    </div>

                    {/* 3. PRODUCTION LAUNCH & SECURITY CLEARANCE */}
                    <div className="glass-card p-6 border-primary/20 space-y-4 flex-1">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                        <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Production Launch & Security Attestation</h3>
                          <p className="text-[10px] text-gray-500">Security clearances and smart contract audit reports</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-darkBg/60 border border-emerald-500/10 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                              ✓
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white">Smart Contract Security Audit</h4>
                              <p className="text-[9px] text-gray-500">Audited by CertiK Foundation & Trail of Bits</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold">
                            SECURE - GRADE A
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-darkBg/60 border border-emerald-500/10 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                              ✓
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white">Regulatory Compliance Attestation</h4>
                              <p className="text-[9px] text-gray-500">Attested for KYC, AML, and cross-border tech transfers</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold">
                            VERIFIED CLEAN
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Investor Equity Offer Console & Lead Partners */}
                  <div className="space-y-6 flex flex-col justify-between">
                    
                    {/* Syndicate Lead Partners & Co-investors */}
                    <div className="glass-card p-6 border-primary/20 space-y-4 flex-1">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                          <Network className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Co-partners/Investors</h3>
                          <p className="text-[10px] text-gray-500">Venture institutions and co-investors sponsoring this round</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-4 bg-darkBg/60 border border-white/5 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold block">Sequoia Capital</span>
                            <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">Institutional Lead • Silicon Valley</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-400">
                            40% allocation
                          </span>
                        </div>

                        <div className="p-4 bg-darkBg/60 border border-white/5 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold block">Founders Fund</span>
                            <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">Co-investor • Deep Tech Growth</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-400">
                            30% allocation
                          </span>
                        </div>

                        <div className="p-4 bg-darkBg/60 border border-white/5 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold block">Andreessen Horowitz (a16z)</span>
                            <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">Co-investor • Infrastructure Group</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-400">
                            30% allocation
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Equity Exchange Offer Console */}
                    <div className="glass-card p-6 border-primary/20 space-y-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                              <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Equity Exchange Console</h3>
                              <p className="text-[10px] text-gray-500">Exchange remaining Phase 2 funds for corporate equity</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (!showCounterOffer) {
                                setCounterAmount(grantTotalAmount - grantPhase1Amount);
                              }
                              setShowCounterOffer(!showCounterOffer);
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider text-white transition-all duration-300 shadow-sm hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                              showCounterOffer
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 border-emerald-500/30 hover:from-emerald-500 hover:to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-gradient-to-r from-fuchsia-600 to-purple-600 border-fuchsia-500/30 hover:from-fuchsia-500 hover:to-purple-500 shadow-[0_0_15px_rgba(217,70,239,0.2)]'
                            }`}
                          >
                            {showCounterOffer ? "View Original Offer" : "Counter Offer"}
                          </button>
                        </div>

                        <AnimatePresence mode="wait">
                          {!showCounterOffer ? (
                            <motion.div
                              key="original-offer"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="space-y-4"
                            >
                              <div className="bg-darkBg/60 border border-white/5 p-4 rounded-xl space-y-1">
                                <span className="text-[9px] text-gray-500 uppercase font-mono block">Lock Capital Requested</span>
                                <span className="text-xl font-black text-white font-mono">
                                  ${(grantTotalAmount - grantPhase1Amount).toLocaleString()} <span className="text-xs text-gray-400">USDT</span>
                                </span>
                              </div>

                              <div className="bg-darkBg/60 border border-white/5 p-4 rounded-xl space-y-1.5">
                                <span className="text-[9px] text-gray-500 uppercase font-mono block">Exchange Equity Offering</span>
                                <div className="flex items-center justify-between">
                                  <span className="text-2xl font-black text-emerald-400 font-mono">12.5%</span>
                                  <span className="text-[10px] text-gray-500 font-mono">Series-A Pref Share</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12.5%' }} />
                                </div>
                              </div>

                              <div className="bg-darkBg/60 border border-white/5 p-4 rounded-xl space-y-2">
                                <span className="text-[9px] text-gray-500 uppercase font-mono block text-left">Investor Terms & Covenants</span>
                                <ul className="text-[10px] text-gray-400 space-y-1.5 list-disc pl-3 text-left">
                                  <li>Post-money valuation locked at $4M.</li>
                                  <li>Funds locked in escrow contract.</li>
                                </ul>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="counter-offer"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="space-y-4"
                            >
                              {/* Counter Amount Config */}
                              <div className="bg-darkBg/60 border border-white/5 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between items-center text-[9px] font-mono uppercase">
                                  <span className="text-gray-500">Counter Capital Requested</span>
                                  <span className="text-fuchsia-400 font-bold">${counterAmount.toLocaleString()} USDT</span>
                                </div>
                                <div className="relative w-full h-8 flex items-center">
                                  <div className="absolute inset-x-0 h-1.5 bg-white/5 rounded-full" />
                                  <div 
                                    className="absolute h-1.5 rounded-full bg-fuchsia-500"
                                    style={{ width: `${Math.min(100, (counterAmount / ((grantTotalAmount - grantPhase1Amount) * 2)) * 100)}%` }}
                                  />
                                  <input 
                                    type="range"
                                    min={Math.floor((grantTotalAmount - grantPhase1Amount) * 0.5)}
                                    max={(grantTotalAmount - grantPhase1Amount) * 2}
                                    step={5000}
                                    value={counterAmount}
                                    onChange={(e) => setCounterAmount(Number(e.target.value))}
                                    className="absolute inset-x-0 w-full h-8 opacity-0 cursor-pointer z-10"
                                  />
                                  <div 
                                    className="absolute w-4 h-4 rounded-full bg-white border border-fuchsia-500"
                                    style={{ left: `calc(${Math.min(100, (counterAmount / ((grantTotalAmount - grantPhase1Amount) * 2)) * 100)}% - 8px)` }}
                                  />
                                </div>
                                <div className="flex justify-between text-[8px] text-gray-500 font-mono">
                                  <span>Min: ${(Math.floor((grantTotalAmount - grantPhase1Amount) * 0.5)).toLocaleString()}</span>
                                  <span>Max: ${((grantTotalAmount - grantPhase1Amount) * 2).toLocaleString()}</span>
                                </div>
                              </div>

                              {/* Counter Equity Config */}
                              <div className="bg-darkBg/60 border border-white/5 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between items-center text-[9px] font-mono uppercase">
                                  <span className="text-gray-500">Proposed Equity Exchange</span>
                                  <span className="text-emerald-400 font-bold">{counterEquity}%</span>
                                </div>
                                <div className="relative w-full h-8 flex items-center">
                                  <div className="absolute inset-x-0 h-1.5 bg-white/5 rounded-full" />
                                  <div 
                                    className="absolute h-1.5 rounded-full bg-emerald-500"
                                    style={{ width: `${(counterEquity / 30) * 100}%` }}
                                  />
                                  <input 
                                    type="range"
                                    min={2}
                                    max={30}
                                    step={0.5}
                                    value={counterEquity}
                                    onChange={(e) => setCounterEquity(Number(e.target.value))}
                                    className="absolute inset-x-0 w-full h-8 opacity-0 cursor-pointer z-10"
                                  />
                                  <div 
                                    className="absolute w-4 h-4 rounded-full bg-white border border-emerald-500"
                                    style={{ left: `calc(${(counterEquity / 30) * 100}% - 8px)` }}
                                  />
                                </div>
                                <div className="flex justify-between text-[8px] text-gray-500 font-mono">
                                  <span>2% Equity</span>
                                  <span>30% Max</span>
                                </div>
                              </div>

                              {/* Calculated Valuation */}
                              <div className="p-3 bg-fuchsia-500/[0.03] border border-fuchsia-500/10 rounded-xl flex items-center justify-between text-[10px]">
                                <span className="text-gray-400 font-bold">Implied Valuation:</span>
                                <span className="font-mono font-black text-fuchsia-400">
                                  ${counterEquity > 0 ? (Math.round((counterAmount / (counterEquity / 100)))).toLocaleString() : 0} USD
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button
                        onClick={async () => {
                          const amountStr = showCounterOffer ? counterAmount.toLocaleString() : (grantTotalAmount - grantPhase1Amount).toLocaleString();
                          const equityStr = showCounterOffer ? `${counterEquity}%` : "12.5%";
                          
                          try {
                            const updatedProfile = await api.updateProfile({
                              phase2Attested: true
                            });
                            setProfile(updatedProfile);
                            setPhase2Attested(true);
                            setToastMessage(`Your equity offer has been accepted! Phase 2 Funding of ${amountStr} USDT has been unlocked in exchange for ${equityStr} equity. Funds have been disbursed straight into your bank account!`);
                            setShowToast(true);
                            setActiveTab('deployed');
                          } catch (err) {
                            alert("Failed to attest equity offer: " + err.message);
                          }
                        }}
                        className={`w-full py-4 mt-6 bg-gradient-to-r border rounded-2xl text-xs font-black uppercase tracking-wider text-white transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                          showCounterOffer 
                            ? 'from-fuchsia-600 to-purple-600 border-fuchsia-500/30 hover:from-fuchsia-500 hover:to-purple-500 shadow-[0_0_20px_rgba(217,70,239,0.25)] hover:shadow-[0_0_35px_rgba(217,70,239,0.45)]' 
                            : 'from-emerald-500 to-teal-400 border-emerald-400/30 hover:from-emerald-400 hover:to-teal-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)]'
                        }`}
                      >
                        {showCounterOffer ? "Submit Custom Counter Offer" : "Lock & Attest Equity Offer"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 1.7 PREMIUM FUTURISTIC DEPLOYED SUCCESS PAGE */}
            {activeTab === 'deployed' && (
              <motion.div
                key="deployed-view"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.6 }}
                className="w-full space-y-8 text-left"
              >
                {/* Immersive Header Banner */}
                <div className="relative p-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.05] via-[#0d0e12] to-teal-500/[0.03] overflow-hidden shadow-[0_20px_50px_rgba(16,185,129,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(0,0,0,0))]" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono uppercase font-black tracking-widest animate-pulse">
                        LIVE DEPLOYMENT STATUS: OPERATIONAL
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider bg-clip-text bg-gradient-to-r from-white via-gray-200 to-emerald-400">
                      Project Deployed Successfully!
                    </h1>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                      Escrow conditions met. The investor syndicate has successfully released and transferred all requested Phase 2 funds directly into your attested bank account.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 relative z-10 shrink-0">
                    <button 
                      onClick={() => setActiveTab('phase2')}
                      className="px-5 py-2.5 border border-white/10 hover:border-emerald-500/30 bg-white/5 hover:bg-emerald-500/10 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-lg"
                    >
                      ← Back to Deal Terms
                    </button>
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-neonPrimary/25 shadow-lg"
                    >
                      Return to Workspace
                    </button>
                  </div>
                </div>

                {/* Symmetrical 2-Column Success Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                  
                  {/* Left Column: Financial Transfer Certificate & Attestations */}
                  <div className="glass-card p-8 border-emerald-500/20 space-y-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#0d0e12] to-[#12141a]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white uppercase tracking-wider">Syndicate Grant Disbursed</h3>
                          <p className="text-xs text-gray-500">Official capital ledger Attestation</p>
                        </div>
                      </div>

                      {/* Major Amount Display */}
                      <div className="bg-black/40 border border-white/5 p-6 rounded-2xl space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono block">Capital Deposited</span>
                          <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                            ${(showCounterOffer ? (grantPhase1Amount + counterAmount) : grantTotalAmount).toLocaleString()} <span className="text-sm font-normal text-gray-400">USDT</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs">
                          <div>
                            <span className="text-gray-500 block mb-0.5 font-mono text-[9px] uppercase">Phase 1 Grant</span>
                            <span className="font-bold text-white font-mono">${grantPhase1Amount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block mb-0.5 font-mono text-[9px] uppercase">Phase 2 Investment</span>
                            <span className="font-bold text-white font-mono">${(showCounterOffer ? counterAmount : (grantTotalAmount - grantPhase1Amount)).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block mb-0.5 font-mono text-[9px] uppercase">Equity Offered</span>
                            <span className="font-bold text-[#d946ef] font-mono">{showCounterOffer ? `${counterEquity}%` : "12.5%"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bank Details Status */}
                      <div className="space-y-3">
                        <div 
                          onClick={() => alert(`WIRE TRANSFER CERTIFICATE:\n-------------------------\nOriginating Bank: Federal Reserve Wire Network\nLead Syndicate Account: Sequoia Capital Trust (*0092)\nReceiving Bank: JP Morgan Chase\nAccount: Account Holder ****4890\nPhase 1 Disbursed: $${grantPhase1Amount.toLocaleString()} USDT\nPhase 2 Disbursed: $${(showCounterOffer ? counterAmount : (grantTotalAmount - grantPhase1Amount)).toLocaleString()} USDT\nTotal Disbursed: $${(showCounterOffer ? (grantPhase1Amount + counterAmount) : grantTotalAmount).toLocaleString()} USDT\nStatus: Settlement Complete via Fedwire Funds Service.`)}
                          className="p-4 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl flex items-center justify-between hover:bg-emerald-500/[0.06] hover:border-emerald-500/20 cursor-pointer transition-all"
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-gray-400 font-bold block">Status: Transfer Complete</span>
                            <span className="text-[9px] text-gray-500 font-mono block">Target: JP Morgan Chase Wire (*4890) (Click to view Wire)</span>
                          </div>
                          <span className="px-3 py-1 rounded bg-emerald-500/15 border border-emerald-500/25 text-[10px] font-mono font-bold text-emerald-400">
                            RECEIVED
                          </span>
                        </div>

                        <div 
                          onClick={() => alert(`EQUITY SHARE RECORD:\n-------------------\nAsset Class: Series-A Preferred Share\nLocked Offering: ${showCounterOffer ? `${counterEquity}%` : "12.5%"}\nImplied Valuation: $${(showCounterOffer ? Math.round((counterAmount / (counterEquity / 100))) : 4000000).toLocaleString()} USD\nLedger Hash: 0x4f82ef29b8cde39ff827aa19fb82d09ff\nAttestation Date: ${new Date().toISOString().split('T')[0]}`)}
                          className="p-4 bg-[#0d0e12] border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/[0.02] hover:border-white/10 cursor-pointer transition-all"
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-gray-400 font-bold block">Equity Locked & Attested</span>
                            <span className="text-[9px] text-gray-500 font-mono block">Asset Class: Series-A Preferred Share (Click details)</span>
                          </div>
                          <span className="px-3 py-1 rounded bg-[#d946ef]/15 border border-[#d946ef]/25 text-[10px] font-mono font-bold text-[#d946ef]">
                            {showCounterOffer ? `${counterEquity}%` : "12.5%"} LOCKED
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 text-center">
                      <span className="text-[9px] text-gray-500 font-mono block">Automated Escrow Smart Contract Attestation: GA-{activeProject.toUpperCase().slice(0,3)}-{new Date().getFullYear()}</span>
                    </div>
                  </div>

                  {/* Right Column: Investor Syndicate Acceptance Panel */}
                  <div className="glass-card p-8 border-primary/20 space-y-6 flex flex-col justify-between bg-gradient-to-b from-[#0d0e12] to-[#12141a]">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white uppercase tracking-wider">Investor Syndicate Sign-off</h3>
                          <p className="text-xs text-gray-500">Attesting board signatures of co-partners/investors</p>
                        </div>
                      </div>

                      {/* Syndicate Co-partners list */}
                      <div className="space-y-3">
                        <div 
                          onClick={() => alert("SEQUOIA CAPITAL BOARD SIGNATURE:\n-----------------------------\nAttesting Partner: Roelof Botha\nSignature Hash: 0x9b31d279cfba829b37cf29a8f273be9f2a0\nAttestation Timestamp: SEC Verified Instant Block")}
                          className="p-4 bg-darkBg/60 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.01] hover:border-white/10 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                              ✓
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">Sequoia Capital</span>
                              <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">Allocated: 40% • Attested Signature: 0x9b31d...</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-400">
                            SIGNED
                          </span>
                        </div>

                        <div 
                          onClick={() => alert("FOUNDERS FUND BOARD SIGNATURE:\n-----------------------------\nAttesting Partner: Peter Thiel\nSignature Hash: 0x22c4f89fbcd398fac0372df02e3b2eef8e0b\nAttestation Timestamp: SEC Verified Instant Block")}
                          className="p-4 bg-darkBg/60 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.01] hover:border-white/10 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                              ✓
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">Founders Fund</span>
                              <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">Allocated: 30% • Attested Signature: 0x22c4f...</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-400">
                            SIGNED
                          </span>
                        </div>

                        <div 
                          onClick={() => alert("ANDREESSEN HOROWITZ BOARD SIGNATURE:\n-------------------------------------\nAttesting Partner: Marc Andreessen\nSignature Hash: 0xe8e2b8c9d2f3a8b27cf1e9ff2a02bce3df278\nAttestation Timestamp: SEC Verified Instant Block")}
                          className="p-4 bg-darkBg/60 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.01] hover:border-white/10 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                              ✓
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">Andreessen Horowitz (a16z)</span>
                              <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">Allocated: 30% • Attested Signature: 0xe8e2b...</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-400">
                            SIGNED
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-2 text-center">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Blockchain Attestation</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        Funds have been disbursed via direct instant bank wire. Transaction and equity lock hashes are pinned on IPFS and broadcasted to mainnet nodes.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Futuristic Assured Deployment Certificate Panel */}
                <div className="relative p-8 rounded-3xl border-2 border-dashed border-emerald-500/30 bg-gradient-to-r from-emerald-500/[0.04] via-emerald-500/[0.01] to-teal-500/[0.04] overflow-hidden text-center space-y-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06),transparent_70%)]" />
                  
                  {/* Holographic Seal Icon */}
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 flex items-center justify-center text-darkBg shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce">
                    <Award className="w-9 h-9" />
                  </div>

                  <div className="space-y-2 relative z-10 max-w-2xl mx-auto">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">
                      🎉 Congratulations! Project Successfully Attested 🎉
                    </h3>
                    <p className="text-sm text-emerald-400 font-bold font-mono uppercase tracking-wider">
                      Official Cryptographic Certificate of Deployment
                    </p>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      We are proud to certify that your venture has cleared all protocol hurdles, verified codebase dependencies, completed security audits, and successfully secured matching co-investments from leading global partners. The entire grant has been wired to your verified banking portal.
                    </p>
                  </div>

                  {/* Security Badge and Hashes */}
                  <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-[10px] font-mono text-gray-400 relative z-10">
                    <span className="px-3 py-1 bg-black/40 border border-white/5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      CERTIFICATE ID: HER-DEP-0982-A
                    </span>
                    <span className="px-3 py-1 bg-black/40 border border-white/5 rounded-full">
                      HASH: 0x8aef3d21c009aee18320abdd90f23
                    </span>
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-bold uppercase">
                      ✓ SECURED & DEPLOYED
                    </span>
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
                {!profileVerified ? (
                  /* Profile Attestation Check-In Form */
                  <div className="w-full max-w-2xl mx-auto glass-card p-8 border-primary/20 bg-[#0d0e12]/80 backdrop-blur-md rounded-3xl space-y-6 text-left relative overflow-hidden shadow-neonPrimary/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-neonPrimary">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-wider">Profile Attestation Check-In</h3>
                        <p className="text-[11px] text-gray-500">Provide the remaining credential tags to verify academic innovation standing.</p>
                      </div>
                    </div>

                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setSaving(true);
                        try {
                          const skillsArray = editSkills
                            .split(',')
                            .map(s => s.trim())
                            .filter(s => s.length > 0);

                          const payload = {
                            name: editName,
                            university: editUniversity,
                            department: editDepartment || 'Bioengineering & Computer Science',
                            role: editRole || 'Lead Researcher',
                            bio: editBio,
                            skills: skillsArray,
                            walletAddress: editWallet
                          };

                          const updatedProfile = await api.updateProfile(payload);
                          setProfile(updatedProfile);
                          setProfileVerified(true);
                          
                          setToastMessage("Profile verified successfully! Proceeding to sync.");
                          setShowToast(true);
                          
                          // Switch to Developer & Document Sync (dashboard)
                          setActiveTab('dashboard');
                        } catch (err) {
                          alert('Failed to verify profile: ' + err.message);
                        } finally {
                          setSaving(false);
                        }
                      }}
                      className="space-y-4"
                    >
                      {/* Name & University */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-gray-400 font-mono uppercase tracking-wider font-bold">Registered Name</label>
                          <input 
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-gray-400 font-mono uppercase tracking-wider font-bold">University Affiliation</label>
                          <input 
                            type="text"
                            value={editUniversity}
                            onChange={(e) => setEditUniversity(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                            required
                          />
                        </div>
                      </div>

                      {/* Role & Department */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-gray-400 font-mono uppercase tracking-wider font-bold">Academic Role</label>
                          <input 
                            type="text"
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            placeholder="e.g. Lead Researcher, PhD Candidate"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-gray-400 font-mono uppercase tracking-wider font-bold">Department / Lab</label>
                          <input 
                            type="text"
                            value={editDepartment}
                            onChange={(e) => setEditDepartment(e.target.value)}
                            placeholder="e.g. Bio-AI Lab, Computer Science"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                            required
                          />
                        </div>
                      </div>

                      {/* Bio Biography */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] text-gray-400 font-mono uppercase tracking-wider font-bold">Research Biography (Bio)</label>
                        <textarea 
                          rows={3}
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          placeholder="Describe your research focus, lab developments, or academic focus..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary resize-none"
                          required
                        />
                      </div>

                      {/* Technical Skills & Wallet */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] text-gray-400 font-mono uppercase tracking-wider font-bold">Technical Skills Checklist (Comma Separated)</label>
                        <input 
                          type="text"
                          value={editSkills}
                          onChange={(e) => setEditSkills(e.target.value)}
                          placeholder="e.g. Deep Learning, Biophysics, PyTorch, EEG signals"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] text-gray-400 font-mono uppercase tracking-wider font-bold">Web3 Wallet / Escrow Signature Address</label>
                        <input 
                          type="text"
                          value={editWallet}
                          onChange={(e) => setEditWallet(e.target.value)}
                          placeholder="e.g. 0xDF39A284bE03E33fcd98c23..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary font-mono"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full mt-4 py-3.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-neonPrimary/25"
                      >
                        {saving ? "Signing Ledger..." : "Attest Node & Verify Profile"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <>
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
                      ← Return to Creator Dashboard
                    </button>
                  </div>
                </div>
                  </>
                )}

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
                {/* Header with Add Project Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-4 mb-4 gap-4">
                  <div className="space-y-1">
                    <h1 className="text-xl font-black text-white uppercase tracking-wider">
                      My Projects Workspace
                    </h1>
                    <p className="text-xs text-gray-400">Attest development stages, manage milestone phases, and request capital allocations.</p>
                  </div>
                  <button
                    onClick={handleOpenAddProject}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-neonPrimary/25 shadow-lg"
                  >
                    <Plus className="w-4.5 h-4.5" />
                    New Project
                  </button>
                </div>

                {/* Symmetrical grid with profile-style cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {projectsList.map((project) => (
                    <div 
                      key={project.id}
                      onClick={() => handleOpenEditProject(project)}
                      className="glass-card p-6 border-primary/20 flex flex-col justify-between space-y-4 hover:border-primary/50 hover:bg-white/[0.01] cursor-pointer transition-all hover:scale-[1.01] relative group overflow-hidden"
                    >
                      {/* Interactive background neon elements */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-all duration-300" />
                      
                      <div className="space-y-3">
                        <div className="w-full h-36 rounded-xl overflow-hidden border border-white/5 relative bg-darkBg/40">
                          <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          
                          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                            {project.tags.map((tag, idx) => (
                              <span key={idx} className="text-[8px] font-mono bg-black/60 border border-white/10 px-1.5 py-0.5 rounded text-gray-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          {/* Verification State Badges */}
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {project.phase1Verified ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                                ✓ Phase 1
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-white/5 text-gray-500 border border-white/5 text-[9px] font-mono font-bold uppercase tracking-wider">
                                Phase 1 Pending
                              </span>
                            )}

                            {project.phase2Verified ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                                ✓ Phase 2
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-white/5 text-gray-500 border border-white/5 text-[9px] font-mono font-bold uppercase tracking-wider">
                                Phase 2 Pending
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-extrabold text-white mt-2 group-hover:text-primary transition-colors">{project.name}</h3>
                          <p className="text-xs text-gray-400 leading-relaxed min-h-[48px]">{project.description}</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                          <span>Development progress</span>
                          <span className="text-white font-bold">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-darkBg h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              project.progress === 100 
                                ? 'bg-emerald-400' 
                                : project.progress > 50 
                                ? 'bg-primary' 
                                : 'bg-accent'
                            }`} 
                            style={{ width: `${project.progress}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-start pt-2">
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors text-xs font-semibold text-gray-300"
                  >
                    ←  Return to Creator Dashboard
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
        <span>Â© 2026 EquiPatent technologies. Seeded via MERN stack.</span>
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

      {/* Project Edit/Add Modal Overlay */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl bg-[#0d0e12] border border-primary/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_20px_50px_rgba(217,70,239,0.15)] overflow-y-auto max-h-[90vh] text-left"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">
                    {editingProjectId ? "Modify Project Workspace" : "Register New Venture"}
                  </h3>
                  <p className="text-xs text-gray-500">Configure corporate registry, verification states, and documentations.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-5">
                {/* Name & Progress Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Project Name</label>
                    <input 
                      type="text" 
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                      placeholder="e.g. Neural Synapse Bridge"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">
                      <span>Development Progress</span>
                      <span className="text-primary">{projProgress}%</span>
                    </div>
                    <div className="relative w-full h-10 flex items-center">
                      <div className="absolute inset-x-0 h-1 bg-white/5 rounded-full" />
                      <div 
                        className="absolute h-1 rounded-full bg-gradient-to-r from-primary to-accent" 
                        style={{ width: `${projProgress}%` }}
                      />
                      <input 
                        type="range"
                        min={0}
                        max={100}
                        value={projProgress}
                        onChange={(e) => setProjProgress(Number(e.target.value))}
                        className="absolute inset-x-0 w-full h-8 opacity-0 cursor-pointer z-10"
                      />
                      <div 
                        className="absolute w-4 h-4 rounded-full bg-white border border-primary"
                        style={{ left: `calc(${projProgress}% - 8px)` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Detailed Description</label>
                  <textarea 
                    rows={3}
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary resize-none"
                    placeholder="Describe the technical overview, implementation parameters, and venture goals..."
                    required
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Technology Tags (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={projTags}
                    onChange={(e) => setProjTags(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary font-mono"
                    placeholder="e.g. PyTorch, EEG Signals, Web3, ZK-Snarks"
                  />
                </div>

                {/* Verification status toggle options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 p-4 border border-white/5 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white block">Phase 1 Verified</span>
                      <span className="text-[10px] text-gray-500 block">Milestone tracker and code integration complete</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProjPhase1Verified(!projPhase1Verified)}
                      className={`w-11 h-6 rounded-full transition-all duration-300 relative focus:outline-none ${
                        projPhase1Verified ? 'bg-emerald-500' : 'bg-white/10'
                      }`}
                    >
                      <div 
                        className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${
                          projPhase1Verified ? 'left-5.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white block">Phase 2 Verified</span>
                      <span className="text-[10px] text-gray-500 block">Attestation and corporate escrow locking done</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProjPhase2Verified(!projPhase2Verified)}
                      className={`w-11 h-6 rounded-full transition-all duration-300 relative focus:outline-none ${
                        projPhase2Verified ? 'bg-emerald-500' : 'bg-white/10'
                      }`}
                    >
                      <div 
                        className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${
                          projPhase2Verified ? 'left-5.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Cover Image Selection */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Project Cover Image</label>
                    <button
                      type="button"
                      onClick={handleUploadProjImage}
                      className="text-[10px] text-accent hover:text-white transition-all underline"
                    >
                      Custom URL Cover
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Neural Synapse', path: '/synapse_real.jpg' },
                      { name: 'Quantum Retinal', path: '/sensor_real.jpg' },
                      { name: 'IP Oracle', path: '/oracle_real.jpg' }
                    ].map((imgOpt) => (
                      <div 
                        key={imgOpt.path}
                        onClick={() => setProjImage(imgOpt.path)}
                        className={`relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          projImage === imgOpt.path ? 'border-primary shadow-neonPrimary' : 'border-white/5 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={imgOpt.path} alt={imgOpt.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-[8px] font-mono text-white text-center px-1">{imgOpt.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supporting Documents section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Supporting Documents & Assets</label>
                    <input 
                      type="file" 
                      id="proj-doc-file-input" 
                      className="hidden" 
                      onChange={handleAddProjectDoc} 
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('proj-doc-file-input')?.click()}
                      className="text-[10px] text-accent border border-accent/25 hover:border-accent/50 bg-accent/5 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      Add Doc
                    </button>
                  </div>

                  {projDocs.length === 0 ? (
                    <p className="text-[10px] text-gray-500 italic">No supporting documents uploaded yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {projDocs.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2.5 bg-black/30 border border-white/5 rounded-xl text-[10px]">
                          <span className="text-white truncate font-mono flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-accent" />
                            {doc}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMockDoc(idx)}
                            className="text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold hover:shadow-neonPrimary transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Project
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
