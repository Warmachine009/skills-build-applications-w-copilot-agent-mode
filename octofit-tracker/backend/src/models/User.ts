import { Schema, model } from 'mongoose';

interface User {
  name: string;
  email: string;
  role: 'member' | 'coach';
  createdAt: Date;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['member', 'coach'], default: 'member' },
  createdAt: { type: Date, default: () => new Date() },
});

export default model<User>('User', userSchema);
