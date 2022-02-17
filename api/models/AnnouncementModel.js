"use strict";
//created by Hatem Ragap
const mongoose = require("mongoose");

const announcementSchema = mongoose.Schema({
  message: {
    type: String,
    default: ""
  },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  sender_name: { type: String },
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
  is_admin_announcement: {
    type: Boolean,
    default: false
  },
  announcement_email: {
    type: String,
    default: null
  },
  createdAt: {
    type: Number,
    default: Date.now
  }
});

const AnnouncementSchemaModel = mongoose.model(
  "announcements",
  announcementSchema
);
module.exports = {
  AnnouncementSchemaModel
};
