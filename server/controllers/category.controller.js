const Category = require('../models/category.model');
const mongoose = require('mongoose');
const User = require('../models/user.model');

exports.getAll = function (req, res) {

  if (isModerator(req)) {
    User.findById(req.user.sub, (err, doc) => {
      const query = { active: true };
      const orQuery = [];

      doc.canManage.forEach((catId) => {
        orQuery.push({ '_id': catId });
      });
      query.$or = orQuery;

      getParsed(req, res, query);
    })
  }
  else {
    getParsed(req, res, { active: true });
  }
}

const getParsed = function (req, res, query) {
  Category.find(query, '_id name icon', (err, docs) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
    res.json(docs);
  })
}

exports.get = function (req, res) {
  Category.findById(req.params.id, (err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
    res.json(doc);
  })
}

exports.create = function (req, res) {
  const prep = prepare(req);
  const Cat = new Category(prep);

  Cat.save((err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
    res.json(doc);
  })
}

exports.update = function (req, res) {
  const prep = prepare(req);
  update(res, req.params.id, prep);
}

exports.delete = function (req, res) {
  const cat = {
    active: false
  }
  update(res, req.params.id, cat);
}

const update = function (res, catId, update) {
  Category.findByIdAndUpdate(catId, { $set: update }, (err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
    res.json(doc);
  })
}

const prepare = function (req) {
  return cat = {
    name: req.body.name,
    icon: req.body.icon
  }
}

const isAdmin = function (req) {
  return req.user !== undefined && req.user.permissions === 'admin'
}

const isModerator = function (req) {
  return req.user !== undefined && req.user.permissions === 'moderator'
}
