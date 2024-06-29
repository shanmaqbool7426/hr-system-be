const JWT = require("jsonwebtoken");
const { UnAuthorized, Forbidden } = require('../util/helpers')
const { JWT_SECRET, USER_FIELDS } = require('../util/config')
const User = require('../models/user')
const Role = require('../models/role')
const UserDevice = require('../models/userdevice')


const validateRole = async (req, res, next, user) => {
    const module = req.baseUrl.replace('/api/', '')
    const right = req.path.split('/').filter((value) => value != "")[0]
    // console.log(module, right);
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
        JWT.verify(token, JWT_SECRET, async (err, payload) => {
            if (err) {
                return UnAuthorized(res);
            }
            const device = await UserDevice.findOne({ token: token })
            if (payload.aud !== device?.user?.toString()) {
                return UnAuthorized(res);
            }
            const user = await User.findById(device.user).populate('company');
            if (!user) {
                return UnAuthorized(res)
            }
            req.payload = { user: { ...user.toObject() } }
            return await validateRole(req, res, next, user)
        })
    }
    verifyRefreshToken(req, res, next) {
        const token = req.headers["Authorization"] || req.headers["authorization"]
        if (!token) {
            return UnAuthorized(res);
        }
        JWT.verify(token, JWT_SECRET, async (err, payload) => {
            if (err) {
                return UnAuthorized(res);
            }
            const device = await UserDevice.findOne({ refreshToken: token })
            if (payload.aud !== device?.user?.toString()) {
                return UnAuthorized(res);
            }
            const user = await User.findById(device.user);
            if (!user) {
                return UnAuthorized(res)
            }
            req.payload = { user: user.toObject(), device: device.toObject() }

            next()
        })
    }

}
module.exports = new Middlewares