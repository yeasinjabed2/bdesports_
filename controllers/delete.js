const Team = require("../model/addTeam.model");
const Point = require("../model/addPoint.model");
const Tournament = require("../model/addTournament.model");
const { cloudinary } = require("../util/cloudinary");

exports.deleteTeam = async (req, res) => {
  const { tournament_id, team_id } = req.body;
  const { user_id } = req.Id;

  try {
    if (!user_id || !tournament_id || !team_id)
      return res.status(400).send("Something went wrong !");

    //existence check
    const existTeam = await Team.find({ _id: team_id, user_id });

    if (!existTeam) return res.status(400).send("Something went wrong !");

    //delete team logo from cloudinary storage
    const { logo_url } = existTeam[0];

    if (logo_url) {
      const logos = await Team.find({ logo_url });

      if (existTeam.length === logos.length) {
        await cloudinary.uploader.destroy(logo_url, (result) => {});
      }
    }

    //delete team from database
    const teamDelete = await Team.deleteOne({
      _id: team_id,
      user_id,
      tournament_id,
    });
    //delete team point
    const pointeDelete = await Point.deleteMany({
      user_id,
      team_id,
      tournament_id,
    });

    if (teamDelete && pointeDelete) res.send({ status: "success" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// * Tournament Delete * /
exports.deleteTournament = async (req, res) => {
  try {
    const { user_id } = req.Id;
    const { tournament_id } = req.body;

    //exist tournament
    const existTournament = await Tournament.find({
      _id: tournament_id,
      user_id,
    });

    if (!existTournament) return res.status(400).send("Something went wrong !");

    //delete tournament logo from cloudinary
    const { logo_url } = existTournament[0];
    if (logo_url) {
      const logos = await Tournament.find({ logo_url });

      if (existTournament.length === logos.length) {
        await cloudinary.uploader.destroy(logo_url, (result) => {});
      }
    }

    //delete teams logo of tournament from cloudinary
    const findTeams = await Team.find({ tournament_id, user_id });
    if (findTeams) {
      findTeams.forEach(async (team) => {
        if (team.logo_url) {
          const logos = await Team.find({ logo_url: team.logo_url });
          if (logos.length === 1) {
            await cloudinary.uploader.destroy(team.logo_url, (result) => {});
          }
        }
      });
    }

    //delete tournament from database
    await Tournament.deleteOne({
      _id: tournament_id,
      user_id,
    });

    //delete all teams of tournament
    await Team.deleteMany({
      tournament_id,
      user_id,
    });

    //delete teams point
    await Point.deleteMany({
      tournament_id,
      user_id,
    });

    res.send({ status: "success", msg: "Delete successfully !" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// * Match Delete * //
exports.deleteMatch = async (req, res) => {
  try {
    const { user_id } = req.Id;
    const { _id, team_id, tournament_id } = req.body;

    if (!user_id || !_id || !team_id || !tournament_id)
      return res.status(400).send({ status: "error", msg: "Id required !" });

    //existence check of match object
    const existMatch = await Point.findOne({
      _id,
      user_id,
      team_id,
      tournament_id,
    });
    if (!existMatch)
      return res
        .status(400)
        .send({ status: "error", msg: "Match object not found !" });

    //Delete match
    await Point.deleteOne({ _id, user_id, team_id, tournament_id });

    res.send({ status: "success", msg: "Successfully Deleted !" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
