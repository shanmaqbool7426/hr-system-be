const express = require("express");
const router = express.Router();

const controller = require('./controller')

const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.post('/store-proccess-stats', [verifyToken, validations.processStats], controller.saveProcessStats);
router.post('/store-screenshots', [verifyToken, validations.screenshots], controller.saveScreenShots);


module.exports = router;
