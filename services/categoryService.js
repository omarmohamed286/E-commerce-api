const CategoryModel = require("../models/categoryModel");
const factory = require("./handlersFactory");

exports.getCategories = factory.getAll(CategoryModel);

exports.getCategory = factory.getOne(CategoryModel);

exports.createCategory = factory.createOne(CategoryModel);

exports.updateCategory = factory.updateOne(CategoryModel);

exports.deleteCategory = factory.deleteOne(CategoryModel);
