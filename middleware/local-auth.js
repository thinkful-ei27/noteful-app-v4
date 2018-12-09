const passport = require("passport");
const createError = require("http-errors");
const { Strategy: LocalStrategy } = require("passport-local");

const User = require("../models/user");

// ===== Define and create basicStrategy =====
const localStrategy = new LocalStrategy((username, password, done) => {
  let user;
  User.findOne({ username })
    .then(results => {
      user = results;
      if (!user) {
        const err = createError(401, "Unauthorized");
        return Promise.reject(err);
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        const err = createError(401, "Unauthorized");
        return Promise.reject(err);
      }
      return done(null, user);
    })
    .catch(err => {
      return done(err);
    });
});

// Utilize the given `strategy`
passport.use(localStrategy);

module.exports = passport.authenticate("local", { session: false, failWithError: true });
