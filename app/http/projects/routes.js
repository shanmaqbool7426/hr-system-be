const express = require("express");
const router = express.Router();
const controller = require('./controller')
const validations = require('./validations')
const { verifyToken } = require('../../middlewares');

router.get('/list', [verifyToken], controller.list);
router.get('/details/:id', [verifyToken], controller.details);
router.post('/create', [verifyToken  ,validations.create ], controller.create);
router.patch('/update/:id', [verifyToken , validations.update], controller.update);
router.delete('/delete/:id', [verifyToken], controller.delete);

router.post('/attachments/create', [verifyToken , validations.createAttachment], controller.createAttachment);
router.delete('/attachments/delete/:id', [verifyToken], controller.deleteAttachment);

module.exports = router;