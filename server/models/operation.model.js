const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OperationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  member: { type: Schema.Types.ObjectId, ref: 'Member' },
  status: { type: Number, required: true },
  created: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Operation', OperationSchema);