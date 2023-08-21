const router = require("express").Router();
const {
  register,
  userLogin,
  tokenCheck,
  userLogout,
} = require("../controllers/auth");
const {
  deleteTeam,
  deleteTournament,
  deleteMatch,
} = require("../controllers/delete");
const {
  getTournament,
  getTeamsData,
  getSingleTeamsData,
  getAllTeamsData,
  databaseInfo,
  getSingleUserInfo,
} = require("../controllers/fetch");
const {
  addTournament,
  addTeam,
  addPoints,
  userInfo,
} = require("../controllers/post");
const { preloader } = require("../controllers/preloader");
const { updateTeamMatch, updateTournament } = require("../controllers/update");
const { tokenVerification } = require("../middleware/token.middleware");

router.post("/auth/register", register);
router.post("/auth/login", userLogin);
router.get("/auth/token-check", tokenCheck);
router.get("/auth/logout", userLogout);

router.post("/add-tournament", tokenVerification, addTournament);
router.post("/add-team", tokenVerification, addTeam);
router.post("/add-point", tokenVerification, addPoints);

router.get("/get-tournament", tokenVerification, getTournament);
router.post("/get-team-data", tokenVerification, getTeamsData);
router.post("/get-single-team-data", tokenVerification, getSingleTeamsData);
router.post("/get-all-team-data", tokenVerification, getAllTeamsData);

router.post("/delete-tournament-team", tokenVerification, deleteTeam);
router.post("/delete-tournament", tokenVerification, deleteTournament);
router.post("/delete/delete-match", tokenVerification, deleteMatch);

router.put(
  "/update/update-team-match-data",
  tokenVerification,
  updateTeamMatch
);
router.put(
  "/update/update-tournament-data",
  tokenVerification,
  updateTournament
);

router.post("/connection-check", preloader);
router.get("/database-info", databaseInfo);
router.post("/user-info", userInfo);
router.post("/database-single-user-info", getSingleUserInfo);

module.exports = router;
