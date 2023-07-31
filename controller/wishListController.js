const { default: mongoose } = require("mongoose");
const FavouriteModel = require("../Models/favouriteModel");
const placeModel = require("../Models/placeModel");

const addWishList = async (req, res) => {
  const { place_id } = req.body;
  if (!req.user) {
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
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const favourites = await FavouriteModel.findOneAndDelete({
    user_id: userId,
    place_id: placeId,
  });
  let isFavourite = true;
  if (favourites) {
    isFavourite = false;
  } else {
    await FavouriteModel.create({
      user_id: userId,
      place_id: placeId,
      is_favourite: true,
    });
    isFavourite = true;
  }
  return res.send({
    status: true,
    message: isFavourite ? "Added to wishlist" : "Removed from wishlist",
    data: {
      status: true,
    },
  });
};

const getWishList = async (req, res) => {
  if (!req.user) {
    return res.status(400).send({
      status: false,
      message: "Un authenticated",
    });
  }
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const data = await FavouriteModel.find({ user_id: userId });
  const array = [];
  data.map((fav) => {
    array.push(fav.place_id);
  });
  let places;
  if (data.length == 0) {
    places = [];
  } else {
    places = await placeModel.aggregate([
      {
        $match: {
          _id: { $in: array },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          place: 1,
          image: 1,
          rating: { $ifNull: ["$rating", null] },
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);
  }
  return res.send({
    status: true,
    message: "Wishlist fetched successfully",
    data: places,
  });
};

module.exports = { addWishList, getWishList };
