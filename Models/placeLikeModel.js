const mongoose = require("mongoose")


const placeLike = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true
    },
    place_id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    is_liked: {
        type: Boolean,
        default: false,
    },
})

const placeLikeModel = mongoose.model("placeLike", placeLike)

module.exports = placeLikeModel;