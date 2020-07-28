const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  homeSide: {},
  awaySide: {}
});

module.exports = Team = mongoose.model('team', TeamSchema);
