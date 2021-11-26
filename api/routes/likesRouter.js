"use strict";
//created by Hatem Ragap
const express = require("express");
const likesRouter = new express.Router();
const likesController = require('../controllers/likesController');

likesRouter.post("/create", likesController.createLike);
likesRouter.post("/delete", likesController.deleteLike);

module.exports = likesRouter;