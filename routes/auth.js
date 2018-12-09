const express = require("express");

const { localAuth, jwtAuth } = require("../middleware");
const { createToken, verifyToken } = require("../helpers/jwt");

const router = express.Router();

router.post("/login", localAuth, (req, res) => {
  const authToken = createToken(req.user);
  res.json({ authToken });
});

router.post("/refresh", jwtAuth, (req, res) => {
  const authToken = createToken(req.user);
  res.json({ authToken });
});

module.exports = router;
