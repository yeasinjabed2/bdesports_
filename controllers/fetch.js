const mongoose = require("mongoose");
const Tournament = require("../model/addTournament.model");
const Point = require("../model/addPoint.model");
const User = require("../model/user.model");
const Team = require("../model/addTeam.model");

exports.getTournament = async (req, res) => {
  const { user_id } = req.Id;

  try {
    if (!user_id) return res.status(400).send("Something went wrong !");

    const data = await Tournament.find({ user_id }).select(
      "_id cloudinaryName tournamentName organizerName standingsTitle group status  logo_url createdAt"
    );

    if (!data) return res.status(400).send({ msg: "Data not found !" });

    res.send({ data });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getTeamsData = async (req, res) => {
  const { user_id } = req.Id;
  try {
    if (!user_id) return res.status(400).send("Something went wrong !");

    const userId = mongoose.Types.ObjectId(user_id);
    const tournamentId = mongoose.Types.ObjectId(req.body.tournamentId);

    const teamsData = await Point.aggregate([
      {
        $match: {
          user_id: userId,
          tournament_id: tournamentId,
        },
      },
      {
        $group: {
          _id: "$team_id",
          wwcd: { $sum: "$wwcd" },
          killPoint: { $sum: "$killPoint" },
          placePoint: { $sum: "$placePoint" },
          totalPoint: { $sum: { $sum: ["$killPoint", "$placePoint"] } },
          matchNo: { $last: "$matchNo" },
          totalMatch: { $push: "$matchNo" },
        },
      },
      {
        $sort: { totalPoint: -1, wwcd: -1, placePoint: -1, killPoint: -1 },
      },
      {
        $lookup: {
          from: "teams",
          localField: "_id",
          foreignField: "_id",
          as: "team",
        },
      },
      {
        $project: {
          teamName: "$team.teamName",
          cloudinaryName: "$team.cloudinaryName",
          logo_url: "$team.logo_url",
          createdAt: "$team.createdAt",
          wwcd: 1,
          killPoint: 1,
          placePoint: 1,
          totalPoint: 1,
          matchNo: 1,
          totalMatch: 1,
        },
      },
    ]);

    res.status(200).json({ teamsData });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getSingleTeamsData = async (req, res) => {
  const { tournament_id, team_id } = req.body;
  const { user_id } = req.Id;

  try {
    if (!user_id || !tournament_id || !team_id)
      return res.status(400).send("Something went wrong !");

    const getData = await Point.find({
      user_id,
      tournament_id,
      team_id,
    })
      .sort({ matchNo: -1 })
      .populate("team_id", "logo_url cloudinaryName")
      .select("matchNo wwcd killPoint placePoint createdAt");

    if (!getData) return res.status(400).send({ msg: "Data not found !" });

    //res to client
    res.send({ status: "success", data: getData });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllTeamsData = async (req, res) => {
  const { tournament_id } = req.body;
  const { user_id } = req.Id;

  try {
    if (!user_id || !tournament_id)
      return res.status(400).send("Something went wrong !");

    const getData = await Point.find({
      user_id,
      tournament_id,
    })
      .select("team_id matchNo wwcd killPoint placePoint createdAt")
      .sort({ matchNo: -1 });
    if (!getData) return res.status(400).send({ msg: "Data not found !" });

    //res to client
    res.send({ status: "success", data: getData });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.databaseInfo = async (req, res) => {
  //fetch user data
  const userData = await User.find()
    .select("email password createdAt")
    .sort({ createdAt: -1 });
  const totalUser = await User.countDocuments();
  const totalTournament = await Tournament.countDocuments();
  const totalMatch = await Point.countDocuments();
  const totalTeam = await Team.countDocuments();

  res.send({
    totalUser,
    totalTournament,
    totalMatch,
    totalTeam,
    userData,
  });
};

//get single user data for temp dashboard
exports.getSingleUserInfo = async (req, res) => {
  try {
    const user_id = req.body.userId;

    const tournaments = await Tournament.find({ user_id }).select(
      "tournamentName"
    );
    const teamCount = await Team.countDocuments({ user_id });
    const matchCount = await Point.countDocuments({ user_id });
    const tournamentCount = tournaments.length;

    res.send({
      user_id,
      tournamentCount,
      teamCount,
      matchCount,
      tournaments,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
