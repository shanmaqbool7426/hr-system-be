const JWT = require("jsonwebtoken");
const { socket } = require('../../bin/socket')
const { origin, DEBUG, TOKENEXPIRY, REFRESHTOKENEXPIRY, JWT_SECRET } = require('../util/config')
const mesages = require('../messages')
const getMessage = (res, key) => mesages[res.language][key] || key

module.exports.emit = (channel, data) => socket.emit(channel, data);

module.exports.jwt = (userId, refresh = false) => {
    return new Promise((resolve, reject) => {
        JWT.sign({}, JWT_SECRET, {
            expiresIn: refresh ? REFRESHTOKENEXPIRY : TOKENEXPIRY,
            issuer: origin,
            audience: String(userId),
        }, (err, token) => {
            if (err) return reject(err);
            return resolve(token);
        });
    });
}

module.exports.Response = (res, data = null, status = 200, message = 'success') => res.status(status).json({ data, message: getMessage(res, message) })
module.exports.BadRequest = (res, message) => this.Response(res, null, 400, message)
module.exports.NotFound = (res) => this.Response(res, null, 404, 'notFound')
module.exports.UnAuthorized = (res) => this.Response(res, null, 401, 'unauthorized')
module.exports.Forbidden = (res) => this.Response(res, null, 403, 'forbidden')

module.exports.serverError = function (res, error) {
    let data;
    let message = getMessage(res, 'serverError')
    if (DEBUG === true) {
        console.error(error);
        data = error
        if (error.message)
            message = error.message
    }
    return res.status(500).json({ data, message })
}