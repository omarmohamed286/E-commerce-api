const ReviewModel = require("../models/reviewModel");
const factory = require("./handlersFactory");

exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
    next();
  };
  

exports.getReviews = factory.getAll(ReviewModel);

exports.getReview = factory.getOne(ReviewModel);

exports.createReview = factory.createOne(ReviewModel);

exports.updateReview = factory.updateOne(ReviewModel);

exports.deleteReview = factory.deleteOne(ReviewModel);
