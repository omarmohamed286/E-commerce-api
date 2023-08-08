const BrandModel = require("../models/brandModel");
const factory = require("./handlersFactory");

exports.getBrands = factory.getAll(BrandModel);

exports.getBrand = factory.getOne(BrandModel);

exports.createBrand = factory.createOne(BrandModel);

exports.updateBrand = factory.updateOne(BrandModel);

exports.deleteBrand = factory.deleteOne(BrandModel);
