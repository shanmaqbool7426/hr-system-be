const express = require("express");
const router = express.Router();
const controller = require('./controller')
const validations = require('./validations')
const { verifyToken } = require('../../middlewares')
router.get('/list', [verifyToken], controller.list);
router.get('/history', [verifyToken], controller.history);
router.get('/details/:id', [verifyToken], controller.details);
router.post('/create', [verifyToken, validations.create], controller.create);
router.patch('/update/:id', [verifyToken, validations.update], controller.update);
router.delete('/delete/:id', [verifyToken], controller.delete);
router.post('/restore/:id', [verifyToken], controller.restore);
router.patch('/assign-asset/:id', [verifyToken, validations.assignAsset], controller.assignAsset);
router.patch('/return-asset/:id', [verifyToken, validations.returnAsset], controller.returnAsset);
module.exports = router;
