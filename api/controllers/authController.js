require("dotenv").config
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const registerController = async (req,res)=>{
    try{
        const{name, email,password} = req.body;
        let user = await User.findOne({email})
        if(user) {
            return res.status(201).json({
                message:"User already Registered",
                data:user
            })
        }
        const decodedPassword = await bcrypt.hash(password,10)
        user = await User.create({name, email,password:decodedPassword})
        if(user) return res.status(200).json({
            message:"User Registered Successfully",
            data:user
        })
    }catch(error){
        res.status(500).json({
            message:"Error Registering User"
        })
    }
}

const loginController = async (req,res)=>{
    try{
        const{email,password} = req.body;
        const user = await User.findOne({email})
        if(!user) {
            return res.status(201).json({
                message:"User Is Not Registered",
                data:""
            })
        }
        const checkPassword = await bcrypt.compare(password,user.password)
        if(!checkPassword){
            return res.status(400).json({message:"Incorrect password"})
        }
        // return console.log(user);
        const token = jwt.sign(
            {
                id:user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            }
        )
        user.token = token
        console.log(user)
        await User.findOneAndUpdate(
            { _id: user._id },
            { $set:{token:token}})

        res.status(200).json({
            message:"Loged In Successfully",
            data:token
        })
    }catch(error){
        res.status(400).json({
            message:"Invalid Login",
            data:error.message
        })
    }
}

const logoutController = async (req,res)=>{
    try{
        const { token } = req.user
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set:{token:null}})
        return res.status(200).json({message:"User logged out"})
    }catch(error){
        res.status(400).json({
            message:"Invalid Logout",
            data:error.message
        })
    }
}
const changePasswordController = async (req,res)=>{
    try{
        const {lastPassword , newPassword , confirmPassword} = req.body
        const user = req.user

        const checkPassword = await bcrypt.compare(lastPassword,user.password)
        if(!checkPassword){
            return res.status(400).json({message:"Incorrect password"})
        }

        if(newPassword != confirmPassword) {
            return res.status(400).json({message:"New password doesn't match"})
        }
        
        if(lastPassword === newPassword) return res.status(400).json({msg:"Use different Password"})
        
        const encodedPassword = await bcrypt.hash(newPassword,10) 
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set:{password:encodedPassword}})
        return res.status(200).json({message:"Password changed Successfuly"})
    }catch(error){
        res.status(400).json({
            message:"Failed changing password",
            data:error.message
        })
    }
}

module.exports = {
    registerController,
    loginController,
    logoutController,
    changePasswordController
}