"use strict";
//created by Hatem Ragap
const mongoose = require('mongoose');
const Joi = require('joi');


// message type 0 mean is only String in flutter ignore img field
// message type 1  mean is only Img in flutter ignore message field
const messageSchema = mongoose.Schema({
    _id: {
        type: String,
    },
    message: {
        type: String,
        default: '',
    },
    message_type: {
        type: Number,
        default: 0
    },
    img: {
        type: String,
        default: ''
    },
    imgs: {
        type: [String]
    },
    isDeleted: {
        type: Number,
        default: 0
    },
    sender_id:
        {type: mongoose.Schema.Types.ObjectId},
    receiver_id:
        {type: mongoose.Schema.Types.ObjectId},
    chat_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    created: {
        type: Number,
        default: Math.floor(Date.now() / 1000)
    }
},
{
    timestamps: true
});

const messageSchemaModel = mongoose.model('messages', messageSchema);
module.exports = {
    messageSchemaModel,
}
