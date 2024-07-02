var express = require("express");
var router = express.Router();

router.use('/attendance', require('./http/attendance/routes'))
router.use('/assets', require('./http/asset/routes'))
router.use('/auth', require('./http/auth/routes'))
router.use('/biometric', require('./http/biometric/routes'))
router.use('/custom-fields', require('./http/custom-field/routes'))
router.use('/departments', require('./http/department/routes'))
router.use('/employees', require('./http/employee/routes'))
router.use('/files', require('./http/files/routes'))
router.use('/leaves', require('./http/leave/routes'))
router.use('/leave-requests', require('./http/leave-request/routes'))
router.use('/roles', require('./http/role/routes'))

module.exports = router;
