const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");

const { TEST_MONGODB_URI } = require("../config");

const User = require("../models/user");

const expect = chai.expect;

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

chai.use(chaiHttp);

describe("Noteful API - Users", function () {
  const username = "exampleUser";
  const password = "examplePass";
  const fullname = "Example User";

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
      .then(() => User.createIndexes());
  });

  beforeEach(function () {
    // noop
  });

  afterEach(function () {
    return User.deleteMany();
  });

  after(function () {
    return mongoose.connection.db.dropDatabase()
      .then(() => mongoose.disconnect());
  });

  describe("POST /api/users", function () {

    it("Should create a new user", function () {
      let res;
      return chai
        .request(app)
        .post("/api/users")
        .send({ username, password, fullname })
        .then(_res => {
          res = _res;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.keys("id", "username", "fullname");
          expect(res.body.id).to.exist;
          expect(res.body.username).to.equal(username);
          expect(res.body.fullname).to.equal(fullname);
          return User.findOne({ username });
        })
        .then(user => {
          expect(user).to.exist;
          expect(user.id).to.equal(res.body.id);
          expect(user.fullname).to.equal(fullname);
          return user.validatePassword(password);
        })
        .then(isValid => {
          expect(isValid).to.be.true;
        });
    });

    it("Should reject users with missing username", function () {
      return chai
        .request(app)
        .post("/api/users")
        .send({ password, fullname })

        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("Field 'username' is required");
        });
    });

    it("Should reject users with missing password", function () {
      return chai
        .request(app)
        .post("/api/users")
        .send({ username, fullname })

        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("Field 'password' is required");
        });
    });

    it("Should reject users with non-string username", function () {
      return chai
        .request(app)
        .post("/api/users")
        .send({ username: 1234, password, fullname })

        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("Field: 'username' must be a String");
        });
    });

    it("Should reject users with non-string password", function () {
      return chai
        .request(app)
        .post("/api/users")
        .send({ username, password: 1234, fullname })

        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("Field: 'password' must be a String");
        });
    });

    it("Should reject users with non-trimmed username", function () {
      return chai
        .request(app)
        .post("/api/users")
        .send({ username: ` ${username} `, password, fullname })

        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("Field: 'username' must not begin or end with whitespace");
        });
    });

    it("Should reject users with non-trimmed password", function () {
      return chai
        .request(app)
        .post("/api/users")
        .send({ username, password: ` ${password}`, fullname })

        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("Field: 'password' must not begin or end with whitespace");
        });
    });

    it("Should reject users with empty username", function () {
      return chai
        .request(app)
        .post("/api/users")
        .send({ username: "", password, fullname })

        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("Field: 'username' must be min 1 characters");
        });
    });

    it("Should reject users with password less than 8 characters", function () {
      return chai
        .request(app)
        .post("/api/users")
        .send({ username, password: "asdfghj", fullname })

        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("Field: 'password' must be min 8 characters");
        });
    });

    it("Should reject users with password greater than 72 characters", function () {
      return chai
        .request(app)
        .post("/api/users")
        .send({ username, password: new Array(73).fill("a").join(""), fullname })

        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("Field: 'password' must be max 72 characters");
        });
    });

    it("Should reject users with duplicate username", function () {
      return User
        .create({
          username,
          password,
          fullname
        })
        .then(() => {
          return chai
            .request(app)
            .post("/api/users")
            .send({ username, password, fullname });
        })
        .then(res => {
          expect(res).to.have.status(409);
          expect(res.body.message).to.equal(`Resource '${username}' must be unique`);
        });
    });

    it("Should trim fullname", function () {
      return chai
        .request(app)
        .post("/api/users")
        .send({ username, password, fullname: ` ${fullname} ` })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.keys("id", "username", "fullname");
          expect(res.body.fullname).to.equal(fullname);
          return User.findOne({ username });
        })
        .then(user => {
          expect(user).to.not.be.null;
          expect(user.fullname).to.equal(fullname);
        });
    });

  });

});
