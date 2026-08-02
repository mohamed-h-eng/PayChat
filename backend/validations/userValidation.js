const joi = require("joi")

const registerSchema = joi.object({
    name:joi.string().min(3).max(30).required(),
    email:joi.string().email().required(),
    password:joi.string().min(8).required(),
    role:joi.string().valid("admin","user").default("user")
})

const loginSchema = joi.object({
    email:joi.string().email().required(),
    password:joi.string().required()
})

module.exports = {
    registerSchema,
    loginSchema
}