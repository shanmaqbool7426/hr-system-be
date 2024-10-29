const express = require("express");
const router = express.Router();

const controller = require('./RemtoeController')
const dashboardController = require('./RemtoeDashboardController')

const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

// Dashboard Routes
router.get('/dashboard', [verifyToken], (req, res) => dashboardController.dashboard(req, res));

// Remote Work Routes
router.get('/my-remote-work', [verifyToken], (req, res) => controller.myRemoteWork(req, res));
router.get('/team-remote-work', [verifyToken], (req, res) => controller.teamRemoteWork(req, res));
router.post('/sync-remote-data', [verifyToken, validations.syncRemoteData], (req, res) => controller.syncRemoteData(req, res));
router.post('/store-proccess-stats', [verifyToken, validations.syncRemoteData], (req, res) => controller.syncRemoteData(req, res));
router.post('/store-screenshots', [verifyToken, validations.syncRemoteData], (req, res) => controller.syncRemoteData(req, res));
router.post('/collective-settings', [verifyToken, validations.collectiveSettings], (req, res) => controller.collectiveSettings(req, res));
router.post('/send-buzz/:id', [verifyToken], (req, res) => controller.sendBuzz(req, res));

module.exports = router;
