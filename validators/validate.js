const Joi = require("joi");

exports.userValidate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data);
};

exports.addTournamentValidate = (data) => {
  const schema = Joi.object({
    cloudName: Joi.string(),
    tournamentName: Joi.string().required(),
    organizerName: Joi.string().default("").empty(""),
    standingsTitle: Joi.string().default("").empty(""),
    group: Joi.string().required(""),
    imgData: Joi.string().default("").empty(""),
    imgName: Joi.string().default("").empty(""),
    imgSize: Joi.number().default("").empty(""),
  });

  return schema.validate(data);
};

exports.updateTournamentValidate = (data) => {
  const schema = Joi.object({
    _id: Joi.string().required(),
    cloudinaryName: Joi.string(),
    tournamentName: Joi.string().required(),
    organizerName: Joi.string().default("").empty(""),
    standingsTitle: Joi.string().default("").empty(""),
    group: Joi.string().required(""),
    imgData: Joi.string().default("").empty(""),
    imgName: Joi.string().default("").empty(""),
    imgSize: Joi.number().default("").empty(""),
  });

  return schema.validate(data);
};

exports.addTeamValidate = (data) => {
  const schema = Joi.object({
    tournament_id: Joi.string().required(),
    cloudName: Joi.string(),
    teamName: Joi.string().required(),
    imgData: Joi.string().default("").empty(""),
    imgName: Joi.string().default("").empty(""),
    imgSize: Joi.number().default("").empty(""),
  });

  return schema.validate(data);
};

exports.addPointValidate = (data) => {
  const schema = Joi.object({
    tournament_id: Joi.string().required(),
    team_id: Joi.string().required(),
    matchNo: Joi.number().required(),
    wwcd: Joi.number().default("").empty(""),
    killPoint: Joi.number().default("").empty(""),
    placePoint: Joi.number().default("").empty(""),
  });

  return schema.validate(data);
};
