
const express = require("express")
const route = express.Router()
const { addCategory,getCategories,updateCategory,deleteCategory } = require("../controller/categoryController")
const multer = require("multer");


const storageEngine = multer.diskStorage({
    destination: "./images/categories",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    },
});

const upload = multer({
    storage: storageEngine,
});

route.post("/addCategory",upload.single("image"), addCategory)
route.post("/updateCategory",upload.single("image"), updateCategory)
route.post("/deleteCategory",deleteCategory)
route.get("/getCategories", getCategories)


module.exports = route;