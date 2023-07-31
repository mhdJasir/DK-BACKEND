const mongoose = require("mongoose")
require("dotenv").config()


const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


const connectDB =async ()=>{
    mongoose.set({ strictQuery: false })
    await mongoose.connect(process.env.MONGO_URL, connectionParams).then(() => {
        console.log("Connected to DB");
    }).catch(() => {
        console.log("Connection to DB failed");
    })
}

module.exports= connectDB;