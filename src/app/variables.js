exports.userWins = function(voxaEvent) {
  return voxaEvent.model.userWins;
};

exports.alexaWins = function(voxaEvent) {
  return voxaEvent.model.alexaWins;
};

exports.maxWins = function(voxaEvent) {
  return voxaEvent.model.wins;
};
