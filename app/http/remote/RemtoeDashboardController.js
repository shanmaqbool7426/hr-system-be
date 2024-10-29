const { Response, emit, serverError } = require('../../util/helpers')
const RemoteApplication = require('../../models/remote_application')
const RemoteUserProcess = require('../../models/remote_user_process')
const RemoteUserScreenshot = require('../../models/remote_user_screenshot')
const Attendance = require('../../models/attendance')
const AttendanceBreak = require('../../models/attendance_break')
const User = require('../../models/user')
const RemoteService = require('./service')
const moment = require('moment')
const { ObjectId } = require('mongoose').Types

class RemoteDashboardController {

  async #getProductiveTimeSpent(month, filters) {
    const productiveApplications = await RemoteApplication.find({ nature: "productive" }, '_id')
    let productiveTimeSpent = [];
    const daysInMonth = moment(month).daysInMonth();
    const promises = Array.from({ length: daysInMonth }, (_, day) => {
      const date = moment(`${moment().format('YYYY')}-${month}-${day + 1}`);
      return RemoteUserProcess.aggregate([
        {
          $match: {
            ...filters,
            application: { $in: productiveApplications.map(app => new ObjectId(app._id)) },
            createdAt: { $gte: moment(date).startOf('day').toDate(), $lt: moment(date).endOf('day').toDate() }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$time_spent" }
          }
        }
      ]);
    });

    const results = await Promise.all(promises);
    results.forEach((dailyProductiveTime, index) => {
      productiveTimeSpent.push({
        date: (index + 1).toString().padStart(2, '0'),
        timeSpent: dailyProductiveTime.length > 0 ? dailyProductiveTime[0].total / 60 / 60 : 0
      });
    });
    return productiveTimeSpent
  }
  async #getTopUsers(filters) {
    const productiveApplications = await RemoteApplication.find({ nature: "productive" }, '_id')
    let topUsers = [];
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const result = await RemoteUserProcess.aggregate([
      {
        $match: {
          ...filters,
          application: { $in: productiveApplications.map(app => new ObjectId(app._id)) },
          createdAt: { $gte: startOfMonth, $lt: endOfMonth }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails"
      },
      {
        $group: {
          _id: {
            user: "$user",
            firstName: "$userDetails.firstName",
            lastName: "$userDetails.lastName"
          },
          total: { $sum: "$time_spent" }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: 3
      }
    ]);

    result.forEach(user => {
      topUsers.push({ _id: user._id, firstName: user._id.firstName, lastName: user._id.lastName, total: user.total });
    });

    return topUsers;
  }
  async dashboard(req, res) {
    try {
      const { user } = req.payload
      const present_ids = await Attendance.find({
        checkInAt: { $gte: moment().startOf('D').format() },
        checkOutAt: { $lt: moment().endOf('D').format() }
      }, 'user').distinct('user')

      const totalRemoteEmployees = await User.countDocuments({ company: user.company._id, workMode: "remote" })
      const totalOnline = await User.countDocuments({ company: user.company._id, workMode: "remote", online: true })
      const totalOffline = await User.countDocuments({ company: user.company._id, workMode: "remote", online: false })
      const totalAbsent = totalRemoteEmployees - present_ids.length

      const twelveMonthsAgo = moment().subtract(12, 'months').startOf('month');
      const applicationTimeSpent = await RemoteApplication.aggregate([
        {
          $match: {
            user: new ObjectId(user._id),
            createdAt: { $gte: twelveMonthsAgo.toDate() }
          }
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: "$timeSpent" }
          }
        }
      ]);


      const productiveTimeSpent = await this.#getProductiveTimeSpent(moment().format('MM'), { company: user.company._id })
      return Response(res, {
        stats: {
          total: totalRemoteEmployees,
          online: totalOnline,
          offline: totalOffline,
          absent: totalAbsent,
        },
        applicationTimeSpent,
        productiveTimeSpent,
        topPerformers: await this.#getTopUsers({ company: user.company._id })
      })
    } catch (error) {
      return serverError(res, error)
    }
  }

}

module.exports = new RemoteDashboardController
