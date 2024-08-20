import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
// Update the URI to use 'mongo' instead of 'localhost'
const uri = process.env.MONGO_URL ?? "";

export const connectDB = () => {
  mongoose.connect(uri);

  // Get the default connection
  const db = mongoose.connection;

  // Bind connection to error event (to get notification of connection errors)
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => {
    console.log("Connected successfully to MongoDB");
    // Further code for interacting with MongoDB will go here
  });
};
