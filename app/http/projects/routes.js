const express = require("express");
const router = express.Router();
const controller = require('./controller')
const validations = require('./validations')
const { verifyToken } = require('../../middlewares');

router.get('/list', [verifyToken], (req, res) => controller.list(req, res));
router.get('/details/:id', [verifyToken], (req, res) => controller.details(req, res));
router.post('/create', [verifyToken, validations.create], (req, res) => controller.create(req, res));
router.patch('/update/:id', [verifyToken, validations.update], (req, res) => controller.update(req, res));
router.delete('/delete/:id', [verifyToken], (req, res) => controller.delete(req, res));

router.post('/attachments/create', [verifyToken, validations.createAttachment], (req, res) => controller.createAttachment(req, res));
router.delete('/attachments/delete/:id', [verifyToken], (req, res) => controller.deleteAttachment(req, res));

module.exports = router;