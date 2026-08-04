import express from "express";
const router = express.Router();

import {
  createController,
  readController,
  uploadPhotoController,
} from "../controllers/accountController.js";

import { authMiddleWare } from "../middleware/authmiddleware.js";
import {upload}  from "../middleware/uploadmiddleware.js";

router.patch('/photo',  authMiddleWare, upload.single('photo'), uploadPhotoController);

router.post("/create",authMiddleWare,createController)

router.get("/",authMiddleWare,readController)

export default router;