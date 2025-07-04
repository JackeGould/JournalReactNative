import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPost extends Document {
  _id: string;
  title: string;
  message: string;
  author: Schema.Types.ObjectId
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
//  createdAt and updatedAt automatically created
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

PostSchema.index({ author: 1, createdAt: -1 }); // For efficient author queries

const Post = mongoose.model<IPost>('Post', PostSchema)

export default Post;