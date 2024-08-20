const express = require("express");
const router = express.Router();
const controller = require('./controller')
const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/list', [verifyToken], controller.list); 
router.post('/todays-attendance', [verifyToken], controller.todaysAttendance);
router.post('/start-break/:id', [verifyToken], controller.startBreak);
router.post('/end-break/:id', [verifyToken], controller.endBreak);
router.post('/check-in', [verifyToken], controller.checkIn);
router.post('/check-out/:id', [verifyToken], controller.checkOut);
router.get('/get-breaks/:id', [verifyToken], controller.getBreaks);

module.exports = router;
