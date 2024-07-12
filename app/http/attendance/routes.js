const express = require("express");
const router = express.Router();
const controller = require('./controller')
const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/list', [verifyToken], controller.list);

router.get('/todays-attendance', [verifyToken], controller.todaysAttendance);
router.post('/start-break', [verifyToken], controller.startBreak);
router.post('/end-break', [verifyToken], controller.endBreak);
router.post('/check-in', [verifyToken], controller.checkIn);
router.post('/check-out', [verifyToken], controller.checkOut);

module.exports = router;
