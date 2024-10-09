const express = require("express");
const router = express.Router();

const controller = require('./controller')

const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/list', [verifyToken], (req, res) => controller.list(req, res));
router.post('/create', [verifyToken, validations.create], (req, res) => controller.create(req, res));
router.patch('/update/:id', [verifyToken, validations.create], (req, res) => controller.update(req, res));
router.delete('/delete/:id', [verifyToken], (req, res) => controller.delete(req, res));
router.patch('/update-status/:id', [verifyToken, validations.updateStatus], (req, res) => controller.updateStatus(req, res));
module.exports = router;
