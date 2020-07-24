const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const { serverErrorHandler, badRequest } = require('../../utils/error');
const { signIn } = require('../../utils/signIn');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Private
router.get('/', auth, (req, res) => {
  serverErrorHandler(async function getUser() {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  });
});

// @route   POST api/auth
// @desc    Authenicate User & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      badRequest(res, errors.array());
    } else {
      const { email, password } = req.body;

      serverErrorHandler(async function logIn() {
        let user = await User.findOne({ email });

        if (!user) badRequest(res, 'Invalid credentials');

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) badRequest(res, 'Invalid credentials');

        signIn(user, res);
      });
    }
  }
);

module.exports = router;
