const jwt = require("jsonwebtoken");

exports.tokenVerification = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) return res.status(400).send("Token undefined ! login again");

    //token verify
    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!verify) return res.status(400).send("Invalid token !");

    const { _id } = verify;
    req.Id = { user_id: _id };

    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};
