// const morgan = require("morgan");

// module.exports = function (req, res, next) {
//   morgan(process.env.NODE_ENV === "development" ? "dev" : "common", {
//     skip: () => process.env.NODE_ENV === "test"
//   });
//   next();
// };

const morgan = require("morgan");

morgan.format("development", morgan.dev);
morgan.format("production", morgan.common);
morgan.format("test", () => { });

module.exports = morgan(process.env.NODE_ENV || "development");
