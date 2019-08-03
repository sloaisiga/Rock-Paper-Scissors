const { AlexaPlatform, plugins, VoxaApp } = require("voxa");
const config = require("../config");
const defaultFulfillIntents = require("../../content/en-US/canfulfill-intent.json");
const Model = require("./model");
const User = require("../services/User");
const states = require("./states");
const variables = require("./variables");
const views = require("./views.json");

const voxaApp = new VoxaApp({ Model, views, variables, defaultFulfillIntents });
states(voxaApp);

exports.alexaSkill = new AlexaPlatform(voxaApp);

plugins.replaceIntent(voxaApp);

exports.voxaApp = voxaApp;
