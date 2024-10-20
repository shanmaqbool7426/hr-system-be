module.exports.PORT = process.env.PORT || 8000
module.exports.DEBUG = Boolean(process.env.DEBUG || false)
module.exports.MONGO_DB_URI = process.env.MONGO_DB_URI || "mongodb://localhost:27017/zaffre?retryWrites=true&w=majority"
module.exports.TOKENEXPIRY = process.env.TOKENEXPIRY || '15m'
module.exports.REFRESHTOKENEXPIRY = process.env.REFRESHTOKENEXPIRY || '18h'
module.exports.REMOTEEXPIRY = process.env.REMOTEEXPIRY || '7d'
module.exports.JWT_SECRET = process.env.JWT_SECRET || ''
module.exports.origin = process.env.ORIGIN || 'zaffretech.co'
module.exports.MAILER_HOST = process.env.MAILER_HOST
module.exports.MAILER_PORT = process.env.MAILER_PORT
module.exports.MAILER_USERNAME = process.env.MAILER_USERNAME
module.exports.MAILER_SECRET = process.env.MAILER_SECRET
module.exports.MAILER_SENDER = process.env.MAILER_SENDER
module.exports.USER_FIELDS = "_id firstName lastName email avatar employeeCode company";
module.exports.whitelist = [
    "https://zaffretech.co",
    "https://dev.zaffretech.co",
    "https://demo.zaffretech.co",
    "http://localhost:3000",
    "http://localhost:1420",
]
