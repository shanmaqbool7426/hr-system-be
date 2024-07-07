const express = require("express");
const router = express.Router();
const controller = require('./controller')
const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/list', [verifyToken], controller.list);
router.get('/create', [verifyToken, validations.create], controller.list);
router.get('/update/:id', [verifyToken, validations.update], controller.update);
router.delete('/delete/:id', [verifyToken], controller.delete);

module.exports = router;
