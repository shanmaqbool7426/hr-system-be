const express = require("express");
const router = express.Router();
const controller = require('./controller')
const validations = require('./validations')
const { verifyToken } = require('../../middlewares');


router.post('/create', [verifyToken  ,validations.create ], controller.create);
router.patch('/update/:id', [verifyToken  ,validations.update ], controller.update);



module.exports = router;
