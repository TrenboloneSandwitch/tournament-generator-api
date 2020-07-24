const express = require("express");
const router = express.Router();

// @route   GET api/profile
// @desc    GET profile
// @access  Public
router.get("/", (req, res) => res.send("Profile"));

module.exports = router;
