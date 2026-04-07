const User = require("../models/User")
const Account = require("../models/Account")
const Transaction = require("../models/Transaction")
const AuditLog = require("../models/Audit")
const mongoose= require("mongoose")

const depositController = async(req,res)=>{
    const { amount } = req.body;
    const userId = req.user.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const account = await Account.findOneAndUpdate(
            { user_id: userId },
            { $inc: { balance: amount } },
            {returnDocument: 'after', session }
        );

        await Transaction.create([{
            sender_iban: "Master/Visa Card",
            receiver_iban:account.iban,
            amount,
            type: 'DEPOSIT',
            status: 'Accepted',
            note: 'Mock card DEPOSIT'
        }],{ session });

        await AuditLog.create([{
            user_id: userId,
            action: 'DEPOSIT',
            description: `User deposited ${amount}`,
        }], { session });

        await session.commitTransaction();

        res.status(200).json({
            message: 'DEPOSIT successful',
            data:account,
            new_balance: account.balance
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: 'DEPOSIT failed',data:error.message });
    }finally{
        await session.endSession()
    }
}

const withdrawController = async(req,res)=>{
    const { amount } = req.body;
    const userId = req.user.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const account = await Account.findOneAndUpdate(
            { user_id: userId },
            { $inc: { balance: -amount } },
            {returnDocument: 'after', session }
        );

        await Transaction.create([{
            sender_iban: "Master/Visa Card",
            receiver_iban:account.iban,
            amount,
            type: 'WITHDRAW',
            status: 'Accepted',
            note: 'Mock card WITHDRAW'
        }],{ session });

        await AuditLog.create([{
            user_id: userId,
            action: 'WITHDRAW',
            description: `User withdraw ${amount}`,
        }], { session });

        await session.commitTransaction();

        res.status(200).json({
            message: 'WITHDRAW successful',
            data:account,
            new_balance: account.balance
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: 'WITHDRAW failed',data:error.message });
    }finally{
        await session.endSession()
    }
}

const sendController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { receiver_iban, amount, note } = req.body;
        console.log(receiver_iban, amount, note);
        
        const receiver = await Account.findOne({ iban: receiver_iban });
        if (!receiver) {
            await session.abortTransaction(); // CRITICAL: Always abort before early return
            return res.status(404).json({ message: "receiver not found" }); // Fixed typo
        }

        const sender = await Account.findOne({ user_id: req.user._id });
        if (receiver.iban === sender.iban) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Self transfer is forbidden" });
        }

        if (sender.status !== "active") {
            await session.abortTransaction();
            if (sender.status === "closed") return res.status(400).json({ message: "Sorry account is closed" });
            return res.status(400).json({ message: `Transfer failed cause account is ${sender.status}` });
        }

        const limit = 3;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todayCount = await Transaction.countDocuments({
            sender_iban: sender.iban,
            type: 'TRANSFER_OUT',
            createdAt: { $gte: startOfDay },
        });

        if (todayCount >= limit) {
            await session.abortTransaction();
            return res.status(403).json({ message: 'Daily transaction limit reached' });
        }

        if (amount > 10000) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Transaction amount exceed transfer limit (10,000)" });
        }

        if (sender.balance < amount) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Transfer failed", data: "Insufficient balance" }); // Fixed typo
        }

        await Account.findOneAndUpdate(
            { user_id: sender.user_id },
            { $inc: { balance: amount } },
            { returnDocument: 'after', session }
        );
        
        await Account.findOneAndUpdate(
            { user_id: receiver.user_id },
            { $inc: { balance: amount } },
            { returnDocument: 'after', session }
        );
        const transactions = await Transaction.create([
            {
                sender_iban:   sender.iban,
                receiver_iban: receiver.iban,
                amount:        amount,        
                type:          'TRANSFER_OUT',
                status:        'Accepted',
                note,
            },
            {
                sender_iban:   sender.iban,   
                receiver_iban: receiver.iban, 
                amount:        amount,        
                type:          'TRANSFER_IN', 
                status:        'Accepted',
                note,
            }
            ], { session, ordered: true }
        );

        await AuditLog.create([{
            user_id: sender.user_id,
            action: 'TRANSFER',
            description: `User transferred amount: ${amount} to Account ${receiver.iban}`,
        }], { session });

        await session.commitTransaction();
        res.status(201).json({ message: "Transfer is Successful", data: transactions[0] });

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({
            message: "Sending Failed",
            data: error.message
        });
    } finally {
        session.endSession();
    }
};

const readController = async(req,res)=>{
    try {
        const account = await Account.findOne({user_id:req.user._id})
        const transactions = await Transaction.find({
            $or: [
                {sender_iban:account.iban, type: 'TRANSFER_OUT'},
                {receiver_iban:account.iban, type: 'TRANSFER_IN'},
                {receiver_iban:account.iban, type: 'deposit'},
                {sender_iban:account.iban, type:'withdraw'},
            ]
            }).sort({ createdAt: -1 });
        if(!transactions) return res.status(404).json({message:"No transactions found", data:account})
        return res.status(200).json({
            message:"transactions retrieved successfully",
            data:transactions
        })
    } catch (error) {
        res.status(500).json({ message: 'Transaction view failed',data:error.message });
    }
}
module.exports = {
    depositController,
    withdrawController,
    sendController,
    readController
}