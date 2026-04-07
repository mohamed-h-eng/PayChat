const express = require("express")
const router = express.Router()
//add controllers
const {
    registerController,
    loginController,
    logoutController,
    changePasswordController} = require("../controllers/authController")
//add validation schemas
const validate = require("../validations/validate")
const {
    registerSchema,
    loginSchema} = require("../validations/userValidation")

const {authMiddleWare} = require("../middleware/authmiddleware")

router.post("/register", validate(registerSchema),registerController)
router.post("/login", validate(loginSchema),loginController)

router.post("/logout", authMiddleWare,logoutController)
router.post("/change-password", authMiddleWare,changePasswordController)

module.exports = router