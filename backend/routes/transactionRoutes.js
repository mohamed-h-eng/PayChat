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

router.post("/transaction/deposit",authMiddleWare,depositController)
router.post("/transaction/withdraw",authMiddleWare,withdrawController)
router.post("/transaction/send",authMiddleWare,sendController)
router.get("/transaction/view",authMiddleWare,readController)

export default router