import { Router } from "express";
import { AdminControllers } from "../controllers/requests/admin-requests";
import PassportService from "../services/passport-services";
import { AuthValidation } from "../validators/auth-validators";
import { handleValidationErrors } from "../utils/functions";


const router = Router();
const adminController=new AdminControllers();


  router.post("/register",
    adminController.register.bind(adminController)
  )

  router.post(
    "/login",
    AuthValidation.loginUser(),
    handleValidationErrors,
    adminController.login.bind(adminController)
  )

  router.post(
    "/updates/:id",
    // PassportService.authenticate("jwt"),
    handleValidationErrors,
    adminController.update.bind(adminController)
  )

  router.delete(
    "/delete/:id",
    // PassportService.authenticate("jwt"),
    adminController.delete.bind(adminController)
  )

  router.get(
    "/get-one/:id",
    // PassportService.authenticate("jwt"),
    adminController.get.bind(adminController)
  )

  router.get(
    "/all",
    // PassportService.authenticate("jwt"),
    adminController.getAll.bind(adminController)
  )


  export default router;