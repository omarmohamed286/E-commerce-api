const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(createSubCategoryValidator, createSubCategory)
  .get(getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .patch(updateCategoryValidator, updateSubCategory)
  .delete(deleteCategoryValidator, deleteSubCategory);

module.exports = router;
