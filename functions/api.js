const serverless = require('serverless-http');
const app = require('../bin/app');

module.exports.handler = serverless(app);
