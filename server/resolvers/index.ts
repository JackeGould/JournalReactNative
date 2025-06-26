// resolvers/index.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) return null;
      const user = await User.findById(context.user._id);
      return user;
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
        { _id: savedUser._id, username: savedUser.username },
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
        { _id: user._id, username: user.username },
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
  },
};

export default resolvers;


