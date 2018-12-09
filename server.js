const app = require("./app");
const mongoose = require("mongoose");
const { PORT, MONGODB_URI } = require("./config");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// Listen on provided port
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on("error", err => {
  console.error(err);
});

// Connect to DB
mongoose.connect(MONGODB_URI)
  .then(instance => {
    const conn = instance.connections[0];
    console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
  })
  .catch(err => {
    console.error(err);
  });
