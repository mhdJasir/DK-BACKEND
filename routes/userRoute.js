const express = require("express");
const route = express.Router();
const { userRegister, userLogin } = require("../controller/authController");
const multer = require("multer");

const storageEngine = multer.diskStorage({
  destination: "./images/users",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const upload = multer({
  storage: storageEngine,
});

route.post("/userRegister", upload.single("image"), userRegister);
route.post("/login", userLogin);

module.exports = route;
