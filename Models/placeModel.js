const mongoose = require("mongoose");

const place = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  catagory_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  catagory: {
    type: String,
    required: true,
  },
  district_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: "Kerala",
  },
  country: {
    type: String,
    default: "India",
  },
  desc_eng: {
    type: String,
  },
  opening_time: {
    type: String,
  },
  closing_time: {
    type: String,
  },
  avail_dates: {
    type: String,
  },
  desc_mal: {
    type: String,
  },
  place: {
    type: String,
  },
  address: {
    type: String,
  },
  latitude: {
    type: String,
  },
  like_count: {
    type: Number,
  },
  user_like: {
    type: Boolean,
  },
  addi_info: {
    type: String,
  },
  wish_list: {
    type: Boolean,
  },
  longitude: {
    type: String,
  },
  rating: {
    type: String,
  },
  is_popular: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  images: {
    type: Array,
  },
});

const placeModel = mongoose.model("place", place);

module.exports = placeModel;
