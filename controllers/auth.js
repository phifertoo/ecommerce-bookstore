const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken"); //generate signed token
const expressJwt = require("express-jwt"); //authorization check

exports.signup = (req, res) => {
  //the body parser will allow you to receive the data coming from the req
  // console.log("req.body", req.body);
  const user = new User(req.body);
  // saves the user information to mongoDB
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({ user });
  });
};

exports.signin = (req, res) => {
  //find the user based on email
  const { email, password } = req.body;
  /*in the calllback, the user is desginated as the object that is returned from 
  the user.find method */
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "User with that  email does not exist. Please signup",
      });
    }
    //if user is found, make the email and password match
    //create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({ error: "Email and Password do not match" });
    }
    //generate a signed jwt with userid and secret
    // the _.id is the user object that was returned from the findOne method above
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //sets a cookie with the token and expiration. Name of the cookie is 't'
    res.cookie("t", token, { expire: new Date() + 9999 });
    //return response with user and token to frontend client
    const { _id, name, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  //clear cookie by the name of 't' which is the token
  res.clearCookie("t");
  res.json({ message: "Signout successful" });
};

//middleware to protect any route. Why doesn't this middleware need next()?
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
});

//ensures that the user that is signed in matches
exports.isAuth = (req, res, next) => {
  /* in the requireSignin method above, we use expressJwt to set the auth property 
  which contains id */
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin access only",
    });
  }
  next();
};
