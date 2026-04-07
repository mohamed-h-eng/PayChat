const express = require("express")
const router = express.Router()
//add controllers
const {
    depositController,
    withdrawController,
    sendController,
    readController} = require("../controllers/transactionController")
const {authMiddleWare} = require("../middleware/authmiddleware")

router.post("/transaction/deposit",authMiddleWare,depositController)
router.post("/transaction/withdraw",authMiddleWare,withdrawController)
router.post("/transaction/send",authMiddleWare,sendController)
router.get("/transaction/view",authMiddleWare,readController)

module.exports = router