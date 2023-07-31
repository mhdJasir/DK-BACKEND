const mongoose = require("mongoose")


const category = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
})

const categoryModel = mongoose.model("category", category)

module.exports = categoryModel;