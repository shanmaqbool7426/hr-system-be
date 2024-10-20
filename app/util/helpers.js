const JWT = require("jsonwebtoken");
const { socket } = require('../../bin/socket')
const { origin, DEBUG, TOKENEXPIRY, REFRESHTOKENEXPIRY, REMOTEEXPIRY } = require('../util/config')
const mesages = require('../messages')
const getMessage = (res, key) => mesages[res.language][key] || key
const fs = require('fs')
const privateKey = fs.readFileSync('private_key.pem', 'utf8');


module.exports.emit = (channel, data) => socket.emit(channel, data);

module.exports.jwt = (userId, refresh = false, is_remote = false) => {
  let expiresIn = TOKENEXPIRY
  if (refresh) expiresIn = REFRESHTOKENEXPIRY
  if (is_remote) expiresIn = REMOTEEXPIRY
  return new Promise((resolve, reject) => {
    JWT.sign({ type: refresh ? 'refresh' : 'access' }, privateKey, {
      algorithm: 'RS256',
      expiresIn,
      issuer: origin,
      audience: String(userId),
    }, (err, token) => {
      if (err) return reject(err);
      return resolve(token);
    });
  });
}

module.exports.Response = (res, data = null, status = 200, message = 'success') => res.status(status).json({ data, message: getMessage(res, message) })
module.exports.BadRequest = (res, message = "Resource not found, invalid request") => this.Response(res, null, 400, message)
module.exports.NotFound = (res) => this.Response(res, null, 404, 'notFound')
module.exports.UnAuthorized = (res) => this.Response(res, null, 401, 'unauthorized')
module.exports.Forbidden = (res) => this.Response(res, null, 403, 'forbidden')

module.exports.serverError = function (res, error) {
  let data;
  let message = getMessage(res, 'Something went wrong, we are tring our best to fix it')
  if (DEBUG === true) {
    console.error(error);
    data = error
    if (error.message)
      message = error.message
  }
  return res.status(500).json({ data, message })
}
