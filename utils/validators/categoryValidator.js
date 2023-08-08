const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMW = require("../../middlewares/validatorMW");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validatorMW,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMW,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMW,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validatorMW,
];
