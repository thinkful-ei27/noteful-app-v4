const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_EXPIRY } = require("../config");

function createToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    throw err;
  }
}

module.exports = { createToken, verifyToken };
