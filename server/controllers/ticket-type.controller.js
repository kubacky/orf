const TicketType = require('../models/ticket-type.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

exports.getAll = function (req, res) {
  if (isModerator(req)) {
    User.findById(req.user.sub, (err, doc) => {
      const query = { active: true };
      const orQuery = [];

      doc.canManage.forEach((catId) => {
        orQuery.push({'for': catId});
      });
      query.$or = orQuery;

      getParsed(req, res, query);
    })
  }
  else {
    getParsed(req, res, { active: true })
  }
}

const getParsed = function (req, res, query) {
  TicketType.find(query)
    .populate('for')
    .exec((err, docs) => {
      if (err) {
        res.sendStatus(500);
        return false;
      }
      res.json(docs);
    });
}

exports.get = function (req, res) {
  TicketType.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    }
    else {
      res.sendStatus(500);
    }
  });
}

exports.getType = function (req, res) {
  const query = {
    'active': true
  };
  query['for.' + req.params.type] = true;

  getTicketType(query, res);
}

exports.getForUser = function (req, res) {
  const userType = req.user.type;
  req.params.type = userType;

  exports.getType(req, res);
}

exports.create = function (req, res) {
  const prepTicket = prepareTicket(req);
  const ticket = new TicketType(prepTicket);

  ticket.save((err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
    res.json(doc);
  })
}

exports.update = function (req, res) {
  const ticket = { name: req.body.name };
  const tId = req.params.id;

  updateTicket(tId, ticket, res);
  sendResult(true, res);
}

exports.updateValue = function (req, res) {

  const assoc = req.body;
  const newAssoc = [];

  assoc.forEach((cat) => {
    if (cat.value) {
      newAssoc.push(new mongoose.Types.ObjectId(cat.id))
    }
  })

  updateTicket(req.params.id, { for: newAssoc }, res);
  sendResult(true, res);
}

exports.delete = function (req, res) {
  const tId = req.params.id;
  const ticket = { active: false };

  const result = updateTicket(tId, ticket, res);
  sendResult(true, res);
}

const updateTicket = function (tId, ticket, res) {
  TicketType.findByIdAndUpdate(tId, ticket, (err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
  })
}

const getTicketType = function (query, res) {
  TicketType.find(query, (err, docs) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
    res.json(docs);
  });
}

const sendResult = function (result, res) {
  if (result) {
    res.json({ status: 'OK', message: 'Zaktulizowano dane' });
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

const prepareTicket = function (req) {
  const assoc = [];
  const keys = Object.keys(req.body.for);

  keys.forEach((key) => {
    if (req.body.for[key]) {

      assoc.push(new mongoose.Types.ObjectId(key));
    }
  })
  return ticket = {
    name: req.body.name,
    for: assoc
  };
}

const isAdmin = function (req) {
  return req.user !== undefined && req.user.permissions === 'admin'
}

const isModerator = function (req) {
  return req.user !== undefined && req.user.permissions === 'moderator'
}
