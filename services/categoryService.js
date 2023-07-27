const CategoryModel = require("../models/categoryModel")
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError')


exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit
    const categories = await CategoryModel.find({}).skip(skip).limit(limit)
    res.status(200).json({ results: categories.length, data: categories })
})

exports.getCategory = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const category = await CategoryModel.findById(id)
    if (!category) {
        return next(new ApiError(`No Cattegory for this id: ${id}`, 404))
    }
    res.status(200).json({ data: category })
})

exports.createCategory = asyncHandler(async (req, res) => {
    const name = req.body.name
    const category = await CategoryModel.create({ name, slug: slugify(name) })
    res.status(201).json({ data: category })
})

exports.updateCategory = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const name = req.body.name
    const category = await CategoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, {
        new: true
    })
    if (!category) {
        return next(new ApiError(`No Cattegory for this id: ${id}`, 404))
    }
    res.status(200).json({ data: category })

})

exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const deletedCategory = await CategoryModel.findByIdAndDelete(id)
    if (!deletedCategory) {
        return next(new ApiError(`No Cattegory for this id: ${id}`, 404))
    }
    res.status(204).json({})

})