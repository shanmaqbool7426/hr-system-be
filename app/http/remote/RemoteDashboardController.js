const { Response, serverError } = require('../../util/helpers')
const RemoteApplication = require('../../models/remote_application')
const RemoteUserProcess = require('../../models/remote_user_process')
const Attendance = require('../../models/attendance')
const User = require('../../models/user')
const moment = require('moment')
const { ObjectId } = require('mongoose').Types

class RemoteDashboardController {

  async #getProductiveTimeSpent(month, filters) {
    const productiveApplications = await RemoteApplication.find({ nature: "productive" }, '_id')
    let productiveTimeSpent = [];
    const daysInMonth = month.daysInMonth();
    const promises = Array.from({ length: daysInMonth }, (_, day) => {
      const date = moment(`${month.format('YYYY-MM')}-${(day + 1).toString().padStart(2, '0')}`);
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
    const startOfMonth = moment().subtract(1, 'month').startOf('month').toDate();
    const endOfMonth = moment().subtract(1, 'month').endOf('month').toDate();

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
        },
      },
      {
        $unwind: "$userDetails"
      },
      {
        $lookup: {
          from: "shifts",
          localField: "user",
          foreignField: "userId",
          as: "shiftDetails"
        }
      },
      {
        $unwind: {
          path: "$shiftDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: {
            user: "$user",
            firstName: "$userDetails.firstName",
            lastName: "$userDetails.lastName"
          },
          total: { $sum: "$time_spent" },
          shift: { $first: "$shiftDetails" }
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
      topUsers.push({
        _id: user._id,
        firstName: user._id.firstName,
        lastName: user._id.lastName,
        total: user.total,
        shift: user.shift
      });
    });

    return topUsers;
  }
  async #getApplicationTimeSpent(filters, startDate = null, endDate = null) {
    startDate = startDate ? moment(startDate) : moment().startOf('month')
    endDate = endDate ? moment(endDate) : moment().endOf('month')

    const applicationTimeSpent = await RemoteUserProcess.aggregate([
      {
        $match: {
          ...filters,
          createdAt: { $gte: startDate.toDate(), $lt: endDate.toDate() }
        }
      },
      {
        $lookup: {
          from: "remote_applications",
          localField: "application",
          foreignField: "_id",
          as: "applicationDetails"
        }
      },
      {
        $unwind: "$applicationDetails"
      },
      {
        $group: {
          _id: {
            application: "$application",
            name: "$applicationDetails.name"
          },
          timeSpent: { $sum: "$time_spent" }
        }
      },
      {
        $project: {
          _id: "$_id.application",
          name: "$_id.name",
          timeSpent: 1
        }
      }
    ])
    return applicationTimeSpent.map(app => ({ name: app.name, timeSpent: (app.timeSpent / 60 / 60).toFixed(2) }))
  }
  async #getApplicationTimeSpentByNature(filters, startDate = null, endDate = null) {
    if (startDate && endDate) {
      filters.createdAt = { $gte: startDate.toDate(), $lt: endDate.toDate() }
    }
    const applicationTimeSpent = await RemoteUserProcess.aggregate([
      {
        $match: {
          ...filters
        }
      },
      {
        $lookup: {
          from: "remote_applications",
          localField: "application",
          foreignField: "_id",
          as: "applicationDetails"
        }
      },
      {
        $unwind: "$applicationDetails"
      },
      {
        $group: {
          _id: "$applicationDetails.nature",
          timeSpent: { $sum: "$time_spent" }
        }
      },
      {
        $project: {
          _id: "$_id",
          name: "$_id",
          timeSpent: 1
        }
      }
    ])
    return applicationTimeSpent.map(app => ({ name: app.name, timeSpent: (app.timeSpent / 60 / 60).toFixed(2) }))
  }
  async dashboard(req, res) {
    try {
      const { user } = req.payload
      const present_ids = await Attendance.find({
        checkInAt: { $gte: moment().startOf('D').format() },
        checkOutAt: { $lt: moment().endOf('D').format() }
      }, 'user').distinct('user')

      const totalRemoteEmployees = await User.countDocuments({ company: user.company._id, workMode: "remote" })
      const remoteEmployees = await User.find({ company: user.company._id, workMode: "remote" }, '_id online firstName lastName email avatar')
      const totalAbsent = totalRemoteEmployees - present_ids.length

      return Response(res, {
        stats: {
          total: totalRemoteEmployees,
          absent: totalAbsent,
        },
        remoteEmployees,
        productiveTimeSpent: await this.#getProductiveTimeSpent(moment().subtract(1, 'month'), { company: user.company._id }),
        topPerformers: await this.#getTopUsers({ company: user.company._id }),
        applicationTimeSpentByNature: await this.#getApplicationTimeSpentByNature({ company: user.company._id })
      })
    } catch (error) {
      return serverError(res, error)
    }
  }

}

module.exports = new RemoteDashboardController
