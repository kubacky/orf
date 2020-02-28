const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  owner: {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true }
  },
  active: { type: Boolean, required: true, default: false },
  agreement: { type: Boolean, required: true, default: false },
  comment: { type: String, trim: true },
  type: { type: Schema.Types.ObjectId, ref: 'Category' },
  members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  created: { type: Date, required: true, default: Date.now },
  updated: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('List', ListSchema);