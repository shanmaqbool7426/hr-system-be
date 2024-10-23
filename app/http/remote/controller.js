const { Response, BadRequest, serverError } = require('../../util/helpers')
const RemoteProcess = require('../../models/remote_process')
const RemoteUserProcess = require('../../models/remote_user_process')
const RemoteUserScreenshot = require('../../models/remote_user_screenshot')
const Attendance = require('../../models/attendance')
const AttendanceBreak = require('../../models/attendance_break')
const User = require('../../models/user')
const RemoteService = require('./service')
const moment = require('moment')
const { ObjectId } = require('mongoose').Types

const getTimeInHoursAndMinutes = (seconds = 0) => {
  const hours = Math.floor(seconds / 3600) || 0;
  const minutes = Math.floor((seconds % 3600) / 60) || 0;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

class RemoteController {
  async myRemoteWork(req, res) {
    try {
      const { user } = req.payload
      let { startDate, endDate } = req.query
      const { attendance,
        productiveTime,
        totalRemoteTime,
        process_list,
        screenshots } = await RemoteService.getUserStats(user, startDate, endDate)
      return Response(res, {
        arrival_time: attendance?.checkInAt ? moment(attendance.checkInAt).format("h: mm A") : null,
        left_time: attendance?.checkOutAt ? moment(attendance.checkOutAt).format("h: mm A") : null,
        productive_time: getTimeInHoursAndMinutes(productiveTime),
        total_remote_time: getTimeInHoursAndMinutes(totalRemoteTime),
        process_list,
        screenshots
      })
    } catch (error) {
      return serverError(res, error)
    }
  }

  async teamRemoteWork(req, res) {
    try {
      const { user } = req.payload
      let { startDate, endDate, team, employee } = req.query
      startDate = startDate || new Date()
      endDate = endDate || new Date()
      startDate = moment(startDate).startOf('D').format()
      endDate = moment(endDate).endOf('D').format()
      employee = employee ? [employee] : []
      const filters = { company: (user.company._id) }
      if (team) {
        employee = await User.find({ team: team, company: user.company._id })
        employee = employee.reduce((acc, item) => {
          acc.push((item._id.toString()))
          return acc
        }, [])
      }
      if (employee.length > 0) filters.user = { $in: employee }
      const differenceInDays = moment(endDate).diff(moment(startDate), 'days')
      let attendance
      if (differenceInDays > 0) {
        const allAttendance = await Attendance.find({
          ...filters,
          checkInAt: { $gte: startDate, $lt: endDate }
        });

        if (allAttendance.length > 0) {
          const totalCheckIns = allAttendance.reduce((sum, att) => sum + new Date(att.checkInAt).getTime(), 0);
          const totalCheckOuts = allAttendance.reduce((sum, att) => sum + (att.checkOutAt ? new Date(att.checkOutAt).getTime() : 0), 0);

          attendance = {
            checkInAt: new Date(totalCheckIns / allAttendance.length),
            checkOutAt: new Date(totalCheckOuts / allAttendance.length)
          };
        } else {
          attendance = {
            checkInAt: null,
            checkOutAt: null
          };
        }
      } else {
        attendance = await Attendance.findOne({
          checkInAt: { $gte: startDate },
          ...filters
        })
      }
      filters.company = new ObjectId(user.company._id)
      if (employee.length > 0) filters.user = { $in: employee.map(item => new ObjectId(item)) }
      let productiveTime = await RemoteUserProcess.aggregate([
        {
          $match: {
            ...filters,
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

      let totalRemoteTime = await RemoteUserProcess.aggregate([
        {
          $match: {
            ...filters,
            createdAt: {
              $gte: new Date(startDate),
              $lt: new Date(endDate)
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
        ...filters
      }).populate('process')

      const screenshots = await RemoteUserScreenshot.find({
        ...filters,
        takenAt: { $gte: startDate, $lt: endDate }
      })

      return Response(res, {
        arrival_time: attendance?.checkInAt ? moment(attendance.checkInAt).format("h: mm A") : null,
        left_time: attendance?.checkOutAt ? moment(attendance.checkOutAt).format("h: mm A") : null,
        productive_time: getTimeInHoursAndMinutes(productiveTime),
        total_remote_time: getTimeInHoursAndMinutes(totalRemoteTime),
        process_list,
        screenshots
      })
    } catch (error) {
      return serverError(res, error)
    }
  }

  async getScreenShot(req, res) {
    try {
      const { user } = req.payload
      let { startDate, endDate } = req.query
      startDate = startDate || new Date()
      endDate = endDate || new Date()
      startDate = moment(startDate).startOf('D').format()
      endDate = moment(endDate).endOf('D').format()

      const screenshots = await RemoteUserScreenshot.find({
        user: user._id,
        company: user.company._id,
        takenAt: { $gte: startDate, $lt: endDate }
      })

      return Response(res, { screenshots })
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
          createdAt: {
            $gte: moment().startOf('D').format(),
            $lt: moment().endOf('D').format()
          },
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
          $gte: moment().startOf('D').format(),
          $lt: moment().endOf('D').format()
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
            startAt: moment(interval.start_at).format(),
            endAt: moment(interval.end_at).format()
          })
          if (!exist) {
            await AttendanceBreak.create({
              attendance: todaysAttendance._id,
              startAt: moment(interval.start_at).format(),
              endAt: moment(interval.end_at).format()
            })
          }
        }
      }

      // get stats
      const { attendance, productiveTime, totalRemoteTime, process_list } = await RemoteService.getUserStats(user)

      return Response(res, {
        arrival_time: attendance?.checkInAt ? moment(attendance.checkInAt).format("h: mm A") : null,
        left_time: attendance?.checkOutAt ? moment(attendance.checkOutAt).format("h: mm A") : null,
        productive_time: getTimeInHoursAndMinutes(productiveTime),
        total_remote_time: getTimeInHoursAndMinutes(totalRemoteTime),
        process_list,
      })
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
          createdAt: {
            $gte: moment().startOf('D').format(),
            $lt: moment().endOf('D').format()
          },
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

  async collectiveSettings(req, res) {
    try {
      const { user } = req.payload
      const { allEmployees, team, ...data } = req.body
      let filter = { company: user.company._id }

      if (!allEmployees && team) {
        let employees = await User.find({ team: team, company: user.company._id })
        employees = employees.reduce((acc, item) => {
          acc.push(item._id)
          return acc
        }, [])
        filter.user = { $in: employees }
      }

      await User.updateMany(filter, { $set: { remoteSetting: data } })
      return Response(res, {})
    } catch (error) {
      return serverError(res, error)
    }
  }
}

module.exports = new RemoteController
