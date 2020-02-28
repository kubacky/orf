const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  type: { type: String, trim: true },
  permissions: { type: String, trim: true, default: 'user' },
  canManage: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  isAdmin: { type: Boolean, default: false },
  limit: { type: Number, default: 0 },
  agreement: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  created: { type: Date, required: true, default: Date.now },
  updated: { type: Date, required: true, default: Date.now }
});


UserSchema.statics.authenticate = function (email, password, callback) {

  // We are looking for user by mail
  this.findOne({ email: email })
    .exec(function (err, user) {

      // Callback with error if user not exists or...
      if (err || !user || !user.active) {
        return callback(err)
      }

      // compare password hashes with existing user
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback(err);
        }
      })
    });
};

// Hashing a password (bcrypt) before saving new user
UserSchema.pre('save', function (next) {
  let user = this;

  bcrypt.hash(user.password, 12, (err, hash) => {
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model('User', UserSchema);