const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMW = require("../../middlewares/validatorMW");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id"),
  validatorMW,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3 })
    .withMessage("Too short brand name")
    .isLength({ max: 32 })
    .withMessage("Too long brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMW,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMW,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id"),
  validatorMW,
];
