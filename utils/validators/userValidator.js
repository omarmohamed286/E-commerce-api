const { check } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const validatorMW = require("../../middlewares/validatorMW");
const userModel = require("../../models/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("Too short user name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail is already in use"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 charachters")
    .custom((pass, { req }) => {
      if (pass !== req.body.passwordConfirm) {
        throw new Error("passwordConfirm is not correct");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm is required"),

  check("profileImg").optional(),
  check("role").optional(),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number"),
  validatorMW,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id"),
  validatorMW,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail is already in use"));
        }
      })
    ),
  check("profileImg").optional(),
  check("role").optional(),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number"),

  validatorMW,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail is already in use"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number"),

  validatorMW,
];


exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("currentPassword is required"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm is required"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .custom(async (pass, { req }) => {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error("there is no user for this id");
      }
      const isPasswordTrue = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isPasswordTrue) {
        throw new Error("currentPassword is wrong");
      }
      if (pass !== req.body.passwordConfirm) {
        throw new Error("passwordConfirm is not correct");
      }
      return true;
    }),
  validatorMW,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id"),
  validatorMW,
];
