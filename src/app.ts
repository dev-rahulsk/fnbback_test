import express, { Application } from "express";
import { connectDB } from "./database/config";
import PassportService from "./api/services/passport-services";
import authRoutes from "./api/routes/auth-routes";
import userRoutes from "./api/routes/user-routes";
import postRoutes from "./api/routes/post-routes";
import adminRoutes from "./api/routes/admin-routes";
import locationRoutes from "./api/routes/location-routes";
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Initialize Passport.js
app.use(PassportService.initialize());

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/admin",adminRoutes)
app.use("/" , (req,res)=> res.send('hello'))
app.listen(8000, () => {
  console.log("Server listening on port 8000");
  connectDB();
});
