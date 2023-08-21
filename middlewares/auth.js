const JWT = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer") || token.length < 25) {
    console.log("No Token");
    next();
    return;
  }
  const payLoad = JWT.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET
  );
  req.user = { _id: payLoad._id, name: payLoad.name };
  next();
};

module.exports = authenticate;
