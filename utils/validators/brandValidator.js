const { check } = require('express-validator');
const validatorMW = require('../../middlewares/validatorMW')

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid brand id'),
    validatorMW
]

exports.createBrandValidator = [
    check('name').notEmpty()
        .withMessage('Brand name is required')
        .isLength({ min: 3 })
        .withMessage('Too short brand name')
        .isLength({ max: 32 })
        .withMessage('Too long brand name'),
    validatorMW
]

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid brand id'),
    validatorMW
]

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid brand id'),
    validatorMW
]