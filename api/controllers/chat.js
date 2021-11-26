const User = require('../models/User');
const Conversation = require('../models/Conversation');

// ----------------------------------------------------------------------
const findContactByUsername = (username) => {
  const contact = contacts.find((_contact) => _contact.username === username);
  return contact || null;
};

const findConversationById = (conversationId) => {
  const conversation = conversations.find((_conversation) => _conversation._id === conversationId);
  return conversation || null;
};

const findConversationByOtherParticipantId = (participantId) => {
  const conversation = conversations.find((_conversation) => {
    if (_conversation.type !== 'ONE_TO_ONE') {
      return false;
    }
    const participant = _conversation.participants.find(
      (_participant) => _participant._id === participantId
    );
    return !!participant;
  });
  return conversation || null;
};

const findConversationByParticipantIds = (participantIds) => {
  const conversation = conversations.find((_conversation) => {
    if (_conversation.participants.length < participantIds.length) {
      return false;
    }
    const _participantIds = [];
    _conversation.participants.forEach((_participant) => {
      _participantIds.push(_participant.id);
    });

    return isEmpty(xor(participantIds, _participantIds));
  });
  return conversation || null;
};

// ----------------------------------------------------------------------

exports.contacts = async (req, res) => {
  const contacts = await User.find({
    _id: {
      $ne: req.user._id
    }
  });
  res.json({ success: true, contacts });
};

exports.search = async (req, res) => {
  const { query } = req.params;
  let results = await User.find({
    _id: {
      $ne: req.user._id
    }
  });
  if (query) {
    const cleanQuery = query.toLowerCase().trim();
    results = results.filter((contact) => contact.name.toLowerCase().includes(cleanQuery));
  }
  res.json({
    success: true,
    results
  });
};

exports.participants = async (req, res) => {
  const { conversationKey } = req.params;
  console.log(conversationKey);
  const participants = [];

  res.json({
    success: true,
    participants
  });
};

exports.conversations = async (req, res) => {
  const conversations = await Conversation.find().populate('messages');
  res.json({
    success: true,
    conversations
  });
};

exports.conversation = (req, res) => {};

exports.conversationMarkAsSeen = async (req, res) => {};

exports.newMessage = async (req, res) => {};
