const express = require('express');
const {
  contacts,
  search,
  participants,
  conversations,
  conversation,
  conversationMarkAsSeen,
  newMessage
} = require('../controllers/chat');
const router = express.Router();
const { verifyToken } = require('../middlewares/authHandler');

router.route('/contacts').get(verifyToken, contacts);
router.route('/search').get(verifyToken, search);
router.route('/participants').get(participants);
router.route('/conversations').get(conversations);
router.route('/conversation').get(conversation);
router.route('/conversation/mark-as-seen').get(conversationMarkAsSeen);
router.route('/messages/new').post(newMessage);

module.exports = router;
