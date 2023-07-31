const mongoose = require("mongoose");

const review = mongoose.Schema({
  place_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  user_image: {
    type: String,
    required: true,
  },
  review: {
    type: String,
  },
  rating: {
    type: Number,
  },
}, {timestamps: true});

const reviewModel = mongoose.model("review", review);

module.exports = reviewModel;
