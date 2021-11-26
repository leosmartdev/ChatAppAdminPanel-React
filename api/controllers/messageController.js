"use strict";
//created by Hatem Ragap

// message type 0 mean is only String in flutter ignore img field
// message type 1  mean is only Img in flutter ignore message field
const path = require('path');
const fs = require('fs');
const {messageSchemaModel} = require("../models/messagesModel");

module.exports = {
    //limit of messages is 100
    fetchAll: async (req, res, next) => {
        let results = {};
        const page = parseInt(req.body.page);
        const limit = parseInt("100");
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let messages = await messageSchemaModel
            .find({chat_id: req.body.chat_id})
            .limit(limit)
            .skip(startIndex)
            .sort({createdAt: -1})
            .select("message imgs message_type created sender_id receiver_id isDeleted note_duration");

        const resultMessages = await messages.map((value, index) => {
            let created = value.created;
            let createDate = new Date(created * 1000);
            let send_date = (createDate.getMonth() + 1) + "-" + createDate.getDate();
            let send_time = createDate.getHours() + ":" + createDate.getMinutes();
            return {
                _id: value._id,
                message: value.message,
                message_type: value.message_type,
                imgs: value.imgs,
                isDeleted: value.isDeleted,
                sender_id: value.sender_id,
                receiver_id: value.receiver_id,
                send_date: send_date,
                send_time: send_time,
                created: value.created
            }
        });

        let totalCommentCount = await messageSchemaModel
            .find({chat_id: req.body.chat_id})
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

    uploadMessageImageOnly: async (req, res) => {
        let imgName = req.file.filename;
        res.send({error: false, data: imgName});
    },

    deleteMessageById: async (req, res) => {

        try {
            await messageSchemaModel.findByIdAndUpdate(req.body.id, {isDeleted: 1});

            res.send({error: false, data: 'done'})
        } catch (err) {
            res.status(400).send({error: true, data: `${err}`});
        }

    },

    uploadMultiImages: async (req, res) => {
        const files = req.files;
        const fileNames = await files.map((file) => file.filename);
        res.send({error: false, data: fileNames});
    },

    getImgSrc: async (req, res) => {
        let fileLocation = path.resolve(__dirname, '../uploads/users_messages_img', req.params.imageName);
        let fileExist = fs.existsSync(fileLocation)
        if(!fileExist) {
            res.status(403).send("Image doesn't exist");
        }
        else {
            res.sendFile(`${fileLocation}`);
        }
    },

    sendMessage: async (req, res, next) => {
        const {messageId, message, senderId, receiverId, chatId, messageType, imgs} = req.body;
        let messageSchema = messageSchemaModel({
            _id: messageId,
            message: message,
            sender_id: senderId,
            receiver_id: receiverId,
            chat_id: chatId,
            message_type: messageType,
            imgs: imgs
        });
        messageSchema.save(async err => {
            if (err) {
              res.status(401).json({
                success: false,
                message: err.message
              });
            } else {
              res.json({
                success: true,
                message: 'send message successfully',
                data: messageSchema
              });
            }
        });
    },
};
