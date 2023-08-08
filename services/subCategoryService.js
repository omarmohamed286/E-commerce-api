const SubCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.createSubCategory = factory.createOne(SubCategoryModel);

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

exports.getSubCategories = factory.getAll(SubCategoryModel);

exports.getSubCategory = factory.getOne(SubCategoryModel);

exports.updateSubCategory = factory.updateOne(SubCategoryModel);

exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);
