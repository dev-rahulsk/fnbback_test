import { Gender, PreferredGender, Role } from "../enums/user.enum";

export interface IUser extends Document {
  email: string;
  password: string;
  profilePictures: string[];
  phoneNumber?: string;
  googleId?: string;
  appleId?: string;
  facebookId?: string;
  about?: string;
  name: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: Date;
  preferredGender?: 'Male' | 'Female' | 'Other';
  role?: 'Admin' | 'Member';
  isVerified: boolean;
  otp?: string;
  profileCompletion: number;
}