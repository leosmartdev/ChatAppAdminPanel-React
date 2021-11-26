"use strict";
//created by Hatem Ragap
const express = require("express");
const commentRouter = new express.Router();
const commentController = require('../controllers/commentController');

commentRouter.post("/create", commentController.createComment);
commentRouter.post("/delete", commentController.deleteComment);
commentRouter.post("/fetch_all", commentController.getComments);

module.exports = commentRouter;