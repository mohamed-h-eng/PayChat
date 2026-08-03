import express from "express";
const router = express.Router();

//add controllers
import {
  registerController,
  loginController,
  logoutController,
  changePasswordController,
} from "../controllers/authController.js";

//add validation schemas
import validate from "../validations/validate.js";
import {
  registerSchema,
  loginSchema,
} from "../validations/userValidation.js";

import { authMiddleWare } from "../middleware/authmiddleware.js";

router.post("/register", validate(registerSchema),registerController)
router.post("/login", validate(loginSchema),loginController)

router.post("/logout", authMiddleWare,logoutController)
router.post("/change-password", authMiddleWare,changePasswordController)

export default router