const { check } = require("express-validator");
const validatorMW = require("../../middlewares/validatorMW");

exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory id'),
    validatorMW
]

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("Too long Subcategory name"),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must belong to a category")
    .isMongoId()
    .withMessage("Invalid Category id"),
  validatorMW,
];

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory id'),
    validatorMW
]

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory id'),
    validatorMW
]
