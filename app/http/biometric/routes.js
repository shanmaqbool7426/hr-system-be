const express = require("express");
const router = express.Router();

const controller = require('./controller')

const validations = require('./validations')
const { verifyToken } = require('../../middlewares')

router.get('/list', [verifyToken], controller.list);
router.post('/create', [verifyToken, validations.create], controller.create);
router.post('/sync/:id', [verifyToken], controller.sync);
router.patch('/update/:id', [verifyToken, validations.create], controller.update);
router.delete('/delete/:id', [verifyToken], controller.delete);


module.exports = router;
