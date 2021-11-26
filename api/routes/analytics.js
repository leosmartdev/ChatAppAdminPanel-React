const express = require('express');
const router = express.Router();
const User = require('../models/User');
const gplay = require('google-play-scraper');

router.get('/', async (req, res) => {
  const total_user = await User.find({status: "active"}).count();
  const registered_user = await User.count();
  const online_visitor = await User.find({online: true}).count();
  const statistics = await gplay.app({ appId: 'com.google.android.apps.translate' });

  res.json({
    total_user,
    registered_user,
    online_visitor,
    statistics
  });
});

module.exports = router;
