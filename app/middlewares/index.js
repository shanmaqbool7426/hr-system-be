const JWT = require("jsonwebtoken");
const { UnAuthorized, Forbidden } = require('../util/helpers')
const { JWT_SECRET, origin } = require('../util/config')
const User = require('../models/user')
const Role = require('../models/role')
const fs = require('fs')
const publicKey = fs.readFileSync('public_key.pem');


const validateRole = async (req, res, next, user) => {
  return next()
  const module = req.baseUrl.replace('/api/', '')
  const right = req.path.split('/').filter((value) => value != "")[0]
  const role = await Role.findById(user.role)
  if (!role)
    return Forbidden(res)

  if (role.rights === 'admin')
    return next()
  // TODO: implement rights logic and test it
  if (role.rights[module][right] === true)
    return next()
  return Forbidden(res)
}

class Middlewares {
  verifyToken(req, res, next) {
    const token = req.headers["Authorization"] || req.headers["authorization"]
    if (!token) {
      return UnAuthorized(res);
    }
    JWT.verify(token, publicKey, { algorithms: ['RS256'] }, async (err, payload) => {
      if (err) {
        return UnAuthorized(res);
      }
      if (payload.type !== 'access' || payload.iss !== origin) {
        return UnAuthorized(res);
      }
      const user = await User.findById(payload.aud).populate('company').populate('role');
      if (!user) {
        return UnAuthorized(res)
      }
      req.payload = { user: user.toObject() }
      return await validateRole(req, res, next, user)
    })
  }
  verifyRefreshToken(req, res, next) {
    const token = req.headers["Authorization"] || req.headers["authorization"]
    if (!token) {
      return UnAuthorized(res);
    }
    JWT.verify(token, publicKey, { algorithms: ['RS256'] }, async (err, payload) => {
      if (err) {
        return UnAuthorized(res);
      }
      if (payload.type !== 'refresh' || payload.iss !== origin) {
        return UnAuthorized(res);
      }
      const user = await User.findById(payload.aud);
      if (!user) {
        return UnAuthorized(res)
      }
      req.payload = { user: user.toObject() }
      next()
    })
  }

}
module.exports = new Middlewares
