const express = require('express');
const router = express.Router();
const { getUserList, updateUserProfile, deleteUserAccount } = require('../controllers/users');
const { register } = require('../controllers/auth');

router.route('/manage-users').get(getUserList).post(register).put(updateUserProfile);
router.route('/manage-users/:userId').delete(deleteUserAccount);

module.exports = router;
