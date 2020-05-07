const express = require("express");
const router = express.Router();
const { signup, signin, signout } = require("../controllers/auth");
/* whenever you need functions/variables from the index.js file,  
you don't need to specify index.js in the route*/
const { userSignupValidator } = require("../validator");

/* routing with middleware*/
router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
