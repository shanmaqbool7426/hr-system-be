const cron = require('node-cron');   //to do 
const ResetPassword = require('../app/models/resetpassword')
const RemoteWorkRequest = require('../app/models/remote_work_request');
const User = require('../app/models/user');
const UserChangeRequest = require('../app/models/user_change_request');
const ChangeShiftRequest = require('../app/models/change_shift_request');
const moment = require('moment');
const RemoveExpiredOTP = async () => {
    await ResetPassword.deleteMany({ createdAt: { $lte: moment().subtract(30, 'minutes').toDate() } });
}

const CheckRemoteWork = async () => {
    const requests = await RemoteWorkRequest.find({ status: "approved", startDate: { $lte: moment().endOf('day').toDate() } })
    for (const request of requests) {
        if (moment(request.startDate).isSameOrBefore(moment()) && (!request.endDate || moment(request.endDate).isSameOrAfter(moment()))) {
            await User.updateOne({ _id: request.user }, { $set: { workMode: "remote", remoteWork: { from: moment(request.startDate).toDate(), to: moment(request.endDate).toDate() } } })
        }
    }

    await User.updateMany({ workMode: "remote", "remoteWork.to": { $lte: moment().startOf('day').toDate() } }, { $set: { workMode: "onsite" } })
}

const CheckChangeRequest = async () => {
    const requests = await UserChangeRequest.find({
        effectiveDate: {
            $gte: moment().startOf('day').toDate(),
            $lt: moment().endOf('day').toDate()
        }
    })
    for (const request of requests) {
        switch (request.type) {
            case "designation":
                await User.updateOne({ _id: request.employee }, { $set: { designation: request.designation } })
                break;
            case "department":
                await User.updateOne({ _id: request.employee }, { $set: { department: request.department } })
                break;
            case "salary":
                await User.updateOne({ _id: request.employee }, { $set: { salary: request.salary } })
                break;
            case "grade":
                await User.updateOne({ _id: request.employee }, { $set: { grade: request.grade } })
                break;
            case "lineManager":
                await User.updateOne({ _id: request.employee }, { $set: { lineManager: request.lineManager } })
                break;
            case "employeeCode":
                await User.updateOne({ _id: request.employee }, { $set: { employeeCode: request.employeeCode } })
                break;
        }
    }
}

const CheckChangeShiftRequest = async () => {
    const requests = await ChangeShiftRequest.find({ effectiveDate: { $gte: moment().startOf('day').toDate(), $lt: moment().endOf('day').toDate() } })
    for (const request of requests) {
        await User.updateOne({ _id: request.employee }, { $set: { shiftplan: request.requestedShift } })
    }
    await ChangeShiftRequest.updateMany({ effectiveDate: { $gte: moment().startOf('day').toDate(), $lt: moment().endOf('day').toDate() } }, { $set: { status: 'approved' } })

    const expiredRequests = await ChangeShiftRequest.find({ validTill: { $lt: moment().startOf('day').toDate() } })
    for (const request of expiredRequests) {
        await User.updateOne({ _id: request.employee }, { $set: { shiftplan: request.previousShift } })
    }
}

const everyMinute = cron.schedule('* * * * *', async () => {
    await RemoveExpiredOTP()
});

const everyDay = cron.schedule('0 0 * * *', async () => {
    await CheckRemoteWork()
    await CheckChangeRequest()
    await CheckChangeShiftRequest()
});


module.exports = () => {
    everyMinute.start()
    everyDay.start()
    console.info("Cron Job Started")
}
