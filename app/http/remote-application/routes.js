const express = require("express");
const router = express.Router();

const controller = require('./controller')

const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/list', [verifyToken], (req, res) => controller.list(req, res));
router.post('/update', [verifyToken, validations.update], (req, res) => controller.update(req, res));
module.exports = router;
