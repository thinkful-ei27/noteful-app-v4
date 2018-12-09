const express = require("express");
const createError = require("http-errors");

const { cors, logger } = require("./middleware");

const notesRouter = require("./routes/notes");
const foldersRouter = require("./routes/folders");
const tagsRouter = require("./routes/tags");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

// Create an Express application
const app = express();

// Log all requests
app.use(logger);

// Create a static webserver
app.use(express.static("public"));

// Log all requests
app.use(cors);

// Parse request body
app.use(express.json());

// Mount user registration
app.use("/api/users", usersRouter);

// Mount login and refresh routes
app.use("/api/auth", authRouter);

// Mount user content resources
app.use("/api/notes", notesRouter);
app.use("/api/folders", foldersRouter);
app.use("/api/tags", tagsRouter);

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = createError(404, "Not Found");
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  // if (err instanceof createError.HttpError) {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = app; // Export for testing
