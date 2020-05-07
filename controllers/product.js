const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      // set req.product to the product that is returned by findById
      req.product = product;
      next();
    });
};

exports.read = (req, res) => {
  /* remove the photo from the req object*/
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  //keep the extensions for whatever extensions come through
  form.keepExtensions = true;
  /*per documentation, form.parse takes in 3 argurments: err, fields, files
  and parses the incoming Node request containing form data. If a callback
  is provided, all fields and files are collected and passed ot the callback*/
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    // check if all fields are populated
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    /* as mentioned above, the parse method passes the fields into the callback. 
    Therefore, the fields can be passed into the Product constructor*/
    let product = new Product(fields);
    // the photos will be named "photo" from the client-side
    if (files.photo) {
      /* We are populating the properties of product */
      /*fs readFileSync returns the contents  of the path. The path is stored
        in files.photo.path */
      /* if the photo is larger than 1mb*/
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let product = req.product;
  ///removes the product from mongoDB
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    res.json({
      message: "Product deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  //keep the extensions for whatever extensions come through
  form.keepExtensions = true;
  /*parses an incoming Node request containing form data. If a callback
    is provided, all fields and files are collected and passed ot the callback*/
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    // check if all fields are populated
    const { name, description, price, category, quantity, shipping } = fields;
    // if (
    //   !name ||
    //   !description ||
    //   !price ||
    //   !category ||
    //   !quantity ||
    //   !shipping
    // ) {
    //   return res.status(400).json({
    //     error: "All fields are required",
    //   });
    // }
    // retrieve the product from the request
    let product = req.product;
    /* extend is a lodash method that takes in an object for the first argument
    and updates the object based on the second argument passed in*/
    product = _.extend(product, fields);
    // the photos will be named "photo" from the client-side
    if (files.photo) {
      /* We are populating the properties of product */
      /*fs readFileSync returns the contents  of the path. The path is stored
          in files.photo.path */
      /* if the photo is larger than 1mb*/
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error),
        });
      }
      res.json(result);
    });
  });
};

// returning products based on sell or arrival query parameters coming from the frontend
// by sell = /products?sortBy=sold&order=desc&limit=4
// by arrival = /products?sortBy=createdAt&order=desc&limit=4
// if no parameters are sent, then all products are returned

exports.list = (req, res) => {
  //req.query is the query in the URL from the front end
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  /*the "category" property in the model relates to the Category
Model. Therefore, the populate method will populate the category property
with the associated Category*/
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({ error: "Products not found" });
      }
      res.json(products);
    });
};

/* Find the products based on the req product category. Other products that have the same
category will be returned*/
exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  //$ne: excludes the specified object. Returns all products in that category except that product
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({ error: "Products not found" });
      }
      res.json(products);
    });
};

exports.listCategories = (req, res) => {
  // get all properties that are in the Product model
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({ error: "Categories not found" });
    }
    res.json(categories);
  });
};

/* List products by search. The product search will come from the frontend. Categories
will be shown in checkbox and price range in radio buttons. When the user checks a box
or clicks on the radio buttons, we will make an API request to show the filtered products*/

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  /*since we are only showing a few of the products at a time (i.e. 1-5 or 6-10 or 21-25, etc),
  we need to skip some products */
  let skip = parseInt(req.body.skip);
  // fingArgs are the criteria that the user is looking for
  let findArgs = {};

  // the criteria for findArgs is contained in the req.body.filters object.
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than or equal to the price that mongoDB understands [0-10]
        // lte - less than or equal to the price that mongoDB understands
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  // based on the criteria (findArgs) specified by the user, we will find the desired products
  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

//return the image of a product
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    //since the response will be an image, you have the set the response type.
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.listSearch = (req, res) => {
  //create query object to hold search value and category value
  const query = {};
  //asign search value to query.name
  if (req.query.search) {
    //'i' means ignore case
    //$regex search for mongoDB
    query.name = { $regex: req.query.search, $options: "i" };
    //assign catgory value to query.category
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }
    //find the product based on query object with 2 properties
    //search and category
    Product.find(query, (err, products) => {
      if (err) {
        return res.status(400).json({ error: errorHandler(err) });
      }
      res.json(products);
    }).select("-photo");
  }
};

exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        //increment and decrement the invventory and sold
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: "Could not update product",
      });
    }
    next();
  });
};
