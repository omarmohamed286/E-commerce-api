const express = require("express");
const authService = require("../services/authService");

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlist,
} = require("../services/wishlistService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getWishlist);

router.delete("/:productId", removeProductFromWishlist);

module.exports = router;
