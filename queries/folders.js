const Folder = require("../models/folder");

exports.getAll = (filter) => Folder.find(filter).sort({ name: "desc" });
