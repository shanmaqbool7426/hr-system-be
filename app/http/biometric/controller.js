const { Response, BadRequest, serverError } = require('../../util/helpers')
const BiometricDevice = require('../../models/biometric_device')
const service = require('./service')
class BiometricController {
    async list(req, res) {
        try {
            const { user } = req.payload
            let list = await BiometricDevice.find({ company: user.company._id })
                .populate('station')

            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const { user } = req.payload
            const data = req.body

            let device = await BiometricDevice.create({
                ipAddress: data.ipAddress,
                station: data.station,
                port: data.port,
                company: user.company._id
            })
            device = await BiometricDevice.findById(device._id).populate('station')
            return Response(res, { device })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let device = await BiometricDevice.findOne({ _id: id, company: user.company._id })
            if (!device) {
                return BadRequest(res, 'deviceNotFound')
            }
            device.ipAddress = data.ipAddress
            device.port = data.port
            device.station = data.station
            await device.save()
            device = await BiometricDevice.findById(device._id).populate('station')
            return Response(res, { device })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async sync(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await BiometricDevice.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'deviceNotFound')
            }

            service.syncAttendanceFromZKT(exists.ipAddress, exists.port, user.company._id)

            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await BiometricDevice.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'deviceNotFound')
            }
            await BiometricDevice.deleteOne({
                _id: id, company: user.company._id
            })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
}

module.exports = new BiometricController