const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  players: [
    {
      name: { type: String, required: true, unique: true },
      matches: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      goalsScored: { type: Number, default: 0 },
      goalsReceived: { type: Number, default: 0 }
    }
  ],
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'team'
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Tournament = mongoose.model('tournament', TournamentSchema);
