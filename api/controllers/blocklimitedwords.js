const asyncHandler = require('express-async-handler');
const BlockLimitedWord = require('../models/BlockLimitedWord');

exports.fetchBlockLimitedWords = asyncHandler(async (req, res, next) => {
  const limitblockwords = await BlockLimitedWord.find();
  res.json({
    success: true,
    limitblockwords
  });
});

exports.addNewBlockLimitedWord = asyncHandler(async (req, res, next) => {
  const BlocklimitWordAlreadyExist = await BlockLimitedWord.findOne({ word: req.body.word });

  if (BlocklimitWordAlreadyExist) {
    return res.json({ success: false, message: 'Already added list of limit block words' });
  }

  const newBlocklimitword = new BlockLimitedWord(req.body);
  await newBlocklimitword.save();

  res.json({
    success: true,
    word: newBlocklimitword
  });
});

exports.updateBlockLimitedWord = asyncHandler(async (req, res, next) => {
  const blocklimitedword = await BlockLimitedWord.findOneAndUpdate({ word: req.query.word }, req.body);

  res.json({
    success: true,
    blocklimitedword
  });
});

exports.deleteBlockLimitedWordById = asyncHandler(async (req, res, next) => {
  await BlockLimitedWord.findByIdAndDelete(req.params.id);
  res.json({
    success: true,
    message: 'Delete Successfully'
  });
});

exports.deleteBlockLimitedWord = asyncHandler(async (req, res, next) => {
  await BlockLimitedWord.findOneAndRemove({ word: req.body.word});
  res.json({
    success: true,
    message: "Delete Successfully"
  })
});
