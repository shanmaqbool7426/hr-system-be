const { Response, BadRequest, serverError } = require('../../util/helpers')
const Attendance = require("../../models/attendance")
const AttendanceBreak = require("../../models/attendance_break")
const moment = require('moment')
class AttendanceController {

  async todaysAttendance(req, res) {
    console.log("trigger", req.payload) 

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);  

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);  

    try {
      const { user } = req.payload
      const attendace = await Attendance.findOne({
        checkInAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        user: user._id
      })
      return Response(res, { attendace })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async list(req, res) {
    try {
      const { user } = req.payload
      const list = await Attendance.find({ company: user.company, }).populate('user')
      return Response(res, { list })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async checkIn(req, res) {
    try {
      const { user } = req.payload
      const attendance = await Attendance.create({
        checkInAt: new Date,
        company: user.company,
        user: user._id
      })
      return Response(res, { attendance })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async startBreak(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      const attendance_break = await AttendanceBreak.create({
        startAt: new Date,
        company: user.company,
        attendance: id
      })

      await Attendance.update({ _id: id }, { $set: { $push: { breaks: attendance_break._id } } })

      return Response(res, { attendance_break })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async endBreak(req, res) {
    try {
      const { id } = req.params
      await AttendanceBreak.updateOne({ _id: id }, { $set: { endAt: new Date } })
      const attendance_break = await AttendanceBreak.findById(id)
      return Response(res, { attendance_break })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async checkOut(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      const attendance = await Attendance.findById(id)
      if (!attendance) {
        return BadRequest('res', 'invalid attendance')
      }
      attendance.checkOutAt = new Date
      await attendance.save()
      return Response(res, { attendance })
    } catch (error) {
      return serverError(res, error)
    }
  }

}
module.exports = new AttendanceController
