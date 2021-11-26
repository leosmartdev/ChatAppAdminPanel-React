const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String
});

module.exports = mongoose.model('Page', PageSchema);