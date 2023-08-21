const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  info: { type: String },
});

module.exports = userInfo = mongoose.model("Info", userSchema);
