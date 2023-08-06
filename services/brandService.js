const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const BrandModel = require("../models/brandModel")
const ApiError = require('../utils/apiError')


exports.getBrands = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 5
    const skip = (page - 1) * limit
    const brands = await BrandModel.find({}).skip(skip).limit(limit)
    res.status(200).json({ results: brands.length, data: brands })
})

exports.getBrand = asyncHandler(async (req, res, next) => {
    const {id} = req.params
    const brand = await BrandModel.findById(id)
    if (!brand) {
        return next(new ApiError(`No brand for this id: ${id}`, 404))
    }
    res.status(200).json({ data: brand })
})

exports.createBrand = asyncHandler(async (req, res) => {
    const {name} = req.body
    const brand = await BrandModel.create({ name, slug: slugify(name) })
    res.status(201).json({ data: brand })
})

exports.updateBrand = asyncHandler(async (req, res, next) => {
    const {id} = req.params
    const {name} = req.body
    const brand = await BrandModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, {
        new: true
    })
    if (!brand) {
        return next(new ApiError(`No Brand for this id: ${id}`, 404))
    }
    res.status(200).json({ data: brand })

})

exports.deleteBrand = asyncHandler(async (req, res, next) => {
    const {id} = req.params
    const deletedbrand = await BrandModel.findByIdAndDelete(id)
    if (!deletedbrand) {
        return next(new ApiError(`No Brand for this id: ${id}`, 404))
    }
    res.status(204).json({})

})