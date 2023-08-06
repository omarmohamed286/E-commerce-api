const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const SubCategoryModel = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");

exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  const subCategories = await SubCategoryModel.find(filterObject)
    .skip(skip)
    .limit(limit);
  res.status(200).json({ results: subCategories.length, data: subCategories });
});

exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findById(id);
  if (!subCategory) {
    return next(new ApiError(`No SubCattegory for this id: ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(name), category },
    {
      new: true,
    }
  );
  if (!subCategory) {
    return next(new ApiError(`No SubCategory for this id: ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletedSubCategory = await SubCategoryModel.findByIdAndDelete(id);
  if (!deletedSubCategory) {
    return next(new ApiError(`No SubCategory for this id: ${id}`, 404));
  }
  res.status(204).json({});
});
