const moment = require('moment')
const Attendance = require('../../models/attendance')
const RemoteUserProcess = require('../../models/remote_user_process')
const RemoteUserScreenshot = require('../../models/remote_user_screenshot')
const { ObjectId } = require('mongoose').Types

class RemoteService {
    async getUserStats(user, startDate = null, endDate = null) {
        startDate = startDate || new Date()
        endDate = endDate || new Date()
        startDate = moment(startDate).startOf('D').format()
        endDate = moment(endDate).endOf('D').format()
        const differenceInDays = moment(endDate).diff(moment(startDate), 'days')
        let attendance
        if (differenceInDays > 0) {
            const allAttendance = await Attendance.find({
                user: user._id,
                company: user.company._id,
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
                user: user._id
            })
        }
        let productiveTime = await RemoteUserProcess.aggregate([
            {
                $match: {
                    user: new ObjectId(user._id),
                    company: new ObjectId(user.company._id),
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
                    user: new ObjectId(user._id),
                    company: new ObjectId(user.company._id),
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
            user: user._id,
            company: user.company._id
        }).populate('application')

        process_list = process_list.reduce((acc, item) => {
            let exist = acc.find(app => app.name === item?.application?.name)
            if (!exist) {
                acc.push({
                    _id: item?.application?._id,
                    name: item?.application?.name,
                    nature: item?.application?.nature,
                    time_spent: item?.time_spent
                })
            } else {
                exist.time_spent += item?.time_spent
            }
            return acc
        }, [])

        const screenshots = user?.remoteSetting?.hideScreenshots ? [] : await RemoteUserScreenshot.find({
            user: user._id,
            company: user.company._id,
            takenAt: { $gte: startDate, $lt: endDate }
        })
        return {
            attendance,
            productiveTime,
            totalRemoteTime,
            process_list,
            screenshots
        }
    }
}

module.exports = new RemoteService