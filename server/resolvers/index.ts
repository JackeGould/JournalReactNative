// resolvers/index.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Post from "../models/Post";
import User from "../models/User";
import { AuthenticationError } from "apollo-server-express";


const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) return null;
      const user = await User.findById(context.user._id);
      return user;
    },
    postsByMe: async (_: any, __: any, { user }: any) => {
      const posts = await Post.find({ author: user._id })
        .sort({ createdAt: -1 })
        .lean();

      return posts.map((post) => ({
        ...post,
        createdAt: new Date(post.createdAt).toISOString(),
        updatedAt: new Date(post.updatedAt).toISOString(),
      }));
    },
  },
  Mutation: {
    addUser: async (
      _: any,
      { username, email, password }: { username: string; email: string; password: string }
    ) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("Email already in use");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      const savedUser = await newUser.save();

      const token = jwt.sign(
        { 
          _id: savedUser._id, 
          username: savedUser.username,
          email: savedUser.email
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return {
        id: savedUser._id.toString(),
        username: savedUser.username,
        email: savedUser.email,
        token,
      };
    },
    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Incorrect password");

      const token = jwt.sign(
        { 
          _id: user._id, 
          username: user.username,
          email: email
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        token,
      };
    },
    createPost : async (
      _: any, 
      { title, message } : { title: string, message: string },
      context: any
    ) => {
      
      console.log(context)

      if (context.user) {
        const post = await Post.create(
          { 
            title, 
            message,
            author: context.user._id
          },
        )

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { posts: post._id } },
          { runValidators: true, new: true }
        )

        console.log(post)

        return post;
      }
      throw AuthenticationError;
    },
    updateProfileImage: async (
      _: any,
      { imageUrl }: { imageUrl: string },
      context: any
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { profileImage: imageUrl },
        { new: true }
      );

      return updatedUser;
    },
    updateBio: async (_: any, { bio }: { bio: string }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      return await User.findByIdAndUpdate(
        context.user._id,
        { bio },
        { new: true }
      );
    },
    updateMood: async (
      _: any,
      { mood, moodDate }: { mood: string; moodDate: string },
      context: any
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { mood, moodDate },
        { new: true }
      );

      return {
        mood: updatedUser?.mood,
        moodDate: updatedUser?.moodDate,
      };
    },


    // createPost: async (
    //   _: any,
    //   { input } : { input: CreatePostInput },
    //   context: Context 
    // ) => {
    //   try {
    //      // Check if user is authenticated via JWT
    //     if (!context.user) {
    //       throw new AuthenticationError('You must be logged in to create a post');
    //     }

    //     // Validate input
    //     if (!input.content || input.content.trim().length === 0) {
    //       throw new UserInputError('Content is required');
    //     }

    //     if (input.title && input.title.length > 100) {
    //       throw new UserInputError('Title must be 100 characters or less');
    //     }

    //     // Verify the user from JWT still exists in database (optional security check)
    //     const userExists = await User.findById(context.user.id);
    //     if (!userExists) {
    //       throw new AuthenticationError('User account not found');
    //     }

    //     // Create the post using the authenticated user's ID from JWT
    //     const newPost = new Post({
    //       title: input.title?.trim() || '',
    //       content: input.content.trim(),
    //       author: context.user.id  // Use authenticated user's ID from JWT
    //     });

    //     // Save to database
    //     const savedPost = await newPost.save();

    //     // Populate author details before returning
    //     await savedPost.populate('author', 'username email');

    //     return savedPost;

    //   } catch (error: any) {
    //     // Handle Mongoose validation errors
    //     if (error.name === 'ValidationError') {
    //       throw new UserInputError(`Validation Error: ${error.message}`);
    //     }
        
    //     // Re-throw known errors
    //     if (error instanceof AuthenticationError || error instanceof UserInputError) {
    //       throw error;
    //     }

    //     // Handle unexpected errors
    //     console.error('Error creating post:', error);
    //     throw new Error('Failed to create post');
    //   }
    // }
  },
};

export default resolvers;