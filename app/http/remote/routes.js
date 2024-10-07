const express = require("express");
const router = express.Router();

const controller = require('./controller')

const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.post('/sync-remote-data', [verifyToken, validations.syncRemoteData], (req, res) => controller.syncRemoteData(req, res));
router.post('/store-proccess-stats', [verifyToken, validations.processStats], (req, res) => controller.saveProcessStats(req, res));
router.post('/store-screenshots', [verifyToken, validations.screenshots], (req, res) => controller.saveScreenShots(req, res));

module.exports = router;
