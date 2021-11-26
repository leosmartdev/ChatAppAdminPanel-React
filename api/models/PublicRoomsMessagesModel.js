"use strict";
//created by Hatem Ragap
const mongoose = require("mongoose");

// message type 0 mean is only String in flutter ignore img field
// message type 1  mean is only Img in flutter ignore message field
const messageSchema = mongoose.Schema({
  message: {
    type: String,
    default: ""
  },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  sender_name: { type: String },
  img: { type: String },
  imgs: { type: Array },
  room_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  top: {
    type: Boolean,
    default: false
  },
  top_set_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    default: null
  },
  top_set_time: {
    type: Number,
    default: Date.now
  },
  createdAt: {
    type: Number,
    default: Date.now
  }
});

const PublicRoomMessageSchemaModel = mongoose.model(
  "publicRoomMessages",
  messageSchema
);
module.exports = {
  PublicRoomMessageSchemaModel
};
