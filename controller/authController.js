const User = require("../Models/userModel");

const userRegister = async (req, res) => {
  const { name, mobile, password } = req.body;

  if (!name)
    return res.status(400).send({ status: false, message: "Name is required" });
  if (!mobile)
    return res
      .status(400)
      .send({ status: false, message: "mobile is required" });
  if (!password)
    return res
      .status(400)
      .send({ status: false, message: "password is required" });
  if (!req.file) {
    return res
      .status(400)
      .send({ status: false, message: "Image is required" });
  }
  try {
    req.body.image = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    const user = await User.create(req.body);
    const token = user.generateToken();
    user.token = token;
    return res.send({
      status: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (e) {
    if (e) {
      if (e.code !== undefined && e.code == 11000) {
        return res.send({
          status: false,
          message: "Register Failed",
          error: e.keyValue,
        });
      }
      return res.status(500).send({
        status: false,
        message: "Register Failed",
        error: "Unknown",
      });
    }
    return res.status(500).send({
      status: false,
      message: "Register Failed",
      error: "Unknown",
    });
  }
};

const userLogin = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile)
    return res
      .status(400)
      .send({ status: false, message: "mobile is required" });
  if (!password)
    return res
      .status(400)
      .send({ status: false, message: "password is required" });

  let user = await User.findOne({ mobile: mobile });

  if (!user) {
    return res.send({
      status: false,
      message: "No user Found with this number",
    });
  }
  const isMatchPassword = await user.comparePasswords(password);
  if (!isMatchPassword) {
    return res.send({
      status: false,
      message: "Password is wrong",
    });
  }
  const token = user.generateToken();
  return res.send({
    status: true,
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      mobile: user.mobile,
      image: user.image,
      token: token,
    },
  });
};

module.exports = { userRegister, userLogin };
