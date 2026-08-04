import "dotenv/config";
import Account from "../models/Account.js";
import crypto from "crypto";
import User from "../models/User.js";

export const createController = async (req, res) => {
    try {
        const { id } = req.user
        const isAccount = await Account.findOne({ user_id: id }).populate("user_id")
        let res;
        if (isAccount) {
            res ={message: "User Already Has Account" , data: isAccount}
        }
        const serial = crypto.randomBytes(10).toString('hex').toUpperCase();
        const iban = "EG00" + serial;
        await Account.create({
            user_id: id,
            iban
        })
        const data = await Account.findOne({ user_id: id }).populate("user_id")
        return res.status(201).json(
            {
                "success": true,
                "message": res.message || "Operation completed successfully",
                "data": res.data || data
            })
    } catch (error) {
        return res.status(400).json(
            {
                "success": false,
                "message": "Validation failed",
                "error": {
                    "code": "VALIDATION_ERROR",
                    "details": [error.message]
                }
            })
    }
}

export const readController = async (req, res) => {
    try {
        const { id } = req.user
        const isAccount = await Account.findOne({ user_id: id }).populate("user_id")
        if (!isAccount) {
            return res.status(200).json({
                message: "User Account Not Found",
                data: isAccount
            })
        }
        const data = await Account.findOne({ user_id: id }).populate("user_id")
        return res.status(200).json(
            {
                "success": true,
                "message": "Operation completed successfully",
                "data": data
            }
        )
    } catch (error) {
        return res.status(400).json(
            {
                "success": false,
                "message": "Validation failed",
                "error": {
                    "code": "VALIDATION_ERROR",
                    "details": [error.message]
                }
            }
        )
    }
}

export const uploadPhotoController = async (req, res) => {
    try {

        if (!req.file)
            return res.status(400).json({ message: 'No image uploaded' });

        const user = req.user

        if (user.photo) {
            const oldPath = path.join(process.cwd(), user.photo);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const photoUrl = `uploads/profiles/${req.file.filename}`;

        const data = await Account.findOneAndUpdate(
            { user_id: user.id },
            { $set: { photo: photoUrl } },
            { returnDocument: 'after' }
        );

        return res.status(200).json(
            {
                "success": true,
                "message": "Operation completed successfully",
                "data": data,
                "meta": {}
            }

        );



    } catch (err) {
        return res.status(400).json(
            {
                "success": false,
                "message": "Validation failed",
                "error": {
                    "code": "VALIDATION_ERROR",
                    "details": [error.message]
                }
            }
        )
    }
};