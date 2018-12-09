const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const createError = require("http-errors");

const notesRouter = require("./routes/notes");
const foldersRouter = require("./routes/folders");
const tagsRouter = require("./routes/tags");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const localStrategy = require("./passport/local");
const jwtStrategy = require("./passport/jwt");

// Create an Express application
const app = express();

// Log all requests. Skip logging during
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "common", {
  skip: () => process.env.NODE_ENV === "test"
}));

// Create a static webserver
app.use(express.static("public"));

// Parse request body
app.use(express.json());

// Utilize the given `strategy`
passport.use(localStrategy);
passport.use(jwtStrategy);

// Protect endpoints using JWT Strategy
const jwtAuth = passport.authenticate("jwt", { session: false, failWithError: true });

// Mount routers
app.use("/api/notes", jwtAuth, notesRouter);
app.use("/api/folders", jwtAuth, foldersRouter);
app.use("/api/tags", jwtAuth, tagsRouter);
app.use("/api/users", usersRouter);
app.use("/api", authRouter);

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = createError(404, "Not Found");
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  // if (err instanceof createError.HttpError) {
  console.log(err);
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = app; // Export for testing
