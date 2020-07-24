const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const { serverErrorHandler, badRequest } = require('../../utils/error');
const { signIn } = require('../../utils/signIn');
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      badRequest(res, errors.array());
    } else {
      const { name, email, password } = req.body;

      serverErrorHandler(async () => {
        let user = await User.findOne({ email });

        if (user) {
          badRequest(res, 'User already exists');
        } else {
          const avatar = 'https://bit.ly/2WQMMdk';

          user = new User({
            name,
            email,
            avatar,
            password
          });

          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
          await user.save();

          signIn(user, res);
        }
      });
    }
  }
);

module.exports = router;
