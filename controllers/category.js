const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.categoryById = (req, res, next, id) => {
  //exec means execute a function
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({ error: "Category does not exist" });
    }
    // sets req.category to category from mongoDB so that we can use it elsewhere
    req.category = category;
    next();
  });
};

exports.create = (req, res) => {
  // the name is the only property in the Category object. req.body contains the name
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({ error: errorHandler(err) });
    }
    res.json({ data });
  });
};

exports.read = (req, res) => {
  return res.json(req.category);
};

exports.update = (req, res) => {
  /*whenever there is the category parameter in the URL, getCategoryById is called
 which sets the req.category to the category in the parameter*/
  const category = req.category;
  category.name = req.body.name;
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({ error: errorHandler(err) });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  /*whenever there is the category parameter in the URL, getCategoryById is called
 which sets the req.category to the category in the parameter*/
  const category = req.category;
  category.remove((err, data) => {
    if (err) {
      return res.status(400).json({ error: errorHandler(err) });
    }
    res.json({ message: "Category deleted" });
  });
};

exports.list = (req, res) => {
  Category.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: errorHandler(err) });
    }
    res.json(data);
  });
};
