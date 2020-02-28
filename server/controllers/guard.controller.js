const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.loginRequired = function (req, res, next) {
  if (req.headers && req.headers['authorization']) {
    const tokenHeader = req.headers['authorization'].split(' ');
    const token = tokenHeader[1];
    const RSA_PRIVATE_KEY = fs.readFileSync('./private/jwtRS256.key.pub');

    jwt.verify(token, RSA_PRIVATE_KEY, (err, decoded) => {
      if (err) {
        req.user = undefined;
        res.sendStatus(401);
        return false;
      }
      req.user = decoded;
      next();
      return true;
    });
  }
  else {
    req.user = undefined;
    res.sendStatus(401);
    return false;
  }
};

exports.isAdmin = function (req, res, next) {
  if (req.user !== undefined && req.user.permissions === 'admin') {
    next();
    return true;
  }
  return false;
}

exports.isModerator = function (req, res, next) {
  if (req.user !== undefined && req.user.permissions === 'moderator' || req.user !== undefined && req.user.permissions === 'admin') {
    next();
    return true;
  }
  return false;
}