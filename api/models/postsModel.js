"use strict";
//created by Hatem Ragap
const mongoose = require('mongoose');
const Joi = require('joi');

var postSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: 'users'
    },
    post_data: {
        type: String,
        default: ''
    },

    has_img: {
        type: Boolean,
        required: true,
    },
    likes: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    post_img: {
        type: String,
        default: null

    },
    isUserLiked: {
        type: Boolean,
        default: false
    },
    usersLiked: [{
        type: mongoose.Types.ObjectId,
        default: []
    }],
    created: {
        type: Number, default: Date.now
    },

}, {
    timestamps: true
});
var postSchemaModel = mongoose.model('posts', postSchema);
module.exports = {
    postSchemaModel,
}
