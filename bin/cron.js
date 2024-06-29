const cron = require('node-cron');
const ResetPassword = require('../app/models/resetpassword')
const RemoveExpiredOTP = async () => {
    await ResetPassword.deleteMany({ createdAt: { $lte: new Date(Date.now() - 30 * 60 * 1000) } });
}

const everyMinute = cron.schedule('* * * * *', async () => {
    await RemoveExpiredOTP()
});



module.exports = () => {
    everyMinute.start()
}