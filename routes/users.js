const express = require("express");
const createError = require("http-errors");

const User = require("../models/user");

const router = express.Router();

/* ========== POST/CREATE AN ITEM ========== */
router.post("/", (req, res, next) => {

  /***** Never trust users - validate input *****/
  const requiredFields = ["username", "password"];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = createError(400, `Missing '${missingField}' in request body`);
    return next(err);
  }

  const stringFields = ["username", "password", "fullname"];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );

  if (nonStringField) {
    const err = createError(400, `Field: '${nonStringField}' must be type String`);
    return next(err);
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ["username", "password"];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    const err = createError(400, `Field: '${nonTrimmedField}' cannot start or end with whitespace`);
    return next(err);
  }

  // bcrypt truncates after 72 characters, so let's not give the illusion
  // of security by storing extra **unused** info
  const sizedFields = {
    username: { min: 1 },
    password: { min: 8, max: 72 }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field => "min" in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  if (tooSmallField) {
    const min = sizedFields[tooSmallField].min;
    const err = createError(400, `Field: '${tooSmallField}' must be at least ${min} characters long`);
    return next(err);
  }

  const tooLargeField = Object.keys(sizedFields).find(
    field => "max" in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooLargeField) {
    const max = sizedFields[tooLargeField].max;
    const err = createError(400, `Field: '${tooLargeField}' must be at most ${max} characters long`);
    return next(err);
  }

  // Username and password were validated as pre-trimmed
  let { username, password, fullname = "" } = req.body;
  fullname = fullname.trim();

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        fullname
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = createError(409, "The username already exists");
      }
      next(err);
    });
});

module.exports = router;
