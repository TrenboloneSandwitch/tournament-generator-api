const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const { serverErrorHandler, badRequest } = require('../../utils/error');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  console.log(req);
  serverErrorHandler(async function getProfile() {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) badRequest(res, 'There is no profile for this user');

    res.json(profile);
  });
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', [auth], async (req, res) => {
  const {
    location,
    wins,
    losses,
    goalsScored,
    goalsReceived,
    wonTournaments
  } = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (location && location.length > 0) profileFields.location = location;
  if (wonTournaments) profileFields.wonTournaments = wonTournaments;

  // Build social object
  const statFields = { wins, losses, goalsScored, goalsReceived };

  serverErrorHandler(async function updateProfile() {
    // Using upsert option (creates new doc if no match is found):

    let user = await Profile.findOne({ user: req.user.id });
    if (user) {
      let { stats } = user;

      for (let [key, value] of Object.entries(statFields)) {
        if (value) {
          statFields[key] = value;
        } else {
          statFields[key] = stats[key];
        }
      }
      profileFields.stats = { ...statFields };
      profileFields.stats.matches =
        profileFields.stats.wins + profileFields.stats.losses;
    }

    let profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      {
        new: true,
        upsert: true
      }
    );
    res.json(profile);
  });
});

module.exports = router;
