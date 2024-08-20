import { Request, Response } from "express";
import User from "../../models/user.model";

class UserControllers {
  // Method to get a user by their ID
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any; // Assuming `req.user` is set by Passport.js

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  // Method to get all users
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find().exec();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
}
const UserController = new UserControllers();
export default UserController
