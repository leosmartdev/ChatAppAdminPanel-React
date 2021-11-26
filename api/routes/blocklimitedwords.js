const express = require('express');
const router = express.Router();
const {
  fetchBlockLimitedWords,
  addNewBlockLimitedWord,
  updateBlockLimitedWord,
  deleteBlockLimitedWordById,
  deleteBlockLimitedWord
} = require('../controllers/blocklimitedwords');
const { verifyToken } = require('../middlewares/authHandler');

router.route('/').get(verifyToken, fetchBlockLimitedWords).post(verifyToken, addNewBlockLimitedWord).put(verifyToken, updateBlockLimitedWord).delete(verifyToken, deleteBlockLimitedWord);
router.route('/:id').delete(verifyToken, deleteBlockLimitedWordById);

module.exports = router;
