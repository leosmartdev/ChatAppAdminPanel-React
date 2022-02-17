"use strict";
//created by Hatem Ragap
const mongoose = require('mongoose');
const Joi = require('joi');

var roomsSchema = mongoose.Schema({
    users: [{
        type: String,
        required: true,
        ref: 'users',
        trim: true,
    }],
    lastMessage: {
        users_see_message: [{
            type: mongoose.Types.ObjectId,
        }],
        message: {
            type: String,
            default: 'first msg'
        },
        unread_count: {
            type: Number,
            default: 0
        },
        updated: {
            type: Number,
            default: Date.now()
        }
    },
    created: {
        type: Date,
        default: Date.now()
    }
},
{
    timestamps: true
}, 
{
    toObject: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    }
});

var roomsSchemaModel = mongoose.model('chatsRooms', roomsSchema);
module.exports = {
    roomsSchemaModel,
}