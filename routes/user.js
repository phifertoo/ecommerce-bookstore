const express = require("express");
const router = express.Router();
const {
  userById,
  read,
  update,
  purchaseHistory,
} = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
  /* since the middleware sets the user to req.profile, you can
    access the user from req.profile */
  res.json({
    user: req.profile,
  });
});

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);
router.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory);

/* whenever there is parameter called userId in the route, we execute userById 
which populates the user in req.profile*/
router.param("userId", userById);

module.exports = router;
