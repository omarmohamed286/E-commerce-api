const asyncHandler = require("express-async-handler");

const userModel = require("../models/userModel");

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({ status: "success", data: user.addresses });
});

exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(204).json({ status: "success", data: user.addresses });
});

exports.getAddresses = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("addresses");
  res.status(200).json({ status: "success", data: user.addresses });
});
