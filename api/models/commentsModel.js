"use strict";
//created by Hatem Ragap
const mongoose = require('mongoose');
const Joi = require('joi');


var commentSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: 'users',
        trim: true,
    },
    user_name: {
        type: String,
        trim: true,
    },
    comment: {
        type: String,
        trim: true,
    },
    user_img: {
        type: String,
        trim: true,
    },

    post_id: {
        type: String,
        required: true,
        trim: true,
        ref: 'posts'
    },

    created: {

        type: Number, default: Date.now
    },
});
var commentSchemaModel = mongoose.model('comments', commentSchema);
module.exports = {
    commentSchemaModel,
}
