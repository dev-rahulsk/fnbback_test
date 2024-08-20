import mongoose from "mongoose";

// Define an interface representing the AdminUser document in MongoDB
export interface IAdmin extends Document {
  email: string;
  password: string;
  role: string;
  name: string;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
}


