const { Response, BadRequest, serverError } = require('../../util/helpers')
const RemoteProcess = require('../../models/remote_process')
const RemoteUserProcess = require('../../models/remote_user_process')
const RemoteUserScreenshot = require('../../models/remote_user_screenshot')
const Attendance = require('../../models/attendance')
const AttendanceBreak = require('../../models/attendance_break')
const moment = require('moment')
class RemoteController {
  async syncRemoteData(req, res) {
    try {
      const { user } = req.payload
      const { checkInAt, checkOutAt, idleIntervals, process, screenshots } = req.body

      for (let index in process) {
        let row = process[index]

        let remote_process = await RemoteProcess.findOne({
          name: row.name,
          company: user.company._id
        })
        if (!remote_process) remote_process = await RemoteProcess.create({
          name: row.name,
          company: user.company._id
        })
        let exist = await RemoteUserProcess.findOne({
          process: remote_process._id,
          user: user._id,
          company: user.company._id,
          createdAt: { $gte: moment().utc().startOf('D').format() }
        })

        if (!exist) {
          exist = await RemoteUserProcess.create({
            process: remote_process._id,
            user: user._id,
            company: user.company._id
          })
        }

        exist.time_spent = row.time_spent
        await exist.save()
      }

      for (let index in screenshots) {
        await RemoteUserScreenshot.create({
          url: screenshots[index].url,
          takenAt: screenshots[index].taken_at,
          user: user._id,
          company: user.company._id
        })
      }

      let todaysAttendance = await Attendance.findOne({
        checkInAt: {
          $gte: moment().utc().startOf('D').format(),
          $lt: moment().utc().endOf('D').format()
        },
        user: user._id
      })


      if (checkInAt && !todaysAttendance) {
        todaysAttendance = await Attendance.create({
          checkInAt: checkInAt,
          user: user._id,
          company: user.company._id
        })
      }

      if (checkOutAt && todaysAttendance) {
        todaysAttendance.checkOutAt = checkOutAt
        await todaysAttendance.save()
      }

      if (idleIntervals && todaysAttendance) {
        for (let index in idleIntervals) {
          await AttendanceBreak.create({
            attendance: todaysAttendance._id,
            startAt: idleIntervals[index].start_at,
            endAt: idleIntervals[index].end_at
          })
        }
      }


      return Response(res, {})
    } catch (error) {
      return serverError(res, error)
    }
  }
  async saveProcessStats(req, res) {
    try {
      const { user } = req.payload
      const { process } = req.body

      for (let index in process) {
        let row = process[index]

        let remote_process = await RemoteProcess.findOne({
          name: row.name,
          company: user.company._id
        })
        if (!remote_process) remote_process = await RemoteProcess.create({
          name: row.name,
          company: user.company._id
        })
        let exist = await RemoteUserProcess.findOne({
          process: remote_process._id,
          user: user._id,
          company: user.company._id,
          createdAt: { $gte: moment().utc().startOf('D').format() }
        })

        if (!exist) {
          exist = await RemoteUserProcess.create({
            process: remote_process._id,
            user: user._id,
            company: user.company._id
          })
        }

        exist.time_spent = row.time_spent
        await exist.save()
      }

      return Response(res, {})
    } catch (error) {
      return serverError(res, error)
    }
  }
  async saveScreenShots(req, res) {
    try {
      const { user } = req.payload
      const { urls } = req.body

      for (let index in urls) {
        await RemoteUserScreenshot.create({
          url: urls[index].url,
          takenAt: urls[index].taken_at,
          user: user._id,
          company: user.company._id
        })
      }
      return Response(res, {})
    } catch (error) {
      return serverError(res, error)
    }
  }
}

module.exports = new RemoteController
