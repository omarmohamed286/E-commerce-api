const { check } = require('express-validator');
const validatorMW = require('../../middlewares/validatorMW')

exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id'),
    validatorMW
]

exports.createCategoryValidator = [
    check('name').notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3 })
        .withMessage('Too short category name')
        .isLength({ max: 32 })
        .withMessage('Too long category name'),
    validatorMW
]

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id'),
    validatorMW
]

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id'),
    validatorMW
]