const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { serverErrorHandler, badRequest } = require('../../utils/error');

const Team = require('../../models/Teams');

// @route   GET api/teams
// @desc    Get all teams
// @access  Public
router.get('/', async (req, res) => {
  let teams = await Team.find();
  res.status(200).json(teams);
});

// @route   POST api/teams
// @desc    Create or update new team
// @access  Public
/* router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('alpha3Code', 'Please include a alpha code').not().isEmpty(),
    check('logo', 'Logo is required').not().isEmpty()
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
      const { name, alpha3Code, logo } = req.body;

      let team = await Team.findOne({ $or: [{ name }, { alpha3Code }] });
      if (team) return badRequest(res, 'Team already exists.');

      team = new Team({ name, alpha3Code, logo });
      await team.save();
      res.status(200).json(team);
    });
  }
); */

// @route   POST api/teams
// @desc    Create new or update existing team
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('alpha3Code', 'Please include a alpha code').not().isEmpty(),
    check('logo', 'Logo is required').not().isEmpty()
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
      const { name, alpha3Code, logo } = req.body;

      let team = await Team.findOneAndUpdate(
        { $or: [{ name }, { alpha3Code }] },
        { name, alpha3Code, logo },
        {
          new: true,
          upsert: true
        }
      );
      if (!team) return badRequest(res, 'Invalid team.');

      res.status(200).json(team);
    });
  }
);

module.exports = router;
