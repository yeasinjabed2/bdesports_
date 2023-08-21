const User = require("../model/user.model");
const moment = require("moment-timezone");
const { userValidate } = require("../validators/validate");
const jwt = require("jsonwebtoken");

//* user registration */
exports.register = async (req, res) => {
  const dateBangladesh = moment.tz(Date.now(), "Asia/Dhaka").format();
  const data = userValidate(req.body);

  try {
    if (data.error)
      return res.status(400).json({ msg: data.error.details[0].message });

    const { email, password } = data.value;

    //user existence check
    const existUser = await User.findOne({ email });
    if (existUser)
      return res
        .status(400)
        .json({ msg: "Email already taken ! try another." });

    //save user
    const saveUser = new User({
      email,
      password,
      createdAt: dateBangladesh,
    });
    const userData = await saveUser.save();

    //res to client
    if (userData) {
      const { _id, email, createdAt } = userData;
      res.send({ status: "success", data: { _id, email, createdAt } });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// * User Login */

exports.userLogin = async (req, res) => {
  const data = userValidate(req.body);

  try {
    if (data.error)
      return res.status(400).json({ msg: data.error.details[0].message });

    const { email, password } = data.value;

    //check exist user
    const existUser = await User.findOne({ email });

    if (!existUser)
      return res
        .status(400)
        .send({ status: "error", msg: "Invalid Email/password !" });
    //check password
    if (existUser.password !== password)
      return res
        .status(400)
        .send({ status: "error", msg: "Invalid Email/password !" });

    //create token
    const token = jwt.sign({ _id: existUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "12h",
    });

    //token decode
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { exp } = decode;

    //set cookies
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 12,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    //response send
    res.send({
      _id: existUser._id,
      email: existUser.email,
      createdAt: existUser.createdAt,
      exp,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// * token check after page refresh * /
exports.tokenCheck = async (req, res) => {
  const token = req.cookies.token;
  try {
    if (!token) return res.status(400).send("Token required ! Login again");
    const tokenVerify = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!tokenVerify) return res.status(400).send({ msg: "Invalid token !" });

    const { _id } = tokenVerify;
    const userData = await User.findOne({ _id });
    if (!userData)
      return res.status(400).send({ msg: "Something went wrong !" });

    res.send({
      _id: userData._id,
      email: userData.email,
      createdAt: userData.createdAt,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// * Logout * /
exports.userLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("Logout");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
