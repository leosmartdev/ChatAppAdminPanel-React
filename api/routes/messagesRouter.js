'use strict';
//created by Hatem Ragap
const express = require('express');
const messageRouter = new express.Router;
const messageController = require('../controllers/messageController');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/users_messages_img',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const multiStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/users_messages_img')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({storage: storage});
const multiUpload = multer({storage: multiStorage});

const { verifyToken } = require('../middlewares/authHandler');

//commentRouter.post('/create',commentController.create);
messageRouter.post('/fetch_all', verifyToken, messageController.fetchAll);
messageRouter.post('/deleteMessageById', verifyToken, messageController.deleteMessageById);
messageRouter.post('/upload_img_message', verifyToken, upload.single('img'), messageController.uploadMessageImageOnly);
messageRouter.post('/upload_multi_imgs', verifyToken, multiUpload.any('img'), messageController.uploadMultiImages);
messageRouter.get('/img-src/:imageName', messageController.getImgSrc);
messageRouter.post('/send', verifyToken, messageController.sendMessage);

module.exports = messageRouter;
