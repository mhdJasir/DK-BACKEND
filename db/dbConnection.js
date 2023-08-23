const mongoose = require("mongoose")
require("dotenv").config()


const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
    user: process.env.USER_NAME,
    pass: process.env.PASSWORD
};


const connectDB =async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL, connectionParams);
        console.log("Connected to DB");
    } catch (error) {
        console.error("Connection to DB failed:", error);
    }
}

module.exports= connectDB;