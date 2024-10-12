const { Response, BadRequest, serverError } = require('../../util/helpers')
const RemoteProcess = require('../../models/remote_process')
const RemoteUserProcess = require('../../models/remote_user_process')
const RemoteUserScreenshot = require('../../models/remote_user_screenshot')
const Attendance = require('../../models/attendance')
const AttendanceBreak = require('../../models/attendance_break')
const moment = require('moment')
const getTimeInHoursAndMinutes = (seconds = 0) => {
  const hours = Math.floor(seconds / 3600) || 0;
  const minutes = Math.floor((seconds % 3600) / 60) || 0;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
class RemoteController {
  async dashboardStats(req, res) {
    try {
      const { user } = req.payload
      let { startDate, endDate } = req.query

      startDate = startDate ? moment(startDate).utc().format() : moment().utc().startOf('D').format()
      endDate = endDate ? moment(endDate).utc().format() : moment().utc().endOf('D').format()


      const differenceInDays = moment(endDate).diff(moment(startDate), 'days')
      let attendance
      if (differenceInDays > 0) {
        attendance = await Attendance.aggregate([
          {
            $match: {
              user: user._id, company: user.company._id,
              checkInAt: { $gte: startDate, $lt: endDate },
            }
          },
          {
            $group: {
              _id: null,
              avgCheckInAt: { $avg: { $toDate: "$checkInAt" } },
              avgCheckOutAt: { $avg: { $toDate: "$checkOutAt" } }
            }
          }
        ])
        attendance = attendance.length > 0 ? attendance[0] : {}
      } else {
        attendance = await Attendance.findOne({
          checkInAt: { $gte: startDate },
          user: user._id
        })
      }
      let productiveTime = await RemoteUserProcess.aggregate([
        {
          $match: {
            user: user._id, company: user.company._id,
            createdAt: {
              $gte: startDate,
              $lt: endDate
            },
            "process.nature": "productive"
          }
        },
        { $group: { _id: null, totalTime: { $sum: "$time_spent" } } }
      ])
      productiveTime = productiveTime.length > 0 ? productiveTime[0].totalTime : 0

      let totalRemoteTime = await RemoteUserScreenshot.aggregate([
        {
          $match: {
            user: user._id, company: user.company._id,
            createdAt: {
              $gte: startDate,
              $lt: endDate
            },
          }
        },
        { $group: { _id: null, totalTime: { $sum: "$time_spent" } } }
      ])
      totalRemoteTime = totalRemoteTime.length > 0 ? totalRemoteTime[0].totalTime : 0
      let process_list = await RemoteUserProcess.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate
        },
        user: user._id,
        company: user.company._id
      }).populate('process')

      return Response(res, {
        arrival_time: attendance?.checkInAt ? moment(attendance.checkInAt).format("h: mm A") : null,
        left_time: attendance?.checkOutAt ? moment(attendance.checkOutAt).format("h: mm A") : null,
        productive_time: getTimeInHoursAndMinutes(productiveTime),
        total_remote_time: getTimeInHoursAndMinutes(totalRemoteTime),
        process_list
      })
    } catch (error) {
      return serverError(res, error)
    }
  }
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
          processName: screenshots[index].process_name,
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
          let interval = idleIntervals[index]
          let exist = await AttendanceBreak.findOne({
            attendance: todaysAttendance._id,
            startAt: moment(interval.start_at).utc().format(),
            endAt: moment(interval.end_at).utc().format()
          })
          if (!exist) {
            await AttendanceBreak.create({
              attendance: todaysAttendance._id,
              startAt: moment(interval.start_at).utc().format(),
              endAt: moment(interval.end_at).utc().format()
            })
          }
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
