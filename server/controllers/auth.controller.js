
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const fs = require('fs');

exports.authenticate = function (req, res) {
  User.authenticate(req.body.email, req.body.password, (err, user) => {

    // Show error message
    if (err || !user) {
      const response = {
        status: 'ERROR',
        title: 'Nieprawidłowy email lub hasło',
        message: 'Wrong email or password'
      };
      res.json(response);
      return false;
    }
    else {
      const RSA_PRIVATE_KEY = fs.readFileSync('./private/jwtRS256.key');

      const userData = {
        name: user.name,
        mail: user.mail,
        company: user.company,
        type: user.type,
        limit: user.limit,
        permissions: user.permissions
      }

      const jwtToken = jwt.sign(userData, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: 432000,
        subject: user.id
      });
      res.json({ token: jwtToken, expiresIn: 432000 });
    }
  })
}