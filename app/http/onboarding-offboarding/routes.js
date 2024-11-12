const express = require("express");
const router = express.Router();

const controller = require('./controller')

const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/settings', [verifyToken], (req, res) => controller.settings(req, res));
router.post('/tasks/:type/create', [verifyToken, validations.createTask], (req, res) => controller.createTask(req, res));
router.post('/tasks/:type/update/:id', [verifyToken, validations.updateTask], (req, res) => controller.updateTask(req, res));
router.delete('/tasks/:type/delete/:id', [verifyToken], (req, res) => controller.deleteTask(req, res));

module.exports = router;
