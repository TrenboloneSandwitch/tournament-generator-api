const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { serverErrorHandler, badRequest } = require('../../utils/error');

const Tournament = require('../../models/Tournament');
const Teams = require('../../models/Teams');

// @route   GET api/tournament
// @desc    SHow all tournaments
// @access  Public
router.get('/', async (req, res) => {
  let tournaments = await Tournament.find();
  res.status(200).json(tournaments);
});

// @route   POST api/tournaments
// @desc    Create new team
// @access  Public
router.post(
  '/',
  [
    check('title', 'title is required').not().isEmpty(),
    check('location', 'Please include a valid location').not().isEmpty(),
    check('players', 'At least 4 players').isArray({ min: 4 }),
    check('teams', 'At least 4 teams').isArray({ min: 4 })
  ],
  (req, res) => {
    // Error handle block
    {
      let errors = validationResult(req);
      if (!errors.isEmpty())
        return badRequest(
          res,
          errors.array().map((err) => err.msg)
        );
    }

    serverErrorHandler(async () => {
      const { title, location, players, teams } = req.body;

      let tournament = await Tournament.findOne({ title });
      if (tournament) return badRequest(res, 'Tournament already exists');

      tournament = new Tournament({
        title,
        location,
        players,
        teams
      });

      try {
        await tournament.populate('teams').save();
        res.status(200).json(tournament);
      } catch (error) {
        res.status(400).send(error);
      }
    });
  }
);

module.exports = router;
