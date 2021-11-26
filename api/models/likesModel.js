"use strict";
//created by Hatem Ragap
const mongoose = require('mongoose');
const Joi = require('joi');

var likeSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: 'users',
        trim: true,
    },
    post_id: {
        type: String,
        required: true,
        trim: true,
        ref: 'posts'
    },

    created: {
        type: Number,
        default: Math.floor(Date.now() / 1000)
    },
});

var likeSchemaModel = mongoose.model('likes', likeSchema);
module.exports = {
    likeSchemaModel,
}