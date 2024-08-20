import { Router } from "express";
import PassportService from "../services/passport-services";
import UserController from "../controllers/requests/user-requests";

const router = Router();

// Route to get the profile of the currently authenticated user
router.get(
  "/profile",
  PassportService.authenticate("jwt"),
  UserController.getProfile
);

// Route to get all users (usually would be restricted to admin or similar)
router.get("/all", PassportService.authenticate("jwt"), UserController.getAll);

export default router;
