const ProductModel = require("../models/productModel");
const factory = require("./handlersFactory");

exports.getProducts = factory.getAll(ProductModel,'Products');

exports.getProduct = factory.getOne(ProductModel);

exports.createProduct = factory.createOne(ProductModel);

exports.updateProduct = factory.updateOne(ProductModel);

exports.deleteProduct = factory.deleteOne(ProductModel);
