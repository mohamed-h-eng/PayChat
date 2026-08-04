
import { env } from '../backend/config/env.js';

import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import path from "path";

import User from "../backend/models/User.js";
import authRoutes from "../backend/routes/authRoutes.js";
import accountRoutes from "../backend/routes/accountRoutes.js";
import transactionRoutes from "../backend/routes/transactionRoutes.js";

import {responseHandler} from '../backend/middleware/response.handler.middleware.js'
// Create Express app
const app = express();

// 1. Basic Middleware
app.use(cors());
app.use(express.json());
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 2. Database Connection Logic (Cached for Vercel)
let isConnected = false;

async function connectToDB() {
  if (isConnected) {
    return true;
  }

  try {
    const db = await mongoose.connect(env.mongoUri);

    isConnected = db.connections[0].readyState;
    console.log("db connected");

    // Create admin if not exists
    // await createAdmin();

    return true;
  } catch (error) {
    console.error("db connection error:", error.message);
    throw error;
  }
}

async function createAdmin() {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.log("Missing Admin .env variables");
      return;
    }

    const admin = await User.findOne({ email: ADMIN_EMAIL });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Admin Account Created Successfully");
    }
  } catch (error) {
    console.error({
      message: "Error Creating Admin",
      data: error.message,
    });
  }
}

// 3. Vercel Database Middleware
app.use(async (req, res, next) => {
  try {
    await connectToDB();
    next();
  } catch (error) {
    res.status(500).json({
      error: "Database connection failed",
    });
  }
});

// 4. handlers
app.use(responseHandler);

// 5. Routes
app.use("/api/auth", authRoutes);
app.use("/api/me", accountRoutes);
app.use("/api/transfer", transactionRoutes);

// 6. Export for Vercel Serverless
export default app;