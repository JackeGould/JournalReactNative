// models/user.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'coach' | 'player';
  teamId?: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['coach', 'player'], required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
