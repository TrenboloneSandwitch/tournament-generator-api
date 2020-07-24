const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  location: {
    type: String
  },
  wonTournaments: {
    type: Number,
    default: 0
  },
  stats: {
    matches: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    goalsScored: { type: Number, default: 0 },
    goalsReceived: { type: Number, default: 0 }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
