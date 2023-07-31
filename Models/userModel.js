const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken")

const user = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

user.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

user.methods.generateToken = function () {
  return jwt.sign({ _id: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

user.methods.comparePasswords = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("user", user);

module.exports = userModel;
