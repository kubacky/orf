const User = require('../models/user.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

exports.getAll = function (req, res) {
  User.find({}, (err, docs) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
    res.json(docs);
  });
}

exports.get = function (req, res) {
  User.findById(req.params.id)
    .populate('canManage')
    .exec((err, doc) => {
      if (err) {
        res.sendStatus(500);
        return false;
      }
      res.json(doc);
    })
}

exports.getCurrent = function (req, res) {
  req.params.id = req.user.sub;
  exports.get(req, res);
}

exports.create = function (req, res) {
  agreement = req.body.agreement;

  if (!agreement) {
    return false;
  }

  const password = comparePasswords(req, res);

  if (password) {
    const prepUser = prepareUser(req, password);
    const user = new User(prepUser);

    user.save((err) => {
      if (err) {
        response = {
          status: 'ERROR',
          title: 'Coś poszło nie tak :/',
          message: 'Something went wrong :/'
        };
        res.json(response);
        return false;
      }
      else {
        res.json({ status: 'OK', message: 'Dodano użytkownika' });
      }
    })
  }
}

exports.update = function (req, res) {
  const password = comparePasswords(req, res);
  const user = prepareUser(req, password);
  const uId = req.params.id;

  if (password) {
    bcrypt.hash(password, 12, (err, hash) => {
      user.password = hash;
      updateUser(uId, user, res);
    });
  }
  else {
    updateUser(uId, user, res);
  }
  sendResult(true, res);
}

exports.updateCurrent = function (req, res) {
  const password = comparePasswords(req, res);
  const user = ({
    name: req.body.name,
    email: req.body.email
  });
  const uId = req.user.sub;

  if (password) {
    bcrypt.hash(password, 12, (err, hash) => {
      user.password = hash;
      updateUser(uId, user, res);
    });
  }
  else {
    updateUser(uId, user, res);
  }
  sendResult(true, res);
}

exports.delete = function (req, res) {
  const uId = req.params.id;

  const result = deleteOne(req, res, uId);
  sendResult(true, res);
}

exports.deleteMany = function (req, res) {
  const uIds = splitToken(req);
  let result = false;

  uIds.forEach((uId) => {
    result = deleteOne(req, res, uId);
  });

  sendResult(true, res);
}

exports.activateMany = function (req, res) {
  const uIds = splitToken(req);

  uIds.forEach((uId) => {
    const user = { active: true }

    updateUser(uId, user, res);
  });
  sendResult(true, res);
}


const deleteOne = function (req, res, id) {

  User.findByIdAndRemove(id, (err) => {
    if (err) {
      sendStatus(false, res);
      return false;
    }
  });
}

const updateUser = function (uId, user, res) {
  User.findByIdAndUpdate(uId, user, (err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
    else {
      return true;
    }
  })
}

const sendResult = function (result, res) {
  if (result) {
    res.json({ status: 'OK', message: { pl: 'Zaktulizowano', en: 'Data has been updated' } });
    return true;
  }
  else {
    res.sendStatus(500);
  }
}

const splitToken = function (req) {
  const token = req.params.token;
  return token.split('_');
}

const comparePasswords = function (req, res) {
  pass = req.body.password;
  confirmPass = req.body.confirmPassword;

  if (pass === confirmPass) {
    return pass;
  }
  else {
    res.json({ status: "ERROR", message: 'Hasła nie sa takie same' });
    return false;
  }
}

const prepareUser = function (req, password) {
  const user = ({
    name: req.body.name,
    email: req.body.email,
    company: req.body.company,
    agreement: req.body.agreement,
    type: req.body.type,
    active: false,
    permissions: 'user'
  });

  if (isAdmin(req)) {
    user.limit = req.body.limit;
    user.permissions = req.body.permissions;
    user.active = req.body.active;
  }

  if (isAdmin(req) && user.permissions !== 'user') {
    user.company = 'Obsługa festiwalu';
    user.type = 'operator';
  }

  if (isAdmin(req) && user.permissions === 'moderator') {
    const assoc = [];
    const keys = Object.keys(req.body.canManage);

    keys.forEach((key) => {
      if (req.body.canManage[key]) {

        assoc.push(new mongoose.Types.ObjectId(key));
      }
    })
    user.canManage = assoc;
  }

  if (password) {
    user.password = password;
  }
  return user;
}

const isAdmin = function (req) {
  return req.user !== undefined && req.user.permissions === 'admin'
}

const isCurrentlyLoggedIn = function (uId) {
  return uId === req.user.sub;
}