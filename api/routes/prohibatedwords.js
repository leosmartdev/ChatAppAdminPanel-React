const express = require("express");
const router = express.Router();
const {
    fetchProhibitedWords,
    addNewProhibitedWord,
    deleteProhibitedWordById,
    deleteProhibitedWord,
    updateProhibitedWord 
} = require("../controllers/prohibatedwords");
const { verifyToken } = require('../middlewares/authHandler');

router.route('/').get(verifyToken, fetchProhibitedWords).post(verifyToken, addNewProhibitedWord).put(verifyToken, updateProhibitedWord).delete(verifyToken, deleteProhibitedWord);
router.route('/:id').delete(verifyToken, deleteProhibitedWordById);

module.exports = router;