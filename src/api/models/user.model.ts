import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/user.type";
import { Gender, PreferredGender, Role } from "../enums/user.enum";

// Define User schema
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePictures: [String],
  phoneNumber: String,
  googleId: String,
  appleId: String,
  facebookId: String,
  about: String,
  name: { type: String },
  gender: { type: String, enum: Object.values(Gender) },
  dateOfBirth: Date,
  preferredGender: { type: String, enum: Object.values(PreferredGender) },
  role: { type: String, enum: Object.values(Role) },
  isVerified: { type: Boolean, default: false },
  otp: String,
  profileCompletion: { type: Number, default: 0 },
});

// Create User model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
