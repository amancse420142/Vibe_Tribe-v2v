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
app.use(express.json());

// Seed profile data
const defaultProfile = {
  id: 'dr-elena-rostova',
  name: 'Dr. Elena Rostova',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
  university: 'Stanford University',
  department: 'Bioengineering & Computer Science',
  role: 'Lead Researcher, Stanford Bio-AI Lab',
  bio: 'Dedicated to leveraging deep neural networks to accelerate target identification in oncological drug design. Lead scientist at Stanford Bio-AI Lab. Ex-Genentech.',
  skills: ['Deep Learning', 'Biophysics', 'PyTorch', 'Proteomics', 'Rust-Bio'],
  walletAddress: '0xDF39A284bE03E33fcd98c23C8A081D019cE3a60A',
  innovationScore: 94,
  verified: true
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
    if (dbMode === 'mongo') {
      const profile = await User.findOne({ id: 'dr-elena-rostova' });
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
      res.json(profile);
    } else {
      const db = getFileDb();
      res.json(db.user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Update user profile
app.put('/api/profile', async (req, res) => {
  try {
    const { name, university, department, role, bio, skills, walletAddress, innovationScore } = req.body;
    
    if (dbMode === 'mongo') {
      const profile = await User.findOne({ id: 'dr-elena-rostova' });
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
      
      if (name !== undefined) profile.name = name;
      if (university !== undefined) profile.university = university;
      if (department !== undefined) profile.department = department;
      if (role !== undefined) profile.role = role;
      if (bio !== undefined) profile.bio = bio;
      if (skills !== undefined) profile.skills = skills;
      if (walletAddress !== undefined) profile.walletAddress = walletAddress;
      if (innovationScore !== undefined) profile.innovationScore = innovationScore;
      
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
      
      db.user = user;
      saveFileDb(db);
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`📡 demov2v Express server listening on http://localhost:${PORT}`);
});
