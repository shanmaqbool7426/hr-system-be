const cron = require('node-cron');   //to do 
const ResetPassword = require('../app/models/resetpassword')
const RemoveExpiredOTP = async () => {
    await ResetPassword.deleteMany({ createdAt: { $lte: new Date(Date.now() - 30 * 60 * 1000) } });
}

const everyMinute = cron.schedule('* * * * *', async () => {
    await RemoveExpiredOTP()
});

// to

module.exports = () => {
    everyMinute.start()
}