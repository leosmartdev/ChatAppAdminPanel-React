const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSpecialPermissionSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  user_email: {
    type: String,
    default: null
  },
  max_coverage: {
    type: Number,
    default: null
  },
  top_message_max_num: {
    type: Number,
    default: null
  },
  effect_year: {
    type: Number,
    default: null
  },
  effect_month: {
    type: Number,
    default: null
  },
  effect_day: {
    type: Number,
    default: null
  },
  valid_period: {
    type: Number,
    default: null
  },
  effect_time: {
    type: Number,
    default: 0
  },
  expire_time: {
    type: Number,
    default: 0
  }
});

var UserSpecialPermssionSchemaModel = mongoose.model('userSpecialPermssion', UserSpecialPermissionSchema);

module.exports = {
  UserSpecialPermssionSchemaModel,
}
