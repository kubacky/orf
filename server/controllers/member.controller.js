const Member = require('../models/member.model');
const List = require('../models/list.model');
const Ticket = require('../models/ticket-type.model');
const Operation = require('../models/operation.model');
const mongoose = require('mongoose');

exports.getAll = function (req, res) {
  Member.find({}, 'id status name role list.name')
    .populate('ticket', 'name')
    .populate('listRef')
    .exec((err, docs) => {
      if (err) {
        res.sendStatus(500);
        return false;
      }
      returnParsedMembers(req, res, docs);
    });
}

exports.parseTicket = function (req, res) {
  Member.find({}, (err, docs) => {
    docs.forEach(member => {
      Ticket.findOne({ name: member.ticketType }, (er, tick) => {
        if (tick) {
          const tId = new mongoose.Types.ObjectId(tick._id);
          Member.findByIdAndUpdate(member._id, { ticket: tId }, (e, u) => { })
        }
      })
    })
  })
}

exports.parseDate = function (req, res) {
  Member.find({}, (err, docs) => {
    docs.forEach(member => {
      if (member.status === 2) {
        const today = new Date("2018-07-05T12:00:00.000Z");
        Member.findByIdAndUpdate(member._id, { $set: { updated: today } }, (e, d) => { })
      }
    })
  })
}

exports.parseList = function (req, res) {
  List.find({})
    .populate('members')
    .exec((e, lists) => {
      if (lists) {
        lists.forEach(list => {
          list.members.forEach(member => {
            const lId = new mongoose.Types.ObjectId(list._id);
            Member.findByIdAndUpdate(member._id, { $set: { listRef: lId } }, (e, d) => { })
          })
        })
      }
    })
}

exports.parseAlias = function (req, res) {
  List.find({})
    .populate('members')
    .exec((e, lists) => {
      if (lists) {
        lists.forEach(list => {
          list.members.forEach(member => {
            Member.findByIdAndUpdate(member._id, { $set: { alias: getMemberAlias(member, list.owner.company) } }, (e, d) => { })
          })
        })
      }
    })
}

const getMemberAlias = function (member, listName) {
  let m = member.name + member.role + listName;
  return m.replace(/ /g, '').toLowerCase();
}

const returnParsedMembers = function (req, res, members) {
  const toReturn = [];

  members.forEach((member) => {
    if (member.ticket === undefined || member.listRef === null) {
      //console.log(member);
    }
    else {
      const m = {
        _id: member._id,
        name: member.name,
        role: member.role,
        ticket: member.ticket.name,
        status: member.status,
        list: member.listRef.owner.company
      }
      toReturn.push(m);
    }
  })
  res.json(toReturn);
}

exports.get = function (req, res) {
  Member.findById(req.params.id, (err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
    res.json(doc);
  });
}

exports.summary = function (req, res) {
  Operation.find({})
    .populate({
      path: 'member',
      model: 'Member',
      select: '',
      populate: {
        path: 'ticket',
        model: 'TicketType'
      }
    })
    .exec((err, docs) => {
      if (err) {
        res.sendStatus(500);
        return false;
      }
      console.log(req.user);
      res.json(docs);
    })
}

const splitUsers = function (docs, res) {
  const users = [];

  docs.forEach(doc => {
    const index = users.findIndex(u => u._id === doc._id);


  })
  res.json(docs);
}

exports.getMembersForList = function (listId) {
  const query = {};
  query['list.id'] = listId;

  let toReturn = false;

  const result = Member.find(query, (err, docs) => {
    if (docs) { }
  });
}

exports.activateMany = function (req, res) {
  const mIds = splitToken(req);

  mIds.forEach((mId) => {
    const member = { status: 1, updated: new Date() }

    updateMember(mId, member, res);
    saveOperation(req, res, mId, 1);
  });
  res.json({ status: 'OK' });
}

exports.deactivateMany = function (req, res) {
  const mIds = splitToken(req);

  mIds.forEach((mId) => {
    const member = { status: 9, updated: new Date() }

    updateMember(mId, member, res);
  });
  res.json({ status: 'OK' });
}

exports.issuingMany = function (req, res) {
  const mIds = splitToken(req);

  mIds.forEach((mId) => {
    const member = { status: 2, updated: new Date() }

    Member.findById(mId, (err, doc) => {
      if (err) {
        res.sendStatus(500);
        return false;
      }
      if (doc.status === 1) {
        updateMember(mId, member, res);
        saveOperation(req, res, mId, 2);
      }
    })
  });
  res.json({ status: 'OK' });
}

exports.returnMany = function (req, res) {
  const mIds = splitToken(req);

  mIds.forEach((mId) => {
    const member = { status: 1, updated: new Date() }

    Member.findById(mId, (err, doc) => {
      if (err) {
        res.sendStatus(500);
        return false;
      }
      if (doc.status === 2) {
        updateMember(mId, member, res);
        saveOperation(req, res, mId, 1);
      }
    })
  });
  res.json({ status: 'OK' });
}

exports.getType = function (req, res) {
  const query = {
    'active': true
  };
  query['for.' + req.params.type] = true;

  getMember(query, res);
}

exports.getForUser = function (req, res) {
  const userType = req.user.type;
  req.params.type = userType;

  exports.getType(req, res);
}

exports.find = function (req, res) {
  Member.find({ alias: new RegExp('^' + req.body.query + '$', "i") }, 'id status name role list.name')
    .populate('ticket', 'name')
    .populate('listRef')
    .exec((err, docs) => {
      if (err) {
        res.sendStatus(500);
        return false;
      }
      returnParsedMembers(req, res, docs);
    });
}

exports.assignMembers = function (req, res, members, list) {
  members.forEach((member) => {
    const memberSchema = {
      name: member.name,
      ticketType: member.type,
      role: member.role,
      list: {
        id: list.id,
        name: list.owner.company
      },
      status: 0
    }

    if (isAdmin(req)) {
      memberSchema.status = 1;
    }

    const memberModel = new Member(memberSchema);
    memberModel.save((err, doc) => {
      if (err) {
        this.sendStatus(500);
        return false;
      }
    });
  });

}

exports.update = function (req, res) {
  const member = { name: req.body.name };
  const lId = req.params.id;

  updateMember(lId, member, res);
  sendResult(true, res);
}

exports.delete = function (req, res) {
  const lId = req.params.id;
  const member = { active: false };

  const result = updateMember(lId, member, res);
  sendResult(true, res);
}

exports.deleteMany = function (req, res) {

  if (isAdmin(req)) {
    const mIds = splitToken(req);
    mIds.forEach((mId) => {
      deleteOne(req, res, mId);
    });
    res.json({ status: 'OK' });
  }
}

const deleteOne = function (req, res, id) {

  Member.findByIdAndRemove(id, (err) => {
    if (err) {
      res.sendStatus(500);
      return false
    }
  })
}

const saveOperation = function (req, res, memberId, status) {
  const operation = new Operation({
    user: new mongoose.Types.ObjectId(req.user.sub),
    member: new mongoose.Types.ObjectId(memberId),
    status: status
  });

  operation.save((err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false;
    }
  })
}
const updateMember = function (mId, member, res) {
  Member.findByIdAndUpdate(mId, member, (err, doc) => {
    if (err) {
      res.sendStatus(500);
      return false
    }
  })
}

const getMember = function (query, res) {
  Member.find(query, (err, docs) => {
    if (err) {
      sendStatus(false, res);
      return false;
    }
    res.json(docs);
  });
}

const sendResult = function (result, res) {
  if (result) {
    res.json({ status: 'OK', message: 'Zapisano memberę' });
    return true;
  }
  else {
    res.sendStatus(500);
  }
}

const splitToken = function (req) {
  const token = req.body.token;
  return token.split('_');
}

const isAdmin = function (req) {
  return req.user !== undefined && req.user.permissions === 'admin'
}