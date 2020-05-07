const express = require("express");
const router = express.Router();
const {
  create,
  categoryById,
  read,
  update,
  remove,
  list,
} = require("../controllers/category");
/* whenever you need functions/variables from the index.js file,  
you don't need to specify index.js in the route*/
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/category/:categoryId", read);
router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put(
  "/category/:categoryId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);
router.delete(
  "/category/:categoryId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.get("/categories", list);

/* whenever there is parameter called categoryId in the route, we execute categoryId middleware 
which populates the user in req.profile*/
router.param("categoryId", categoryById);
/* whenever there is parameter called userId in the route, we execute userById middleware
which populates the user in req.profile*/
router.param("userId", userById);

module.exports = router;
