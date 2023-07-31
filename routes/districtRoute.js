
const express = require("express")
const route = express.Router()
const { addDistrict, getDistricts, updateDistrict } = require("../controller/districtController")
const multer = require("multer");


const storageEngine = multer.diskStorage({
    destination: "./images/districts",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    },
});

const upload = multer({
    storage: storageEngine,
});

route.post("/addDistrict", upload.single("image"), addDistrict)
route.post("/updateDistrict", upload.single("image"), updateDistrict)
route.get("/getDistricts", getDistricts)


module.exports = route;