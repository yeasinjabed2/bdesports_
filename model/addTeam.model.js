const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tournament_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  cloudinaryName: { type: String },
  teamName: { type: String, required: true },
  logo_url: { type: String },
  imgName: { type: String },
  imgSize: { type: Number },
  createdAt: { type: String },
});

module.exports = Team = mongoose.model("Team", teamSchema);
