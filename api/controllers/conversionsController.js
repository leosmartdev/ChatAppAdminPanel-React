"use strict";
//created by Hatem Ragap
const {roomsSchemaModel} = require("../models/conversionsModel");
const {userSchemaModel} = require("../models/userModel");
const {messageSchemaModel} = require("../models/messagesModel")
const mongoose = require("mongoose");

const _ = require("underscore");
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
                let chats = await roomsSchemaModel.find({users: userId}).sort({updatedAt: -1}).populate("users", "_id name email gender role avatarUrl online like dislike coverage");

                let chatsResult = chats.map((value, index) => {
                    let friend = value.users.find((user) => user._id !== userId);
                    let friendId = friend._id;
                    let isAdminChat = friend.role === "admin";
                    return {
                        _id: value._id,
                        friendId: friendId,
                        friend: friend,
                        isAdminChat: isAdminChat,
                        users: value.users,
                        lastMessage: value.lastMessage,
                        created: value.created,
                        createdAt: value.createdAt,
                        updatedAt: value.updatedAt,
                    }
                });

                chatsResult.sort((a, b) => {
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
                result.data = `there are error ${error}`;
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











