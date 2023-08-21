const Point = require("../model/addPoint.model");
const Team = require("../model/addTeam.model");
const Tournament = require("../model/addTournament.model");
const { updateTournamentValidate } = require("../validators/validate");
const { cloudinary } = require("../util/cloudinary");

exports.updateTeamMatch = async (req, res) => {
  try {
    const { user_id } = req.Id;
    const {
      tournament_id,
      team_id,
      match_id,
      teamName,
      killPoint,
      placePoint,
      wwcd,
    } = req.body;

    if (!user_id || !tournament_id || !team_id || !match_id)
      return res.status(400).send({ status: "error", msg: "Id required !" });

    //teamName existence check
    const existTeam = await Team.findOne({
      _id: team_id,
      user_id,
      tournament_id,
      teamName,
    });

    if (!existTeam) {
      //check is it already taken or not
      const checkName = await Team.findOne({
        user_id,
        tournament_id,
        teamName,
      });
      if (checkName)
        return res
          .status(400)
          .send({ status: "error", msg: "Name already taken !" });

      //update team name
      await Team.updateOne(
        { _id: team_id, user_id, tournament_id },
        { $set: { teamName } }
      );

      //
      //match existence check
      await isMatchExist(match_id, user_id, tournament_id, team_id).then(
        (response) => {
          if (!response)
            return res
              .status(400)
              .send({ status: "error", msg: "Match not found!" });
        }
      );

      // update match points data
      await updateMatchPoints(
        match_id,
        user_id,
        tournament_id,
        team_id,
        killPoint,
        placePoint,
        wwcd
      ).then((response) => {
        if (response)
          return res.status(200).send({
            status: "success",
            msg: "Update successfully done!",
            data: response.data,
          });
      });
    } else {
      //match existence check
      await isMatchExist(match_id, user_id, tournament_id, team_id).then(
        (response) => {
          if (!response)
            return res
              .status(400)
              .send({ status: "error", msg: "Match not found !" });
        }
      );

      // update match points data
      await updateMatchPoints(
        match_id,
        user_id,
        tournament_id,
        team_id,
        killPoint,
        placePoint,
        wwcd
      ).then((response) => {
        if (response)
          return res.status(200).send({
            status: "success",
            msg: "Update successfully done!",
            data: response.data,
          });
      });
    }

    //match exist function -------
    async function isMatchExist(_id, user_id, tournament_id, team_id) {
      return await Point.findOne({
        _id,
        user_id,
        tournament_id,
        team_id,
      });
    }

    //match update function -------
    async function updateMatchPoints(
      _id,
      user_id,
      tournament_id,
      team_id,
      killPoint,
      placePoint,
      wwcd
    ) {
      return await Point.updateOne(
        { _id, user_id, tournament_id, team_id },
        { $set: { killPoint, placePoint, wwcd } }
      );
    }

    //update match points
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// * Update tournament * /
exports.updateTournament = async (req, res) => {
  try {
    const data = updateTournamentValidate(req.body);
    const { user_id } = req.Id;

    if (!user_id) return res.status(400).send("Something went wrong !");
    if (data.error)
      return res.status(400).send({ msg: data.error.details[0].message });

    const {
      _id,
      tournamentName,
      organizerName,
      standingsTitle,
      group,
      imgData,
      cloudinaryName,
      imgName,
      imgSize,
    } = data.value;

    // tournament existence check
    const exist = await Tournament.findOne({ _id, user_id });

    if (!exist)
      return res
        .status(400)
        .send({ status: "error", msg: "Tournament Not found !" });

    const { logo_url } = exist;
    //delete image from cloudinary
    if (logo_url) {
      const duplicateImageExist = await Tournament.find({ user_id, logo_url });

      if (duplicateImageExist.length === 1) {
        deleteImageFromCloudinary(logo_url);
      }
    }
    //
    async function deleteImageFromCloudinary(logo_url) {
      await cloudinary.uploader.destroy(logo_url, (result) => {});
    }

    // update Tournament data
    if (imgData) {
      //upload on cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(imgData, {
        upload_preset: "esports",
      });

      if (!uploadedResponse)
        return res.status(400).send("Something went wrong !");

      const { public_id } = uploadedResponse;
      //update
      updateDataWithImage(
        public_id,
        cloudinaryName,
        _id,
        user_id,
        tournamentName,
        organizerName,
        standingsTitle,
        group,
        imgName,
        imgSize
      ).then((response) => {
        if (response)
          res.send({ status: "success", msg: "Update successfully done!" });
      });
    } else {
      updateData(
        _id,
        user_id,
        tournamentName,
        organizerName,
        standingsTitle,
        group
      ).then((response) => {
        if (response)
          res.send({ status: "success", msg: "Update successfully done!" });
      });
    }

    //update with image data
    async function updateDataWithImage(
      logo_url,
      cloudinaryName,
      _id,
      user_id,
      tournamentName,
      organizerName,
      standingsTitle,
      group,
      imgName,
      imgSize
    ) {
      return await Tournament.updateOne(
        { _id, user_id },
        {
          $set: {
            tournamentName,
            organizerName,
            standingsTitle,
            group,
            logo_url,
            cloudinaryName,
            imgName,
            imgSize,
          },
        }
      );
    }

    //update without image data
    async function updateData(
      _id,
      user_id,
      tournamentName,
      organizerName,
      standingsTitle,
      group
    ) {
      return await Tournament.updateOne(
        { _id, user_id },
        { $set: { tournamentName, organizerName, standingsTitle, group } }
      );
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
