// models/user.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  // post: Schema.Types.ObjectId
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
    // post: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Post",
    //   required: false
    // }
  }, 
  { 
    toJSON: {
      virtuals: true
    },
  }
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;