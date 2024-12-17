const express = require("express");
const router = express.Router();

const controller = require('./controller')

const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/settings', [verifyToken], (req, res) => controller.settings(req, res));
router.post('/tasks/:type/create', [verifyToken, validations.createTask], (req, res) => controller.createTask(req, res));
router.post('/tasks/:type/update/:id', [verifyToken, validations.updateTask], (req, res) => controller.updateTask(req, res));
router.delete('/tasks/:type/delete/:id', [verifyToken], (req, res) => controller.deleteTask(req, res));

router.post('/assets/create', [verifyToken, validations.createAsset], (req, res) => controller.createAsset(req, res));
router.post('/assets/update/:id', [verifyToken, validations.updateAsset], (req, res) => controller.updateAsset(req, res));
router.delete('/assets/delete/:id', [verifyToken], (req, res) => controller.deleteAsset(req, res));

router.get('/employees/onboarding', [verifyToken], (req, res) => controller.getOnboardingEmployees(req, res));
router.get('/employees/offboarding', [verifyToken], (req, res) => controller.getOffboardingEmployees(req, res));
router.get('/process/:type/:employee', [verifyToken], (req, res) => controller.getEmployeeProcess(req, res));
router.patch('/process/:type/update/:id', [verifyToken], (req, res) => controller.updateEmployeeProcess(req, res));
router.post('/process/:type/complete/:id', [verifyToken], (req, res) => controller.completeEmployeeProcess(req, res));


module.exports = router;
