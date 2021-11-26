"use strict";
//created by Hatem Ragap

// message type 0 mean is only String in flutter ignore img field
// message type 1  mean is only Img in flutter ignore message field
const path = require('path');
const fs = require('fs');
const {PublicRoomMessageSchemaModel} = require("../models/PublicRoomsMessagesModel");
const {userSchemaModel} = require('../models/userModel');
const mongoose = require("mongoose");

module.exports = {

    //limit of messages is 100
    fetchAll: async (req, res, next) => {
        let results = {};
        const page = parseInt(req.body.page);
        const limit = parseInt("100");
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const messages = await PublicRoomMessageSchemaModel
            .aggregate([
                { $match: {room_id: new mongoose.Types.ObjectId(req.body.room_id)} },
                { $limit: limit },
                { $skip: startIndex },
                { $sort: {createdAt: -1}},
                {
                    $lookup: {
                        from: "users", // collection name in db
                        localField: "sender_id",
                        foreignField: "_id",
                        as: "sender"
                    }
                },
                {
                    $unwind: "$sender"
                },
                {
                    $project: {
                        "sender.password": 0,
                        "sender.originPassword": 0,
                        "sender.token": 0
                    }
                }
            ]).exec();

        const resultMessages = messages.map((value, index) => {
            const timeDif = Date.now() - value.createdAt;
            const secsDif = Math.floor(timeDif / 1000);
            const minsDif = Math.floor(timeDif / 60000);
            const hoursDif = Math.floor(timeDif / 3600000);
            const daysDif = Math.floor(timeDif / 86400000);
            let timeDifStr;
            if (secsDif < 60) {
                timeDifStr = `${secsDif} sec${secsDif>1 ? 's' : ''} ago`;
            } else if (minsDif < 60) {
                timeDifStr = `${minsDif} min${minsDif>1 ? 's' : ''} ago`;
            } else if (hoursDif < 24) {
                timeDifStr = `${hoursDif} hour${hoursDif>1 ? 's' : ''} ago`;
            } else {
                timeDifStr = `${daysDif} day${daysDif>1 ? 's' : ''} ago`;
            }
            let like = value.sender.like;
            let dislike = value.sender.dislike;
            let credit = like && Math.round(like / (like + dislike) * 100);
            return {
                _id: value._id,
                message: value.message,
                img: value.img,
                imgs: value.imgs,
                imgPath: "roomMessages/img-src/",
                sender_id: value.sender_id,
                sender_name: value.sender_name,
                nickname: value.sender.name,
                gender: value.sender.gender,
                like: like,
                dislike: dislike,
                credit: credit,
                online: value.sender.online,
                avatarUrl: value.sender.avatarUrl,
                timeDiff: timeDifStr,
                top: value.top,
                top_set_user_id: value.top_set_user_id,
                top_set_time: value.top_set_time,
                createdAt: value.createdAt,
                room_id: value.room_id
            }
        });

        let totalCommentCount = await PublicRoomMessageSchemaModel
            .find({room_id: req.body.room_id})
            .countDocuments()
            .exec();
        results.totalCount = totalCommentCount;

        if (endIndex < totalCommentCount) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }
        results.error = false;
        results.data = resultMessages;
        res.send(results);
    },
    //fetch Top messages
    fetchTop: async (req, res, next) => {
        const userId = req.params.userId;
        let results = {};

        try {
            const user = await userSchemaModel.findById(userId);

            const messages = await PublicRoomMessageSchemaModel.aggregate([
                    {
                        $match: {
                            room_id: new mongoose.Types.ObjectId(req.body.room_id),
                            top: true
                        } 
                    },
                    {
                        $lookup: {
                            from: "users", // collection name in db
                            // localField: "sender_id",
                            // foreignField: "_id",
                            as: "sender",
                            let: { sender_id: "$sender_id" },
                            pipeline: [
                                {
                                    $geoNear: {
                                        near: {
                                            type: "Point",
                                            coordinates: user.location.coordinates
                                        },
                                        distanceField: "distance",
                                        includeLocs: "location",
                                        // spherical: true,
                                        minDistance: 0
                                    }
                                },
                                {
                                    $match: { 
                                        $expr: { $eq: ["$$sender_id", "$_id"] }
                                    } 
                                },
                            ]
                        }
                    },
                    {
                        $unwind: "$sender"
                    },
                    {
                        $project: {
                            "sender.password": 0,
                            "sender.originPassword": 0,
                            "sender.token": 0
                        }
                    }
                ]).exec();

            let resultMessages = messages.map((value, index) => {
                const timeDif = Date.now() - value.createdAt;
                const secsDif = Math.floor(timeDif / 1000);
                const minsDif = Math.floor(timeDif / 60000);
                const hoursDif = Math.floor(timeDif / 3600000);
                const daysDif = Math.floor(timeDif / 86400000);
                let timeDifStr;
                if (secsDif < 60) {
                    timeDifStr = `${secsDif} sec${secsDif>1 ? 's' : ''} ago`;
                } else if (minsDif < 60) {
                    timeDifStr = `${minsDif} min${minsDif>1 ? 's' : ''} ago`;
                } else if (hoursDif < 24) {
                    timeDifStr = `${hoursDif} hour${hoursDif>1 ? 's' : ''} ago`;
                } else {
                    timeDifStr = `${daysDif} day${daysDif>1 ? 's' : ''} ago`;
                }
                let isMyTop = false;
                if (user._id.equals(value.top_set_user_id)) {
                    isMyTop = true;
                }
                let like = value.sender.like;
                let dislike = value.sender.dislike;
                let credit = like && Math.round(like / (like + dislike) * 100);
                return {
                    _id: value._id,
                    message: value.message,
                    img: value.img,
                    imgs: value.imgs,
                    imgPath: "roomMessages/img-src/",
                    sender_id: value.sender_id,
                    sender_name: value.sender_name,
                    nickname: value.sender.name,
                    gender: value.sender.gender,
                    like: like,
                    dislike: dislike,
                    credit: credit,
                    distance: value.sender.distance,
                    distancekm: `${(value.sender.distance/1000).toFixed(2)}km`,
                    online: value.sender.online,
                    avatarUrl: value.sender.avatarUrl,
                    timeDiff: timeDifStr,
                    top: value.top,
                    top_set_user_id: value.top_set_user_id,
                    top_set_time: value.top_set_time,
                    isMyTopMsg: isMyTop,
                    createdAt: value.createdAt,
                    room_id: value.room_id
                }
            });

            resultMessages.sort((a, b) => {
                if (!a.isMyTopMsg && b.isMyTopMsg) 
                    return 1;
                if (!a.isMyTopMsg && a.distance > b.distance) 
                    return 1;
                return -1;
            });

            let totalCommentCount = await PublicRoomMessageSchemaModel
                .find({room_id: req.body.room_id,top: true})
                .countDocuments()
                .exec();
            results.totalCount = totalCommentCount;

            results.error = false;
            results.data = resultMessages;
            res.send(results);
        } catch(err) {
            res.status(400).send({error: true, data: err.message});
        }
    },
    setTopMessage: async (req, res, next) => {
        const {msgId, userId} = req.params;
        const prevTopMsg = await PublicRoomMessageSchemaModel.update({top_set_user_id: userId}, {top: false});
        const newTopMsg = await PublicRoomMessageSchemaModel.findByIdAndUpdate(msgId, {
            top: true,
            top_set_user_id: userId,
            top_set_time: Date.now()
        });
        if (!newTopMsg) {
            res.status(400).send({error: true, data: 'not exist'});
        }
        else {
            res.send({error: false, data: newTopMsg});
        }
    },
    cancelTopMessage: async (req, res, next) => {
        const {msgId, userId} = req.params;
        const msg = await PublicRoomMessageSchemaModel.findByIdAndUpdate(msgId, {
            top: false,
            top_set_user_id: userId,
            top_set_time: Date.now()
        });
        if (!msg) {
            res.status(400).send({error: true, data: 'not exist'});
        }
        else {
            res.send({error: false, data: msg});
        }
    },
    sendMessage: async (req, res, next) => {
        const {room_id, sender_id, sender_name, message, imgs} = req.body;
        const params = {
            message: message,
            imgs: imgs,
            sender_id: sender_id,
            sender_name: sender_name,
            room_id: room_id
        };
        const publicRoomMessage = PublicRoomMessageSchemaModel(params);
        publicRoomMessage.save(async err => {
            if (err) {
              res.status(401).json({
                success: false,
                message: err.message
              });
            } else {
              res.json({
                success: true,
                message: 'send message successfully',
                data: publicRoomMessage
              });
            }
        });
    },
    uploadMessageImageOnly: async (req, res) => {
        let imgName = req.file.filename;
        res.send({error: false, data: imgName});
    },
    uploadMultiImages: async (req, res) => {
        const files = req.files;
        const fileNames = await files.map((file) => file.filename);
        res.send({error: false, data: fileNames});
    },
    getImgSrc: async (req, res) => {
        let fileLocation = path.resolve(__dirname, '../uploads/public_chat_messages', req.params.imageName);
        let fileExist = fs.existsSync(fileLocation)
        if(!fileExist) {
            res.status(403).send("Image doesn't exist");
        }
        else {
            res.sendFile(`${fileLocation}`);
        }
    },
};
