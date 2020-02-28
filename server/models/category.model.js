const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
  created: { type: Date, required: true, default: Date.now },
  updated: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema);