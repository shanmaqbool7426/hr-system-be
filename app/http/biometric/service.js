const ZKJUBAER = require("zk-jubaer");
const moment = require('moment')
const Attendance = require('../../models/attendance')
const User = require('../../models/user')

class BiometricService {
    async syncAttendanceFromZKT(ip, port, company) {
        return new Promise(async (resolve, reject) => {
            try {
                const zkt = new ZKJUBAER(ip, port, 5200, process.env.PORT);
                await zkt.createSocket()
                let logs = await zkt.getAttendances()
                await zkt.disconnect()
                let employees = await User.find({ company })
                logs = logs.data.reduce((acc, item) => {
                    let mdate = moment(new Date(item.recordTime))
                    if (!acc[item.deviceUserId]) {
                        acc[item.deviceUserId] = {}
                    }
                    if (!acc[item.deviceUserId][mdate.format('YYYY-MM-DD')]) {
                        acc[item.deviceUserId][mdate.format('YYYY-MM-DD')] = []
                    }
                    acc[item.deviceUserId][mdate.format('YYYY-MM-DD')].push(mdate)
                    return acc
                }, {})

                for (let index in employees) {
                    let employee = employees[index]
                    if (logs[employee.employeeCode]) {
                        let user_logs = logs[employee.employeeCode]
                        let dates = Object.keys(user_logs)
                        for (let index2 in dates) {
                            let date = dates[index2]
                            let attendance = await Attendance.findOne({ date, user: employee._id, company })
                            if (!attendance) {
                                let checkInAt = null
                                let checkOutAt = null
                                if (user_logs[date].length > 1) {
                                    checkInAt = user_logs[date][0].utc().format()
                                    checkOutAt = user_logs[date][1].utc().format()
                                } else {
                                    if (user_logs[date][0].format("H") > 12) checkOutAt = user_logs[date][0]
                                    else checkInAt = user_logs[date][0].utc().format()
                                }
                                await Attendance.create({
                                    date, checkInAt, checkOutAt, company, user: employee._id
                                })
                            }
                        }
                    }
                }
                return resolve()
            } catch (error) {
                return reject(error)
            }
        })
    }
}

module.exports = new BiometricService