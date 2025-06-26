// index.ts
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import cors from "cors";
import typeDefs from "./typeDefs/index";
import resolvers from "./resolvers/index";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const startServer = async () => {
  const app: Application = express();

  app.use(
    cors({
      origin: "*",
      credentials: true,
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          _id: string;
          username: string;
        };
        return { user: decoded };
      } catch (err: any) {
        console.warn("❌ Invalid token:", err.message);
        return {};
      }
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  await mongoose.connect(process.env.MONGO_URI!);

  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
};

startServer();
