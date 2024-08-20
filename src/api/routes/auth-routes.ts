import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import PassportService from "../services/passport-services";
import { AuthController } from "../controllers/requests/auth-requests";
import { AuthValidation } from "../validators/auth-validators";
import MulterService from "../services/multer-serivces";
import { handleValidationErrors } from "../utils/functions";

const router = Router();
const authController = new AuthController();


// Public routes
router.post(
  "/register",
  AuthValidation.registerUser(),
  handleValidationErrors,
  authController.registerUser.bind(authController)
);

router.post(
  "/verify-email",
  AuthValidation.verifyEmail(),
  handleValidationErrors,
  authController.verifyEmail.bind(authController)
);

router.post(
  "/login",
  AuthValidation.loginUser(),
  handleValidationErrors,
  authController.loginUser.bind(authController)
);

// Protected routes
router.post(
  "/select-role",
  PassportService.authenticate("jwt"),
  AuthValidation.selectRole(),
  handleValidationErrors,
  authController.selectRole.bind(authController)
);

router.post(
  "/complete-profile",
  PassportService.authenticate("jwt"),
  MulterService.getUploadMiddleware('profilePicture', 'profilePictures'),
  AuthValidation.completeProfile(),
  handleValidationErrors,
  authController.completeProfile.bind(authController)
);

router.post(
  "/select-preferred-gender",
  PassportService.authenticate("jwt"),
  AuthValidation.selectPreferredGender(),
  handleValidationErrors,
  authController.selectPreferredGender.bind(authController)
);

router.post(
  "/add-location",
  PassportService.authenticate("jwt"),
  AuthValidation.createLocation(),
  handleValidationErrors,
  authController.addLocation.bind(authController)
)
router.post("/forget-password",AuthValidation.verifyEmailOnly(),handleValidationErrors,authController.forgetPassword.bind(authController));
router.post("/reset-password",PassportService.authenticate("jwt"),AuthValidation.VerifyPassword(),handleValidationErrors,authController.resetPassword.bind(authController));
export default router;
