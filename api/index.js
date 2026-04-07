// require("dotenv").config()
// const express = require("express")
// const mongoose = require("mongoose")
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const bcrypt = require("bcrypt")
// const app = express()
// const PORT = process.env.PORT || 3000
// const cors = require("cors")
// const path = require('path');

// app.use(cors())
// app.use(express.json())

// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// async function DBconnection(){
//     try{
//         await mongoose.connect(process.env.MONGO_URI)
//         console.log("db connected")
//         return true
//     }catch(error){
//         console.log("db disconnected")
//         console.log(error.message)
//         return false
//     }
// }
// const authRoutes = require("./routes/authRoutes")
// const accountRoutes = require("./routes/accountRoutes")
// const transactionRoutes = require("./routes/transactionRoutes")

// app.use("/api",authRoutes)
// app.use("/api",accountRoutes)
// app.use("/api",transactionRoutes)


// //assign admin manually
// const User = require("./models/User")
// async function CreateAdmin(isConnected){
//     try{
//         if(!isConnected){
//             return console.log("cancel Admin account creation: db disconnected")
//         }
//         //get data
//         const{ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD} = process.env
//         //validate data
//         if(!ADMIN_NAME|| !ADMIN_EMAIL|| !ADMIN_PASSWORD){
//             return console.log("Error Creating Admin Account")
//         }
//         const admin = await User.findOne({email:ADMIN_EMAIL})
//         // create admin account if not found
//         const decodedPassword = await bcrypt.hash(ADMIN_PASSWORD,10)
//         if(!admin){
//             const user = await User.create({
//                 name:ADMIN_NAME,
//                 email:ADMIN_EMAIL,
//                 password:decodedPassword,
//                 role:"admin"
//             })
//             if(user) return console.log("Admin Account Created Successfully")
//         }else{
//             return console.log("Admin Already Registered")
//         }
//     }catch(error){
//         console.log({message:"Error Creating Admin",data:error.message})
//     }
// }
// // app.listen(PORT,(req,res)=>{
// //     console.log(`sever running at https://localhost:${PORT}`)
// // })

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(process.env.MONGO_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     return true
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

// async function main(){
//     const isConnected = await DBconnection()
//     // const isConnected = await run()
//     await CreateAdmin(isConnected)
// }
// main()
// module.exports = app;

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// IMPORTANT VERCEL NOTE: Vercel has a read-only filesystem. 
// Any files uploaded to this folder during runtime will disappear.
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
const authRoutes = require("../backend/routes/authRoutes");
const accountRoutes = require("../backend/routes/accountRoutes");
const transactionRoutes = require("../backend/routes/transactionRoutes");

app.use("/api", authRoutes);
app.use("/api", accountRoutes);
app.use("/api", transactionRoutes);

const User = require("../backend/models/User");

// VERCEL FIX 1: Cache the DB connection to prevent connection pooling limits
let isConnected = false;

async function DBconnection() {
    if (isConnected) {
        console.log("Using cached db connection");
        return true;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        // Store the connection state so we don't reconnect on warm starts
        isConnected = db.connections[0].readyState; 
        console.log("db connected");
        return true;
    } catch (error) {
        console.log("db connection error:", error.message);
        return false;
    }
}

// Assign admin manually
async function CreateAdmin(connected) {
    try {
        if (!connected) {
            return console.log("Cancel Admin account creation: db disconnected");
        }
        
        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
        
        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            return console.log("Error Creating Admin Account: Missing .env variables");
        }
        
        const admin = await User.findOne({ email: ADMIN_EMAIL });
        
        if (!admin) {
            const decodedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
            const user = await User.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: decodedPassword,
                role: "admin"
            });
            if (user) return console.log("Admin Account Created Successfully");
        } else {
            console.log("Admin Already Registered");
        }
    } catch (error) {
        console.log({ message: "Error Creating Admin", data: error.message });
    }
}

// Initialize DB and run Admin check on cold start
DBconnection().then((connected) => {
    CreateAdmin(connected);
});

// VERCEL FIX 2: Export the Express app instead of listening on a port
module.exports = app;