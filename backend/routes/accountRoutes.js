const express = require("express")
const router =express.Router()

const {createController,readController, uploadPhotoController} = require("../controllers/accountController")
const {authMiddleWare} = require("../middleware/authmiddleware")
const {upload} = require("../middleware/uploadmiddleware")
// const validate = require("../validations/validate")
// const sendSchema = require("../validations/accountValidation")

router.patch('/account/me/photo',  authMiddleWare, upload.single('photo'), uploadPhotoController);

router.post("/account/create",authMiddleWare,createController)
router.get("/account/me",authMiddleWare,readController)

module.exports = router;