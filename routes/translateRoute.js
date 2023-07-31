const express = require("express")
const route = express.Router()
const { translateText } = require("../controller/translateController.js")


route.post("/translateText", translateText);


module.exports = route;