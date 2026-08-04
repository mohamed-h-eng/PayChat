import express from "express";
const router = express.Router();

//add controllers
import {
  depositController,
  withdrawController,
  sendController,
  readController,
} from "../controllers/transactionController.js";

import { authMiddleWare } from "../middleware/authmiddleware.js";

router.post("/deposit",authMiddleWare,depositController)
router.post("/withdraw",authMiddleWare,withdrawController)
router.post("/send",authMiddleWare,sendController)
router.get("/view",authMiddleWare,readController)

export default router