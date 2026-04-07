const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    iban:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:["active","frozen","closed"],
        default:"active"
    },
    photo:{
        type:String,
        default:null
    },
    photo_hash:{
        type:String,
        default:null
    }
},{timestamps:true})

const Account = mongoose.model("Account",accountSchema);
module.exports = Account;