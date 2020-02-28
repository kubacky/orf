const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  name: { type: String, requiered: true },
  ticket: { type: Schema.Types.ObjectId, ref: 'TicketType', required: true },
  role: { type: String, trim: true }, // it's turned to 'comment'
  listRef: { type: Schema.Types.ObjectId, ref: 'List' },
  status: { type: Number, required: true, default: 0 },
  alias: { type: String, required: true, trim: true },
  created: { type: Date, required: true, default: Date.now },
  updated: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Member', MemberSchema);