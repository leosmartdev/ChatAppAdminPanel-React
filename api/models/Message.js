const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  body: {
    type: String
  },
  contentType: {
    type: String,
    default: 'text'
  },
  attachments: [],
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
module.exports = mongoose.model('Message', MessageSchema);
