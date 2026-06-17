import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '👤' },
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetToken: String,
  resetTokenExpires: Date,
  isPro: { type: Boolean, default: false },
  stripeCustomerId: String,
  subscriptionId: String,
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
});

export default mongoose.model('User', userSchema);