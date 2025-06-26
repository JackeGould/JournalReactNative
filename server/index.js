const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const cors = require("cors"); // ✅ import cors
const typeDefs = require("./typeDefs/index"); // adjust path if needed
const resolvers = require("./resolvers/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const startServer = async () => {
  const app = express();

  // ✅ Enable CORS
  app.use(
    cors({
      origin: "*", // Replace with your client URL for production (e.g., "http://192.168.1.100:19006")
      credentials: true, // Allow cookies, if needed later
    })
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");

      if (!token) return {};

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { user: decoded };
      } catch (err) {
        console.warn("❌ Invalid token:", err.message);
        return {};
      }
    },
  });

  await server.start();

  // ✅ Apply middleware *after* CORS
  server.applyMiddleware({ app });

  await mongoose.connect(process.env.MONGO_URI);

  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
};

startServer();

