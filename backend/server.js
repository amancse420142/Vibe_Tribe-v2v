import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import Mongoose User model
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve Frontend compiled production bundles
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Seed profile data
const defaultProfile = {
  id: 'dr-elena-rostova',
  name: 'Dr. Elena Rostova',
  email: 'elena@stanford.edu',
  password: 'password123',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
  university: 'Stanford University',
  department: 'Bioengineering & Computer Science',
  role: 'Lead Researcher, Stanford Bio-AI Lab',
  bio: 'Dedicated to leveraging deep neural networks to accelerate target identification in oncological drug design. Lead scientist at Stanford Bio-AI Lab. Ex-Genentech.',
  skills: ['Deep Learning', 'Biophysics', 'PyTorch', 'Proteomics', 'Rust-Bio'],
  walletAddress: '0xDF39A284bE03E33fcd98c23C8A081D019cE3a60A',
  innovationScore: 94,
  verified: true,
  projects: [
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
  ],
  grantTotalAmount: 50000,
  grantPhase1Amount: 20000,
  projectDescription: '',
  budgetSplitItems: [
    { category: 'US Patent Filing Fee', amount: 8000 },
    { category: 'Software & Cloud Services', amount: 5000 },
    { category: 'Research & Development', amount: 7000 }
  ],
  grantApplied: false,
  phase2Attested: false
};

// Local JSON File Database Fallback
const dbPath = path.join(__dirname, 'db.json');
const getFileDb = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ user: defaultProfile }, null, 2));
  }
  return JSON.parse(fs.readFileSync(dbPath));
};
const saveFileDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

let dbMode = 'file';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/demov2v';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
  .then(async () => {
    console.log('⚡ Connected successfully to MongoDB server.');
    dbMode = 'mongo';
    
    // Seed default user if empty
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        const seedUser = new User(defaultProfile);
        await seedUser.save();
        console.log('🌱 Seeded default user profile in MongoDB.');
      }
    } catch (err) {
      console.error('Error seeding user profile:', err);
    }
  })
  .catch((err) => {
    console.log('⚠️ MongoDB server not running locally. Falling back to JSON file storage (db.json)');
    dbMode = 'file';
    getFileDb(); // Initialize the fallback json file
  });

// API Routes

// 1. Get user profile
app.get('/api/profile', async (req, res) => {
  try {
    const email = req.headers['x-user-email'] || 'elena@stanford.edu';
    if (dbMode === 'mongo') {
      let profile = await User.findOne({ email });
      if (!profile) {
        // Fallback to default user if looking for Elena
        profile = await User.findOne({ id: 'dr-elena-rostova' });
      }
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
      
      // Auto-populate projects if empty/missing
      if (!profile.projects || profile.projects.length === 0) {
        profile.projects = defaultProfile.projects;
        await profile.save();
      }
      res.json(profile);
    } else {
      const db = getFileDb();
      // Auto-populate projects if empty/missing
      if (!db.user.projects || db.user.projects.length === 0) {
        db.user.projects = defaultProfile.projects;
        saveFileDb(db);
      }
      res.json(db.user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Update user profile
app.put('/api/profile', async (req, res) => {
  try {
    const { 
      name, university, department, role, bio, skills, walletAddress, innovationScore, projects,
      grantTotalAmount, grantPhase1Amount, projectDescription, budgetSplitItems, grantApplied, phase2Attested
    } = req.body;
    
    const email = req.headers['x-user-email'] || 'elena@stanford.edu';
    if (dbMode === 'mongo') {
      let profile = await User.findOne({ email });
      if (!profile) {
        profile = await User.findOne({ id: 'dr-elena-rostova' });
      }
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
      
      if (name !== undefined) profile.name = name;
      if (university !== undefined) profile.university = university;
      if (department !== undefined) profile.department = department;
      if (role !== undefined) profile.role = role;
      if (bio !== undefined) profile.bio = bio;
      if (skills !== undefined) profile.skills = skills;
      if (walletAddress !== undefined) profile.walletAddress = walletAddress;
      if (innovationScore !== undefined) profile.innovationScore = innovationScore;
      if (projects !== undefined) profile.projects = projects;
      if (grantTotalAmount !== undefined) profile.grantTotalAmount = grantTotalAmount;
      if (grantPhase1Amount !== undefined) profile.grantPhase1Amount = grantPhase1Amount;
      if (projectDescription !== undefined) profile.projectDescription = projectDescription;
      if (budgetSplitItems !== undefined) profile.budgetSplitItems = budgetSplitItems;
      if (grantApplied !== undefined) profile.grantApplied = grantApplied;
      if (phase2Attested !== undefined) profile.phase2Attested = phase2Attested;
      
      await profile.save();
      res.json(profile);
    } else {
      const db = getFileDb();
      const user = db.user;
      
      if (name !== undefined) user.name = name;
      if (university !== undefined) user.university = university;
      if (department !== undefined) user.department = department;
      if (role !== undefined) user.role = role;
      if (bio !== undefined) user.bio = bio;
      if (skills !== undefined) user.skills = skills;
      if (walletAddress !== undefined) user.walletAddress = walletAddress;
      if (innovationScore !== undefined) user.innovationScore = innovationScore;
      if (projects !== undefined) user.projects = projects;
      if (grantTotalAmount !== undefined) user.grantTotalAmount = grantTotalAmount;
      if (grantPhase1Amount !== undefined) user.grantPhase1Amount = grantPhase1Amount;
      if (projectDescription !== undefined) user.projectDescription = projectDescription;
      if (budgetSplitItems !== undefined) user.budgetSplitItems = budgetSplitItems;
      if (grantApplied !== undefined) user.grantApplied = grantApplied;
      if (phase2Attested !== undefined) user.phase2Attested = phase2Attested;
      
      db.user = user;
      saveFileDb(db);
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { name, university, email, password } = req.body;
    if (!name || !university || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (dbMode === 'mongo') {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
      }

      const newUser = new User({
        id: email, // use email as user ID
        name,
        email,
        password, // simple plaintext password
        university,
        department: 'Bioengineering & Computer Science',
        role: 'Lead Researcher',
        bio: '',
        skills: [],
        walletAddress: email,
        projects: defaultProfile.projects,
        grantTotalAmount: 50000,
        grantPhase1Amount: 20000,
        projectDescription: '',
        budgetSplitItems: defaultProfile.budgetSplitItems,
        grantApplied: false,
        phase2Attested: false
      });
      await newUser.save();
      res.json({ email: newUser.email, name: newUser.name });
    } else {
      const db = getFileDb();
      db.user = {
        id: email,
        name,
        email,
        password,
        university,
        department: 'Bioengineering & Computer Science',
        role: 'Lead Researcher',
        bio: '',
        skills: [],
        walletAddress: email,
        projects: defaultProfile.projects,
        grantTotalAmount: 50000,
        grantPhase1Amount: 20000,
        projectDescription: '',
        budgetSplitItems: defaultProfile.budgetSplitItems,
        grantApplied: false,
        phase2Attested: false
      };
      saveFileDb(db);
      res.json({ email: db.user.email, name: db.user.name });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Log in a user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (dbMode === 'mongo') {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
      res.json({ email: user.email, name: user.name, university: user.university });
    } else {
      const db = getFileDb();
      if (db.user && db.user.email === email && db.user.password === password) {
        res.json({ email: db.user.email, name: db.user.name, university: db.user.university });
      } else if (email === 'elena@stanford.edu' && password === 'password123') {
        res.json({ email: defaultProfile.email, name: defaultProfile.name, university: defaultProfile.university });
      } else {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Wildcard route to serve React app for client-side routing
app.get('*', (req, res) => {
  const indexHtmlPath = path.join(__dirname, '../frontend/dist/index.html');
  if (fs.existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else {
    if (req.path === '/') {
      res.json({ status: "MERN API Backend Operational", storage: dbMode });
    } else {
      res.status(404).send('API endpoint not found.');
    }
  }
});

app.listen(PORT, () => {
  console.log(`📡 demov2v Express server listening on http://localhost:${PORT}`);
});
