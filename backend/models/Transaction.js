const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    sender_iban:{
        type:String,
        required:true
    },
    receiver_iban:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:["DEPOSIT","WITHDRAW","TRANSFER_IN","TRANSFER_OUT"],
        required:true
    },
    note:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Cancelled"],
        default:"active"
    }
},{timestamps:true})

const Transaction = mongoose.model("Transaction",transactionSchema);
module.exports = Transaction;