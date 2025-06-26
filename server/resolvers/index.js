const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      console.log("🧠 Context in me:", context.user); // Add this

      if (!context.user) {
        return null; // no user found in context (not logged in)
      }

      const user = await User.findById(context.user._id);
      return user;
    },
  },
  Mutation: {
    addUser: async (_, { username, email, password }) => {
      try {
        console.log("🔧 Attempting to create user:", username, email);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.warn("🚫 Email already in use:", email);
          throw new Error("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        const savedUser = await newUser.save();
        console.log("✅ User created:", savedUser);

        const token = jwt.sign(
          { _id: savedUser._id, username: savedUser.username },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return {
          id: savedUser._id.toString(),
          username: savedUser.username,
          email: savedUser.email,
          token,
        };
      } catch (err) {
        console.error("❌ Error in addUser resolver:", err);
        throw new Error("Failed to create user");
      }
    },
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("User not found");
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error("Incorrect password");
        }

        const token = jwt.sign(
          { _id: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          token,
        };
      } catch (err) {
        console.error("❌ Error in login resolver:", err);
        throw new Error("Login failed");
      }
    },
  },
};

module.exports = resolvers;


