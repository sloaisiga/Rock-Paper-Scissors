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

/**
 * Load User into the model
 */
// voxaApp.onRequestStarted(async (voxaEvent) => {
//   const user = await User.get(voxaEvent);

//   voxaEvent.model.user = user;
// });

/**
 * Update the session count
 */
// voxaApp.onSessionStarted(async voxaEvent => {
//   const user = voxaEvent.model.user;
//   user.newSession();
// });

/**
 * Save the user
 */
// voxaApp.onBeforeReplySent(async (voxaEvent) => {
//     const user = voxaEvent.model.user;

//     await user.save({ userId: voxaEvent.user.userId });
//   }
// );

exports.voxaApp = voxaApp;
