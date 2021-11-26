const asyncHandler = require('express-async-handler');
const User = require('../models/User');

exports.getUserList = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.json({
    success: true,
    users
  });
});

exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate({ username: req.query.username }, req.body);

  res.json({
    success: true,
    user
  });
});

exports.deleteUserAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.userId);
  res.json({
    success: true
  })
});