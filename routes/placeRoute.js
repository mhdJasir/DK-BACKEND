const express = require("express");
const router = express.Router();
const {
  addPlace,
  getPlaces,
  updatePlace,
  getPlace,
  placeLike,
} = require("../controller/placeController.js");
const {
  addWishList,
  getWishList,
} = require("../controller/wishListController.js");
const { addReview, getReviews } = require("../controller/reviewController.js");
const {getPopularPlaces,addToPoularPlaces} = require("../controller/popularPlaceController.js");
const multer = require("multer");

const storageEngine = multer.diskStorage({
  destination: "./images/places",
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const upload = multer({
  storage: storageEngine,
});

router.post(
  "/addPlace",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ]),
  addPlace
);

router.post(
  "/updatePlace",
  upload.fields([
    { name: "Image", maxCount: 1 },
    { name: "Images", maxCount: 20 },
  ]),
  updatePlace
);

router.get("/getPlaces", getPlaces);
router.get("/getPlace", getPlace);
router.post("/placeLike", placeLike);
router.post("/addWishList", addWishList);
router.get("/getWishList", getWishList);
router.post("/addReview", addReview);
router.get("/getReviews", getReviews);
router.get("/getPopularPlaces", getPopularPlaces);
router.post("/addToPoularPlaces", addToPoularPlaces);

module.exports = router;
