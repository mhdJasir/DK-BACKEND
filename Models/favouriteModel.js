const mongoose = require("mongoose")


const favourite = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    place_id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    is_favourite: {
        type: Boolean,
        default: false,

    },
})

const favouriteModel = mongoose.model("favourite", favourite)

module.exports = favouriteModel;