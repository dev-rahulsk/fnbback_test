import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.model";
import EmailService from "../../services/email-services";
import { Role, PreferredGender } from "../../enums/user.enum";
import AuthResponse from "../responses/auth-responses";
import { ObjectId } from "mongodb";
import Location from "../../models/location.model";
import otpModel from "../../models/otp.model";


export class AuthController {
  // Private method to generate tokens
  private generateTokens(userId: ObjectId) {
    const accessToken = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || "secret", // Use environment variable for secret
      { expiresIn: "12h" } // Access token expiration
    );

    const refreshToken = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || "secret", // Use environment variable for secret
      { expiresIn: "7d" } // Refresh token expiration
    );

    return { accessToken, refreshToken };
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      let user = await User.findOne({ email });
      // let existingOtp = await otpModel.findOne({ email: email });
      // console.log(user?.isVerified);
      
      if (user && user.isVerified) {
        AuthResponse.userAlreadyExists(res);
        return;
      }
  
      // Send verification email
      const otp = await EmailService.generateVerificationCode();
      await EmailService.sendVerificationEmail(email,otp)
      // console.log(otp);
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      if (user && !user.isVerified) {
        // If user exists and is not verified, update the password and otp
        user.password = hashedPassword;
        await otpModel.updateOne(
          {email:email},
          {
            otp:otp
          },
          {upsert:true}
        );
        await user.save();
      
      } else {
        // If user does not exist, create a new user
        user = new User({ email, password: hashedPassword, otp, isVerified: false });
        await user.save();
      }
  
      res.status(201).json({
        message: "User registered successfully.Please verify your account by entering the otp that has been sent to your email for verification.",
      });
    } catch (error) {
      console.log("error", error);
      AuthResponse.serverError(res);
    }
  }
  
  async verifyEmail(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    // console.log("email,otp", email, otp);
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        AuthResponse.emailNotFound(res);
        return;
      }
      // console.log("user", user);
      const existingOtp=await otpModel.findOne({email:user.email})
      // console.log(existingOtp);
      // console.log(existingOtp)
      if(!existingOtp){
      
        
        AuthResponse.otpExpired(res);
        return;
      }
      if(existingOtp.otp!=otp){
        AuthResponse.invalidVerificationCode(res);
        return;
      }
      await otpModel.deleteOne({email:email});

      // OTP is correct, update the user's verification status
      user.isVerified = true;
      await user.save();
   

      // Generate access and refresh tokens using the private method
      const tokens = this.generateTokens(user._id);

      // Send response with tokens
      res.status(200).json({
        message: "Email verified successfully",
        tokens,
      });
    } catch (error) {
      console.error("Verification error:", error);
      AuthResponse.invalidVerificationCode(res);
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        AuthResponse.serverError(res);
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        AuthResponse.serverError(res);
        return;
      }

      // Check if user is verified
      if (!user.isVerified) {
        res.status(400).json({ message: "Please verify your email first" });
        return;
      }

      // Generate access and refresh tokens using the private method
      const tokens = this.generateTokens(user._id);

      // Send response with tokens
      res.status(200).json({
        message: "Logined In successfully",
        tokens,
      });
    } catch (error) {
      AuthResponse.serverError(res);
    }
  }

  async selectRole(req: Request, res: Response): Promise<void> {
    const { role } = req.body;

    if (!Object.values(Role).includes(role)) {
      AuthResponse.invalidRole(res);
      return;
    }

    try {
      const user = req.user as any; // Assuming `req.user` is set by Passport.js
      user.role = role;
      await user.save();

      res.status(200).json({ message: "Role selected successfully" });
    } catch (error) {
      AuthResponse.serverError(res);
    }
  }

  async completeProfile(req: Request, res: Response) {
    const { firstName, lastName, gender, dob } = req.body;

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Profile picture is required' });
      }
  
      const user = req.user as any; // Assuming req.user is set by Passport.js
  
      user.firstName = firstName;
      user.lastName = lastName;
      user.gender = gender;
      user.dateOfBirth = new Date(dob);
  
      // Handle profile picture
      const profilePictureUrl = `/uploads/profilePictures/${req.file.filename}`;
      user.profilePictures = [profilePictureUrl]; // Resetting to the new picture
  
      await user.save();
  
      AuthResponse.profileUpdateSuccess(res);
    } catch (error) {
      AuthResponse.serverError(res);
    }
  }

  async selectPreferredGender(req: Request, res: Response): Promise<void> {
    const { preferredGender } = req.body;

    if (!Object.values(PreferredGender).includes(preferredGender)) {
      AuthResponse.invalidRole(res);
      return;
    }

    try {
      const user = req.user as any; // Assuming `req.user` is set by Passport.js
      user.preferredGender = preferredGender;
      await user.save();

      res
        .status(200)
        .json({ message: "Preferred gender selected successfully" });
    } catch (error) {
      AuthResponse.serverError(res);
    }
  }

  async addLocation(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user as any;
      const { type, address, coordinates } = req.body;
  
 
      const location = new Location({
        userId:userId._id, 
        type,
        address,
        coordinates,
      });
  

      const savedLocation = await location.save();
  
      return res.status(201).json(savedLocation);
    } catch (error) {
      console.error('Error saving location:', error);
      return res.status(500).json({ message: 'Internal Server Error.' });
    }
  }
  async forgetPassword(req: Request, res: Response): Promise<Response> {
    try {
      // Find the user by email
      const user = await User.findOne({ email: req.body.email});
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Generate OTP
      const otp = await EmailService.generateVerificationCode();
      const msg = `
        You are receiving this email because a request to reset your password was received for your account.
  
        Your one-time password (OTP) for password reset is: ${otp}
  
        For security reasons, please do not share this OTP with anyone.
  
        If you did not request a password reset, please ignore this email or contact our support team immediately.
      `;
      const subject=`Forget Password`;
  
      // Send OTP email
      await EmailService.sendVerificationEmail(user.email,otp,msg,subject)
  
      // Check if OTP already exists for this email
      const existingOtp = await otpModel.findOne({ email: user.email });
  
      if (existingOtp) {
        await otpModel.updateOne(
          { email: user.email },
          {
            $set: {
              otp,
              createdAt: new Date(),
            }
          }
        );
        
      } else {
        const newOtp = new otpModel({
          email: user.email,
          otp,
        });
        await newOtp.save();
      }
      return res.status(200).json({ message: 'OTP sent to your email address successfully.' });
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ message: 'Internal Server Error.' });
    }
  }

  async resetPassword(req:Request,res:Response):Promise<Response>{
    try {
    //  console.log(req.user);
     
       let userId = req.user as any;   
        userId=userId._id
        console.log(userId);
        
      const {password}=req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,  
        { $set: { password: hashedPassword } }, 
        { new: true, runValidators: true }  
      );
      
  
      return res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
      console.log(error);
      
      return res.status(500).json({ message: 'Internal Server Error.' });
    }
  }
  
}
