const express = require('express');
const router = express.Router();
const {
    register,
    login,
    adminlogin,
    myAccount,
    logout,
    putState,
    getState,
    retrievePasswordMailSend,
    resetPassword
} = require('../controllers/auth');
const { verifyToken } = require('../middlewares/authHandler');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/online-status').put(verifyToken, putState);
router.route('/online-status').get(verifyToken, getState);
router.route('/adminlogin').post(adminlogin);
router.route('/me').get(verifyToken, myAccount);
router.route('/logout').post(verifyToken, logout);
router.route('/retrieve-pwd-mail-send').post(retrievePasswordMailSend);
router.route('/reset-password/:userId').post(resetPassword);

module.exports = router;
