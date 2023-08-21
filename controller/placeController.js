const placeModel = require("../Models/placeModel.js");
const FavouriteModel = require("../Models/favouriteModel.js");
const LikeModel = require("../Models/placeLikeModel.js");
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
var translate = require("translation-google");

const addPlace = async (req, res) => {
  try {
    const {
      name,
      catagory_id,
      catagory,
      district_id,
      district,
      desc_eng,
      place,
      rating,
      address,
      opening_time,
      closing_time,
      avail_dates,
      latitude,
      longitude,
      is_popular,
      date,
    } = req.body;
    if (!name)
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    if (!catagory_id)
      return res
        .status(400)
        .send({ status: false, message: "catagory_id is required" });
    if (!catagory)
      return res
        .status(400)
        .send({ status: false, message: "catagory is required" });
    if (!district_id)
      return res
        .status(400)
        .send({ status: false, message: "district_id is required" });
    if (!district)
      return res
        .status(400)
        .send({ status: false, message: "district is required" });

    let { image, images } = req.files;
    let primeImage;
    if (image && image.length > 0) {
      console.log("Here");
      primeImage = `${req.protocol}://${req.get("host")}/${image[0].path}`;
    }

    let array = [];

    if (images && images.length > 0) {
      images.map((image) => {
        array.push(`${req.protocol}://${req.get("host")}/${image.path}`);
      });
    }
    const data = await translate(desc_eng, { from: "en", to: "ml" });
    const desc_mal = data.text;
    const newPlace = await placeModel.create({
      name,
      catagory_id,
      catagory,
      district_id,
      district,
      desc_eng,
      rating,
      desc_mal,
      place,
      opening_time,
      closing_time,
      avail_dates,
      address,
      latitude,
      longitude,
      is_popular,
      date,
      image: primeImage,
      images: array,
    });
    return res.send({
      status: true,
      data: newPlace,
    });
  } catch (e) {
    // if (req.file) {
    //     fs.unlink(req.file.path, (err) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //     });
    // }
    // if (req.files) {
    //     req.files.map((file) => {
    //         fs.unlink(file.path, (err) => {
    //             if (err) {
    //                 console.log(err);
    //             }
    //         });
    //     })
    //     fs.unlink(req.file.path, (err) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //     });
    // }
    if (e != undefined && e.code === 11000) {
      console.log("Duplicate key error:", e.message);
      return res
        .status(400)
        .send({ status: false, message: "This place exists" });
    }
    console.log(e);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const updatePlace = async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id)
      return res.status(400).send({ status: 400, message: "Invalid request" });
    const updateObject = { name };

    if (req.file) {
      updateObject.image = `${req.protocol}://${req.get("host")}/${
        req.file.path
      }`;
    }
    const category = await placeModel.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
    return res.send({
      status: true,
      message: "Updated successfully",
      data: {
        id: category.id,
        name: category.name,
        image: category.image,
      },
    });
  } catch (e) {
    console.log(e);
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    if (e.code === 11000) {
      console.log("Duplicate key error:", e.message);
      return res
        .status(400)
        .send({ status: false, message: "The category Exists" });
    }
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getPlaces = async (req, res) => {
  try {
    let { limit, page_number, query, district_search, catagory_search } =
      req.body;
    const matchStage = {
      name: { $regex: new RegExp(query, "i") },
    };

    if (ObjectId.isValid(district_search)) {
      matchStage.district_id = new mongoose.Types.ObjectId(district_search);
    }

    if (ObjectId.isValid(catagory_search)) {
      matchStage.catagory_id = new mongoose.Types.ObjectId(catagory_search);
    }

    const data = await placeModel.aggregate([
      {
        $match: matchStage,
      },
      {
        $facet: {
          paginatedResults: [
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
              $skip: (page_number - 1) * limit,
            },
            {
              $limit: limit,
            },
          ],
          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
      {
        $unwind: "$totalCount",
      },
      {
        $project: {
          paginatedResults: 1,
          totalCount: "$totalCount.total",
        },
      },
    ]);

    if (data.length == 0) {
      return res.send({
        status: true,
        page: {
          itemCount: 0,
          totalCount: 0,
          limit: limit,
        },
        data: [],
      });
    }
    const paginatedResults = data[0].paginatedResults;
    const totalCount = data[0].totalCount;
    return res.send({
      status: true,
      page: {
        itemCount: data.length,
        totalCount: totalCount,
        limit: limit,
      },
      data: paginatedResults,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getPlace = async (req, res) => {
  try {
    let { place_id } = req.body;

    if (!ObjectId.isValid(place_id)) {
      return res.status(400).send({ status: false, message: "Invalid id" });
    }
    const placeId = new mongoose.Types.ObjectId(place_id);
    const userId = new mongoose.Types.ObjectId(req.user._id);

    let place = await placeModel.aggregate([
      {
        $match: {
          _id: placeId,
        },
      },
      {
        $addFields: {
          likes: { $ifNull: ["$likes", []] },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          catagory_id: 1,
          catagory: 1,
          district: 1,
          place: 1,
          address: 1,
          opening_time: 1,
          closing_time: 1,
          avail_dates: 1,
          image: 1,
          latitude: 1,
          longitude: 1,
          desc_eng: 1,
          desc_mal: 1,
          rating: { $ifNull: ["$rating", null] },
          user_like: { $in: [userId, "$likes"] },
          like_count: { $ifNull: ["$like_count", null] },
          addi_info: { $ifNull: ["$addi_info", null] },
          images: { $ifNull: ["$images", null] },
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);
    let isLiked = false;
    let isFavourite = false;

    if (req.user && ObjectId.isValid(req.user._id)) {
      const likeData = await LikeModel.findOne({
        user_id: userId,
        place_id: placeId,
      });
      if (likeData) {
        isLiked = likeData.is_liked;
      }
      const favouriteData = await FavouriteModel.findOne({
        user_id: userId,
        place_id: placeId,
      });
      if (favouriteData) {
        isFavourite = favouriteData.is_favourite;
      }
      place[0].wish_list = isFavourite;
      place[0].user_like = isLiked;
    }

    return res.send({
      status: true,
      data: place[0],
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const placeLike = async (req, res) => {
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

  const place = await LikeModel.findOneAndDelete({
    place_id: placeId,
    user_id: userId,
  });

  let isLiked = false;
  if (!place) {
    await LikeModel.create({
      place_id: placeId,
      user_id: userId,
      is_liked: true,
    });
    isLiked = true;
  }
  let incrementCount = isLiked ? 1 : -1;

  await placeModel.findOneAndUpdate(
    { _id: placeId },
    { $inc: { like_count: incrementCount } }
  );

  res.json({
    status: true,
    message: `Place ${isLiked ? "liked" : "unliked"} successfully`,
  });
};

module.exports = {
  addPlace,
  getPlaces,
  updatePlace,
  getPlace,
  placeLike,
};
