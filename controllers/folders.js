const folders = require("../queries/folders");

exports.findAll = (req, res, next) => {
  const userId = req.user.id;

  folders.getAll({ userId })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });

};
