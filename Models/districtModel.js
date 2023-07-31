const mongoose = require("mongoose")


const district = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
})

const distrcitModel = mongoose.model("district", district)

module.exports = distrcitModel;