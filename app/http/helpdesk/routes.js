const express = require("express");
const router = express.Router();

const controller = require('./controller')

const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/dashboard', [verifyToken], (req, res) => controller.dashboard(req, res));
router.get('/list', [verifyToken], (req, res) => controller.list(req, res));
router.post('/create', [verifyToken, validations.create], (req, res) => controller.create(req, res));
router.patch('/update/:id', [verifyToken, validations.create], (req, res) => controller.update(req, res));
router.delete('/delete/:id', [verifyToken], (req, res) => controller.delete(req, res));
router.patch('/assign/:id', [verifyToken, validations.assign], (req, res) => controller.assign(req, res));
router.patch('/transfer/:id', [verifyToken, validations.transfer], (req, res) => controller.transfer(req, res));
router.patch('/close/:id', [verifyToken], (req, res) => controller.close(req, res));
module.exports = router;
