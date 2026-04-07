require("dotenv").config()
const Account = require("../models/Account")
const crypto = require('crypto');
const User = require("../models/User")
const createController = async(req,res)=>{
    try{
        const {id} = req.user
        const isAccount = await Account.findOne({user_id:id}).populate("user_id")
        if(isAccount){
            return res.status(200).json({
                message:"User Already Has Account",
                data:isAccount
            })
        }
        const serial = crypto.randomBytes(10).toString('hex').toUpperCase();
        const iban = "EG00"+serial;
        await Account.create({
            user_id:id,
            iban
        })
        const createdAccount = await Account.findOne({user_id:id}).populate("user_id")
        res.status(201).json({message:"Account Created Successfully",data:createdAccount})
    }catch(error){
        return res.status(400).json({
            message:"Account createion failed",
            data:error.message
        })
    }
}

const readController = async(req,res)=>{
    try{
        const {id} = req.user
        const isAccount = await Account.findOne({user_id:id}).populate("user_id")
        if(!isAccount){
            return res.status(200).json({
                message:"User Account Not Found",
                data:isAccount
            })
        }
        const account = await Account.findOne({user_id:id}).populate("user_id")
        res.status(200).json({message:"Account Found Successfully",data:account})
    }catch(error){
        return res.status(400).json({
            message:"Account retreive failed",
            data:error.message
        })
    }
}

const uploadPhotoController = async (req, res) => {
  try {

    if (!req.file)
      return res.status(400).json({ message: 'No image uploaded' });

    const user = req.user

    if (user.photo) {
      const oldPath = path.join(process.cwd(), user.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const photoUrl = `uploads/profiles/${req.file.filename}`;

    const updatedUser = await Account.findOneAndUpdate(
      {user_id:user.id},
      { $set: { photo: photoUrl } },
      { returnDocument: 'after' }
    );

    res.status(200).json({ 
      message: 'Photo updated successfully',
      photo:   updatedUser.photo,
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to upload photo', error: err.message });
  }
};

module.exports = {
    createController,
    readController,
    uploadPhotoController
}