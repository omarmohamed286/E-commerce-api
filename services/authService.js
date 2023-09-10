const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");

const userModel = require("../models/userModel");

const generateToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const token = generateToken(user._id);
  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    email: req.body.email,
  });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect password or email", 401));
  }
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new ApiError("Token is required to access this route", 401));
  }
  const token = req.headers.authorization.split(" ")[1];

  const { userId, iat } = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await userModel.findById(userId);
  if (!user) {
    return next(new ApiError("Token is not related to any user", 401));
  }

  if (user.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );

    if (passwordChangedTimestamp > iat) {
      return next(
        new ApiError(
          "User changed his password recently, please login again",
          401
        )
      );
    }
  }
  req.user = user;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`No user for this email: ${req.body.email}`, 404));
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const message = `
  Hi ${user.name}\n
  We recieved a request to reset your password on your E-shop account.\n
  Your reset code is: ${resetCode}\n
  Enter this code to complete the reset.
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Code (valid for 10 minutes)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("Sending email failed", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await userModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid reset code or expired"));
  }

  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "Success" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No user for this email", 404));
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset password code is not verified", 400));
  }

  user.password = await bcrypt.hash(req.body.newPassword, 12);
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({ token });
});
