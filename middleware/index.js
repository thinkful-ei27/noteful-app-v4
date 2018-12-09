const logger = require("./logger");
const cors = require("./cors");

const localAuth = require("./local-auth");
const jwtAuth = require("./jwt-auth");

module.exports = { logger, cors, localAuth, jwtAuth };
