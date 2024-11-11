const express = require("express");
const router = express.Router();

const controller = require('./controller')

const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/settings', [verifyToken], (req, res) => controller.settings(req, res));
router.post('/tasks/create', [verifyToken, validations.createTask], (req, res) => controller.createTask(req, res));
router.post('/tasks/update/:id', [verifyToken, validations.updateTask], (req, res) => controller.updateTask(req, res));

module.exports = router;
