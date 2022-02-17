const asyncHandler = require('express-async-handler');
const ProhibitedWord = require('../models/ProhibitedWord');

exports.fetchProhibitedWords = asyncHandler(async (req, res, next) => {
  const prohibitedwords = await ProhibitedWord.find();
  res.json({
    success: true,
    prohibitedwords
  });
});

exports.addNewProhibitedWord = asyncHandler(async (req, res, next) => {
  const prohibitedWordAlreadyExist = await ProhibitedWord.findOne({ word: req.body.word });

  if (prohibitedWordAlreadyExist) {
    return res.json({ success: false, message: 'Already added list of prohibited words' });
  }

  const prohibitedword = new ProhibitedWord();
  prohibitedword.word = req.body.word;
  await prohibitedword.save();
  res.json({
    success: true,
    prohibitedword
  });
});

exports.updateProhibitedWord = asyncHandler(async (req, res, next) => {
  const prohibitedword = await ProhibitedWord.findByIdAndUpdate(req.query.id, req.body);

  res.json({
    success: true,
    prohibitedword
  });
});

exports.deleteProhibitedWordById = asyncHandler(async (req, res, next) => {
  await ProhibitedWord.findByIdAndDelete(req.params.id);
  res.json({
    success: true,
    message: "Delete Successfully"
  })
});

exports.deleteProhibitedWord = asyncHandler(async (req, res, next) => {
  await ProhibitedWord.findOneAndRemove({ word: req.body.word});
  res.json({
    success: true,
    message: "Delete Successfully"
  })
});
