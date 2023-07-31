const { default: mongoose } = require("mongoose");
const placeModel = require("../Models/placeModel");
const ObjectId = require("mongoose").Types.ObjectId;

const getPopularPlaces = async (req, res) => {
  try {
    const places = await placeModel.aggregate([
      {
        $match: {
          is_popular: true,
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

    return res.send({
      status: false,
      message: "Popular places fetched successfully",
      data: places,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const addToPoularPlaces = async (req, res) => {
  const { place_id } = req.body;
  try {
    const placeId = new mongoose.Types.ObjectId(place_id);
    if (!ObjectId.isValid(placeId)) {
      return res.send({
        status: false,
        message: "Invalid id",
      });
    }
    const updateObject = {
      is_popular: true,
    };
    const place = await placeModel
      .findByIdAndUpdate(placeId, updateObject, {
        new: true,
      })
      .select(
        "-desc_mal -avail_dates -closing_time -opening_time -desc_eng -country -state -district -__v -images -catagory_id -catagory -district_id -place -address"
      );
    return res.send({
      status: false,
      message: "Added to popular places",
      data: place,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = { getPopularPlaces, addToPoularPlaces };
