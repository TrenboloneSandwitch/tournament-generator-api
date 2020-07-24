module.exports.serverErrorHandler = function (callback) {
  try {
    callback();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports.badRequest = function (res, msg) {
  return res.status(400).json({ errors: msg });
};

module.exports.validateInputs = function (req) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};
