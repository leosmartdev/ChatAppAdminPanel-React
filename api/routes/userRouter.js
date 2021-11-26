"use strict";
//created by Hatem Ragap
const express = require("express");
const userRouter = new express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
//img path
// http://localhost:5000/uploads/users_profile_img/1582645366303-apple-logo.png
const storage = multer.diskStorage({
    destination: 'uploads/users_profile_img',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const { verifyToken } = require('../middlewares/authHandler');

const upload = multer({storage: storage});
userRouter.post("/create", verifyToken, userController.createUser); // /api/user/create
userRouter.post("/update/:userId", verifyToken, userController.updateUser); // /api/user/update
userRouter.delete("/delete/:userId", verifyToken, userController.deleteUser); // /api/user/delete
userRouter.post("/login", verifyToken, userController.loginUser); // /api/user/login
userRouter.post("/change_password/:userId", verifyToken, userController.updatePassword); // /api/user/updatePassword
userRouter.post("/update_bio_and_name", verifyToken, userController.update_bio_and_name); // /api/user/login
userRouter.post("/get_likes_posts_comments_counts", verifyToken, userController.get_likes_posts_comments_counts); // /api/user/login
userRouter.get("/get/:userId", verifyToken, userController.getUser); // /api/user/get
userRouter.get("/getUserByEmail", verifyToken, userController.getUserByEmail); // /api/user/get
userRouter.post("/searchUserByName", verifyToken, userController.searchUserByName); // /api/user/get
userRouter.get("/getUsers", verifyToken, userController.getUsers); // /api/user/get
userRouter.post("/img/:userId", verifyToken, upload.single('img'), userController.addUserImg);
userRouter.get('/img/:userId', userController.getUserImg);
userRouter.get('/img-src/:imageName', userController.getImgSrc);

userRouter.post("/update_bio", verifyToken, userController.update_bio);
userRouter.post('/update_user_token', verifyToken, userController.updateAndAddUserToken);

userRouter.put('/permissions/:userId', verifyToken, userController.saveUserSepcialPermission);
userRouter.post('/getSpecialPermissions', verifyToken, userController.getSpecialPermissions);
userRouter.post('/clearSpecialPermission/:userId', verifyToken, userController.clearSpecialPermission);
userRouter.get("/getSettings/:userId", verifyToken, userController.getUserSettings); // /api/user/getSettings
userRouter.post("/setSettings/:userId", verifyToken, userController.setUserSettings); // /api/user/setSettings
userRouter.get("/getGender/:userId", verifyToken, userController.getUserGender); 
userRouter.post("/setGender/:userId", verifyToken, userController.setUserGender); 
userRouter.get("/getNickname/:userId", verifyToken, userController.getUserName);
userRouter.post("/setNickname/:userId", verifyToken, userController.setUserName);
userRouter.get("/getLocalUsers/:userId", verifyToken, userController.getLocalUsers);
userRouter.get("/getLocation/:userId", verifyToken, userController.getLocation);
userRouter.post("/setLocation/:userId", verifyToken, userController.setLocation);
userRouter.post('/setLike/:userId/:posterId', verifyToken, userController.setLike);
userRouter.post('/setDislike/:userId/:posterId', verifyToken, userController.setDislike);
userRouter.get("/get-details/:userId", verifyToken, userController.getUserDetails); // /api/user/getDeails

module.exports = userRouter;
