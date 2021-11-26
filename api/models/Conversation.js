const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  type: {
    type: String,
    default: 'ONE_TO_ONE'
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }
  ]
});

module.exports = mongoose.model('Conversation', ConversationSchema);
