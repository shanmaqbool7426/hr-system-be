const cron = require('node-cron');   //to do 
const ResetPassword = require('../app/models/resetpassword')
const RemoveExpiredOTP = async () => {
    await ResetPassword.deleteMany({ createdAt: { $lte: new Date(Date.now() - 30 * 60 * 1000) } });
}

const everyMinute = cron.schedule('* * * * *', async () => {
    await RemoveExpiredOTP()
});

// *TO DO*
// change request --> designation 
// change request --> department
// change request --> salary 
// change request --> grade 
// change request --> line manager
// change request --> employeeCode 

module.exports = () => {
    everyMinute.start()
}