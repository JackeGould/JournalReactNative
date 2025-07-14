import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import cors from "cors";
import typeDefs from "./typeDefs/index";
import resolvers from "./resolvers/index";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { upload } from "./middleware/uploads"; // multer setup

dotenv.config();

const startServer = async () => {
  const app: Application = express();

  const allowedOrigin = "http://localhost:8081";

  app.use(cors({
    origin: ['http://localhost:8081', 'https://studio.apollographql.com'],
    credentials: true,
  }));


  app.use(express.json());

  // Serve image files
  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  app.use("/uploads", express.static(uploadsDir));

  // Upload route
  app.post("/uploads", upload.single("profileImage"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

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
  server.applyMiddleware({
    app,
    cors: {
      origin: ['http://localhost:8081', 'https://studio.apollographql.com'],
      credentials: true,
    },
  });


  await mongoose.connect(process.env.MONGO_URI!);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`📁 Uploads at http://localhost:${PORT}/uploads`);
  });
};

startServer();


