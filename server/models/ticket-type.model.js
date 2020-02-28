const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketTypeSchema = new Schema({
  name: { type: String, required: true, trim: true },
  active: { type: Boolean, required: true, default: true },
  for: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  created: { type: Date, required: true, default: Date.now },
  updated: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('TicketType', TicketTypeSchema);