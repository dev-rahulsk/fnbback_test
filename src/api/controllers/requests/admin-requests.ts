// controllers/AdminController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../../models/admin.model";
import dotenv from 'dotenv';


export class AdminControllers {
  private  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public  async register(req: Request, res: Response): Promise<void> {
    const { email, password, name, roleId, createdBy } = req.body;
    
    try {
      if (!email || !password || !name) {
        res.status(400).json({ error: "Email, password, and name are required." });
        return;
      }

      const existingAdmin = await Admin.findOne({ email }).exec();
      if (existingAdmin) {
        res.status(400).json({ error: "Admin with this email already exists." });
        return;
      }

      const hashedPassword = await this.hashPassword(password);

      const newAdmin = new Admin({
        email,
        password: hashedPassword,
        name,
      });

      const savedAdmin = await newAdmin.save();

      res.status(201).json(savedAdmin);
    } catch (error) {
      console.error("Error registering admin:", error);
      res.status(500).json({ error: "Failed to register admin." });
    }
  }

  public  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {

      const admin = await Admin.findOne({ email }).exec();
      if (!admin) {
        res.status(401).json({ error: "Invalid email or password." });
        return;
      }

      const isMatch = await this.comparePassword(password, admin.password);
      if (!isMatch) {
        res.status(401).json({ error: "Invalid email or password." });
        return;
      }
      
      const token = jwt.sign({ id: admin._id },process.env.JWT_SECRET || "secret", { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (error) {
      console.error("Error logging in admin:", error);
      res.status(500).json({ error: "Failed to log in admin." });
    }
  }

  public  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updates = req.body;

    try {
      const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, { new: true }).exec();
      if (!updatedAdmin) {
        res.status(404).json({ error: "Admin not found." });
        return;
      }

      res.status(200).json(updatedAdmin);
    } catch (error) {
      console.error("Error updating admin:", error);
      res.status(500).json({ error: "Failed to update admin." });
    }
  }

  public  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const deletedAdmin = await Admin.findByIdAndDelete(id).exec();
      if (!deletedAdmin) {
        res.status(404).json({ error: "Admin not found." });
        return;
      }

      res.status(200).json({ message: "Admin deleted successfully." });
    } catch (error) {
      console.error("Error deleting admin:", error);
      res.status(500).json({ error: "Failed to delete admin." });
    }
  }

  public  async get(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    console.log(id);
    
    try {
      const admin = await Admin.findById(id).exec();
      if (!admin) {
        res.status(404).json({ error: "Admin not found." });
        return;
      }

      res.status(200).json(admin);
    } catch (error) {
      console.error("Error fetching admin:", error);
      res.status(500).json({ error: "Failed to fetch admin." });
    }
  }

  public  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const admins = await Admin.find().exec();
      res.status(200).json(admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ error: "Failed to fetch admins." });
    }
  }
}
const AdminController = new AdminControllers
export default AdminController;
