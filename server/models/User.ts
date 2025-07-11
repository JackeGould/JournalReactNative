// models/user.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  posts: Schema.Types.ObjectId;
  profileImage?: string;
  bio: string;
  mood: string;
  moodDate: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    posts: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: false
    },
    profileImage: {
      type: String,
      required: false
    },
    bio: {
      type: String,
      default: "",
    },
    mood: {
      type: String,
      default: null,
    },
    moodDate: {
      type: String, 
      default: null,
    },
  },
  { 
    toJSON: {
      virtuals: true
    },
  }
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;