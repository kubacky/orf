const List = require('../models/list.model');
const Member = require('../models/member.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const memberController = require('./member.controller');

exports.getAll = function (req, res) {
  const query = {};

  if (isModerator(req)) {

    User.findById(req.user.sub, (err, doc) => {
      const orQuery = [];

      doc.canManage.forEach((catId) => {
        orQuery.push({ 'type': catId });
      })

      getParsed(req, res, { $or: orQuery });
    })
  }
  else if (isAdmin(req)) {
    getParsed(req, res, query);
  }
  else {
    res.sendStatus(500);
  }
}

const getParsed = function (req, res, query) {
  List.find(query)
    .populate('members')
    .populate('type')
    .exec((err, docs) => {
      if (err) {
        res.sendStatus(500)
      }
      sendParsedLists(req, res, docs);
    });
}

exports.get = function (req, res) {
  List.findById(req.params.id)
    .populate({
      path: 'members',
      populate: {
        path: 'listRef',
        model: 'List'
      }
    })
    .populate({
      path: 'members',
      populate: {
        path: 'ticket',
        model: 'TicketType'
      }
    })
    .populate('type')
    .exec((err, docs) => {
      if (err) {
        res.sendStatus(500);
        return false;
      }
      res.json(docs);
    })
}

exports.getForUser = function (req, res) {
  const query = {};
  query['owner.id'] = req.user.sub;

  List.findOne(query)
    .populate('members')
    .populate('type')
    .exec((err, doc) => {
      if (err) {
        res.sendStatus(500);
        return false;
      }
      res.json(doc)
    });
}

exports.create = function (req, res) {

  //schema dla nowej listy
  const prepList = prepareList(req);
  prepList._id = new mongoose.Types.ObjectId();

  const list = new List(prepList);

  if (req.user.imit > 0 && req.body.members.length > req.user.limit) {
    res.sendStatus(500);
    return false;
  }

  list.save((err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
    assignMembers(req, res, prepList._id, prepList.owner.company);
  });
}

/*
exports.parse = function (req, res) {
  var fs = require('fs');
  var parse = require('csv-parse');

  const l = {
    owner: {
      id: '5b290416cd80c02946eda0bc',
      name: 'Artur Kubacki',
      company: 'Akredytacje'
    },
    type: new mongoose.Types.ObjectId('5b32da6abd44e622201d88e8'),
    agreement: true,
    active: true,
  };
  l._id = new mongoose.Types.ObjectId();

  const list = new List(l);
  list.save((err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
    else {
      var members = [];

      fs.createReadStream('./server/controllers/akr.csv')
        .pipe(parse({ delimiter: ',' }))
        .on('data', function (row) {
          //do something with csvrow
          // 0 - type 1 - name 3 - info
          const memberSchema = new Member({
            name: row[1],
            ticketType: row[0],
            role: row[2],
            list: {
              id: l._id,
              name: 'Akredytacje'
            },
            status: 1
          });
          memberSchema._id = new mongoose.Types.ObjectId();

          memberSchema.save((err, doc) => {
            if (err) {
              res.sendStatus(500);
              return false;
            }
            else {
              members.push(memberSchema._id);
              updateMembersAndReturn(req, res, members, l._id);
            }
          });
        });
    }
  });
}
*/

exports.update = function (req, res) {
  const lId = new mongoose.Types.ObjectId(req.params.id);
  const prepList = prepareList(req, res);

  updateListData(res, prepList, lId);
  const members = [];

  req.body.members.forEach((member) => {
    if (!member.id) {
      const memId = createMember(member, lId, prepList.owner.company, req, res);
      members.push(memId);
    }
    else {
      updateMember(req, res, member, lId);
      members.push(member.id);
    }
  })

  if (req.body.removed.length > 0) {
    deleteMembers(req.body.removed, res);
  }

  updateMembersAndReturn(req, res, members, lId);
}

const updateListData = function (res, list, listId) {
  List.findByIdAndUpdate(listId, { $set: list }, (err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
  })
}

exports.markAsRead = function (req, res) {
  const lId = req.params.id;

  const list = { active: true }

  List.findByIdAndUpdate(lId, list, (err, doc) => {
    if (err) {
      res.sendResult(500);
      return false;
    }
  })
  res.json({ status: 'OK' });
}

exports.delete = function (req, res) {
  const lId = req.params.id;
  const list = { active: false };

  const result = updateList(lId, list, res);
  sendResult(true, res);
}

exports.deleteMany = function (req, res) {
  const uIds = splitToken(req);

  uIds.forEach((uId) => {
    deleteOne(req, res, uId);
  });

  sendResult(true, res);
}

exports.activateMany = function (req, res) {
  const lIds = splitToken(req);

  lIds.forEach((lId) => {
    const list = { active: true }

    List.findByIdAndUpdate(lId, list, (err, doc) => {
      if (err) {
        res.sendStatus(500);
        return false;
      }
    })

    List.findById(lId)
      .populate('members')
      .exec((err, doc) => {
        acceptMembers(req, res, doc.members);
      });
  });

  res.json({ status: 'OK' })
}

const sendParsedLists = function (req, res, lists) {
  const parsed = [];

  lists.forEach((list) => {
    const l = {
      _id: list._id,
      name: list.owner.company,
      owner: list.owner.name,
      ownerId: list.owner.id,
      type: false,
      active: list.active,
      members: list.members
    }

    if (list.type !== undefined) {
      l.type = list.type.name;
      l.typeId = list.type._id;
    }

    parsed.push(l);
  });

  res.json(parsed);
}

const assignMembers = function (req, res, listId, listName) {

  if (req.user.limit > 0 && req.body.members.length > req.user.limit) {
    res.sendStatus(500);
    return false;
  }

  const members = [];

  req.body.members.forEach((mem) => {
    const memId = createMember(mem, listId, listName, req, res);
    members.push(memId);
  });

  updateMembersAndReturn(req, res, members, listId);
}

const updateMembersAndReturn = function (req, res, members, listId) {
  List.findByIdAndUpdate(listId.toString(), { $set: { 'members': members } }, (err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }

    req.params.id = listId;
    module.exports.get(req, res);
  });
}

const createMember = function (member, listId, listName, req, res) {
  const memberSchema = new Member({
    name: member.name,
    ticket: new mongoose.Types.ObjectId(member.ticket),
    role: member.role,
    listRef: new mongoose.Types.ObjectId(listId),
    status: member.status,
    alias: getMemberAlias(member, listName)
  });

  if (isAdmin(req)) {
    memberSchema.status = 1;
  }
  memberSchema._id = new mongoose.Types.ObjectId();

  memberSchema.save((err, doc) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return false;
    }
  });

  return memberSchema._id;
}

const getMemberAlias = function (member, listName) {
  let m = member.name + member.role + listName;
  return m.replace(/ /g, '').toLowerCase();
}

const updateMember = function (req, res, member, listId, listName) {

  const m = {
    name: member.name,
    ticket: new mongoose.Types.ObjectId(member.ticket),
    role: member.role,
    listRef: new mongoose.Types.ObjectId(listId),
    status: member.status,
    alias: getMemberAlias(member, listName)
  }

  Member.findByIdAndUpdate(member.id, m, (err) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
  })
}

const deleteOne = function (req, res, lId) {

  List.findByIdAndRemove(lId, (err) => {
    if (err) {
      res.sendStatus(500);
      return false
    }
  })

  const query = {
    status: { $ne: 2 },
    listRef: new mongoose.Types.ObjectId(lId)
  };


  Member.deleteMany(query, (err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false
    }
  });
}

const updateList = function (lId, List, res) {
  List.findByIdAndUpdate(lId, List, (err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false
    }
  })
}

const acceptMembers = function (req, res, members) {
  members.forEach((member) => {
    const update = { status: 1 }
    const query = {
      _id: member._id,
      status: { $ne: 2 }
    }

    Member.findOneAndUpdate(query, update, (err, doc) => {
      if (err) {
        res.sendStatus(500);
        return false;
      }
    })
  });
}

const sendResult = function (result, res) {
  if (result) {
    res.json({ status: 'OK', message: 'Zapisano listę' });
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

const prepareList = function (req) {
  const list = {
    owner: {
      id: req.user.sub,
      name: req.user.name,
      company: req.user.company
    },
    type: new mongoose.Types.ObjectId(req.body.type),
    agreement: req.body.agreement,
    active: false,
  };

  if (isAdmin(req)) {
    list.active = true;
    list.agreement = true;
    list.owner.company = req.body.name;
  }

  if (isModerator(req)) {
    list.active = true;
    list.owner.company = req.body.name;
  }

  return list;
}

const deleteMembers = function (token, res) {

  const mIds = token.split('_');

  mIds.forEach((mId) => {
    Member.findByIdAndRemove(mId, (err) => {
      if (err) {
        res.sendStatus(500);
        return false;
      }
    })
  })
}

const isAdmin = function (req) {
  return req.user !== undefined && req.user.permissions === 'admin'
}

const isModerator = function (req) {
  return req.user !== undefined && req.user.permissions === 'moderator'
}
