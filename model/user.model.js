const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String },
  createdAt: { type: String },
});

module.exports = User = mongoose.model("User", userSchema);
