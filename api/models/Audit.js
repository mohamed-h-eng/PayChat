const mongoose = require("mongoose")

const auditSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    action:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    }
},{timestamps:true})

const Audit = mongoose.model("Audit",auditSchema);
module.exports = Audit;