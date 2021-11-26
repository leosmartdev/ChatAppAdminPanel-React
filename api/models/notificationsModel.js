"use strict";
//created by Hatem Ragap
const mongoose = require('mongoose');


var notificationsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    userImg: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    notif_to_user: {
        type: String,
        required: true,
    },
    my_id: {
        type: String,
        required: true,
    },
    created: {
        type: Number, default: Date.now
    },

}, {
    timestamps: true
});
var notificationsSchemaModel = mongoose.model('notifications', notificationsSchema);
module.exports = {
    notificationsSchemaModel,
}
