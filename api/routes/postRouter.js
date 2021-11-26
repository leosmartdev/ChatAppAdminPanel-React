"use strict";
//created by Hatem Ragap
const express = require("express");
const postRouter = new express.Router();
const postsController = require('../controllers/postsController');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: 'uploads/users_posts_img',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({storage: storage});

postRouter.post("/create", upload.single('img'), postsController.createPost);
postRouter.post("/fetch", postsController.getPosts);
postRouter.post("/getPostById", postsController.getPostById);
postRouter.post("/deletePost", postsController.deletePost);
postRouter.post("/fetch_posts_by_user_id", postsController.fetch_posts_by_user_id);

module.exports = postRouter;