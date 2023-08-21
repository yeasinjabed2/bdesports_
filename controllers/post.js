const Tournament = require("../model/addTournament.model");
const UserInfo = require("../model/userInfo.model");
const Team = require("../model/addTeam.model");
const Point = require("../model/addPoint.model");
const moment = require("moment-timezone");
const { cloudinary } = require("../util/cloudinary");
const {
  addTournamentValidate,
  addTeamValidate,
  addPointValidate,
} = require("../validators/validate");

// * add tournament */
exports.addTournament = async (req, res) => {
  const dateBangladesh = moment.tz(Date.now(), "Asia/Dhaka").format();
  const data = addTournamentValidate(req.body);
  const { user_id } = req.Id;

  try {
    if (!user_id) return res.status(400).send("Something went wrong !");
    if (data.error)
      return res.status(400).send({ msg: data.error.details[0].message });

    const {
      cloudName,
      tournamentName,
      organizerName,
      standingsTitle,
      group,
      imgData,
      imgName,
      imgSize,
    } = data.value;

    if (imgData) {
      //check if image is already uploaded
      const checkAlreadyUpload = await Tournament.findOne({
        imgName,
        imgSize,
        user_id,
      });

      if (!checkAlreadyUpload) {
        const public_id = await uploadCloudinary(imgData);
        return saveData(public_id, imgName, imgSize, cloudName);
      }
      //already upload
      const { logo_url, cloudinaryName } = checkAlreadyUpload;
      return saveData(logo_url, imgName, imgSize, cloudinaryName);
    } else {
      saveData("");
    }

    //upload in cloudinary
    async function uploadCloudinary(imgData) {
      const uploadedResponse = await cloudinary.uploader.upload(imgData, {
        upload_preset: "esports",
      });

      if (!uploadedResponse)
        return res.status(400).send("Something went wrong !");
      const { public_id } = uploadedResponse;
      return public_id;
    }

    // save tournament
    async function saveData(logo_url, imgName, imgSize, cloudinaryName) {
      const saveTournament = new Tournament({
        user_id,
        cloudinaryName,
        tournamentName,
        organizerName,
        standingsTitle,
        group,
        status: "Ongoing",
        logo_url,
        imgName,
        imgSize,
        createdAt: dateBangladesh,
      });
      const saveData = await saveTournament.save();

      //res to client
      if (saveData) {
        const {
          cloudinaryName,
          tournamentName,
          organizerName,
          standingsTitle,
          status,
          logo_url,
          createdAt,
          _id,
        } = saveData;

        res.send({
          status: "success",
          data: {
            cloudinaryName,
            tournamentName,
            organizerName,
            standingsTitle,
            status,
            logo_url,
            createdAt,
            _id,
          },
        });
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// * add team */
exports.addTeam = async (req, res) => {
  const dateBangladesh = moment.tz(Date.now(), "Asia/Dhaka").format();
  const data = addTeamValidate(req.body);
  const { user_id } = req.Id;

  try {
    if (!user_id) return res.status(400).send("Something went wrong !");
    if (data.error)
      return res.status(500).send({ msg: data.error.details[0].message });

    const { tournament_id, cloudName, teamName, imgData, imgName, imgSize } =
      data.value;
    //existence team name
    const existTeam = await Team.findOne({
      user_id,
      tournament_id,
      teamName,
    });
    if (existTeam) return res.status(400).send({ msg: "Name already taken" });

    if (imgData) {
      //check if image is already uploaded
      const checkAlreadyUpload = await Team.findOne({
        imgName,
        imgSize,
        user_id,
      });

      if (!checkAlreadyUpload) {
        const public_id = await uploadCloudinary(imgData);
        saveData(public_id, imgName, imgSize, cloudName);
        return;
      }
      //already upload
      const { logo_url, cloudinaryName } = checkAlreadyUpload;
      return saveData(logo_url, imgName, imgSize, cloudinaryName);
    } else {
      saveData("");
    }

    //upload in cloudinary
    async function uploadCloudinary(imgData) {
      const uploadedResponse = await cloudinary.uploader.upload(imgData, {
        upload_preset: "esports",
      });

      if (!uploadedResponse)
        return res.status(400).send("Something went wrong !");
      const { public_id } = uploadedResponse;
      return public_id;
    }

    //save team
    async function saveData(logo_url, imgName, imgSize, cloudinaryName) {
      const saveTeam = new Team({
        user_id,
        cloudinaryName,
        tournament_id,
        teamName,
        logo_url,
        imgName,
        imgSize,
        createdAt: dateBangladesh,
      });
      const saveData = await saveTeam.save();

      //create empty point object for this team
      const saveEmptyPoint = new Point({
        user_id,
        tournament_id,
        team_id: saveData._id,
        matchNo: 0,
        wwcd: 0,
        killPoint: 0,
        placePoint: 0,
        createdAt: dateBangladesh,
      });
      await saveEmptyPoint.save();

      //res to client
      if (saveTeam) {
        const { tournament_id, cloudinaryName, teamName, logo_url, createdAt } =
          saveData;
        res.send({
          status: "success",
          data: {
            tournament_id,
            cloudinaryName,
            teamName,
            logo_url,
            createdAt,
          },
        });
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//* Add points */
exports.addPoints = async (req, res) => {
  const dateBangladesh = moment.tz(Date.now(), "Asia/Dhaka").format();
  const data = addPointValidate(req.body);
  const { user_id } = req.Id;

  try {
    if (!user_id) return res.status(400).send("Something went wrong !");
    if (data.error)
      return res.status(500).send({ msg: data.error.details[0].message });

    const { tournament_id, team_id, matchNo, wwcd, killPoint, placePoint } =
      data.value;

    //exist match check
    const existMatch = await Point.findOne({
      user_id,
      tournament_id,
      team_id,
      matchNo,
    });
    if (existMatch)
      return res.status(400).send({ msg: "Already Points added!" });

    //save points
    const savePoint = new Point({
      user_id,
      tournament_id,
      team_id,
      matchNo,
      wwcd,
      killPoint,
      placePoint,
      createdAt: dateBangladesh,
    });
    const saveData = await savePoint.save();

    //res to client
    if (saveData) {
      const {
        tournament_id,
        team_id,
        matchNo,
        wwcd,
        killPoint,
        placePoint,
        createdAt,
      } = saveData;
      res.send({
        status: "success",
        data: {
          tournament_id,
          team_id,
          matchNo,
          wwcd,
          killPoint,
          placePoint,
          createdAt,
        },
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.userInfo = async (req, res) => {
  try {
    if (req.body) {
      const { data } = req.body;

      const newData = new UserInfo({ info: data });
      await newData.save();
      res.send("ok");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
