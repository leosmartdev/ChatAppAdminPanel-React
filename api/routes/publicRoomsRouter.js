"use strict";
//created by Hatem Ragap
const express = require("express");
const roomsRouter = new express.Router();
const roomsController = require('../controllers/publicRoomsController');
const multer = require('multer');
//img path
// http://localhost:5000/uploads/users_profile_img/1582645366303-apple-logo.png
const storage = multer.diskStorage({
    destination: 'uploads/public_chat_rooms',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const { verifyToken } = require('../middlewares/authHandler');

const upload = multer({storage: storage});
roomsRouter.post("/create", verifyToken, upload.single('img'),roomsController.createRoom); // /api/user/create
roomsRouter.get("/getRooms", verifyToken, roomsController.getRooms); // /api/user/get
roomsRouter.delete("/deleteRoom/:roomId", verifyToken, roomsController.deleteRoom);

module.exports = roomsRouter;
