const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberSchema = require('./member.model');
const UserSchema = require('./user.model');

const Category = new CategorySchema();
const Member = new MemberSchema();

const EventSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: string, required: true, trim: true }, //created, updated, deleted, logged in
  destiny: { type: string, required: true, trim: true }, //tickets, users, members...
  data: { type: JSON, required: true},
  created: { type: Date, required: true, default: Date.now },
  updated: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);