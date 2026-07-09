import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
  university: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, default: 'Innovator / Researcher' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  walletAddress: { type: String, default: '0xDF...A28' },
  innovationScore: { type: Number, default: 94 },
  verified: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;
