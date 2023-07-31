const mongoose = require("mongoose");

const likeCount = mongoose.Schema({
  place_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
  },
  like_count: {
    type: Number,
    default: 0,
  },
});

const likeCountModel = mongoose.model("likeCount", likeCount);

module.exports = likeCountModel;
