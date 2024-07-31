const express = require("express");
const router = express.Router();
const controller = require('./controller')
const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/list/:board_id', [verifyToken], controller.list);
router.get('/list-completed', [verifyToken], controller.completedTaskList);
router.get('/list-overdue', [verifyToken], controller.overDueTaskList);
router.get('/list-awaiting', [verifyToken], controller.awaitingTaskList);
router.get('/list-reported', [verifyToken], controller.reportedTaskList);
router.get('/details/:id', [verifyToken], controller.details);
router.post('/create', [verifyToken, validations.create], controller.create);
router.patch('/update/:id', [verifyToken , validations.update], controller.update);
router.delete('/delete/:id', [verifyToken], controller.delete);

module.exports = router;
