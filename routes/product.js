const express = require("express");
const router = express.Router();
const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo,
  listSearch,
} = require("../controllers/product");
/* whenever you need functions/variables from the index.js file,  
you don't need to specify index.js in the route*/
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/product/:productId", read);
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
// put requests are used for updating
router.put(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);

router.get("/products", list);
router.get("/products/search", listSearch);
router.get("/products/related/:productId", listRelated);
/* getting categories based on product criteria*/
router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId", photo);

/* whenever there is parameter called userId in the route, we execute userById 
which populates the user in req.profile*/
router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
