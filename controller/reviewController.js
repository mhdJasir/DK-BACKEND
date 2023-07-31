const { default: mongoose } = require("mongoose");
const reviewModel = require("../Models/reviewModel");
const userModel = require("../Models/userModel");

const addReview = async (req, res) => {
  const { place_id, review, rating } = req.body;

  const userId = new mongoose.Types.ObjectId(req.user._id);

  if (!req.user || !userId) {
    return res.status(400).send({
      status: false,
      message: "Un authenticated",
    });
  }
  const placeId = new mongoose.Types.ObjectId(place_id);

  if (!placeId) {
    return res.status(400).send({
      status: false,
      message: "Place_id is required",
    });
  }
  const user = await userModel.findById(userId);
  if (!user) {
    return res.send({
      status: true,
      message: "somthing went wrong",
    });
  }
  const newReview = await reviewModel.create({
    place_id: placeId,
    user_id: userId,
    user_name: user.name,
    user_image: user.image,
    review: review,
    rating: rating,
  });

  return res.send({
    status: true,
    message: "Review added",
    data: {
      id: newReview._id,
      user_name: newReview.user_name,
      user_image: newReview.user_image,
      rating: newReview.rating,
      review: newReview.review,
      date: newReview.createdAt,
    },
  });
};

const getReviews = async (req, res) => {
  const { place_id } = req.body;
  const placeId = new mongoose.Types.ObjectId(place_id);
  if(!placeId){
    return res.status(400).send(
        {
            status: false,
            message: "No reviews",
            data: [],
        }
    )
  }
  const data = await reviewModel.aggregate([
    {
      $match: {
        place_id: placeId,
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        rating: 1,
        review: 1,
        user_name: 1,
        user_image: 1,
        date: 1,
      },
    },
    {
      $project: {
        __v: 0,
      },
    },
  ]);

  return res.send({
    status: true,
    message: "Reviews fetched successfully",
    data: data,
  });
};

module.exports = { addReview, getReviews };
