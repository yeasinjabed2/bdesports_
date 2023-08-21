const mongoose = require("mongoose");

const pointSchema = mongoose.Schema({
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
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  matchNo: { type: Number, required: true },
  wwcd: { type: Number },
  killPoint: { type: Number },
  placePoint: { type: Number },
  createdAt: { type: String },
});

module.exports = Point = mongoose.model("Point", pointSchema);
