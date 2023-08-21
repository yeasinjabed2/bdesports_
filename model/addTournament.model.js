const mongoose = require("mongoose");

const tournamentSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cloudinaryName: { type: String },
  tournamentName: { type: String, required: true },
  organizerName: { type: String },
  standingsTitle: { type: String },
  group: { type: String },
  status: { type: String },
  logo_url: { type: String },
  imgName: { type: String },
  imgSize: { type: Number },
  createdAt: { type: String },
});

module.exports = Tournament = mongoose.model("Tournament", tournamentSchema);
