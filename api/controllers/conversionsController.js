"use strict";
//created by Hatem Ragap
const {roomsSchemaModel} = require("../models/conversionsModel");
const {userSchemaModel} = require("../models/userModel");
const {messageSchemaModel} = require("../models/messagesModel");
const {settingsSchemaModel} = require('../models/settingsModel');
const mongoose = require("mongoose");

const _ = require("underscore");

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2) 
{
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}

module.exports = {
    createChatRoom: async (req, res) => {
        const {user_one, user_two, lastMessage} = req.body;
        if (user_two && user_one && lastMessage) {
            let msg = {
                users_see_message: [user_one],
                message: lastMessage
            };

            let chat = await roomsSchemaModel.findOne({users: {$all: [user_one, user_two]}});

            if (chat === null) {
                //create new Conversation
                const roomModel = new roomsSchemaModel({users: [user_one, user_two], lastMessage: msg});

                roomModel.save(async err => {
                    if (err) {
                        res.status(400).send({error: true, data: err});
                    } else {
                        res.send({error: false, data: roomModel, new: true});
                    }
                });
            } else {
                //just send this message on this conversation and send Notification
                res.send({error: false, data: chat, new: false});
            }
        } else {
            res.status(400).send({error: true, data: 'missing some args user_one user_two lastMessage'})
        }
    },
    getUserChats: async (req, res) => {
        let userId = req.body.user_id;
        if (!userId) {
            userId = req.user._id;
        }
        if (userId) {
            let listOfOnlineAndOffline = {"user 1 id ": true};
            const keys = Object.keys(listOfOnlineAndOffline);
            let result = {};
            try {
                const user = await userSchemaModel.findById(userId);
                const { change_kilometers_to_miles } = user;
                // const conversations = await roomsSchemaModel.aggregate([
                //     { $match: {users: userId} },
                //     { $sort: {updatedAt: -1} }
                // ]).exec();
                // let chats = await roomsSchemaModel.populate(conversations, {
                //     path: "users",
                //     select: "_id name email gender role avatarUrl online like dislike coverage location"
                // });
                let chats = await roomsSchemaModel.find({users: userId}).sort({created: -1}).populate("users", "_id name email gender role avatarUrl online like dislike coverage location");
                const parameterSettings = await settingsSchemaModel.findOne({type: "parameter"});
                const chatAdminEmail = parameterSettings.settings.online_chat_admin_email;

                let chatsResult = chats.filter((value) => value.users.length == 2).map((value, index) => {
                    let friend = value.users.find((value) => value._id.toString() !== userId);
                    let friendId = null;
                    let isAdminChat = false;
                    let isAdminChannel = false;
                    let distance = 0;
                    let credit = 0;
                    if (friend !== undefined) {
                        friendId = friend._id;
                        isAdminChat = friend.role === "admin";
                        isAdminChannel = friend.role === "admin" && friend.email == chatAdminEmail;
                        distance = calcCrow(user.location.coordinates[1], user.location.coordinates[0], friend.location.coordinates[1], friend.location.coordinates[0]);
                        distance = change_kilometers_to_miles ? distance * 0.621371 : distance;
                        credit = friend.like && Number((friend.like / (friend.like + friend.dislike) * 100).toFixed(2));
                    }
                    const distance_unit = change_kilometers_to_miles ? "miles" : "km";
                    const timeDif = Date.now() - value.lastMessage.updated;
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
                    
                    return {
                        _id: value._id,
                        friendId: friendId,
                        friend: {...friend.toObject(), ...{distance: String(distance), distance_unit, credit: String(credit)}},
                        isAdminChat: isAdminChat,
                        isAdminChannel: isAdminChannel,
                        users: value.users,
                        lastMessage: {...value.lastMessage, ...{timeDiff: timeDifStr}},
                        created: value.created,
                        createdAt: value.createdAt,
                        updatedAt: value.updatedAt,
                    }
                });

                chatsResult.sort((a, b) => {
                    if (!a.isAdminChannel && b.isAdminChannel)
                        return 1;
                    if (!a.isAdminChat && b.isAdminChat)
                        return 1;
                    return -1;
                });
                
                result.error = false;
                result.data = chatsResult;
                result.onLineUsersId = keys;

                res.send({error: false, data: chatsResult, onLineUsersId: keys})
            } catch (error) {
                result.onLineUsersId = [];
                result.error = true;
                result.data = `there are error ${error.message}`;
                res.status(400).send({error: true, data: result})
            }

        } else {
            res.status(400).send({error: true, data: 'user_id is empty'})
        }
    },
    removeChatRoom: async (req, res) => {
        const {chat_id} = req.body;
        await roomsSchemaModel.findByIdAndRemove(chat_id).exec((err) => {
            if (err) {
                res.status(400).send({error: true, data: err.message});
            }
            else {
                res.send({error: false, data: "Removed Successfully"});
            }
        });
    },
    contacts: async (req, res) => {
        const contacts = await userSchemaModel.find({
          _id: {
            $ne: req.user._id
          }
        });
        res.json({ success: true, contacts });
    },
    conversations: async (req, res) => {
        let userId = req.body.user_id;
        if (!userId && req.user) {
            userId = req.user._id.toString();
        }
        if (userId) {
            // const conversations = await roomsSchemaModel.find({users: userId}).populate("users", "_id name email gender role avatarUrl online like dislike coverage");
            const conversations = await roomsSchemaModel.aggregate([
                { $match: {users: userId} },
                {
                    $lookup: {
                        from: "messages", // collection name in db
                        localField: "_id",
                        foreignField: "chat_id",
                        as: "messages"
                    }
                },
                {
                    $project: {
                        "messages.img": 0
                    }
                }
            ]).exec();

            const conversationsResult = await roomsSchemaModel.populate(conversations, {
                path: "users",
                select: "_id name email gender role avatarUrl online like dislike coverage"
            });

            res.json({
                success: true,
                conversations: conversationsResult
            });
        } else {
            res.status(400).send({error: true, data: 'user_id is empty'})
        }
    },
    conversation: async (req, res) => {
        let chatId = req.body.chat_id;
        if (chatId) {
            // const conversations = await roomsSchemaModel.find({users: userId}).populate("users", "_id name email gender role avatarUrl online like dislike coverage");
            const conversations = await roomsSchemaModel.aggregate([
                { $match: {_id: new mongoose.Types.ObjectId(chatId)} },
                {
                    $lookup: {
                        from: "messages", // collection name in db
                        localField: "_id",
                        foreignField: "chat_id",
                        as: "messages"
                    }
                },
                {
                    $project: {
                        "messages.img": 0
                    }
                }
            ]).exec();

            const conversationsResult = await roomsSchemaModel.populate(conversations, {
                path: "users",
                select: "_id name email gender role avatarUrl online like dislike coverage"
            });

            res.json({
                success: true,
                conversation: conversationsResult[0]
            });
        } else {
            res.status(400).send({error: true, data: 'chat_id is empty'})
        }
    }
};











