const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: null
  },
  username: String,
  password: {
    type: String,
    required: true
  },
  phoneNumber: String,
  password: String,
  role: {
    type: String,
    default: 'user'
  },
  avatarUrl: {
    type: String,
    default: null
  },
  address: String,
  zipCode: String,
  country: String,
  state: String,
  city: String,
  status: {
    type: String,
    default: 'active'
  },
  online: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', UserSchema);
