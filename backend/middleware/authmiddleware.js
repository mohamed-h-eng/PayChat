require("dotenv").config
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authMiddleWare = async (req,res,next)=>{
        try{
            const token = req.headers.authorization.split(" ")[1]
            
            const {id} = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findOne({_id:id})
            
            if(user.token != token) return res.status(401).json({message:"Session expired"})
            if(!user) {
                return res.status(201).json({
                    message:"User Is Not Registered",
                    data:""
                })
            }
            req.user = user;
            next();
        }catch(error){
            res.status(400).json({
                message:"Invalid Login",
                data:error.message
            })
        }
    }

module.exports = {authMiddleWare}