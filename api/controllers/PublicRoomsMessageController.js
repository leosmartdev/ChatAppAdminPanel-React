"use strict";
//created by Hatem Ragap

// message type 0 mean is only String in flutter ignore img field
// message type 1  mean is only Img in flutter ignore message field
const path = require('path');
const fs = require('fs');
const {PublicRoomMessageSchemaModel} = require("../models/PublicRoomsMessagesModel");
const {publicChatRoomModel} = require("../models/publicChatRoomModel");
const {userSchemaModel} = require('../models/userModel');
const mongoose = require("mongoose");
const { ObjectID } = require('mongodb');

module.exports = {

    //limit of messages is 100
    fetchAll: async (req, res, next) => {
        let results = {};
        let userId = req.body.user_id;
        if (!userId) {
            userId = req.user._id;
        }
        const page = parseInt(req.body.page);
        const limit = parseInt("100");
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        try {
            const user = await userSchemaModel.findById(userId);
            const { change_kilometers_to_miles } = user;
            const messages = await PublicRoomMessageSchemaModel
                .aggregate([
                    {
                        $match: {
                            room_id: new mongoose.Types.ObjectId(req.body.room_id),
                            $or: [
                                {receiver_ids: {"$all": [userId]}},
                                {is_announcement: true}
                            ]
                        }
                    },
                    { $sort: {createdAt: -1}},
                    // { $sort: {is_admin_announcement: -1, is_announcement: -1, createdAt: -1}},
                    { $limit: limit },
                    { $skip: startIndex },
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
                let credit = like && Number((like / (like + dislike) * 100).toFixed(2));
                const distance = change_kilometers_to_miles ? value.sender.distance / 1000 * 0.621371 : value.sender.distance / 1000;
                const distance_unit = change_kilometers_to_miles ? "miles" : "km";
                return {
                    _id: value._id,
                    message: value.message,
                    img: value.img,
                    imgs: value.imgs,
                    imgPath: "roomMessages/img-src/",
                    sender_id: value.sender_id,
                    sender_name: value.sender_name,
                    nickname: value.sender.name,
                    email: value.sender.email,
                    gender: value.sender.gender,
                    like: like,
                    dislike: dislike,
                    credit: String(credit),
                    distance: String(distance),
                    distance_unit,
                    online: value.sender.online,
                    avatarUrl: value.sender.avatarUrl,
                    timeDiff: timeDifStr,
                    top: value.top,
                    top_set_user_id: value.top_set_user_id,
                    top_set_time: value.top_set_time,
                    is_announcement: value.is_announcement,
                    is_admin_announcement: value.is_admin_announcement,
                    createdAt: value.createdAt,
                    room_id: value.room_id
                }
            });

            let totalCommentCount = await PublicRoomMessageSchemaModel
                .find({
                    room_id: req.body.room_id,
                    $or: [
                        {receiver_ids: [userId]},
                        {is_announcement: true}
                    ]
                })
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
        } catch(err) {
            res.status(400).send({error: true, data: err.message});
        }
    },
    //fetch Top messages
    fetchTop: async (req, res, next) => {
        const userId = req.params.userId;
        let results = {};

        try {
            const user = await userSchemaModel.findById(userId);
            const { change_kilometers_to_miles } = user;
            const messages = await PublicRoomMessageSchemaModel.aggregate([
                    {
                        $match: {
                            room_id: new mongoose.Types.ObjectId(req.body.room_id),
                            top: true,
                            $or: [
                                {receiver_ids: {"$all": [userId]}},
                                {is_announcement: true}
                            ]
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
                let credit = like && Number((like / (like + dislike) * 100).toFixed(2));
                const distance = change_kilometers_to_miles ? value.sender.distance / 1000 * 0.621371 : value.sender.distance / 1000;
                const distance_unit = change_kilometers_to_miles ? "miles" : "km";
                return {
                    _id: value._id,
                    message: value.message,
                    img: value.img,
                    imgs: value.imgs,
                    imgPath: "roomMessages/img-src/",
                    sender_id: value.sender_id,
                    sender_name: value.sender_name,
                    nickname: value.sender.name,
                    email: value.sender.email,
                    gender: value.sender.gender,
                    like: like,
                    dislike: dislike,
                    credit: String(credit),
                    distance: String(distance),
                    distance_unit,
                    online: value.sender.online,
                    avatarUrl: value.sender.avatarUrl,
                    timeDiff: timeDifStr,
                    top: value.top,
                    top_set_user_id: value.top_set_user_id,
                    top_set_time: value.top_set_time,
                    isMyTopMsg: isMyTop,
                    is_announcement: value.is_announcement,
                    is_admin_announcement: value.is_admin_announcement,
                    createdAt: value.createdAt,
                    room_id: value.room_id
                }
            });

            resultMessages.sort((a, b) => {
                // if (!a.is_admin_announcement && b.is_admin_announcement) 
                //     return 1;
                // if (!a.is_admin_announcement && !a.is_announcement && b.is_announcement) 
                //     return 1;
                // if (!a.is_admin_announcement && !a.is_announcement && !a.isMyTopMsg && b.isMyTopMsg) 
                //     return 1;
                // if (!a.is_admin_announcement && !a.is_announcement && !a.isMyTopMsg && a.distance > b.distance) 
                //     return 1;
                if (!a.isMyTopMsg && b.isMyTopMsg) 
                    return 1;
                if (a.isMyTopMsg && a.distance > b.distance)
                    return 1;
                if (!a.isMyTopMsg && a.distance > b.distance)
                    return 1;
                return -1;
            });

            let totalCommentCount = await PublicRoomMessageSchemaModel
                .find({
                    room_id: req.body.room_id,
                    top: true,
                    $or: [
                        {receiver_ids: [userId]},
                        {is_announcement: true}
                    ]
                })
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
        const max_top_count = 2;
        const {msgId, userId} = req.params;
        try {
            const top_count = await PublicRoomMessageSchemaModel.find({ top_set_user_id: userId }).countDocuments().exec();
            if (top_count >= max_top_count) {
                await PublicRoomMessageSchemaModel.findOneAndUpdate({ top_set_user_id: new mongoose.Types.ObjectId(userId) }, {
                    top: false,
                    top_set_user_id: null
                }, { new: true }).sort({top_set_time: 1});
            }
            const newTopMsg = await PublicRoomMessageSchemaModel.findByIdAndUpdate(msgId, {
                top: true,
                top_set_user_id: userId,
                top_set_time: Date.now()
            }, { new: true });
            if (!newTopMsg) {
                res.status(400).send({error: true, data: 'not exist'});
            }
            else {
                res.send({error: false, data: newTopMsg});
            }
        } catch(err) {
            res.status(400).send({error: true, data: err.message});
        }
    },
    cancelTopMessage: async (req, res, next) => {
        const {msgId, userId} = req.params;
        try {
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
        } catch(err) {
            res.status(400).send({error: true, data: err.message});
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
    sendAnnouncement: async (req, res, next) => {
        const {message, posted_at, publisher, poster_email, imgs, position, coverage} = req.body;
        let room_id = req.body.room_id;
        if (!room_id) {
            const rooms = await publicChatRoomModel.find().sort({created: -1});
            room_id = rooms[0]._id;
        }
        var objectId = new ObjectID();
        let params = {
            _id: objectId,
            message: message,
            imgs: imgs,
            sender_id: req.user._id,
            sender_name: req.user.nickname,
            room_id: room_id,
            is_announcement: true,
            is_admin_announcement: publisher == "admin" ? true : false
        };
        if (posted_at == "top") {
            params.top = true;
            params.top_set_user_id = req.user._id;
            params.top_set_time = Date.now();
        }
        if (poster_email) {
            params.announcement_email = poster_email;
        }
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
};
