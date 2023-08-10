const mongoose = require("mongoose");

const placeLike = mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  place_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  is_liked: {
    type: Boolean,
    default: false,
  },
});

const placeLikeModel = mongoose.model("placeLike", placeLike);

// const dropIndex= async()=>{
//     await mongoose.connection.collection('placelikes').dropIndex({ user_id: 1 });
// }

// dropIndex()
module.exports = placeLikeModel;
