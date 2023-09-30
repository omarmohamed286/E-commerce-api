const { check } = require("express-validator");
const validatorMW = require("../../middlewares/validatorMW");
const reviewModel = require("../../models/reviewModel");

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Ratings is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 and 5"),
  check("user")
    .isMongoId()
    .withMessage("Invalid user id")
    .custom((val, { req }) => {
      if (val !== req.user._id.toString()) {
        return Promise.reject(
          new Error("User id from token must equal from body")
        );
      }
      return true;
    }),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id")
    .custom((val, { req }) =>
      reviewModel
        .findOne({ user: req.user._id, product: req.body.product })
        .then((review) => {
          if (review) {
            return Promise.reject(
              new Error("You created review for that product already")
            );
          }
        })
    ),
  validatorMW,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id")
    .custom((val, { req }) =>
      reviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("No review for that id"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to update this review")
          );
        }
      })
    ),
  validatorMW,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return reviewModel.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error("No review for that id"));
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to delete this review")
            );
          }
        });
      }
      return true;
    }),
  validatorMW,
];
