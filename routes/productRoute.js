const express = require("express");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const authService = require("../services/authService");

const router = express.Router();

router.route("/").get(getProducts).post(
  authService.protect,
  authService.allowedTo("admin", "manager"),
  uploadProductImages,
  resizeProductImages,
  createProductValidator,
  createProduct
);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .patch(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
