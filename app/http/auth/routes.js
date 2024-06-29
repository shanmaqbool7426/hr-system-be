const express = require("express");
const router = express.Router();
const controller = require('./controller')
const validations = require('./validations')
const { verifyToken, verifyRefreshToken } = require('../../middlewares')
router.post('/sign-in', [validations.signin], controller.signin);
router.post('/refresh-token', [verifyRefreshToken], controller.refreshToken);
router.post('/forgot-password', [validations.forgotPassword], controller.forgotPassword);
router.post('/verify-otp', [validations.verifyOTP], controller.verifyOTP);
router.post('/reset-password', [validations.resetPassword], controller.resetPassword);
router.post('/', [verifyToken], controller.auth);
module.exports = router;
