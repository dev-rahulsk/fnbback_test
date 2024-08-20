import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import PassportService from "../services/passport-services";
import { PostValidation } from "../validators/post-validators";
import PostController from "../controllers/requests/post-requests";
import { handleValidationErrors } from "../utils/functions";
import { upload } from "../utils/postupload.utils";

const router = Router();

router.post(
  "/add-posts",
  PassportService.authenticate("jwt"),
  upload,
  PostController.add.bind(PostController) 
);

export default router;
