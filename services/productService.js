const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ProductModel = require("../models/productModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.getProducts = asyncHandler(async (req, res) => {
  const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
    .paginate()
    .filter()
    .search()
    .limitFields()
    .sort();

  const products = await apiFeatures.mongooseQuery;
  res.status(200).json({ results: products.length, data: products });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new ApiError(`No product for this id: ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await ProductModel.create(req.body);
  res.status(201).json({ data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await ProductModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`No product for this id: ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletedProduct = await ProductModel.findByIdAndDelete(id);
  if (!deletedProduct) {
    return next(new ApiError(`No product for this id: ${id}`, 404));
  }
  res.status(204).json({});
});
