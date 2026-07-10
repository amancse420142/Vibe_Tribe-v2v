import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
  university: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, default: 'Innovator / Researcher' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  walletAddress: { type: String, default: '0xDF...A28' },
  innovationScore: { type: Number, default: 94 },
  verified: { type: Boolean, default: true },
  projects: [{
    id: { type: String },
    name: { type: String },
    description: { type: String },
    image: { type: String },
    tags: [{ type: String }],
    progress: { type: Number },
    phase1Verified: { type: Boolean },
    phase2Verified: { type: Boolean },
    documents: [{ type: String }],
    gitUsernameInput: { type: String },
    gitUser: { type: mongoose.Schema.Types.Mixed },
    gitRepos: { type: mongoose.Schema.Types.Mixed },
    selectedGitRepo: { type: String },
    gitCommits: { type: mongoose.Schema.Types.Mixed },
    peerPapersVerified: { type: Boolean },
    uploadedDocs: { type: mongoose.Schema.Types.Mixed },
    deployed: { type: Boolean, default: false }
  }],
  grantTotalAmount: { type: Number, default: 50000 },
  grantPhase1Amount: { type: Number, default: 20000 },
  projectDescription: { type: String, default: '' },
  budgetSplitItems: [{
    category: { type: String },
    amount: { type: Number }
  }],
  grantApplied: { type: Boolean, default: false },
  phase2Attested: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;
